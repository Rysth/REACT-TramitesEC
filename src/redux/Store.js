import { configureStore } from '@reduxjs/toolkit'
import AuthenticationReducer from './slices/AuthenticationSlice'
import CustomerReducer from './slices/CustomerSlice'

const Store = configureStore({
  reducer: {
    authentication: AuthenticationReducer,
    customer: CustomerReducer,
  },
})

export default Store
