import { configureStore } from '@reduxjs/toolkit'
import AuthenticationReducer from './slices/AuthenticationSlice'

const Store = configureStore({
  reducer: {
    authentication: AuthenticationReducer,
  },
})

export default Store
