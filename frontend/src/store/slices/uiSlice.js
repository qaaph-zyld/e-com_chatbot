import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // Global UI state
  theme: 'light',
  sidebarOpen: false,
  mobileMenuOpen: false,
  
  // Loading states
  globalLoading: false,
  
  // Notifications/Toasts
  notifications: [],
  
  // Modals
  modals: {
    login: false,
    register: false,
    productDetail: false,
    cart: false,
    checkout: false,
  },
  
  // Search
  searchOpen: false,
  
  // Filters
  filtersOpen: false,
  
  // Layout
  layout: 'default', // 'default', 'compact', 'wide'
  
  // Preferences
  preferences: {
    currency: 'USD',
    language: 'en',
    notifications: true,
    emailUpdates: true,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    
    // Sidebar
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    
    // Mobile menu
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    
    // Global loading
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload
    },
    
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        type: 'info', // 'success', 'error', 'warning', 'info'
        title: '',
        message: '',
        duration: 5000,
        ...action.payload,
      }
      state.notifications.push(notification)
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    
    // Modals
    openModal: (state, action) => {
      const modalName = action.payload
      if (modalName in state.modals) {
        state.modals[modalName] = true
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload
      if (modalName in state.modals) {
        state.modals[modalName] = false
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal] = false
      })
    },
    
    // Search
    setSearchOpen: (state, action) => {
      state.searchOpen = action.payload
    },
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen
    },
    
    // Filters
    setFiltersOpen: (state, action) => {
      state.filtersOpen = action.payload
    },
    toggleFilters: (state) => {
      state.filtersOpen = !state.filtersOpen
    },
    
    // Layout
    setLayout: (state, action) => {
      state.layout = action.payload
    },
    
    // Preferences
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload }
    },
    resetPreferences: (state) => {
      state.preferences = initialState.preferences
    },
  },
})

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setMobileMenuOpen,
  toggleMobileMenu,
  setGlobalLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setSearchOpen,
  toggleSearch,
  setFiltersOpen,
  toggleFilters,
  setLayout,
  updatePreferences,
  resetPreferences,
} = uiSlice.actions

// Selectors
export const selectTheme = (state) => state.ui.theme
export const selectSidebarOpen = (state) => state.ui.sidebarOpen
export const selectMobileMenuOpen = (state) => state.ui.mobileMenuOpen
export const selectGlobalLoading = (state) => state.ui.globalLoading
export const selectNotifications = (state) => state.ui.notifications
export const selectModals = (state) => state.ui.modals
export const selectModalOpen = (modalName) => (state) => state.ui.modals[modalName]
export const selectSearchOpen = (state) => state.ui.searchOpen
export const selectFiltersOpen = (state) => state.ui.filtersOpen
export const selectLayout = (state) => state.ui.layout
export const selectPreferences = (state) => state.ui.preferences

export default uiSlice.reducer
