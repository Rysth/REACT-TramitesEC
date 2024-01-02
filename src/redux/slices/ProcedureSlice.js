import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  procedureOriginal: [],
  proceduresArray: [],
  procedureStats: [],
  procedureSelected: null,
  loading: true,
}

const handleRequestError = (error) => {
  if (error.response.status === 401) {
    toast.error('¡Sesión Caducada! Cerrando Sesion...', { autoClose: 2000, theme: 'dark' })

    setTimeout(() => {
      sessionStorage.removeItem('active')
      sessionStorage.removeItem('activeUser')
      sessionStorage.removeItem('activeToken')
      window.location.href = '/session'
    }, 3000)
  }

  if (error.response.status === 500) {
    toast.error('¡Problema en el Servidor!', { theme: 'dark' })
  }

  throw new Error(error)
}

// Wrapper for handling async thunks with common error handling
const createAsyncThunkWrapper = (type, requestFn) =>
  createAsyncThunk(`procedures/${type}`, async (...args) => {
    try {
      const response = await requestFn(...args)
      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  })

// Thunk for retrieving procedures (GET)
export const getProcedures = createAsyncThunkWrapper('getProcedures', async (activeToken) => {
  return axios.get(`${API_URL}/api/v1/procedures`, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for creating a new processor (POST)
export const createProcessor = createAsyncThunkWrapper('createProcessor', async ({ activeToken, newProcessor }) => {
  return axios.post(`${API_URL}/api/v1/procedures/`, newProcessor, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for updating an existing processor (PUT)
export const updateProcessor = createAsyncThunkWrapper('updateProcessor', async ({ activeToken, oldProcessor }) => {
  return axios.put(`${API_URL}/api/v1/procedures/${oldProcessor.id}`, oldProcessor, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for deleting a processor (DELETE)
export const destroyProcessor = createAsyncThunkWrapper('destroyProcessor', async ({ activeToken, processorID }) => {
  return axios.delete(`${API_URL}/api/v1/procedures/${processorID}`, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Function to update state and stats after successful API response
const updateStateAndStats = (state, action, successMessage) => {
  const { payload } = action
  const procedures = payload.procedures
  state.procedureOriginal = procedures
  state.proceduresArray = procedures

  /* processor Stats */
  state.procedureStats = [
    {
      title: 'Total de Trámites',
      metric: payload.stats.procedures_quantity,
      color: 'indigo',
    },
    {
      title: 'Agregados (Últimos 30 días)',
      metric: payload.stats.procedures_added_last_month,
      color: 'purple',
    },
    {
      title: 'Agregados (Últimos 7 días)',
      metric: payload.stats.procedures_added_last_7_days,
      color: 'blue',
    },
  ]

  if (successMessage) {
    toast.success(successMessage, { autoClose: 2000, theme: 'dark' })
  }
}

const showLoadingMessage = () => {
  toast.info('Espere...', { autoClose: 2000, theme: 'dark' })
}

// Redux Toolkit Slice for managing processor state
const proceduresSlice = createSlice({
  name: 'procedures',
  initialState,
  reducers: {
    // Search for a processor based on input and selected user
    searchProcedure: (state, action) => {
      const searchData = action.payload.searchData.toLowerCase()
      const selectedUserId = action.payload.selectedUserId

      if (searchData === '' && !selectedUserId) {
        state.proceduresArray = state.procedureOriginal
        return
      }

      // Fix Search system for Procedures
      const filteredProcedures = state.procedureOriginal.filter((procedure) => {
        const fullNameCustomer = `${procedure.customer.nombres} ${procedure.customer.apellidos}`.toLowerCase()
        const fullNameProcessor = `${procedure.processor.nombres} ${procedure.processor.apellidos}`.toLowerCase()

        console.log(fullNameCustomer.includes(searchData))

        return (
          (procedure.codigo.includes(searchData) ||
            fullNameCustomer.includes(searchData) ||
            fullNameProcessor.includes(searchData)) &&
          (!selectedUserId || procedure.user.id === selectedUserId)
        )
      })

      state.proceduresArray = filteredProcedures
    },
    // Set the selected processor based on ID
    setProcedureSelected: (state, action) => {
      const content = action.payload

      if (content === '') {
        state.procedureSelected = null
        return
      }

      const processorID = parseInt(content)
      const processorFound = state.procedureOriginal.find((processor) => processor.id === processorID)
      state.procedureSelected = processorFound
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProcedures.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action)
    })
    builder.addCase(createProcessor.pending, () => {
      showLoadingMessage()
    })
    builder.addCase(createProcessor.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Trámitador Registrado!')
    })
    builder.addCase(updateProcessor.pending, () => {
      showLoadingMessage()
    })
    builder.addCase(updateProcessor.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Trámitador Actualizado!')
    })
    builder.addCase(destroyProcessor.pending, () => {
      showLoadingMessage()
    })
    builder.addCase(destroyProcessor.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Trámitador Eliminado!')
    })
  },
})

// Export Redux Toolkit actions and reducer
export const procedureActions = proceduresSlice.actions
export default proceduresSlice.reducer
