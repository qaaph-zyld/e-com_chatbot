"""
Chat session and message models with database operations
"""
import uuid
from datetime import datetime
from typing import Optional, Dict, Any, List
from backend.utils.database import db_manager
import logging

logger = logging.getLogger(__name__)

class ChatSession:
    """Chat session model with database operations"""
    
    def __init__(self, session_id=None, user_id=None, status='active', 
                 created_at=None, updated_at=None, metadata=None):
        self.session_id = session_id or str(uuid.uuid4())
        self.user_id = user_id
        self.status = status  # active, ended, archived
        self.created_at = created_at or datetime.utcnow()
        self.updated_at = updated_at or datetime.utcnow()
        self.metadata = metadata or {}
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert chat session to dictionary"""
        return {
            'session_id': self.session_id,
            'user_id': self.user_id,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'metadata': self.metadata
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ChatSession':
        """Create ChatSession instance from dictionary"""
        return cls(
            session_id=data.get('session_id'),
            user_id=data.get('user_id'),
            status=data.get('status', 'active'),
            created_at=datetime.fromisoformat(data['created_at']) if data.get('created_at') else None,
            updated_at=datetime.fromisoformat(data['updated_at']) if data.get('updated_at') else None,
            metadata=data.get('metadata', {})
        )
    
    def save(self) -> bool:
        """Save chat session to database"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                # Check if session exists
                cursor.execute("SELECT session_id FROM chat_sessions WHERE session_id = %s", (self.session_id,))
                exists = cursor.fetchone()
                
                if exists:
                    # Update existing session
                    self.updated_at = datetime.utcnow()
                    cursor.execute("""
                        UPDATE chat_sessions SET 
                            user_id = %s, status = %s, updated_at = %s, metadata = %s
                        WHERE session_id = %s
                    """, (self.user_id, self.status, self.updated_at, self.metadata, self.session_id))
                else:
                    # Insert new session
                    cursor.execute("""
                        INSERT INTO chat_sessions (
                            session_id, user_id, status, created_at, updated_at, metadata
                        ) VALUES (%s, %s, %s, %s, %s, %s)
                    """, (
                        self.session_id, self.user_id, self.status,
                        self.created_at, self.updated_at, self.metadata
                    ))
                
                logger.info(f"Chat session {self.session_id} saved successfully")
                return True
                
        except Exception as e:
            logger.error(f"Failed to save chat session {self.session_id}: {e}")
            return False
    
    @classmethod
    def find_by_id(cls, session_id: str) -> Optional['ChatSession']:
        """Find chat session by ID"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                cursor.execute("SELECT * FROM chat_sessions WHERE session_id = %s", (session_id,))
                row = cursor.fetchone()
                
                if row:
                    return cls.from_dict(dict(row))
                return None
                
        except Exception as e:
            logger.error(f"Failed to find chat session by ID {session_id}: {e}")
            return None
    
    @classmethod
    def find_by_user_id(cls, user_id: str, limit: int = 10) -> List['ChatSession']:
        """Find chat sessions by user ID"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                cursor.execute("""
                    SELECT * FROM chat_sessions 
                    WHERE user_id = %s 
                    ORDER BY updated_at DESC 
                    LIMIT %s
                """, (user_id, limit))
                rows = cursor.fetchall()
                
                return [cls.from_dict(dict(row)) for row in rows]
                
        except Exception as e:
            logger.error(f"Failed to find chat sessions for user {user_id}: {e}")
            return []

class ChatMessage:
    """Chat message model with database operations"""
    
    def __init__(self, message_id=None, session_id=None, sender_type='user', 
                 content=None, created_at=None, metadata=None):
        self.message_id = message_id or str(uuid.uuid4())
        self.session_id = session_id
        self.sender_type = sender_type  # user, bot, system
        self.content = content
        self.created_at = created_at or datetime.utcnow()
        self.metadata = metadata or {}
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert chat message to dictionary"""
        return {
            'message_id': self.message_id,
            'session_id': self.session_id,
            'sender_type': self.sender_type,
            'content': self.content,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'metadata': self.metadata
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ChatMessage':
        """Create ChatMessage instance from dictionary"""
        return cls(
            message_id=data.get('message_id'),
            session_id=data.get('session_id'),
            sender_type=data.get('sender_type', 'user'),
            content=data.get('content'),
            created_at=datetime.fromisoformat(data['created_at']) if data.get('created_at') else None,
            metadata=data.get('metadata', {})
        )
    
    def save(self) -> bool:
        """Save chat message to database"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                cursor.execute("""
                    INSERT INTO chat_messages (
                        message_id, session_id, sender_type, content, created_at, metadata
                    ) VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    self.message_id, self.session_id, self.sender_type,
                    self.content, self.created_at, self.metadata
                ))
                
                logger.info(f"Chat message {self.message_id} saved successfully")
                return True
                
        except Exception as e:
            logger.error(f"Failed to save chat message {self.message_id}: {e}")
            return False
    
    @classmethod
    def find_by_session_id(cls, session_id: str, limit: int = 100) -> List['ChatMessage']:
        """Find chat messages by session ID"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                cursor.execute("""
                    SELECT * FROM chat_messages 
                    WHERE session_id = %s 
                    ORDER BY created_at ASC 
                    LIMIT %s
                """, (session_id, limit))
                rows = cursor.fetchall()
                
                return [cls.from_dict(dict(row)) for row in rows]
                
        except Exception as e:
            logger.error(f"Failed to find chat messages for session {session_id}: {e}")
            return []
    
    @classmethod
    def get_recent_messages(cls, session_id: str, count: int = 10) -> List['ChatMessage']:
        """Get recent messages for a session"""
        try:
            with db_manager.get_pg_cursor() as cursor:
                cursor.execute("""
                    SELECT * FROM chat_messages 
                    WHERE session_id = %s 
                    ORDER BY created_at DESC 
                    LIMIT %s
                """, (session_id, count))
                rows = cursor.fetchall()
                
                # Reverse to get chronological order
                return [cls.from_dict(dict(row)) for row in reversed(rows)]
                
        except Exception as e:
            logger.error(f"Failed to get recent messages for session {session_id}: {e}")
            return []
