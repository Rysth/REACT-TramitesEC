import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  procedureTypesOriginal: [],
  procedureTypesArray: [],
  procedureTypeSelected: null,
  loading: true,
  currentPage: 1,
  totalPages: 0,
  totalProcessors: 0,
}

const handleRequestError = (error) => {
  if (error.response.status === 409) {
    toast.error('El tipo de trámite tiene procedimientos asociados y no se puede eliminar.', { theme: 'colored' })
    return
  }

  if (error.response.status === 422) {
    toast.error('El tipo de trámite ya está registrado.', { theme: 'colored' })
    return
  }

  if (error.response.status === 500) {
    toast.error('Se ha producido un problema en el servidor.', { theme: 'colored' })
  }

  throw new Error(error)
}

// Wrapper for handling async thunks with common error handling
const createAsyncThunkWrapper = (type, requestFn) =>
  createAsyncThunk(`procedureType/${type}`, async (...args) => {
    try {
      const response = await requestFn(...args)
      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  })

// Thunk for retrieving procedure types (GET)
export const getProcedureTypes = createAsyncThunkWrapper('getProcedureTypes', async ({ activeToken }) => {
  console.log('activeToken', activeToken)

  return axios.get(`${API_URL}/api/v1/procedure_types`, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for creating a new procedure type (POST)
export const createProcedureType = createAsyncThunkWrapper(
  'createProcedureType',
  async ({ activeToken, procedureTypeData }) => {
    return axios.post(`${API_URL}/api/v1/procedure_types`, procedureTypeData, {
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
  },
)

// Thunk for updating an existing procedure type (PUT)
export const updateProcedureType = createAsyncThunkWrapper(
  'updateProcedureType',
  async ({ activeToken, procedureTypeData }) => {
    return axios.put(`${API_URL}/api/v1/procedure_types/${procedureTypeData.id}`, procedureTypeData, {
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
  },
)

// Thunk for deleting a procedure type (DELETE)
export const destroyProcedureType = createAsyncThunkWrapper(
  'destroyProcedureType',
  async ({ activeToken, procedureTypeID }) => {
    return axios.delete(`${API_URL}/api/v1/procedure_types/${procedureTypeID}`, {
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
  },
)

// Thunk for generating Excel file
export const generateExcelFile = createAsyncThunk(
  'procedureType/generateExcelFile',
  async ({ activeToken, startDate, endDate }) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/procedure_types/generate_excel`, {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
        headers: {
          Authorization: activeToken,
        },
        responseType: 'blob',
        withCredentials: true,
      })

      // Generate a random code for the filename
      const randomCode = Math.random().toString(36).substring(7)

      // Get the current date
      const currentDate = new Date()
      // Extract year, month, and day from the current date
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0') // Months are zero-based
      const day = String(currentDate.getDate()).padStart(2, '0')

      // Format the start date with the current date
      const formattedDate = `${year}-${month}-${day}`

      // Format the filename with the random code, start date, and end date
      const filename = `tipos_tramites_${formattedDate}_${randomCode}.xlsx`

      // Save the Excel file to the user's device
      FileSaver.saveAs(response.data, filename)
    } catch (error) {
      handleRequestError(error) // Handle request error
      throw error // Throw the error to indicate failure
    }
  },
)

// Function to update state after successful API response
const updateState = (state, action, successMessage) => {
  if (action.payload) {
    const { procedure_types, pagination } = action.payload
    state.procedureTypesOriginal = procedure_types
    state.procedureTypesArray = procedure_types
    state.currentPage = pagination.current_page
    state.totalPages = pagination.total_pages
    state.totalProcedureTypes = pagination.total_count
  }

  if (successMessage) {
    toast.success(successMessage, { autoClose: 2000, theme: 'colored' })
  }
}

// Redux Toolkit Slice for managing procedure type state
const procedureTypeSlice = createSlice({
  name: 'procedureTypes',
  initialState,
  reducers: {
    // Set the selected procedure type based on ID
    setProcedureTypeSelected: (state, action) => {
      const content = action.payload

      if (content === '') {
        state.procedureTypeSelected = null
        return
      }

      const procedureTypeID = parseInt(content)
      const procedureTypeFound = state.procedureTypes.find((procedureType) => procedureType.id === procedureTypeID)
      state.procedureTypeSelected = procedureTypeFound
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProcedureTypes.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getProcedureTypes.fulfilled, (state, action) => {
      state.loading = false
      updateState(state, action)
    })
    builder.addCase(createProcedureType.fulfilled, (state, action) => {
      state.loading = false

      if (action.payload) {
        updateState(state, action, '¡Tipo de Trámite Registrado!')
      }
    })
    builder.addCase(updateProcedureType.fulfilled, (state, action) => {
      state.loading = false
      updateState(state, action, '¡Tipo de Trámite Actualizado!')
    })
    builder.addCase(destroyProcedureType.fulfilled, (state, action) => {
      state.loading = false
      updateState(state, action, '¡Tipo de Trámite Eliminado!')
    })
    builder.addCase(generateExcelFile.fulfilled, (state) => {
      state.loading = false
    })
  },
})

// Export Redux Toolkit actions and reducer
export const procedureTypeActions = procedureTypeSlice.actions
export default procedureTypeSlice.reducer
