import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  customersOriginal: [],
  customersArray: [],
  customerStats: [],
  customerSelected: {},
  loading: true,
}

// GET Clientes#index
export const getClientes = createAsyncThunk('customer/getClientes', async (activeToken) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/clientes`, {
      headers: {
        Authorization: atob(activeToken),
      },
      withCredentials: true,
    })

    return response.data
  } catch (error) {
    if (error.response.status === 401) {
      toast.error('¡Sesión Caducada! Cerrando Sesion...', { autoClose: 2000, theme: 'colored' })

      setTimeout(() => {
        sessionStorage.removeItem('active')
        sessionStorage.removeItem('activeUser')
        sessionStorage.removeItem('activeToken')

        window.location.href = '/session'
      }, 3000)
    }

    if (error.response.status === 500) {
      toast.error('¡Problema en el Servidor!')
    }

    throw new Error(error)
  }
})

// CREATE Clientes#create
export const createCliente = createAsyncThunk('customer/createCliente', async ({ activeToken, newCustomer }) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/clientes/`, newCustomer, {
      headers: {
        Authorization: atob(activeToken),
      },
      withCredentials: true,
    })

    return response.data
  } catch (error) {
    if (error.response.status === 422) {
      toast.error('¡Cliente ya Registrado!', { theme: 'colored' })
      return
    }

    if (error.response.status === 500) {
      toast.error('¡Problema en el Servidor!', { theme: 'colored' })
      return
    }
    throw new Error(error)
  }
})

// DELETE Clientes#destroy
export const destroyCliente = createAsyncThunk('customer/destroyCliente', async ({ activeToken, customerID }) => {
  try {
    await axios.delete(`${API_URL}/api/v1/clientes/${customerID}`, {
      headers: {
        Authorization: atob(activeToken),
      },
      withCredentials: true,
    })
  } catch (error) {
    if (error.response.status === 500) {
      toast.error('¡Problema en el Servidor!', { theme: 'colored' })
      return
    }
    throw new Error(error)
  }
})

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
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
    statusCustomer: (state, action) => {
      const searchData = action.payload === 'true'

      if (action.payload === '') {
        state.customersArray = state.customersOriginal
        return
      }

      state.customersArray = state.customersOriginal.filter((customer) => customer.active === searchData)
    },
    setCustomerSelected: (state, action) => {
      const customerID = parseInt(action.payload)
      const customerFound = state.customersOriginal.find((customer) => customer.id === customerID)
      state.customerSelected = customerFound
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getClientes.fulfilled, (state, action) => {
      state.loading = false
      state.customersOriginal = action.payload.customers
      state.customersArray = action.payload.customers

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
    })
    builder.addCase(destroyCliente.fulfilled, (state, action) => {
      const deletedCustomerId = action.meta.arg.customerID
      state.customersOriginal = state.customersOriginal.filter((customer) => customer.id !== deletedCustomerId)
      state.customersArray = state.customersOriginal

      /* Customer Stats */
      const customersQuantity = state.customersArray.length
      const customersActive = state.customersArray.filter((customer) => customer.active === true).length
      const customersInactive = state.customersArray.filter((customer) => customer.active === false).length

      state.customerStats = [
        {
          title: 'Clientes Registrados',
          metric: customersQuantity,
          color: 'bg-indigo-700',
        },
        {
          title: 'Activos',
          metric: customersActive,
          color: 'bg-green-500',
        },
        {
          title: 'Inactivos',
          metric: customersInactive,
          color: 'bg-red-700',
        },
      ]

      toast.success('¡Cliente Eliminado!', { autoClose: 2000, theme: 'colored' })
    })
    builder.addCase(createCliente.fulfilled, (state, action) => {
      state.customersOriginal = [...state.customersOriginal, action.payload]
      state.customersArray = state.customersOriginal
      /* Customer Stats */
      const customersQuantity = state.customersArray.length
      const customersActive = state.customersArray.filter((customer) => customer.active === true).length
      const customersInactive = state.customersArray.filter((customer) => customer.active === false).length

      state.customerStats = [
        {
          title: 'Clientes Registrados',
          metric: customersQuantity,
          color: 'bg-indigo-700',
        },
        {
          title: 'Activos',
          metric: customersActive,
          color: 'bg-green-500',
        },
        {
          title: 'Inactivos',
          metric: customersInactive,
          color: 'bg-red-700',
        },
      ]

      toast.success('¡Cliente Registrado!', { autoClose: 2000, theme: 'colored' })
    })
  },
})

export const customerActions = customerSlice.actions
export default customerSlice.reducer
