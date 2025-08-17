"""
Auth service routes with user authentication and authorization
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
import uuid
from datetime import datetime, timedelta
import logging
from backend.models.user import User

auth_bp = Blueprint('auth', __name__)
logger = logging.getLogger(__name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        required_fields = ['username', 'email', 'password']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Username, email, and password are required'}), 400
        
        username = data['username']
        email = data['email']
        password = data['password']
        
        # Check if user already exists
        existing_user = User.find_by_email(email) or User.find_by_username(username)
        if existing_user:
            return jsonify({'error': 'User with this email or username already exists'}), 409
        
        # Create new user with hashed password
        user = User(
            email=email,
            username=username,
            password_hash=User.hash_password(password),
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            phone=data.get('phone')
        )
        
        if user.save():
            # Create access token
            access_token = create_access_token(identity=user.user_id)
            
            logger.info(f"User registered: {username} ({email})")
            
            return jsonify({
                'success': True,
                'data': {
                    'user': user.to_dict(),
                    'access_token': access_token
                }
            })
        else:
            return jsonify({'error': 'Failed to create user'}), 500
        
        logger.info(f"User registered: {username} ({email})")
        
        return jsonify({
            'success': True,
            'data': {
                'user': user_data,
                'access_token': access_token
            }
        }), 201
        
    except Exception as e:
        logger.error(f"Error registering user: {str(e)}")
        return jsonify({'error': 'Failed to register user'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate user and return access token"""
    try:
        data = request.get_json()
        
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password are required'}), 400
        
        email = data['email']
        password = data['password']
        
        # Authenticate user using database model
        user = User.authenticate(email, password)
        
        if user:
            # Create access token
            access_token = create_access_token(identity=user.user_id)
            
            logger.info(f"User logged in: {email}")
            
            return jsonify({
                'success': True,
                'data': {
                    'user': user.to_dict(),
                    'access_token': access_token
                }
            })
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
        
    except Exception as e:
        logger.error(f"Error logging in user: {str(e)}")
        return jsonify({'error': 'Failed to login'}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile"""
    try:
        user_id = get_jwt_identity()
        
        # TODO: Retrieve user from database
        # Mock user data for now
        user_data = {
            'id': user_id,
            'username': 'testuser',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'created_at': datetime.utcnow().isoformat()
        }
        
        return jsonify({
            'success': True,
            'data': user_data
        })
        
    except Exception as e:
        logger.error(f"Error retrieving profile: {str(e)}")
        return jsonify({'error': 'Failed to retrieve profile'}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # TODO: Update user in database
        # Mock update for now
        updated_data = {
            'id': user_id,
            'username': data.get('username', 'testuser'),
            'email': data.get('email', 'test@example.com'),
            'first_name': data.get('first_name', 'Test'),
            'last_name': data.get('last_name', 'User'),
            'phone': data.get('phone', ''),
            'updated_at': datetime.utcnow().isoformat()
        }
        
        logger.info(f"Profile updated for user: {user_id}")
        
        return jsonify({
            'success': True,
            'data': updated_data
        })
        
    except Exception as e:
        logger.error(f"Error updating profile: {str(e)}")
        return jsonify({'error': 'Failed to update profile'}), 500
