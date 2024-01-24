import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  typesOriginal: [],
  statusOriginal: [],
  licensesOriginal: [],
  licensesArray: [],
}

const handleRequestError = (error) => {
  if (error.response.status === 500) {
    toast.error('¡Problema en el Servidor!', { theme: 'colored' })
  } else {
    throw new Error(error)
  }
}

// Async thunk for fetching types
export const getTypes = createAsyncThunk('shared/getTypes', async (activeToken) => {
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

// Async thunk for fetching statuses
export const getStatuses = createAsyncThunk('shared/getStatuses', async (activeToken) => {
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

// Async thunk for fetching licenses
export const getLicenses = createAsyncThunk('shared/getLicenses', async (activeToken) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/licenses`, {
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

const sharedSlice = createSlice({
  name: 'shared',
  initialState,
  reducers: {
    filterLicenses: (state, action) => {
      const searchTypeID = action.payload
      if (searchTypeID === 1) {
        state.licensesArray = state.licensesOriginal
        return
      }
      state.licensesArray = state.licensesOriginal.filter((license) => license.type.id === searchTypeID)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTypes.fulfilled, (state, action) => {
        state.typesOriginal = action.payload
      })
      .addCase(getStatuses.fulfilled, (state, action) => {
        state.statusOriginal = action.payload
      })
      .addCase(getLicenses.fulfilled, (state, action) => {
        state.licensesOriginal = action.payload
        state.licensesArray = action.payload
      })
  },
})

export const sharedActions = sharedSlice.actions

export default sharedSlice.reducer
