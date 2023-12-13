import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-tailwind/react'
import './index.css'
import App from './App'
import Store from './redux/Store'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <>
    <ThemeProvider>
      <Provider store={Store}>
        <App />
      </Provider>
    </ThemeProvider>
  </>,
)
