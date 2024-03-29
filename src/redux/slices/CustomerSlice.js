import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
import FileSaver from 'file-saver'

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
  startDate: null,
  endDate: null,
}

const handleRequestError = (error) => {
  if (error.response.status === 422) {
    toast.error('¡Cliente ya Registrado! Cédula o Teléfono Repetidos')
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
export const getCustomers = createAsyncThunkWrapper(
  'getCustomers',
  async ({ activeToken, page, search, userId, processorId }) => {
    const params = { page }
    if (search) params.search = search
    if (userId) params.userId = userId
    if (processorId || processorId === 0) params.processorId = processorId

    return axios.get(`${API_URL}/api/v1/customers`, {
      params,
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
  },
)

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
  if (customerData.is_direct) {
    customerData.processor_id = null
  }

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

// Function to format date to include only day, month, and year
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Month is zero-based
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

// Thunk for generating Excel file
export const generateExcelFile = createAsyncThunk(
  'customers/generateExcelFile',
  async ({ activeToken, startDate, endDate, isAdmin = false }) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/customers/generate_excel`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          is_admin: isAdmin,
        },
        headers: {
          Authorization: activeToken,
        },
        responseType: 'blob',
        withCredentials: true,
      })

      // Generate a random code for the filename
      const randomCode = Math.random().toString(36).substring(7)
      // Format the start date and end date to include only day, month, and year
      const formattedStartDate = formatDate(startDate)
      const formattedEndDate = formatDate(endDate)
      // Format the filename with the random code, start date, and end date
      const filename = `clientes_${formattedStartDate}_to_${formattedEndDate}_${randomCode}.xlsx`

      // Save the Excel file to the user's device
      FileSaver.saveAs(response.data, filename)
    } catch (error) {
      handleRequestError(error) // Handle request error
      throw error // Throw the error to indicate failure
    }
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
    // Reducer for setting start date
    setStartDate: (state, action) => {
      state.startDate = action.payload
    },
    // Reducer for setting end date
    setEndDate: (state, action) => {
      state.endDate = action.payload
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
    builder.addCase(createCustomer.pending, (state) => {
      state.loading = true
    })
    builder.addCase(createCustomer.fulfilled, (state, action) => {
      state.loading = false
      if (action.payload) {
        updateStateAndStats(state, action, '¡Cliente Registrado!')
      }
    })
    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      state.loading = false

      if (action.payload) {
        updateStateAndStats(state, action, '¡Cliente Actualizado!')
      }
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
