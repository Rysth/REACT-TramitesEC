import { createSlice } from '@reduxjs/toolkit'

const getActiveSession = sessionStorage.getItem('active')
const initialState = {
  active: getActiveSession || false,
}

export const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    createSession(state) {
      state.active = true
      sessionStorage.setItem('active', state.active)
    },
    destroySession(state) {
      state.active = false
      sessionStorage.removeItem('active')
    },
  },
})

export const AuthenticationActions = AuthenticationSlice.actions

export default AuthenticationSlice.reducer
