import { configureStore } from '@reduxjs/toolkit'
import AuthenticationReducer from './slices/AuthenticationSlice'
import UserReducer from './slices/UserSlice'
import CustomerReducer from './slices/CustomerSlice'
import ProcessorReducer from './slices/ProcessorSlice'
import SupplierReducer from './slices/SupplierSlice'
import ProfileReducer from './slices/ProfileSlice'
import ProcedureReducer from './slices/ProcedureSlice'
import ProcedureTypeReducer from './slices/ProcedureTypeSlice'
import SharedReducer from './slices/SharedSlice'
import AgencyReducer from './slices/AgencySlice'
import CourseReducer from './slices/CourseSlice'
import SchoolReducer from './slices/SchoolSlice'

const Store = configureStore({
  reducer: {
    authentication: AuthenticationReducer,
    users: UserReducer,
    customer: CustomerReducer,
    processor: ProcessorReducer,
    supplier: SupplierReducer,
    profile: ProfileReducer,
    procedure: ProcedureReducer,
    procedureType: ProcedureTypeReducer,
    shared: SharedReducer,
    agency: AgencyReducer,
    course: CourseReducer,
    school: SchoolReducer,
  },
})

export default Store
