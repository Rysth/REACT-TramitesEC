import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  customersOriginal: [],
  customersArray: [],
  customerStats: [],
  customerSelected: null,
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

  if (error.response.status === 422) {
    toast.error('¡Cliente ya Registrado! Cédula/Correo Repetidos', { theme: 'dark' })
    return
  }

  if (error.response.status === 500) {
    toast.error('¡Problema en el Servidor!', { theme: 'dark' })
  }

  throw new Error(error)
}

// Wrapper for handling async thunks with common error handling
const createAsyncThunkWrapper = (type, requestFn) =>
  createAsyncThunk(`customer/${type}`, async (...args) => {
    try {
      const response = await requestFn(...args)
      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  })

// Thunk for retrieving clients (GET)
export const getCustomers = createAsyncThunkWrapper('getCustomers', async (activeToken) => {
  return axios.get(`${API_URL}/api/v1/customers`, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for retrieving clients (GET)
export const getCustomersByProcessor = createAsyncThunkWrapper('getCustomersByProcessor', async (activeToken) => {
  return axios.get(`${API_URL}/api/v1/customers`, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for creating a new client (POST)
export const createCliente = createAsyncThunkWrapper('createCliente', async ({ activeToken, newCustomer }) => {
  return axios.post(`${API_URL}/api/v1/customers/`, newCustomer, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for updating an existing client (PUT)
export const updateCliente = createAsyncThunkWrapper('updateCliente', async ({ activeToken, oldCustomer }) => {
  return axios.put(`${API_URL}/api/v1/customers/${oldCustomer.id}`, oldCustomer, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for deleting a client (DELETE)
export const destroyCliente = createAsyncThunkWrapper('destroyCliente', async ({ activeToken, customerID }) => {
  return axios.delete(`${API_URL}/api/v1/customers/${customerID}`, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Function to update state and stats after successful API response
const updateStateAndStats = (state, action, successMessage) => {
  const customers = action.payload.customers
  state.customersOriginal = customers
  state.customersArray = customers

  /* Customer Stats */
  state.customerStats = [
    {
      title: 'Total de Clientes',
      metric: action.payload.stats.customers_quantity,
      color: 'bg-indigo-700',
    },
    {
      title: 'Agregados (Últimos 30 días)',
      metric: action.payload.stats.customers_added_last_month,
      color: 'bg-purple-700',
    },
    {
      title: 'Agregados (Últimos 7 días)',
      metric: action.payload.stats.customers_added_last_7_days,
      color: 'bg-blue-700',
    },
  ]

  if (successMessage) {
    toast.success(successMessage, { autoClose: 2000, theme: 'dark' })
  }
}

const showLoadingMessage = () => {
  toast.info('Envíando...', { autoClose: 2000, theme: 'dark' })
}

// Redux Toolkit Slice for managing customer state
const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    // Search for a customer based on input and selected user
    searchCustomer: (state, action) => {
      const searchData = action.payload.searchData.toLowerCase()
      const selectedUserId = action.payload.selectedUserId

      if (searchData === '' && !selectedUserId) {
        state.customersArray = state.customersOriginal
        return
      }

      const filteredCustomers = state.customersOriginal.filter((customer) => {
        const fullName = `${customer.nombres} ${customer.apellidos}`.toLowerCase()
        return (
          (customer.cedula.includes(searchData) ||
            fullName.includes(searchData) ||
            customer.email.includes(searchData)) &&
          (!selectedUserId || customer.processor.user.id === selectedUserId)
        )
      })

      state.customersArray = filteredCustomers
    },

    // Set the selected customer based on ID
    setCustomerSelected: (state, action) => {
      const content = action.payload

      if (content === '') {
        state.customerSelected = null
        return
      }

      const customerID = parseInt(content)
      const customerFound = state.customersOriginal.find((customer) => customer.id === customerID)
      state.customerSelected = customerFound
    },
  },
  extraReducers: (builder) => {
    // Handle API response for getcustomers
    builder.addCase(getCustomers.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action)
    })

    // Handle API response for createCliente
    builder.addCase(createCliente.pending, (state) => {
      state.loading = true
      showLoadingMessage()
    })
    // Handle API response for createCliente
    builder.addCase(createCliente.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Cliente Registrado!')
    })

    // Handle API response for updateCliente
    builder.addCase(updateCliente.pending, (state) => {
      state.loading = true
      showLoadingMessage()
    })
    // Handle API response for updateCliente
    builder.addCase(updateCliente.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Cliente Actualizado!')
    })

    // Handle API response for destroyCliente
    builder.addCase(destroyCliente.pending, (state) => {
      state.loading = true
      showLoadingMessage()
    })
    // Handle API response for destroyCliente
    builder.addCase(destroyCliente.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Cliente Eliminado!')
    })
  },
})

// Export Redux Toolkit actions and reducer
export const customerActions = customerSlice.actions
export default customerSlice.reducer
