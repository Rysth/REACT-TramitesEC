import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
import FileSaver from 'file-saver'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  processorOriginal: [],
  processorsArray: [],
  processorOptions: [],
  processorSelected: null,
  loading: true,
  currentPage: 1,
  totalPages: 0,
  totalProcessors: 0,
  processorProcedures: [],
  processorData: {},
  processorStats: {},
  startDate: null,
  endDate: null,
}

const handleRequestError = (error) => {
  if (error.response.status === 409) {
    toast.error('¡Aún tiene clientes o trámites!')
    return
  }

  if (error.response.status === 422) {
    toast.error('¡El trámitador ya está registrado! Nombre y Apellidos Repetidos')
    return
  }

  if (error.response.status === 500) {
    toast.error('¡Problema en el servidor!')
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

// Thunk for loading processor options
export const fetchProcessorOptions = createAsyncThunkWrapper(
  'processor/fetchOptions',
  async ({ activeToken, query }) => {
    return axios.get(`${API_URL}/api/v1/processors/search_processors`, {
      params: { query },
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
  },
)

// Thunk for retrieving processors (GET)
export const getProcessors = createAsyncThunkWrapper('getProcessors', async ({ activeToken, page, search, userId }) => {
  const params = { page }
  if (search) params.search = search
  if (userId) params.userId = userId

  return axios.get(`${API_URL}/api/v1/processors`, {
    params,
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for creating a new processor (POST)
export const createProcessor = createAsyncThunkWrapper('createProcessor', async ({ activeToken, processorData }) => {
  return axios.post(`${API_URL}/api/v1/processors/`, processorData, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for updating an existing processor (PUT)
export const updateProcessor = createAsyncThunkWrapper('updateProcessor', async ({ activeToken, processorData }) => {
  console.log(processorData.id)

  return axios.put(`${API_URL}/api/v1/processors/${processorData.id}`, processorData, {
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

/// Thunk for fetching latest procedures for a processor (GET)
export const fetchLatestProcedures = createAsyncThunkWrapper(
  'processor/fetchLatestProcedures',
  async ({ activeToken, processorID, page }) => {
    return await axios.get(`${API_URL}/api/v1/processors/${processorID}`, {
      params: {
        page: page,
      },
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
  },
)

// Function to format date to include only day, month, and year
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Month is zero-based
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

// Thunk for generating Excel file
export const generateExcelFile = createAsyncThunk(
  'processor/generateExcelFile',
  async ({ activeToken, startDate, endDate, isAdmin = false }) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/processors/generate_excel`, {
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
      const filename = `tramitadores_${formattedStartDate}_to_${formattedEndDate}_${randomCode}.xlsx`

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
  if (action.payload.processors) {
    const { processors, pagination } = action.payload
    state.processorOriginal = processors
    state.processorsArray = processors
    state.currentPage = pagination.current_page
    state.totalPages = pagination.total_pages
    state.totalProcessors = pagination.total_count
  }

  if (successMessage) {
    toast.success(successMessage, { autoClose: 2000 })
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
          (processor.codigo.toLowerCase().includes(searchData) || fullName.includes(searchData)) &&
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
    builder.addCase(fetchProcessorOptions.fulfilled, (state, action) => {
      // Assuming the response structure has an array of processors
      state.processorOptions = action.payload
    })
    builder.addCase(getProcessors.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getProcessors.fulfilled, (state, action) => {
      state.loading = false
      console.log(action.payload)
      updateStateAndStats(state, action)
    })
    builder.addCase(createProcessor.fulfilled, (state, action) => {
      state.loading = false

      if (action.payload) {
        updateStateAndStats(state, action, '¡Trámitador Registrado!')
      }
    })
    builder.addCase(updateProcessor.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Trámitador Actualizado!')
    })
    builder.addCase(destroyProcessor.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Trámitador Eliminado!')
    })
    builder.addCase(fetchLatestProcedures.fulfilled, (state, action) => {
      state.loading = false
      state.processorProcedures = [...action.payload.procedures]
      state.processorData = action.payload.processor
      state.processorStats = action.payload.processor_stats
      state.totalPages = action.payload.pagination.total_pages
      state.currentPage = action.payload.pagination.current_page
    })
  },
})

// Export Redux Toolkit actions and reducer
export const processorActions = processorslice.actions
export default processorslice.reducer
