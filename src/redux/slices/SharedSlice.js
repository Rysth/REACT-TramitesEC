import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  typesOriginal: [],
  statusOriginal: [],
  licensesOriginal: [],
  licensesArray: [],
  licenseTypesOriginal: [],
  paymentsTypeOriginal: [],
  paymentsOriginal: [],
  selectedProcedureType: {},
  selectedLicenseType: {},
}

const handleRequestError = (error) => {
  if (error.response.status === 500) {
    toast.error('¡Problema en el Servidor!', { theme: 'colored' })
  } else {
    throw new Error(error)
  }
}

// Async thunk for fetching procedure types
export const getProcedureTypes = createAsyncThunk('shared/getProcedureTypes', async (activeToken) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/procedure_types`, {
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    handleRequestError(error)
  }
})

// Async thunk for fetching statuses
export const getStatuses = createAsyncThunk('shared/getStatuses', async (activeToken) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/statuses`, {
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    handleRequestError(error)
  }
})

// Async thunk for fetching license types
export const getLicenseTypes = createAsyncThunk('shared/getLicenseTypes', async (activeToken) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/license_types`, {
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    handleRequestError(error)
  }
})

// Async thunk for fetching licenses
export const getLicenses = createAsyncThunk('shared/getLicenses', async (activeToken) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/licenses`, {
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    handleRequestError(error)
  }
})

// Async thunk for fetching license types
export const getPaymentTypes = createAsyncThunk('shared/getPaymentTypes', async (activeToken) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/payment_types`, {
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    handleRequestError(error)
  }
})
// Async thunk for fetching license types
export const getPayments = createAsyncThunk('shared/getPayments', async ({ activeToken, procedureID }) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/payments/${procedureID}`, {
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    handleRequestError(error)
  }
})

// Async thunk for creating a new payment
export const createPayment = createAsyncThunk('shared/createPayment', async ({ activeToken, paymentData }) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/payments`, paymentData, {
      headers: {
        Authorization: activeToken,
      },
      withCredentials: true,
    })
    return response.data
  } catch (error) {
    handleRequestError(error)
  }
})

const sharedSlice = createSlice({
  name: 'shared',
  initialState,
  reducers: {
    filterLicenses: (state, action) => {
      const searchTypeID = action.payload
      if (searchTypeID === 1) {
        state.licensesArray = state.licensesOriginal
        return
      }
      state.licensesArray = state.licensesOriginal.filter((license) => license.type.id === searchTypeID)
    },
    setProcedureTypeSelected: (state, action) => {
      const selectedProcedureTypeId = parseInt(action.payload)

      if (selectedProcedureTypeId === 0) {
        state.selectedProcedureType === null
        return
      }

      state.selectedProcedureType = state.typesOriginal.find((type) => type.id === selectedProcedureTypeId)
      state.selectedLicenseType = null // Reset selected license type when procedure type changes
    },
    setLicenseTypeSelected: (state, action) => {
      const selectedLicenseTypeId = parseInt(action.payload)
      state.selectedLicenseType = selectedLicenseTypeId
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProcedureTypes.fulfilled, (state, action) => {
        state.typesOriginal = action.payload
      })
      .addCase(getStatuses.fulfilled, (state, action) => {
        state.statusOriginal = action.payload
      })
      .addCase(getLicenses.fulfilled, (state, action) => {
        state.licensesOriginal = action.payload
        state.licensesArray = action.payload
      })
      .addCase(getLicenseTypes.fulfilled, (state, action) => {
        state.licenseTypesOriginal = action.payload
      })
      .addCase(getPaymentTypes.fulfilled, (state, action) => {
        state.paymentsTypeOriginal = action.payload
      })
      .addCase(getPayments.fulfilled, (state, action) => {
        state.paymentsOriginal = action.payload
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.paymentsOriginal = action.payload
        toast.success('¡Pago creado exitosamente!', { autoClose: 2000 })
      })
  },
})

export const sharedActions = sharedSlice.actions

export default sharedSlice.reducer
