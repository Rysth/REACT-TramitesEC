import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from './components/Sidebar/Sidebar'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import SessionPage from './pages/SessionPage/SessionPage'
import ProcessorPage from './pages/ProcessorPage/ProcessorPage'
import CustomerPage from './pages/CustomerPage/CustomerPage'
import './App.css'

function App() {
  const active = useSelector((state) => state.authentication.active)

  useEffect(() => {}, [active])

  return (
    <BrowserRouter>
      <ToastContainer />
      {active && <Sidebar />}
      <main className="h-full">
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
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
