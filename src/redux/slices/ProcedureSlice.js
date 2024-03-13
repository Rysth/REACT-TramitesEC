import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
import FileSaver from 'file-saver'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  procedureOriginal: [],
  proceduresArray: [],
  processorOptions: [],
  procedureSelected: null,
  procedureChange: false,
  loading: true,
  startDate: null,
  endDate: null,
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

  if (error.response.status === 422) {
    toast.error('¡Placa ya utilizada para un Trámite similar!')
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
export const getProcedures = createAsyncThunkWrapper(
  'getProcedures',
  async ({ activeToken, page, search, userId, processorId, statusId, procedureTypeId, hasLicenses }) => {
    const params = { page }
    if (search) params.search = search
    if (userId) params.userId = userId
    if (processorId || processorId === 0) params.processorId = processorId
    if (statusId) params.statusId = statusId
    if (procedureTypeId) params.procedureTypeId = procedureTypeId
    if (hasLicenses !== undefined) params.hasLicenses = hasLicenses

    return axios.get(`${API_URL}/api/v1/procedures`, {
      params,
      headers: { Authorization: activeToken },
      withCredentials: true,
    })
  },
)

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

// Function to format date to include only day, month, and year
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Month is zero-based
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

// Thunk for generating Excel file for procedures
export const generateProcedureExcelFile = createAsyncThunk(
  'procedures/generateExcelFile',
  async ({ activeToken, startDate, endDate, isAdmin = false }) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/procedures/generate_excel`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          is_admin: isAdmin,
        },
        headers: {
          Authorization: activeToken,
        },
        responseType: 'blob',
        withCredentials: true,
      })

      // Generate a random code for the filename
      const randomCode = Math.random().toString(36).substring(7)
      // Format the start date and end date to include only day, month, and year
      const formattedStartDate = formatDate(startDate)
      const formattedEndDate = formatDate(endDate)
      // Format the filename with the random code, start date, and end date
      const filename = `procedures_${formattedStartDate}_to_${formattedEndDate}_${randomCode}.xlsx`

      // Save the Excel file to the user's device
      FileSaver.saveAs(response.data, filename)
    } catch (error) {
      handleRequestError(error) // Handle request error
      throw error // Throw the error to indicate failure
    }
  },
)

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
        state.procedureChange = false
        state.procedureSelected = null
        return
      }

      const procedureID = parseInt(content)
      const procedureFound = state.procedureOriginal.find((procedure) => procedure.id === procedureID)
      console.log('ProcedureID:', procedureFound)
      state.procedureSelected = procedureFound
      state.procedureChange = true
    },
    // Reducer for setting start date
    setStartDate: (state, action) => {
      state.startDate = action.payload
    },
    // Reducer for setting end date
    setEndDate: (state, action) => {
      state.endDate = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProcedures.pending, (state) => {
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
    builder.addCase(createProcedure.pending, (state) => {
      state.loading = true
    })
    builder.addCase(createProcedure.fulfilled, (state, action) => {
      state.loading = true

      if (action.payload) {
        state.loading = false
        updateStateAndStats(state, action, '¡Trámite Registrado!')
      }
    })
    builder.addCase(createProcedure.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(updateProcedure.fulfilled, (state, action) => {
      state.loading = true

      if (action.payload) {
        state.loading = false
        updateStateAndStats(state, action, '¡Trámite Actualizado!')
      }
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
