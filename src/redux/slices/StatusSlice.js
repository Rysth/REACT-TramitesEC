import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  statusOriginal: [],
}

const handleRequestError = (error) => {
  if (error.response.status === 500) {
    toast.error('¡Problema en el Servidor!', { theme: 'colored' })
  } else {
    throw new Error(error)
  }
}

export const getStatuses = createAsyncThunk('status/getStatuses', async (activeToken) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/statuses`, {
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

export const StatusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStatuses.fulfilled, (state, action) => {
      state.statusOriginal = action.payload
    })
  },
})

export const StatusActions = StatusSlice.actions

export default StatusSlice.reducer
