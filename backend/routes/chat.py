"""
Chat service routes with session management and message handling
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid
from datetime import datetime
import logging
from backend.models.chat import ChatSession, ChatMessage
from backend.models.user import User

logger = logging.getLogger(__name__)
chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/session', methods=['POST'])
@jwt_required(optional=True)
def create_chat_session():
    """Create a new chat session"""
    try:
        user_id = get_jwt_identity()
        
        # Create new chat session using database model
        session = ChatSession(user_id=user_id)
        
        if session.save():
            logger.info(f"Created chat session: {session.session_id}")
            return jsonify({
                'success': True,
                'data': session.to_dict()
            })
        else:
            return jsonify({'error': 'Failed to create chat session'}), 500
        
    except Exception as e:
        logger.error(f"Error creating chat session: {str(e)}")
        return jsonify({'error': 'Failed to create chat session'}), 500

@chat_bp.route('/message', methods=['POST'])
def send_message():
    """Send a message and get AI response"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({'error': 'Message is required'}), 400
        
        message = data['message']
        session_id = data.get('session_id')
        
        if not session_id:
            return jsonify({'error': 'Session ID is required'}), 400
        
        # Verify session exists
        session = ChatSession.find_by_id(session_id)
        if not session:
            return jsonify({'error': 'Invalid session ID'}), 404
        
        # Save user message
        user_message = ChatMessage(
            session_id=session_id,
            sender_type='user',
            content=message
        )
        user_message.save()
        
        # Generate AI response (mock for now)
        ai_content = f"I received your message: '{message}'. How can I help you find products today?"
        
        # Save AI response
        ai_message = ChatMessage(
            session_id=session_id,
            sender_type='bot',
            content=ai_content,
            metadata={
                'suggestions': [
                    'Show me laptops',
                    'I need a smartphone',
                    'What\'s on sale?'
                ]
            }
        )
        ai_message.save()
        
        logger.info(f"Processed message for session: {session_id}")
        
        return jsonify({
            'success': True,
            'data': ai_message.to_dict()
        })
        
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        return jsonify({'error': 'Failed to process message'}), 500

@chat_bp.route('/history/<session_id>', methods=['GET'])
@jwt_required(optional=True)
def get_chat_history(session_id):
    """Get chat history for a session"""
    try:
        # Verify session exists
        session = ChatSession.find_by_id(session_id)
        if not session:
            return jsonify({'error': 'Invalid session ID'}), 404
        
        # Get chat messages from database
        messages = ChatMessage.find_by_session_id(session_id)
        
        # Convert to response format
        history = [message.to_dict() for message in messages]
        
        return jsonify({
            'success': True,
            'data': {
                'session_id': session_id,
                'messages': history
            }
        })
        
    except Exception as e:
        logger.error(f"Error retrieving chat history: {str(e)}")
        return jsonify({'error': 'Failed to retrieve chat history'}), 500
