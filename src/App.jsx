import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from './components/Sidebar/Sidebar'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import SessionPage from './pages/SessionPage/SessionPage'
import ProcessorPage from './pages/ProcessorPage/ProcessorPage'
import ProcedurePage from './pages/ProcedurePage/ProcedurePage'
import CustomerPage from './pages/CustomerPage/CustomerPage'
import { getProcessors } from './redux/slices/ProcessorSlice'
import { getCustomers } from './redux/slices/CustomerSlice'
import { getUsers } from './redux/slices/UserSlice'
import { getProcedures } from './redux/slices/ProcedureSlice'
import { getTypes } from './redux/slices/TypeSlice'
import './App.css'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import DashboardPage from './pages/DashboardPage/DashboardPage'

function App() {
  const dispatch = useDispatch()
  const { active, activeToken } = useSelector((state) => state.authentication)

  useEffect(() => {
    if (active) {
      dispatch(getProcessors(activeToken))
      dispatch(getCustomers(activeToken))
      dispatch(getUsers(activeToken))
      dispatch(getProcedures(activeToken))
      dispatch(getTypes(activeToken))
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
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tramitadores"
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
