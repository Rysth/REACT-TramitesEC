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
  loading: false,
}

const handleRequestError = (error) => {
  if (error.response.status === 401) {
    toast.error('¡Email/Contraseña Incorrectas!')
  } else if (error.response.status === 400) {
    toast.error('¡Cuenta no Existe!')
  } else if (error.response.status === 500) {
    toast.error('¡Problema en el Servidor!')
  } else {
    throw new Error(error)
  }
}

export const createSession = createAsyncThunk('authentication/createSession', async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/tokens/sign_in`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    const userResponse = await axios.get(`${API_URL}/api/v1/users/1`, {
      headers: {
        Authorization: response.data.token,
      },
      withCredentials: true,
    })

    return [response.data, userResponse.data]
  } catch (error) {
    handleRequestError(error)
  }
})

export const destroySession = createAsyncThunk('authentication/destroySession', async (activeToken) => {
  try {
    await axios.post(
      `${API_URL}/users/tokens/revoke`,
      {},
      {
        headers: {
          Authorization: activeToken,
        },
        withCredentials: true,
      },
    )
  } catch (error) {
    if (error.response.status === 500) {
      toast.error('¡Problema en el Servidor!')
    } else {
      throw new Error(error)
    }
  }
})

export const getActualUser = createAsyncThunk('authentication/getActualUser', async (activeToken) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/users/1`, {
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    if (error.response.status === 500) {
      toast.error('¡Problema en el Servidor!')
    } else {
      throw new Error(error)
    }
  }
})

const updateSessionStorage = (state) => {
  sessionStorage.setItem('active', state.active)
  sessionStorage.setItem('activeToken', state.activeToken)
  sessionStorage.setItem('activeUser', JSON.stringify(state.activeUser))
}

export const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    destroySession: (state) => {
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
    builder.addCase(getActualUser.fulfilled, (state, action) => {
      state.activeUser = action.payload
      updateSessionStorage(state)
    })
    builder.addCase(createSession.pending, (state) => {
      state.loading = true
      toast.info('Espere porfavor...', { autoClose: 2000 })
    })
    builder.addCase(createSession.fulfilled, (state, action) => {
      state.active = true
      state.loading = false
      state.activeUser = action.payload[1]
      state.activeToken = action.payload[0].token
      updateSessionStorage(state)
      toast.success('¡Bienvenido!', { autoClose: 2000 })
    })
    builder.addCase(createSession.rejected, (state, action) => {
      state.loading = false
    })
    builder.addCase(destroySession.fulfilled, (state) => {
      state.active = false
      state.activeUser = {}
      state.activeToken = ''
      updateSessionStorage(state)
      toast.info('¡Muchas Gracias!', { autoClose: 2000 })
    })
  },
})

export const AuthenticationActions = AuthenticationSlice.actions

export default AuthenticationSlice.reducer
