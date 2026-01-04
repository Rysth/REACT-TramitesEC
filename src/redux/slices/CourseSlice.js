import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  coursesOriginal: [],
  coursesArray: [],
  courseSelected: null,
  loading: true,
  currentPage: 1,
  totalPages: 0,
  totalCourses: 0,
}

const handleRequestError = (error) => {
  if (error?.response?.status === 409) {
    toast.error('El curso tiene procedimientos asociados y no se puede eliminar.', { theme: 'colored' })
    return
  }

  if (error?.response?.status === 422) {
    toast.error('El curso ya está registrado.', { theme: 'colored' })
    return
  }

  if (error?.response?.status === 500) {
    toast.error('Se ha producido un problema en el servidor.', { theme: 'colored' })
  }

  throw new Error(error)
}

const createAsyncThunkWrapper = (type, requestFn) =>
  createAsyncThunk(`course/${type}`, async (...args) => {
    try {
      const response = await requestFn(...args)
      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  })

export const getCourses = createAsyncThunkWrapper(
  'getCourses',
  async ({ activeToken, page, search, startDate, endDate, activeOnly = false }) => {
    const params = {
      page,
      search,
      start_date: startDate ? startDate.toISOString() : null,
      end_date: endDate ? endDate.toISOString() : null,
      active_only: activeOnly,
    }

    return axios.get(`${API_URL}/api/v1/courses`, {
      params,
      headers: { Authorization: activeToken },
      withCredentials: true,
    })
  },
)

export const createCourse = createAsyncThunkWrapper('createCourse', async ({ activeToken, courseData }) => {
  return axios.post(`${API_URL}/api/v1/courses`, courseData, {
    headers: { Authorization: activeToken },
    withCredentials: true,
  })
})

export const updateCourse = createAsyncThunkWrapper('updateCourse', async ({ activeToken, courseData }) => {
  return axios.put(`${API_URL}/api/v1/courses/${courseData.id}`, courseData, {
    headers: { Authorization: activeToken },
    withCredentials: true,
  })
})

export const destroyCourse = createAsyncThunkWrapper('destroyCourse', async ({ activeToken, courseID }) => {
  return axios.delete(`${API_URL}/api/v1/courses/${courseID}`, {
    headers: { Authorization: activeToken },
    withCredentials: true,
  })
})

const updateState = (state, action, successMessage) => {
  if (action.payload?.courses) {
    const { courses, pagination } = action.payload
    state.coursesOriginal = courses
    state.coursesArray = courses
    state.currentPage = pagination.current_page
    state.totalPages = pagination.total_pages
    state.totalCourses = pagination.total_count
  }

  if (successMessage) {
    toast.success(successMessage, { autoClose: 2000, theme: 'colored' })
  }
}

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourseSelected: (state, action) => {
      const content = action.payload

      if (content === '') {
        state.courseSelected = null
        return
      }

      const courseID = parseInt(content)
      const courseFound = state.coursesArray.find((course) => course.id === courseID)
      state.courseSelected = courseFound
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCourses.pending, (state) => {
        state.loading = true
      })
      .addCase(getCourses.fulfilled, (state, action) => {
        state.loading = false
        updateState(state, action)
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false

        if (action.payload) {
          updateState(state, action, '¡Curso Registrado!')
        }
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false
        updateState(state, action, '¡Curso Actualizado!')
      })
      .addCase(destroyCourse.fulfilled, (state, action) => {
        state.loading = false
        updateState(state, action, '¡Curso Eliminado!')
      })
  },
})

export const courseActions = courseSlice.actions
export default courseSlice.reducer
