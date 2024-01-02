import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
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

export const getLicenses = createAsyncThunk('license/getLicenses', async (activeToken) => {
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

export const LicenseSlice = createSlice({
  name: 'license',
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
    builder.addCase(getLicenses.fulfilled, (state, action) => {
      state.licensesOriginal = action.payload
      state.licensesArray = state.licensesOriginal
    })
  },
})

export const LicenseActions = LicenseSlice.actions

export default LicenseSlice.reducer
