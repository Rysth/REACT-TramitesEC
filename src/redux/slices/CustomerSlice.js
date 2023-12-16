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
    toast.error('¡Sesión Caducada! Cerrando Sesion...', { autoClose: 2000, theme: 'colored' })

    setTimeout(() => {
      sessionStorage.removeItem('active')
      sessionStorage.removeItem('activeUser')
      sessionStorage.removeItem('activeToken')
      window.location.href = '/session'
    }, 3000)
  }

  if (error.response.status === 422) {
    toast.error('¡Cliente ya Registrado!', { theme: 'colored' })
    return
  }

  if (error.response.status === 500) {
    toast.error('¡Problema en el Servidor!', { theme: 'colored' })
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

// Thunk for retrieving clients
export const getClientes = createAsyncThunkWrapper('getClientes', async (activeToken) => {
  return axios.get(`${API_URL}/api/v1/clientes`, {
    headers: {
      Authorization: atob(activeToken),
    },
    withCredentials: true,
  })
})

// Thunk for creating a new client
export const createCliente = createAsyncThunkWrapper('createCliente', async ({ activeToken, newCustomer }) => {
  return axios.post(`${API_URL}/api/v1/clientes/`, newCustomer, {
    headers: {
      Authorization: atob(activeToken),
    },
    withCredentials: true,
  })
})

// Thunk for updating an existing client
export const updateCliente = createAsyncThunkWrapper('updateCliente', async ({ activeToken, oldCustomer }) => {
  return axios.put(`${API_URL}/api/v1/clientes/${oldCustomer.id}`, oldCustomer, {
    headers: {
      Authorization: atob(activeToken),
    },
    withCredentials: true,
  })
})

// Thunk for deleting a client
export const destroyCliente = createAsyncThunkWrapper('destroyCliente', async ({ activeToken, customerID }) => {
  return axios.delete(`${API_URL}/api/v1/clientes/${customerID}`, {
    headers: {
      Authorization: atob(activeToken),
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
      title: 'Clientes Registrados',
      metric: action.payload.stats.customers_quantity,
      color: 'bg-indigo-700',
    },
    {
      title: 'Activos',
      metric: action.payload.stats.customers_active,
      color: 'bg-green-500',
    },
    {
      title: 'Inactivos',
      metric: action.payload.stats.customers_inactive,
      color: 'bg-red-700',
    },
  ]

  if (successMessage) {
    toast.success(successMessage, { autoClose: 2000, theme: 'colored' })
  }
}

// Redux Toolkit Slice for managing customer state
const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    // Search for a customer based on input
    searchCustomer: (state, action) => {
      const searchData = action.payload.toLowerCase()

      if (searchData === '') {
        state.customersArray = state.customersOriginal
        return
      }

      const filteredCustomers = state.customersOriginal.filter((customer) => {
        const fullName = `${customer.nombres} ${customer.apellidos}`.toLowerCase()
        return (
          customer.cedula.includes(searchData) || fullName.includes(searchData) || customer.email.includes(searchData)
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
    // Handle API response for getClientes
    builder.addCase(getClientes.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action)
    })

    // Handle API response for createCliente
    builder.addCase(createCliente.fulfilled, (state, action) => {
      updateStateAndStats(state, action, '¡Cliente Registrado!')
    })

    // Handle API response for updateCliente
    builder.addCase(updateCliente.fulfilled, (state, action) => {
      updateStateAndStats(state, action, '¡Cliente Actualizado!')
    })

    // Handle API response for destroyCliente
    builder.addCase(destroyCliente.fulfilled, (state, action) => {
      updateStateAndStats(state, action, '¡Cliente Eliminado!')
    })
  },
})

// Export Redux Toolkit actions and reducer
export const customerActions = customerSlice.actions
export default customerSlice.reducer
