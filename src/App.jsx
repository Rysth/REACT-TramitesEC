import { createContext, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Sidebar from './components/Sidebar/Sidebar'
import Session from './pages/Session/Session'
import './App.css'

export const DispatchContext = createContext()

function App() {
  const active = useSelector((state) => state.authentication.active)

  useEffect(() => {}, [active])

  return (
    <BrowserRouter>
      {active && <Sidebar />}
      <main className="h-full">
        <ToastContainer position="top-right" />
        <Routes>
          <Route
            path="/session"
            element={
              <ProtectedRoute isAllowed={!active} redirectTo="/">
                <Session />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
