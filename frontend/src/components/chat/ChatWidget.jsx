import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { chatAPI, analyticsAPI } from '../../services/api'

const ChatContainer = styled(motion.div)`
  position: relative;
  width: 350px;
  height: ${props => props.isOpen ? '500px' : '60px'};
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  transition: height 0.3s ease;
`

const ChatToggle = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 60px;
  height: 60px;
  background: ${props => props.theme.colors.primary};
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`

const ChatHeader = styled.div`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ChatMessages = styled.div`
  height: 320px;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Message = styled.div`
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  word-wrap: break-word;
  
  ${props => props.isBot ? `
    align-self: flex-start;
    background: #f1f3f4;
    color: #333;
  ` : `
    align-self: flex-end;
    background: ${props.theme.colors.primary};
    color: white;
  `}
`

const ChatInput = styled.div`
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 0.5rem;
`

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
  }
`

const SendButton = styled.button`
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #666;
  font-style: italic;
`

const Suggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`

const SuggestionChip = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.primary};
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background: ${props => props.theme.colors.primary};
    color: white;
  }
`

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hi! I'm your shopping assistant. How can I help you find the perfect product today?",
      isBot: true,
      timestamp: new Date(),
      suggestions: ['Show me laptops', 'I need a smartphone', 'What\'s on sale?']
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !sessionId) {
      createChatSession()
    }
  }, [isOpen])

  const createChatSession = async () => {
    try {
      const response = await chatAPI.createSession()
      setSessionId(response.data.data.session_id)
    } catch (error) {
      console.error('Failed to create chat session:', error)
    }
  }

  const sendMessage = async (messageContent) => {
    if (!messageContent.trim()) return

    const userMessage = {
      id: Date.now(),
      content: messageContent,
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Track user message event
    try {
      await analyticsAPI.trackEvent({
        event_type: 'chat_message_sent',
        event_data: {
          message_length: messageContent.length,
          session_id: sessionId
        }
      })
    } catch (error) {
      console.error('Failed to track event:', error)
    }

    try {
      const response = await chatAPI.sendMessage(messageContent, sessionId)
      const botResponse = response.data.data

      const botMessage = {
        id: Date.now() + 1,
        content: botResponse.content,
        isBot: true,
        timestamp: new Date(),
        suggestions: botResponse.suggestions || []
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        content: "Sorry, I'm having trouble responding right now. Please try again.",
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion)
  }

  return (
    <ChatContainer
      isOpen={isOpen}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <ChatHeader>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Shopping Assistant</h3>
                <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
                  Online now
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </ChatHeader>

            <ChatMessages>
              {messages.map((message) => (
                <div key={message.id}>
                  <Message isBot={message.isBot}>
                    {message.content}
                  </Message>
                  {message.suggestions && message.suggestions.length > 0 && (
                    <Suggestions>
                      {message.suggestions.map((suggestion, index) => (
                        <SuggestionChip
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </SuggestionChip>
                      ))}
                    </Suggestions>
                  )}
                </div>
              ))}
              {isTyping && (
                <TypingIndicator>
                  <div>Assistant is typing...</div>
                </TypingIndicator>
              )}
              <div ref={messagesEndRef} />
            </ChatMessages>

            <ChatInput>
              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isTyping}
                />
                <SendButton type="submit" disabled={isTyping || !inputValue.trim()}>
                  Send
                </SendButton>
              </form>
            </ChatInput>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatToggle onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '×' : '💬'}
      </ChatToggle>
    </ChatContainer>
  )
}

export default ChatWidget
