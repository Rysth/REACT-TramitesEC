import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const getActiveUser = JSON.parse(sessionStorage.getItem('activeUser'))
const getActiveToken = sessionStorage.getItem('activeToken')
const getActiveSession = sessionStorage.getItem('active')

const initialState = {
  activeUser: getActiveUser || {},
  activeToken: getActiveToken || '',
  active: getActiveSession === 'true',
}
// Login
export const createSession = createAsyncThunk('authentication/createSession', async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/tokens/sign_in`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    const userResponse = await axios.get(`${API_URL}/api/v1/user`, {
      headers: {
        Authorization: response.data.token,
      },
      withCredentials: true,
    })

    return [response.data, userResponse.data]
  } catch (error) {
    if (error.response.status === 401) {
      toast.error('¡Email/Contraseña Incorrectas!')
      return
    }

    if (error.response.status === 400) {
      toast.error('¡Cuenta no Existe!')
      return
    }

    if (error.response.status === 500) {
      toast.error('¡Problema en el Servidor!')
      return
    }

    throw new Error(error)
  }
})

// Logout
export const destroySession = createAsyncThunk('authentication/destroySession', async (activeToken) => {
  try {
    await axios.post(`${API_URL}/users/tokens/revoke`, {
      headers: {
        Authorization: atob(activeToken),
      },
      withCredentials: true,
    })
  } catch (error) {
    if (error.response.status === 500) {
      toast.error('¡Problema en el Servidor!')
      return
    }

    throw new Error(error)
  }
})

export const getActualUser = createAsyncThunk('authentication/getActualUser', async (activeToken) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/user`, {
      headers: {
        Authorization: atob(activeToken),
      },
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    if (error.response.status === 500) {
      toast.error('¡Problema en el Servidor!')
    }

    throw new Error(error)
  }
})

export const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    createSession(state) {
      state.active = true
      sessionStorage.setItem('active', state.active)
      toast.success('¡Bienvenido!', { autoClose: 2000 })
    },
    destroySession(state) {
      state.active = false
      state.activeUser = {}
      state.activeToken = ''
      sessionStorage.removeItem('active')
      sessionStorage.removeItem('activeUser')
      sessionStorage.removeItem('activeToken')
      toast.info('¡Muchas Gracias!', { autoClose: 2000 })
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getActualUser.fulfilled, (state) => {
      state.activeUser = action.payload
      sessionStorage.setItem('activeUser', JSON.stringify(action.payload))
    })
    builder.addCase(createSession.fulfilled, (state, action) => {
      state.active = true
      state.activeUser = action.payload[1]
      state.activeToken = btoa(action.payload[0].token)
      sessionStorage.setItem('active', state.active)
      sessionStorage.setItem('activeToken', btoa(action.payload[0].token))
      sessionStorage.setItem('activeUser', JSON.stringify(action.payload[1]))
      toast.success('¡Bienvenido!', { autoClose: 2000 })
    })
    builder.addCase(destroySession.fulfilled, (state) => {
      state.active = false
      state.activeUser = {}
      state.activeToken = ''
      sessionStorage.removeItem('active')
      sessionStorage.removeItem('activeUser')
      sessionStorage.removeItem('activeToken')
      toast.info('¡Muchas Gracias!', { autoClose: 2000 })
    })
  },
})

export const AuthenticationActions = AuthenticationSlice.actions

export default AuthenticationSlice.reducer
