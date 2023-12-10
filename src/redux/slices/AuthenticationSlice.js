import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const getActiveUser = JSON.parse(sessionStorage.getItem('activeUser'))
const getActiveSession = sessionStorage.getItem('active')
const initialState = {
  activeUser: getActiveUser || {},
  active: getActiveSession || false,
}

export const createSession = createAsyncThunk('authentication/createSession', async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users/tokens/sign_in`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    return response.data
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
})

export const destroySession = createAsyncThunk('authentication/destroySession', async (activeToken) => {
  try {
    await axios.post(`${API_URL}/users/tokens/revoke`, {
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
})

export const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    destroySession(state) {
      state.active = false
      state.activeUser = {}
      state.activeToken = ''
      sessionStorage.removeItem('active')
      sessionStorage.removeItem('activeUser')
      sessionStorage.removeItem('activeToken')
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createSession.fulfilled, (state, action) => {
      state.active = true
      state.activeUser = action.payload.resource_owner
      state.activeToken = action.payload.token
      sessionStorage.setItem('active', state.active)
      sessionStorage.setItem('activeUser', JSON.stringify(action.payload.resource_owner))
      sessionStorage.setItem('activeToken', action.payload.token)
    })
    builder.addCase(destroySession.fulfilled, (state) => {
      state.active = false
      state.activeUser = {}
      state.activeToken = ''
      sessionStorage.removeItem('active')
      sessionStorage.removeItem('activeUser')
      sessionStorage.removeItem('activeToken')
    })
  },
})

export const AuthenticationActions = AuthenticationSlice.actions

export default AuthenticationSlice.reducer
