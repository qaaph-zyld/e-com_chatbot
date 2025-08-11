import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData) => 
    api.post('/auth/register', userData),
  
  getProfile: () => 
    api.get('/auth/profile'),
  
  updateProfile: (userData) => 
    api.put('/auth/profile', userData),
}

// Chat API
export const chatAPI = {
  createSession: () => 
    api.post('/chat/session'),
  
  sendMessage: (message, sessionId) => 
    api.post('/chat/message', { message, session_id: sessionId }),
  
  getChatHistory: (sessionId) => 
    api.get(`/chat/history/${sessionId}`),
}

// Products API
export const productsAPI = {
  searchProducts: (params) => 
    api.get('/products/search', { params }),
  
  getProduct: (productId) => 
    api.get(`/products/${productId}`),
  
  getRecommendations: (params) => 
    api.get('/products/recommendations', { params }),
  
  getCategories: () => 
    api.get('/products/categories'),
}

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => 
    api.post('/orders', orderData),
  
  getOrders: (params) => 
    api.get('/orders', { params }),
  
  getOrder: (orderId) => 
    api.get(`/orders/${orderId}`),
  
  cancelOrder: (orderId) => 
    api.post(`/orders/${orderId}/cancel`),
}

// Analytics API
export const analyticsAPI = {
  trackEvent: (eventData) => 
    api.post('/analytics/event', eventData),
  
  getDashboard: () => 
    api.get('/analytics/dashboard'),
  
  getSalesReport: (params) => 
    api.get('/analytics/reports/sales', { params }),
  
  getChatReport: (params) => 
    api.get('/analytics/reports/chat', { params }),
}

export default api
