import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
import FileSaver from 'file-saver'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  supplierOriginal: [],
  suppliersArray: [],
  supplierOptions: [],
  supplierSelected: null,
  loading: true,
  currentPage: 1,
  totalPages: 0,
  totalSuppliers: 0,
  startDate: null,
  endDate: null,
}

const handleRequestError = (error) => {
  if (error.response.status === 409) {
    toast.error('El proveedor trámites asociados y no se puede eliminar.', { theme: 'colored' })
    return
  }

  if (error.response.status === 422) {
    toast.error('Ya existe un proveedor con la misma identificación.', { theme: 'colored' })
    return
  }

  if (error.response.status === 500) {
    toast.error('Se produjo un error en el servidor.', { theme: 'colored' })
  }

  throw new Error(error)
}

const createAsyncThunkWrapper = (type, requestFn) =>
  createAsyncThunk(`supplier/${type}`, async (...args) => {
    try {
      const response = await requestFn(...args)
      return response.data
    } catch (error) {
      handleRequestError(error)
    }
  })

export const getSuppliers = createAsyncThunkWrapper(
  'getSuppliers',
  async ({ activeToken, page, search, userId, startDate, endDate }) => {
    const params = {
      page,
      search: search && search,
      userId: userId && userId,
      startDate: startDate ? startDate.toISOString() : null, // Convert date to ISO string
      endDate: endDate ? endDate.toISOString() : null,
    }

    return axios.get(`${API_URL}/api/v1/suppliers`, {
      params,
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
  },
)

// Thunk for loading processor options
export const fetchSupplierOptions = createAsyncThunkWrapper('supplier/fetchOptions', async ({ activeToken, query }) => {
  return axios.get(`${API_URL}/api/v1/suppliers/search_suppliers`, {
    params: { query },
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

export const createSupplier = createAsyncThunkWrapper('createSupplier', async ({ activeToken, supplierData }) => {
  return axios.post(`${API_URL}/api/v1/suppliers/`, supplierData, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

export const updateSupplier = createAsyncThunkWrapper('updateSupplier', async ({ activeToken, supplierData }) => {
  return axios.put(`${API_URL}/api/v1/suppliers/${supplierData.id}`, supplierData, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

export const destroySupplier = createAsyncThunkWrapper('destroySupplier', async ({ activeToken, supplierID }) => {
  return axios.delete(`${API_URL}/api/v1/suppliers/${supplierID}`, {
    headers: {
      Authorization: activeToken,
    },
    withCredentials: true,
  })
})

export const generateExcelFile = createAsyncThunk(
  'supplier/generateExcelFile',
  async ({ activeToken, isAdmin = false, startDate, endDate }) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/suppliers/generate_excel`, {
        params: {
          is_admin: isAdmin,
          start_date: startDate,
          end_date: endDate,
        },
        headers: {
          Authorization: activeToken,
        },
        responseType: 'blob',
        withCredentials: true,
      })

      // Generate a random code for the filename
      const randomCode = Math.random().toString(36).substring(7)
      // Get the current date
      const currentDate = new Date()
      // Extract year, month, and day from the current date
      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0') // Months are zero-based
      const day = String(currentDate.getDate()).padStart(2, '0')

      // Format the start date with the current date
      const formattedDate = `${year}-${month}-${day}`
      // Format the filename with the random code, start date, and end date
      const filename = `proveedores_${formattedDate}_${randomCode}.xlsx`

      // Save the Excel file to the user's device
      FileSaver.saveAs(response.data, filename)
    } catch (error) {
      handleRequestError(error) // Handle request error
      throw error // Throw the error to indicate failure
    }
  },
)

const updateStateAndStats = (state, action, successMessage) => {
  if (action.payload.suppliers) {
    const { suppliers, pagination } = action.payload
    state.supplierOriginal = suppliers
    state.suppliersArray = suppliers
    state.currentPage = pagination.current_page
    state.totalPages = pagination.total_pages
    state.totalSuppliers = pagination.total_count
  }

  if (successMessage) {
    toast.success(successMessage, { autoClose: 2000, theme: 'colored' })
  }
}

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState,
  reducers: {
    // Search for a supplier based on input
    searchSupplier: (state, action) => {
      const searchData = action.payload.searchData.toLowerCase()

      if (searchData === '') {
        state.suppliers = state.supplierOriginal
        return
      }

      const filteredSuppliers = state.supplierOriginal.filter((supplier) => {
        const fullName = `${supplier.name}`.toLowerCase()
        return supplier.code.toLowerCase().includes(searchData) || fullName.includes(searchData)
      })

      state.suppliers = filteredSuppliers
    },
    // Set the selected supplier based on ID
    setSupplierSelected: (state, action) => {
      const content = action.payload

      if (content === '') {
        state.supplierSelected = null
        return
      }

      const supplierID = parseInt(content)
      const supplierFound = state.supplierOriginal.find((supplier) => supplier.id === supplierID)
      state.supplierSelected = supplierFound
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
    builder.addCase(getSuppliers.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getSuppliers.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action)
    })
    builder.addCase(createSupplier.fulfilled, (state, action) => {
      state.loading = false

      if (action.payload) {
        updateStateAndStats(state, action, 'Supplier successfully created.')
      }
    })
    builder.addCase(updateSupplier.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, 'Supplier successfully updated.')
    })
    builder.addCase(destroySupplier.fulfilled, (state, action) => {
      state.loading = false
      updateStateAndStats(state, action, 'Supplier successfully deleted.')
    })
  },
})

export const supplierActions = supplierSlice.actions
export default supplierSlice.reducer
