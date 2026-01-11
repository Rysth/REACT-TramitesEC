import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  schoolsOriginal: [],
  schoolsArray: [],
  schoolSelected: null,
  loading: true,
  currentPage: 1,
  totalPages: 0,
  totalSchools: 0,
}

const handleRequestError = (error) => {
  if (error?.response?.status === 409) {
    toast.error('La escuela tiene procedimientos asociados y no se puede eliminar.', { theme: 'colored' })
    return
  }

  if (error?.response?.status === 422) {
    toast.error('La escuela ya está registrada.', { theme: 'colored' })
    return
  }

  if (error?.response?.status === 500) {
    toast.error('Se ha producido un problema en el servidor.', { theme: 'colored' })
  }

  throw new Error(error)
}

const createAsyncThunkWrapper = (type, requestFn) =>
  createAsyncThunk(`school/${type}`, async (...args) => {
    try {
      const response = await requestFn(...args)
      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  })

export const getSchools = createAsyncThunkWrapper(
  'getSchools',
  async ({ activeToken, page, search, startDate, endDate, activeOnly = false }) => {
    const params = {
      page,
      search,
      start_date: startDate ? startDate.toISOString() : null,
      end_date: endDate ? endDate.toISOString() : null,
      active_only: activeOnly,
    }

    return axios.get(`${API_URL}/api/v1/schools`, {
      params,
      headers: { Authorization: activeToken },
      withCredentials: true,
    })
  },
)

export const createSchool = createAsyncThunkWrapper('createSchool', async ({ activeToken, schoolData }) => {
  return axios.post(`${API_URL}/api/v1/schools`, schoolData, {
    headers: { Authorization: activeToken },
    withCredentials: true,
  })
})

export const updateSchool = createAsyncThunkWrapper('updateSchool', async ({ activeToken, schoolData }) => {
  return axios.put(`${API_URL}/api/v1/schools/${schoolData.id}`, schoolData, {
    headers: { Authorization: activeToken },
    withCredentials: true,
  })
})

export const destroySchool = createAsyncThunkWrapper('destroySchool', async ({ activeToken, schoolID }) => {
  return axios.delete(`${API_URL}/api/v1/schools/${schoolID}`, {
    headers: { Authorization: activeToken },
    withCredentials: true,
  })
})

const updateState = (state, action, successMessage) => {
  if (action.payload?.schools) {
    const { schools, pagination } = action.payload
    state.schoolsOriginal = schools
    state.schoolsArray = schools
    state.currentPage = pagination.current_page
    state.totalPages = pagination.total_pages
    state.totalSchools = pagination.total_count
  }

  if (successMessage) {
    toast.success(successMessage, { autoClose: 2000, theme: 'colored' })
  }
}

const schoolSlice = createSlice({
  name: 'schools',
  initialState,
  reducers: {
    setSchoolSelected: (state, action) => {
      const content = action.payload

      if (content === '') {
        state.schoolSelected = null
        return
      }

      const schoolID = parseInt(content)
      const schoolFound = state.schoolsArray.find((school) => school.id === schoolID)
      state.schoolSelected = schoolFound
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSchools.pending, (state) => {
        state.loading = true
      })
      .addCase(getSchools.fulfilled, (state, action) => {
        state.loading = false
        updateState(state, action)
      })
      .addCase(createSchool.fulfilled, (state, action) => {
        state.loading = false

        if (action.payload) {
          updateState(state, action, '¡Escuela Registrada!')
        }
      })
      .addCase(updateSchool.fulfilled, (state, action) => {
        state.loading = false
        updateState(state, action, '¡Escuela Actualizada!')
      })
      .addCase(destroySchool.fulfilled, (state, action) => {
        state.loading = false
        updateState(state, action, '¡Escuela Eliminada!')
      })
  },
})

export const schoolActions = schoolSlice.actions
export default schoolSlice.reducer
