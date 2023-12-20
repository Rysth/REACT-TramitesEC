import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  processorOriginal: [],
  processorsArray: [],
  processorStats: [],
  processorSelected: null,
  loading: true,
}

const handleRequestError = (error) => {
  if (error.response.status === 401) {
    toast.error('¡Sesión Caducada! Cerrando Sesion...', { autoClose: 2000, theme: 'colored' })

    setTimeout(() => {
      sessionStorage.removeItem('active')
      sessionStorage.removeItem('activeUser')
      sessionStorage.removeItem('activeToken')
      window.location.href = '/session'
    }, 3000)
  }

  if (error.response.status === 422) {
    toast.error('¡Trámitador ya Registrado!', { theme: 'colored' })
    return
  }

  if (error.response.status === 500) {
    toast.error('¡Problema en el Servidor!', { theme: 'colored' })
  }

  throw new Error(error)
}

// Wrapper for handling async thunks with common error handling
const createAsyncThunkWrapper = (type, requestFn) =>
  createAsyncThunk(`processor/${type}`, async (...args) => {
    try {
      const response = await requestFn(...args)
      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  })

// Thunk for retrieving processors (GET)
export const getProcessors = createAsyncThunkWrapper('getProcessors', async (activeToken) => {
  return axios.get(`${API_URL}/api/v1/processors`, {
    headers: {
      Authorization: atob(activeToken),
    },
    withCredentials: true,
  })
})

// Thunk for creating a new processor (POST)
export const createProcessor = createAsyncThunkWrapper('createProcessor', async ({ activeToken, newProcessor }) => {
  return axios.post(`${API_URL}/api/v1/processors/`, newProcessor, {
    headers: {
      Authorization: atob(activeToken),
    },
    withCredentials: true,
  })
})

// Thunk for updating an existing processor (PUT)
export const updateProcessor = createAsyncThunkWrapper('updateProcessor', async ({ activeToken, oldProcessor }) => {
  return axios.put(`${API_URL}/api/v1/processors/${oldProcessor.id}`, oldProcessor, {
    headers: {
      Authorization: atob(activeToken),
    },
    withCredentials: true,
  })
})

// Thunk for deleting a processor (DELETE)
export const destroyProcessor = createAsyncThunkWrapper('destroyProcessor', async ({ activeToken, processorID }) => {
  return axios.delete(`${API_URL}/api/v1/processors/${processorID}`, {
    headers: {
      Authorization: atob(activeToken),
    },
    withCredentials: true,
  })
})

// Function to update state and stats after successful API response
const updateStateAndStats = (state, action, successMessage) => {
  const processors = action.payload.processors
  state.processorOriginal = processors
  state.processorsArray = processors

  /* processor Stats */
  state.processorStats = [
    {
      title: 'Trámitadores Registrados',
      metric: action.payload.stats.processors_quantity,
      color: 'bg-indigo-700',
    },
    {
      title: 'Activos',
      metric: action.payload.stats.processors_active,
      color: 'bg-green-500',
    },
    {
      title: 'Inactivos',
      metric: action.payload.stats.processors_inactive,
      color: 'bg-red-700',
    },
  ]

  if (successMessage) {
    toast.success(successMessage, { autoClose: 2000, theme: 'colored' })
  }
}

// Redux Toolkit Slice for managing processor state
const processorslice = createSlice({
  name: 'processors',
  initialState,
  reducers: {
    // Search for a processor based on input
    searchProcessor: (state, action) => {
      const searchData = action.payload.toLowerCase()

      if (searchData === '') {
        state.processorsArray = state.processorOriginal
        return
      }

      const filteredprocessors = state.processorOriginal.filter((processor) => {
        const fullName = `${processor.nombres} ${processor.apellidos}`.toLowerCase()
        return processor.cedula.includes(searchData) || fullName.includes(searchData)
      })

      state.processorsArray = filteredprocessors
    },

    // Set the selected processor based on ID
    setProcessorSelected: (state, action) => {
      const content = action.payload

      if (content === '') {
        state.processorSelected = null
        return
      }

      const processorID = parseInt(content)
      const processorFound = state.processorOriginal.find((processor) => processor.id === processorID)
      state.processorSelected = processorFound
    },
  },
  extraReducers: (builder) => {
    // Handle API response for getProcessors
    builder.addCase(getProcessors.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action)
    })

    // Handle API response for createProcessor
    builder.addCase(createProcessor.fulfilled, (state, action) => {
      updateStateAndStats(state, action, '¡Trámitador Registrado!')
    })

    // Handle API response for updateProcessor
    builder.addCase(updateProcessor.fulfilled, (state, action) => {
      updateStateAndStats(state, action, '¡Trámitador Actualizado!')
    })

    // Handle API response for destroyProcessor
    builder.addCase(destroyProcessor.fulfilled, (state, action) => {
      updateStateAndStats(state, action, '¡Trámitador Eliminado!')
    })
  },
})

// Export Redux Toolkit actions and reducer
export const processorActions = processorslice.actions
export default processorslice.reducer
