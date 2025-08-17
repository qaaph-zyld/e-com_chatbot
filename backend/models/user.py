"""
User model and database operations
"""
import hashlib
import uuid
from datetime import datetime
from typing import Optional, Dict, Any
import bcrypt
from backend.utils.database import db_manager
import logging

logger = logging.getLogger(__name__)

class User:
    """User model with database operations"""
    
    def __init__(self, user_id=None, email=None, username=None, password_hash=None, 
                 first_name=None, last_name=None, phone=None, is_active=True, 
                 created_at=None, updated_at=None, preferences=None):
        self.user_id = user_id or str(uuid.uuid4())
        self.email = email
        self.username = username
        self.password_hash = password_hash
        self.first_name = first_name
        self.last_name = last_name
        self.phone = phone
        self.is_active = is_active
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
        self.preferences = preferences or {}
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using bcrypt"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def verify_password(self, password: str) -> bool:
        """Verify password against hash"""
        if not self.password_hash:
            return False
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self, include_sensitive=False) -> Dict[str, Any]:
        """Convert user to dictionary"""
        user_dict = {
            'user_id': self.user_id,
            'email': self.email,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'preferences': self.preferences
        }
        
        if include_sensitive:
            user_dict['password_hash'] = self.password_hash
        
        return user_dict
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'User':
        """Create User instance from dictionary"""
        return cls(
            user_id=data.get('user_id'),
            email=data.get('email'),
            username=data.get('username'),
            password_hash=data.get('password_hash'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            phone=data.get('phone'),
            is_active=data.get('is_active', True),
            created_at=datetime.fromisoformat(data['created_at']) if data.get('created_at') else None,
            updated_at=datetime.fromisoformat(data['updated_at']) if data.get('updated_at') else None,
            preferences=data.get('preferences', {})
        )
    
    def save(self) -> bool:
        """Save user to database"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                # Check if user exists
                cursor.execute("SELECT user_id FROM users WHERE user_id = %s", (self.user_id,))
                exists = cursor.fetchone()
                
                if exists:
                    # Update existing user
                    self.updated_at = datetime.utcnow()
                    cursor.execute("""
                        UPDATE users SET 
                            email = %s, username = %s, password_hash = %s,
                            first_name = %s, last_name = %s, phone = %s,
                            is_active = %s, updated_at = %s, preferences = %s
                        WHERE user_id = %s
                    """, (
                        self.email, self.username, self.password_hash,
                        self.first_name, self.last_name, self.phone,
                        self.is_active, self.updated_at, self.preferences,
                        self.user_id
                    ))
                else:
                    # Insert new user
                    cursor.execute("""
                        INSERT INTO users (
                            user_id, email, username, password_hash,
                            first_name, last_name, phone, is_active,
                            created_at, updated_at, preferences
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        self.user_id, self.email, self.username, self.password_hash,
                        self.first_name, self.last_name, self.phone, self.is_active,
                        self.created_at, self.updated_at, self.preferences
                    ))
                
                logger.info(f"User {self.user_id} saved successfully")
                return True
                
        except Exception as e:
            logger.error(f"Failed to save user {self.user_id}: {e}")
            return False
    
    @classmethod
    def find_by_id(cls, user_id: str) -> Optional['User']:
        """Find user by ID"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
                row = cursor.fetchone()
                
                if row:
                    return cls.from_dict(dict(row))
                return None
                
        except Exception as e:
            logger.error(f"Failed to find user by ID {user_id}: {e}")
            return None
    
    @classmethod
    def find_by_email(cls, email: str) -> Optional['User']:
        """Find user by email"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
                row = cursor.fetchone()
                
                if row:
                    return cls.from_dict(dict(row))
                return None
                
        except Exception as e:
            logger.error(f"Failed to find user by email {email}: {e}")
            return None
    
    @classmethod
    def find_by_username(cls, username: str) -> Optional['User']:
        """Find user by username"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
                row = cursor.fetchone()
                
                if row:
                    return cls.from_dict(dict(row))
                return None
                
        except Exception as e:
            logger.error(f"Failed to find user by username {username}: {e}")
            return None
    
    @classmethod
    def authenticate(cls, email_or_username: str, password: str) -> Optional['User']:
        """Authenticate user with email/username and password"""
        try:
            # Try to find by email first, then username
            user = cls.find_by_email(email_or_username)
            if not user:
                user = cls.find_by_username(email_or_username)
            
            if user and user.verify_password(password) and user.is_active:
                return user
            
            return None
            
        except Exception as e:
            logger.error(f"Authentication failed for {email_or_username}: {e}")
            return None
    
    def delete(self) -> bool:
        """Soft delete user (set is_active to False)"""
        try:
            self.is_active = False
            return self.save()
            
        except Exception as e:
            logger.error(f"Failed to delete user {self.user_id}: {e}")
            return False
