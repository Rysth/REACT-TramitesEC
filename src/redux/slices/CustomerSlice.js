import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  customersOriginal: [],
  customersArray: [],
  customerStats: [],
  customerSelected: null,
  loading: true,
  currentPage: 1,
  totalPages: 0,
  totalProcessors: 0,
  customerProcedures: [],
  customerData: {},
  customerStats: {},
}

const handleRequestError = (error) => {
  if (error.response.status === 422) {
    toast.error('¡Cliente ya Registrado! Cédula, Email o Celular Repetidos')
    return
  }

  if (error.response.status === 500) {
    toast.error('¡Cliente tiene Trámites!')
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

// Thunk for loading customer options
export const fetchCustomerOptions = createAsyncThunkWrapper(
  'processor/fetchOptions',
  async ({ activeToken, query }) => {
    return axios.get(`${API_URL}/api/v1/customers/search_from_procedures`, {
      params: { query },
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
  },
)

// Thunk for retrieving clients (GET)
export const getCustomers = createAsyncThunkWrapper('getCustomers', async ({ activeToken, page, search, userId }) => {
  const params = { page }
  if (search) params.search = search
  if (userId) params.userId = userId

  return axios.get(`${API_URL}/api/v1/customers`, {
    params,
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for retrieving a specific customer's details (GET)
export const fetchCustomerDetails = createAsyncThunkWrapper(
  'customer/fetchDetails',
  async ({ activeToken, customerID }) => {
    return axios.get(`${API_URL}/api/v1/customers/${customerID}`, {
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
  },
)

// Thunk for creating a new client (POST)
export const createCustomer = createAsyncThunkWrapper('createCustomer', async ({ activeToken, customerData }) => {
  return axios.post(`${API_URL}/api/v1/customers/`, customerData, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for updating an existing client (PUT)
export const updateCustomer = createAsyncThunkWrapper('updateCustomer', async ({ activeToken, customerData }) => {
  return axios.put(`${API_URL}/api/v1/customers/${customerData.id}`, customerData, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

// Thunk for deleting a client (DELETE)
export const destroyCustomer = createAsyncThunkWrapper('destroyCustomer', async ({ activeToken, customerID }) => {
  return axios.delete(`${API_URL}/api/v1/customers/${customerID}`, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

/// Thunk for fetching latest procedures for a customer (GET)
export const fetchLatestProcedures = createAsyncThunkWrapper(
  'customer/fetchLatestProcedures',
  async ({ activeToken, customerID, page }) => {
    return await axios.get(`${API_URL}/api/v1/customers/${customerID}`, {
      params: {
        page: page,
      },
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
  },
)

// Function to update state and stats after successful API response
const updateStateAndStats = (state, action, successMessage) => {
  if (action.payload.customers) {
    const { customers, pagination } = action.payload
    state.customersOriginal = customers
    state.customersArray = customers
    state.currentPage = pagination.current_page
    state.totalPages = pagination.total_pages
    state.totalProcessors = pagination.total_count
  }

  if (successMessage) {
    toast.success(successMessage, { autoClose: 2000 })
  }
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
          (customer.cedula.toLowerCase().includes(searchData) ||
            fullName.includes(searchData) ||
            customer.email.toLowerCase().includes(searchData)) &&
          (!selectedUserId || customer.user.id === selectedUserId)
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
    builder.addCase(getCustomers.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getCustomers.fulfilled, (state, action) => {
      updateStateAndStats(state, action)
      state.loading = false
    })
    builder.addCase(createCustomer.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Cliente Registrado!')
    })
    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Cliente Actualizado!')
    })
    builder.addCase(destroyCustomer.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, '¡Cliente Eliminado!')
    })
    builder.addCase(fetchCustomerDetails.fulfilled, (state, action) => {
      state.loading = false
      state.customerSelected = action.payload
    })
    builder.addCase(fetchLatestProcedures.fulfilled, (state, action) => {
      state.loading = false
      state.customerProcedures = [...action.payload.procedures]
      state.customerData = action.payload.customer
      state.customerStats = action.payload.customer_stats
      state.totalPages = action.payload.pagination.total_pages
      state.currentPage = action.payload.pagination.current_page
    })
  },
})

// Export Redux Toolkit actions and reducer
export const customerActions = customerSlice.actions
export default customerSlice.reducer
