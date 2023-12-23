import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const getCurrentUserStorage = JSON.parse(sessionStorage.getItem('currentUser'))

const initialState = {
  usersArray: [],
}

const handleRequestError = (error) => {
  if (error.response.status === 500) {
    toast.error('¡Problema en el Servidor!', { theme: 'colored' })
  } else {
    throw new Error(error)
  }
}

export const getUsers = createAsyncThunk('users/getUsers', async (activeToken) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })

    return response.data
  } catch (error) {
    handleRequestError(error)
  }
})
export const UserSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.usersArray = action.payload
    })
  },
})

export const UserActions = UserSlice.actions

export default UserSlice.reducer
