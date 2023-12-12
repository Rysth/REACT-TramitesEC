import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  customersArray: [],
  customersFilter: [],
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
    if (error.response.status === 500) {
      toast.error('¡Problema en el Servidor!')
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
      state.customersFilter = state.customersArray.filter(
        (customer) =>
          customer.cedula.toLowerCase().includes(searchData) ||
          customer.nombres.toLowerCase().includes(searchData) ||
          customer.apellidos.toLowerCase().includes(searchData) ||
          customer.celular.toLowerCase().includes(searchData) ||
          customer.email.toLowerCase().includes(searchData),
      )

      if (searchData === '') {
        state.customersFilter = state.customersArray
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getClientes.fulfilled, (state, action) => {
      state.loading = false
      state.customersArray = action.payload
      state.customersFilter = action.payload

      /* Customer Stats */
      const customersQuantity = state.customersFilter.length
      const customersActive = state.customersFilter.filter((customer) => customer.active === true).length
      const customersInactive = state.customersFilter.filter((customer) => customer.active === false).length

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
  },
})

export const customerActions = customerSlice.actions
export default customerSlice.reducer
