import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  userData: [],
}

const handleRequestError = (error) => {
  if (error.response.status === 500) {
    toast.error('¡Problema en el Servidor!', { theme: 'colored' })
  } else {
    throw new Error(error)
  }
}

export const getProfileStats = createAsyncThunk('profile/getProfileStats', async ({ activeToken, userID }) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/profiles/${userID}`, {
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

export const ProfileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProfileStats.fulfilled, (state, action) => {
      state.userData = action.payload
      console.log(state.userData)
    })
  },
})

export const ProfileActions = ProfileSlice.actions

export default ProfileSlice.reducer
