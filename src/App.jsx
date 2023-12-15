import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import SessionPage from './pages/SessionPage/SessionPage'
import './App.css'

function App() {
  const active = useSelector((state) => state.authentication.active)

  useEffect(() => {}, [active])

  return (
    <BrowserRouter>
      <ToastContainer />
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
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
