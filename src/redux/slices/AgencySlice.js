import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  agenciesOriginal: [],
  agenciesArray: [],
  agencySelected: null,
  loading: true,
  currentPage: 1,
  totalPages: 0,
  totalAgencies: 0,
}

const handleRequestError = (error) => {
  if (error.response.status === 409) {
    toast.error('La agencia tiene procedimientos asociados y no se puede eliminar.', { theme: 'colored' })
    return
  }

  if (error.response.status === 422) {
    toast.error('La agencia ya está registrada.', { theme: 'colored' })
    return
  }

  if (error.response.status === 500) {
    toast.error('Se ha producido un problema en el servidor.', { theme: 'colored' })
  }

  throw new Error(error)
}

const createAsyncThunkWrapper = (type, requestFn) =>
  createAsyncThunk(`agency/${type}`, async (...args) => {
    try {
      const response = await requestFn(...args)
      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  })

export const getAgencies = createAsyncThunkWrapper(
  'getAgencies',
  async ({ activeToken, page, search, startDate, endDate }) => {
    const params = {
      page,
      search,
      start_date: startDate ? startDate.toISOString() : null,
      end_date: endDate ? endDate.toISOString() : null,
    }

    return axios.get(`${API_URL}/api/v1/agencies`, {
      params,
      headers: { Authorization: activeToken },
      withCredentials: true,
    })
  },
)

// Add new thunks after getAgencies
export const createAgency = createAsyncThunkWrapper('createAgency', async ({ activeToken, agencyData }) => {
  return axios.post(`${API_URL}/api/v1/agencies`, agencyData, {
    headers: { Authorization: activeToken },
    withCredentials: true,
  })
})

export const updateAgency = createAsyncThunkWrapper('updateAgency', async ({ activeToken, agencyData }) => {
  return axios.put(`${API_URL}/api/v1/agencies/${agencyData.id}`, agencyData, {
    headers: { Authorization: activeToken },
    withCredentials: true,
  })
})

export const destroyAgency = createAsyncThunkWrapper('destroyAgency', async ({ activeToken, agencyID }) => {
  return axios.delete(`${API_URL}/api/v1/agencies/${agencyID}`, {
    headers: { Authorization: activeToken },
    withCredentials: true,
  })
})

export const generateExcelFile = createAsyncThunk(
  'agency/generateExcelFile',
  async ({ activeToken, startDate, endDate }) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/agencies/generate_excel`, {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
        headers: { Authorization: activeToken },
        responseType: 'blob',
        withCredentials: true,
      })

      const randomCode = Math.random().toString(36).substring(7)
      const currentDate = new Date()
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`
      const filename = `agencias_${formattedDate}_${randomCode}.xlsx`

      FileSaver.saveAs(response.data, filename)
    } catch (error) {
      handleRequestError(error)
      throw error
    }
  },
)

const updateState = (state, action, successMessage) => {
  if (action.payload.agencies) {
    const { agencies, pagination } = action.payload
    state.agenciesOriginal = agencies
    state.agenciesArray = agencies
    state.currentPage = pagination.current_page
    state.totalPages = pagination.total_pages
    state.totalAgencies = pagination.total_count
  }

  if (successMessage) {
    toast.success(successMessage, { autoClose: 2000, theme: 'colored' })
  }
}

const agencySlice = createSlice({
  name: 'agencies',
  initialState,
  reducers: {
    setAgencySelected: (state, action) => {
      const content = action.payload

      if (content === '') {
        state.agencySelected = null
        return
      }

      const agencyID = parseInt(content)
      const agencyFound = state.agenciesArray.find((agency) => agency.id === agencyID)
      state.agencySelected = agencyFound
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAgencies.pending, (state) => {
        state.loading = true
      })
      .addCase(getAgencies.fulfilled, (state, action) => {
        state.loading = false
        updateState(state, action)
      })
      .addCase(createAgency.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          updateState(state, action, '¡Agencia Registrada!')
        }
      })
      .addCase(updateAgency.fulfilled, (state, action) => {
        state.loading = false
        updateState(state, action, '¡Agencia Actualizada!')
      })
      .addCase(destroyAgency.fulfilled, (state, action) => {
        state.loading = false
        updateState(state, action, '¡Agencia Eliminada!')
      })
      .addCase(generateExcelFile.fulfilled, (state) => {
        state.loading = false
      })
  },
})

export const agencyActions = agencySlice.actions
export default agencySlice.reducer
