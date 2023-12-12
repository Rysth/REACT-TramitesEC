import './App.css'
import { createContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Sidebar from './components/Sidebar/Sidebar'
import Login from './pages/Session/Login'
/* import Home from './pages/Home/Home' */
import Customer from './pages/Customer/Customer'
import 'react-toastify/dist/ReactToastify.css'

export const DispatchContext = createContext()

function App() {
  const active = useSelector((state) => state.authentication.active)

  useEffect(() => {}, [active])

  return (
    <BrowserRouter>
      {active && <Sidebar />}
      <main className="">
        <ToastContainer position="top-right" />
        <Routes>
          <Route
            path="/login"
            element={
              <ProtectedRoute isAllowed={!active} redirectTo="/">
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute isAllowed={active} redirectTo="/login">
                <Customer />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
