import { configureStore } from '@reduxjs/toolkit'
import AuthenticationReducer from './slices/AuthenticationSlice'
import CustomerReducer from './slices/CustomerSlice'
import ProcessorReducer from './slices/ProcessorSlice'

const Store = configureStore({
  reducer: {
    authentication: AuthenticationReducer,
    customer: CustomerReducer,
    processor: ProcessorReducer,
  },
})

export default Store
