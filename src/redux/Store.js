import { configureStore } from '@reduxjs/toolkit'
import AuthenticationReducer from './slices/AuthenticationSlice'
import UserReducer from './slices/UserSlice'
import CustomerReducer from './slices/CustomerSlice'
import ProcessorReducer from './slices/ProcessorSlice'
import ProfileReducer from './slices/ProfileSlice'
import ProcedureReducer from './slices/ProcedureSlice'
import SharedReducer from './slices/SharedSlice'

const Store = configureStore({
  reducer: {
    authentication: AuthenticationReducer,
    users: UserReducer,
    customer: CustomerReducer,
    processor: ProcessorReducer,
    profile: ProfileReducer,
    procedure: ProcedureReducer,
    shared: SharedReducer,
  },
})

export default Store
