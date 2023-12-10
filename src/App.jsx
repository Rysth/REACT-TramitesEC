import './App.css'
import { createContext } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Sidebar from './components/Sidebar/Sidebar'
import Login from './pages/Session/Login'
import Home from './pages/Home/Home'
import Customer from './pages/Customer/Customer'

export const DispatchContext = createContext()

function App() {
  const active = useSelector((state) => state.authentication.active)

  return (
    <BrowserRouter>
      {active && <Sidebar />}
      <main className="">
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
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes"
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
