import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ordersAPI } from '../../services/api'

// Async thunks for orders actions
export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.createOrder(orderData)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create order')
    }
  }
)

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getOrders(params)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch orders')
    }
  }
)

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.getOrder(orderId)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch order')
    }
  }
)

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (orderId, { rejectWithValue }) => {
    try {
      await ordersAPI.cancelOrder(orderId)
      return orderId
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to cancel order')
    }
  }
)

const initialState = {
  orders: [],
  currentOrder: null,
  cart: {
    items: [],
    total: 0,
    currency: 'USD',
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    status: '',
    dateFrom: null,
    dateTo: null,
  },
  loading: false,
  error: null,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existingItem = state.cart.items.find(i => i.product_id === item.product_id)
      
      if (existingItem) {
        existingItem.quantity += item.quantity || 1
      } else {
        state.cart.items.push({
          ...item,
          quantity: item.quantity || 1
        })
      }
      
      // Recalculate total
      state.cart.total = state.cart.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
      )
    },
    removeFromCart: (state, action) => {
      const productId = action.payload
      state.cart.items = state.cart.items.filter(item => item.product_id !== productId)
      
      // Recalculate total
      state.cart.total = state.cart.items.reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
      )
    },
    updateCartItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload
      const item = state.cart.items.find(i => i.product_id === productId)
      
      if (item) {
        if (quantity <= 0) {
          state.cart.items = state.cart.items.filter(i => i.product_id !== productId)
        } else {
          item.quantity = quantity
        }
        
        // Recalculate total
        state.cart.total = state.cart.items.reduce(
          (sum, item) => sum + (item.price * item.quantity), 0
        )
      }
    },
    clearCart: (state) => {
      state.cart.items = []
      state.cart.total = 0
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
        state.orders.unshift(action.payload) // Add to beginning of orders list
        state.cart.items = [] // Clear cart after successful order
        state.cart.total = 0
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.orders || []
        state.pagination.total = action.payload.total || 0
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch order
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false
        const orderId = action.payload
        
        // Update order status in orders list
        const order = state.orders.find(o => o.id === orderId)
        if (order) {
          order.status = 'cancelled'
        }
        
        // Update current order if it's the cancelled one
        if (state.currentOrder?.id === orderId) {
          state.currentOrder.status = 'cancelled'
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  setFilters,
  setPagination,
  clearCurrentOrder,
  clearError,
} = ordersSlice.actions

// Selectors
export const selectOrders = (state) => state.orders.orders
export const selectCurrentOrder = (state) => state.orders.currentOrder
export const selectCart = (state) => state.orders.cart
export const selectCartItems = (state) => state.orders.cart.items
export const selectCartTotal = (state) => state.orders.cart.total
export const selectCartItemCount = (state) => 
  state.orders.cart.items.reduce((sum, item) => sum + item.quantity, 0)
export const selectOrdersFilters = (state) => state.orders.filters
export const selectOrdersPagination = (state) => state.orders.pagination
export const selectOrdersLoading = (state) => state.orders.loading
export const selectOrdersError = (state) => state.orders.error

export default ordersSlice.reducer
