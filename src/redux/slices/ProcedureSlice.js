import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  procedureOriginal: [],
  proceduresArray: [],
  processorOptions: [],
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

  if (error.response.status === 409) {
    toast.error('¡El Cliente tiene un Trámite Activo!')
  }

  if (error.response.status === 500) {
    toast.error('¡Problema en el Servidor!')
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
export const getProcedures = createAsyncThunkWrapper('getProcedures', async ({ activeToken, page, search, userId }) => {
  const params = { page }
  if (search) params.search = search
  if (userId) params.userId = userId

  return axios.get(`${API_URL}/api/v1/procedures`, {
    params,
    headers: { Authorization: activeToken },
    withCredentials: true,
  })
})

export const fetchProcedureDetails = createAsyncThunkWrapper(
  'procedure/fetchDetails',
  async ({ activeToken, procedureId }) => {
    return axios.get(`${API_URL}/api/v1/procedures/${procedureId}`, {
      headers: { Authorization: activeToken },
      withCredentials: true,
    })
  },
)

// Thunk for creating a new processor (POST)
export const createProcedure = createAsyncThunkWrapper('createProcedure', async ({ activeToken, procedureData }) => {
  return axios.post(`${API_URL}/api/v1/procedures/`, procedureData, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for updating an existing processor (PUT)
export const updateProcedure = createAsyncThunkWrapper('updateProcedure', async ({ activeToken, procedureData }) => {
  return axios.put(`${API_URL}/api/v1/procedures/${procedureData.id}`, procedureData, {
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
  if (action.payload.procedures) {
    const { procedures, pagination } = action.payload
    state.procedureOriginal = procedures
    state.proceduresArray = procedures
    state.currentPage = pagination.current_page
    state.totalPages = pagination.total_pages
    state.totalProcessors = pagination.total_count
  }

  if (successMessage) {
    toast.success(successMessage, { autoClose: 2000 })
  }
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

        return (
          (procedure.codigo.toLowerCase().includes(searchData) ||
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
    builder.addCase(getProcedures.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(getProcedures.fulfilled, (state, action) => {
      updateStateAndStats(state, action)
      state.loading = false
    })
    builder.addCase(fetchProcedureDetails.fulfilled, (state, action) => {
      state.loading = false
      state.procedureSelected = action.payload
    })
    builder.addCase(createProcedure.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Trámite Registrado!')
    })
    builder.addCase(updateProcedure.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Trámite Actualizado!')
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
