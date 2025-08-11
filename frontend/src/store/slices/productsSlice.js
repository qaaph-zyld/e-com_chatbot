import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productsAPI } from '../../services/api'

// Async thunks for products actions
export const searchProducts = createAsyncThunk(
  'products/search',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await productsAPI.searchProducts(searchParams)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to search products')
    }
  }
)

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getProduct(productId)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch product')
    }
  }
)

export const fetchRecommendations = createAsyncThunk(
  'products/fetchRecommendations',
  async (params, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getRecommendations(params)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch recommendations')
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsAPI.getCategories()
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch categories')
    }
  }
)

const initialState = {
  products: [],
  currentProduct: null,
  recommendations: [],
  categories: [],
  searchQuery: '',
  filters: {
    category: '',
    minPrice: null,
    maxPrice: null,
    brand: '',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
  loading: false,
  error: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        minPrice: null,
        maxPrice: null,
        brand: '',
      }
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    clearProducts: (state) => {
      state.products = []
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products || []
        state.pagination.total = action.payload.total || 0
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch product
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false
        state.currentProduct = action.payload
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch recommendations
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false
        state.recommendations = action.payload.recommendations || []
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  setSearchQuery,
  setFilters,
  clearFilters,
  setPagination,
  clearProducts,
  clearCurrentProduct,
  clearError,
} = productsSlice.actions

// Selectors
export const selectProducts = (state) => state.products.products
export const selectCurrentProduct = (state) => state.products.currentProduct
export const selectRecommendations = (state) => state.products.recommendations
export const selectCategories = (state) => state.products.categories
export const selectSearchQuery = (state) => state.products.searchQuery
export const selectFilters = (state) => state.products.filters
export const selectPagination = (state) => state.products.pagination
export const selectProductsLoading = (state) => state.products.loading
export const selectProductsError = (state) => state.products.error

export default productsSlice.reducer
