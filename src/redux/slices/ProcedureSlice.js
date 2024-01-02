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
    toast.error('¡Sesión Caducada! Cerrando Sesion...', { autoClose: 2000 })

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
export const createProcedure = createAsyncThunkWrapper('createProcedure', async ({ activeToken, newProcedure }) => {
  return axios.post(`${API_URL}/api/v1/procedures/`, newProcedure, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for updating an existing processor (PUT)
export const updateProcedure = createAsyncThunkWrapper('updateProcedure', async ({ activeToken, oldProcedure }) => {
  return axios.put(`${API_URL}/api/v1/procedures/${oldProcedure.id}`, oldProcedure, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for deleting a processor (DELETE)
export const destroyProcedure = createAsyncThunkWrapper('destroyProcedure', async ({ activeToken, procedureID }) => {
  return axios.delete(`${API_URL}/api/v1/procedures/${procedureID}`, {
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
    toast.success(successMessage, { autoClose: 2000 })
  }
}

const showLoadingMessage = () => {
  toast.info('Espere...', { autoClose: 2000 })
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

      const procedureID = parseInt(content)
      const procedureFound = state.procedureOriginal.find((procedure) => procedure.id === procedureID)
      state.procedureSelected = procedureFound
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProcedures.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action)
    })
    builder.addCase(createProcedure.pending, () => {
      showLoadingMessage()
    })
    builder.addCase(createProcedure.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Trámite Registrado!')
    })
    builder.addCase(updateProcedure.pending, () => {
      showLoadingMessage()
    })
    builder.addCase(updateProcedure.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Trámite Actualizado!')
    })
    builder.addCase(destroyProcedure.pending, () => {
      showLoadingMessage()
    })
    builder.addCase(destroyProcedure.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Trámite Eliminado!')
    })
  },
})

// Export Redux Toolkit actions and reducer
export const procedureActions = proceduresSlice.actions
export default proceduresSlice.reducer
