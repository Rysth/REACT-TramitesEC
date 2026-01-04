import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  usersOriginal: [],
  usersArray: [],
  userSelected: null,
  loading: true,
  currentPage: 1,
  totalPages: 0,
  totalUsers: 0,
}

const handleRequestError = (error) => {
  if (error?.response?.status === 409) {
    toast.error('El usuario tiene registros asociados y no se puede eliminar.', { theme: 'colored' })
    return
  }

  if (error?.response?.status === 403) {
    toast.error(error.response.data?.error || 'No tienes permisos para esta acción.', { theme: 'colored' })
    return
  }

  if (error?.response?.status === 422) {
    const errors = error.response.data?.errors
    if (errors && errors.length > 0) {
      toast.error(errors[0], { theme: 'colored' })
    } else {
      toast.error('Error de validación.', { theme: 'colored' })
    }
    return
  }

  if (error?.response?.status === 500) {
    toast.error('Se ha producido un problema en el servidor.', { theme: 'colored' })
  }

  throw new Error(error)
}

const createAsyncThunkWrapper = (type, requestFn) =>
  createAsyncThunk(`user/${type}`, async (...args) => {
    try {
      const response = await requestFn(...args)
      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  })

export const getUsers = createAsyncThunkWrapper(
  'getUsers',
  async ({ activeToken, page, search, startDate, endDate, activeOnly = false }) => {
    const params = {
      page,
      search,
      start_date: startDate ? startDate.toISOString() : null,
      end_date: endDate ? endDate.toISOString() : null,
      active_only: activeOnly,
    }

    return axios.get(`${API_URL}/api/v1/users`, {
      params,
      headers: { Authorization: activeToken },
      withCredentials: true,
    })
  },
)

export const createUser = createAsyncThunkWrapper('createUser', async ({ activeToken, userData }) => {
  return axios.post(`${API_URL}/api/v1/users`, { user: userData }, {
    headers: { Authorization: activeToken },
    withCredentials: true,
  })
})

export const updateUser = createAsyncThunkWrapper('updateUser', async ({ activeToken, userData }) => {
  return axios.put(`${API_URL}/api/v1/users/${userData.id}`, { user: userData }, {
    headers: { Authorization: activeToken },
    withCredentials: true,
  })
})

export const destroyUser = createAsyncThunkWrapper('destroyUser', async ({ activeToken, userID }) => {
  return axios.delete(`${API_URL}/api/v1/users/${userID}`, {
    headers: { Authorization: activeToken },
    withCredentials: true,
  })
})

export const updateUserPassword = createAsyncThunkWrapper('updateUserPassword', async ({ activeToken, userID, password, passwordConfirmation }) => {
  return axios.patch(`${API_URL}/api/v1/users/${userID}/update_password`, {
    password,
    password_confirmation: passwordConfirmation,
  }, {
    headers: { Authorization: activeToken },
    withCredentials: true,
  })
})

const updateState = (state, action, successMessage) => {
  if (action.payload?.users) {
    const { users, pagination } = action.payload
    state.usersOriginal = users
    state.usersArray = users
    state.currentPage = pagination.current_page
    state.totalPages = pagination.total_pages
    state.totalUsers = pagination.total_count
  }

  if (successMessage) {
    toast.success(successMessage, { autoClose: 2000, theme: 'colored' })
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserSelected: (state, action) => {
      const content = action.payload

      if (content === '') {
        state.userSelected = null
        return
      }

      const userID = parseInt(content)
      const userFound = state.usersArray.find((user) => user.id === userID)
      state.userSelected = userFound
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false
        updateState(state, action)
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false

        if (action.payload) {
          updateState(state, action, '¡Usuario Registrado!')
        }
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        updateState(state, action, '¡Usuario Actualizado!')
      })
      .addCase(destroyUser.fulfilled, (state, action) => {
        state.loading = false
        updateState(state, action, '¡Usuario Eliminado!')
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.loading = false
        toast.success('¡Contraseña Actualizada!', { autoClose: 2000, theme: 'colored' })
      })
  },
})

export const userActions = userSlice.actions
export default userSlice.reducer
