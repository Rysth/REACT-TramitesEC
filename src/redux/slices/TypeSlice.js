import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  typesOriginal: [],
}

const handleRequestError = (error) => {
  if (error.response.status === 500) {
    toast.error('¡Problema en el Servidor!', { theme: 'colored' })
  } else {
    throw new Error(error)
  }
}

export const getTypes = createAsyncThunk('type/getTypes', async (activeToken) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/types`, {
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

export const TypeSlice = createSlice({
  name: 'type',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTypes.fulfilled, (state, action) => {
      state.typesOriginal = action.payload
    })
  },
})

export const TypeActions = TypeSlice.actions

export default TypeSlice.reducer
