import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import chatSlice from './slices/chatSlice'
import productsSlice from './slices/productsSlice'
import ordersSlice from './slices/ordersSlice'
import uiSlice from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    chat: chatSlice,
    products: productsSlice,
    orders: ordersSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

// Export types for TypeScript usage (when converted to .ts)
// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch
