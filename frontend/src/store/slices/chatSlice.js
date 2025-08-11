import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { chatAPI } from '../../services/api'

// Async thunks for chat actions
export const createChatSession = createAsyncThunk(
  'chat/createSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatAPI.createSession()
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create session')
    }
  }
)

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, sessionId }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.sendMessage(message, sessionId)
      return {
        userMessage: {
          id: Date.now(),
          content: message,
          type: 'user',
          timestamp: new Date().toISOString()
        },
        botMessage: response.data.data
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to send message')
    }
  }
)

export const fetchChatHistory = createAsyncThunk(
  'chat/fetchHistory',
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getChatHistory(sessionId)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch history')
    }
  }
)

const initialState = {
  currentSession: null,
  messages: [],
  isTyping: false,
  loading: false,
  error: null,
  isWidgetOpen: false,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleWidget: (state) => {
      state.isWidgetOpen = !state.isWidgetOpen
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    clearMessages: (state) => {
      state.messages = []
    },
    clearError: (state) => {
      state.error = null
    },
    setCurrentSession: (state, action) => {
      state.currentSession = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Create session
      .addCase(createChatSession.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createChatSession.fulfilled, (state, action) => {
        state.loading = false
        state.currentSession = action.payload
      })
      .addCase(createChatSession.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isTyping = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isTyping = false
        state.messages.push(action.payload.userMessage)
        state.messages.push(action.payload.botMessage)
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isTyping = false
        state.error = action.payload
      })
      // Fetch history
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false
        state.messages = action.payload.messages || []
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  toggleWidget,
  setTyping,
  addMessage,
  clearMessages,
  clearError,
  setCurrentSession,
} = chatSlice.actions

// Selectors
export const selectCurrentSession = (state) => state.chat.currentSession
export const selectMessages = (state) => state.chat.messages
export const selectIsTyping = (state) => state.chat.isTyping
export const selectChatLoading = (state) => state.chat.loading
export const selectChatError = (state) => state.chat.error
export const selectIsWidgetOpen = (state) => state.chat.isWidgetOpen

export default chatSlice.reducer
