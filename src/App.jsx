import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Sidebar from './components/Sidebar/Sidebar'
import CustomerPage from './pages/CustomerPage/CustomerPage'
import ProcedurePage from './pages/ProcedurePage/ProcedurePage'
import ProcessorPage from './pages/ProcessorPage/ProcessorPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import SessionPage from './pages/SessionPage/SessionPage'
import { getCustomers } from './redux/slices/CustomerSlice'
import { getLicenses } from './redux/slices/LicenseSlice'
import { getProcedures } from './redux/slices/ProcedureSlice'
import { getProcessors } from './redux/slices/ProcessorSlice'
import { getStatuses } from './redux/slices/StatusSlice'
import { getTypes } from './redux/slices/TypeSlice'
import { getUsers } from './redux/slices/UserSlice'

function App() {
  const dispatch = useDispatch()
  const { active, activeToken } = useSelector((state) => state.authentication)

  useEffect(() => {
    if (active) {
      dispatch(getUsers(activeToken))
    }
  }, [dispatch, activeToken, active])

  return (
    <BrowserRouter>
      <ToastContainer />
      {active && <Sidebar />}
      <main className="h-screen">
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
            path="/clientes"
            element={
              <ProtectedRoute isAllowed={active} redirectTo="/session">
                <CustomerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tramites"
            element={
              <ProtectedRoute isAllowed={active} redirectTo="/session">
                <ProcedurePage />
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
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
