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

  if (error.response.status === 409) {
    toast.error('¡Trámitador Tiene Clientes!', { theme: 'colored' })
    return
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
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for creating a new processor (POST)
export const createProcessor = createAsyncThunkWrapper('createProcessor', async ({ activeToken, newProcessor }) => {
  return axios.post(`${API_URL}/api/v1/processors/`, newProcessor, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for updating an existing processor (PUT)
export const updateProcessor = createAsyncThunkWrapper('updateProcessor', async ({ activeToken, oldProcessor }) => {
  return axios.put(`${API_URL}/api/v1/processors/${oldProcessor.id}`, oldProcessor, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for deleting a processor (DELETE)
export const destroyProcessor = createAsyncThunkWrapper('destroyProcessor', async ({ activeToken, processorID }) => {
  return axios.delete(`${API_URL}/api/v1/processors/${processorID}`, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Function to update state and stats after successful API response
const updateStateAndStats = (state, action, successMessage) => {
  const { payload } = action
  const processors = payload.processors
  state.processorOriginal = processors
  state.processorsArray = processors

  /* processor Stats */
  state.processorStats = [
    {
      title: 'Total de Trámitadores',
      metric: payload.stats.processors_quantity,
      color: 'indigo',
    },
    {
      title: 'Agregados (Últimos 30 días)',
      metric: payload.stats.processors_added_last_month,
      color: 'purple',
    },
    {
      title: 'Agregados (Últimos 7 días)',
      metric: payload.stats.processors_added_last_7_days,
      color: 'blue',
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
    // Search for a processor based on input and selected user
    searchProcessor: (state, action) => {
      const searchData = action.payload.searchData.toLowerCase()
      const selectedUserId = action.payload.selectedUserId

      if (searchData === '' && !selectedUserId) {
        state.processorsArray = state.processorOriginal
        return
      }

      const filteredProcessors = state.processorOriginal.filter((processor) => {
        const fullName = `${processor.nombres} ${processor.apellidos}`.toLowerCase()
        return (
          (processor.cedula.includes(searchData) || fullName.includes(searchData)) &&
          (!selectedUserId || processor.user.id === selectedUserId)
        )
      })

      state.processorsArray = filteredProcessors
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
    builder.addCase(getProcessors.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action)
    })
    builder.addCase(createProcessor.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Trámitador Registrado!')
    })
    builder.addCase(updateProcessor.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Trámitador Actualizado!')
    })
    builder.addCase(destroyProcessor.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Trámitador Eliminado!')
    })
  },
})

// Export Redux Toolkit actions and reducer
export const processorActions = processorslice.actions
export default processorslice.reducer
