import { configureStore } from '@reduxjs/toolkit'
import AuthenticationReducer from './slices/AuthenticationSlice'
import UserReducer from './slices/UserSlice'
import CustomerReducer from './slices/CustomerSlice'
import ProcessorReducer from './slices/ProcessorSlice'
import ProfileReducer from './slices/ProfileSlice'
import ProcedureReducer from './slices/ProcedureSlice'

const Store = configureStore({
  reducer: {
    authentication: AuthenticationReducer,
    users: UserReducer,
    customer: CustomerReducer,
    processor: ProcessorReducer,
    profile: ProfileReducer,
    procedure: ProcedureReducer,
  },
})

export default Store
