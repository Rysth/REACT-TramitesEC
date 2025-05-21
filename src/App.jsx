import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Sidebar from './components/Sidebar/Sidebar'
import AgencyPage from './pages/AgencyPage/AgencyPage' // Import AgencyPage
import CustomerPage from './pages/CustomerPage/CustomerPage'
import CustomerProfilePage from './pages/CustomerPage/CustomerProfilePage'
import ProcedurePage from './pages/ProcedurePage/ProcedurePage'
import ProcedureTypePage from './pages/ProcedureTypePage/ProcedureTypePage' // Import ProcedureTypePage
import ProcessorPage from './pages/ProcessorPage/ProcessorPage'
import ProcessorProfilePage from './pages/ProcessorPage/ProcessorProfilePage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import SessionPage from './pages/SessionPage/SessionPage'
import SupplierPage from './pages/SupplierPage/SupplierPage'
import {
  getLicenses,
  getLicenseTypes,
  getPaymentTypes,
  getProcedureTypes,
  getStatuses,
  getAgencies,
} from './redux/slices/SharedSlice'
import { getUsers } from './redux/slices/UserSlice'

function App() {
  const dispatch = useDispatch()
  const { active, activeToken } = useSelector((state) => state.authentication)

  useEffect(() => {
    if (active) {
      dispatch(getUsers(activeToken))
      dispatch(getStatuses(activeToken))
      dispatch(getLicenses(activeToken))
      dispatch(getLicenseTypes(activeToken))
      dispatch(getProcedureTypes({ activeToken, full: true }))
      dispatch(getPaymentTypes(activeToken))
      dispatch(getAgencies({ activeToken, full: true })) // Updated line
    }
  }, [dispatch, activeToken, active])

  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" />

      {active && <Sidebar />}
      <main className={`min-h-screen ${active ? 'bg-white!' : 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-800 '} rounded-xl`}>
        <Routes>
          <Route
            path="/session"
            element={
              <ProtectedRoute isAllowed={!active} redirectTo="/">
                <SessionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute isAllowed={active} redirectTo="/session">
                <ProcessorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tramitadores/:id"
            element={
              <ProtectedRoute isAllowed={active} redirectTo="/session">
                <ProcessorProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <ProtectedRoute isAllowed={active} redirectTo="/session">
                <CustomerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes/:id"
            element={
              <ProtectedRoute isAllowed={active} redirectTo="/session">
                <CustomerProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tramites/vehiculares"
            element={
              <ProtectedRoute isAllowed={active} redirectTo="/session">
                <ProcedurePage routeName="vehiculares" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tramites/licencias"
            element={
              <ProtectedRoute isAllowed={active} redirectTo="/session">
                <ProcedurePage routeName="licencias" />
              </ProtectedRoute>
            }
          />
          <Route // Add route for Suppliers
            path="/proveedores"
            element={
              <ProtectedRoute isAllowed={active} redirectTo="/session">
                <SupplierPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tipo-tramites" // Add route for Procedure Types
            element={
              <ProtectedRoute isAllowed={active} redirectTo="/session">
                <ProcedureTypePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profiles/:id"
            element={
              <ProtectedRoute isAllowed={active} redirectTo="/session">
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agencias"
            element={
              <ProtectedRoute isAllowed={active} redirectTo="/session">
                <AgencyPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
