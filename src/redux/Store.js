import { configureStore } from '@reduxjs/toolkit'
import AuthenticationReducer from './slices/AuthenticationSlice'
import UserReducer from './slices/UserSlice'
import CustomerReducer from './slices/CustomerSlice'
import ProcessorReducer from './slices/ProcessorSlice'

const Store = configureStore({
  reducer: {
    authentication: AuthenticationReducer,
    users: UserReducer,
    customer: CustomerReducer,
    processor: ProcessorReducer,
  },
})

export default Store
