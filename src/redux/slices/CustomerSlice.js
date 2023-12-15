import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  customersOriginal: [],
  customersArray: [],
  customerStats: [],
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
      toast.error('¡Sesión Caducada!', { autoClose: 2000, theme: 'colored' })

      setTimeout(() => {
        sessionStorage.removeItem('active')
        sessionStorage.removeItem('activeUser')
        sessionStorage.removeItem('activeToken')
      }, 1000)
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
      const searchData = action.payload

      if (searchData === '') {
        state.customersArray = state.customersOriginal
        return
      }

      state.customersArray = state.customersOriginal.filter(
        (customer) =>
          customer.cedula.toLowerCase().includes(searchData) ||
          customer.nombres.toLowerCase().includes(searchData) ||
          customer.apellidos.toLowerCase().includes(searchData) ||
          customer.email.toLowerCase().includes(searchData),
      )
    },
    statusCustomer: (state, action) => {
      const searchData = action.payload === 'true'

      if (action.payload === '') {
        state.customersArray = state.customersOriginal
        return
      }

      state.customersArray = state.customersOriginal.filter((customer) => customer.active === searchData)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getClientes.fulfilled, (state, action) => {
      state.loading = false
      state.customersOriginal = action.payload
      state.customersArray = action.payload

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
