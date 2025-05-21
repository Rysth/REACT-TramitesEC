import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

const getActiveUser = JSON.parse(sessionStorage.getItem('activeUser'))
const getActiveToken = sessionStorage.getItem('activeToken')
const getActiveSession = sessionStorage.getItem('active')

const initialState = {
  activeUser: getActiveUser || {},
  activeToken: getActiveToken || '',
  active: getActiveSession === 'true',
  loading: false,
  error: null,
}

// Modified to reject with error instead of handling it directly
const handleRequestError = (error) => {
  if (error.response) {
    if (error.response.status === 401) {
      return "Credenciales incorrectas. Por favor, verifique su correo y contraseña.";
    } else if (error.response.status === 400) {
      return "La cuenta no existe. Verifique su información.";
    } else if (error.response.status === 500) {
      return "Error en el servidor. Por favor, inténtelo más tarde.";
    }
  }
  return "Error de conexión. Inténtelo de nuevo.";
}

export const createSession = createAsyncThunk(
  'authentication/createSession', 
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/users/tokens/sign_in`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })

      const userResponse = await axios.get(`${API_URL}/api/v1/users/1`, {
        headers: {
          Authorization: response.data.token,
        },
        withCredentials: true,
      })

      return [response.data, userResponse.data]
    } catch (error) {
      const errorMessage = handleRequestError(error);
      toast.error(errorMessage, { theme: 'colored' });
      return rejectWithValue(errorMessage);
    }
  }
)

export const destroySession = createAsyncThunk(
  'authentication/destroySession', 
  async (activeToken, { rejectWithValue }) => {
    try {
      await axios.post(
        `${API_URL}/users/tokens/revoke`,
        {},
        {
          headers: {
            Authorization: activeToken,
          },
          withCredentials: true,
        },
      )
      return true;
    } catch (error) {
      const errorMessage = error.response?.status === 500 
        ? "Error en el servidor. Por favor, inténtelo más tarde."
        : "Error al cerrar sesión.";
      
      toast.error(errorMessage, { theme: 'colored' });
      return rejectWithValue(errorMessage);
    }
  }
)

export const getActualUser = createAsyncThunk(
  'authentication/getActualUser', 
  async (activeToken, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/users/1`, {
        headers: {
          Authorization: activeToken,
        },
        withCredentials: true,
      })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.status === 500 
        ? "Error en el servidor. Por favor, inténtelo más tarde."
        : "Error al obtener datos del usuario.";
      
      toast.error(errorMessage, { theme: 'colored' });
      return rejectWithValue(errorMessage);
    }
  }
)

const updateSessionStorage = (state) => {
  sessionStorage.setItem('active', state.active)
  sessionStorage.setItem('activeToken', state.activeToken)
  sessionStorage.setItem('activeUser', JSON.stringify(state.activeUser))
}

export const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    destroySession: (state) => {
      state.active = false
      state.activeUser = {}
      state.activeToken = ''
      sessionStorage.removeItem('active')
      sessionStorage.removeItem('activeUser')
      sessionStorage.removeItem('activeToken')
      toast.info('¡Muchas Gracias!', { autoClose: 2000, theme: 'colored' })
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getActualUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getActualUser.fulfilled, (state, action) => {
      state.loading = false;
      state.activeUser = action.payload
      state.error = null;
      updateSessionStorage(state)
    });
    builder.addCase(getActualUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    builder.addCase(createSession.pending, (state) => {
      state.loading = true;
      state.error = null;
      toast.info('Espere porfavor...', { autoClose: 2000, theme: 'colored' })
    });
    builder.addCase(createSession.fulfilled, (state, action) => {
      state.active = true
      state.loading = false
      state.activeUser = action.payload[1]
      state.activeToken = action.payload[0].token
      state.error = null;
      updateSessionStorage(state)
      toast.success('¡Bienvenido!', { autoClose: 2000, theme: 'colored' })
    });
    builder.addCase(createSession.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    builder.addCase(destroySession.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(destroySession.fulfilled, (state) => {
      state.active = false
      state.activeUser = {}
      state.activeToken = ''
      state.loading = false;
      state.error = null;
      updateSessionStorage(state)
      toast.info('¡Muchas Gracias!', { autoClose: 2000, theme: 'colored' })
    });
    builder.addCase(destroySession.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
})

export const AuthenticationActions = AuthenticationSlice.actions

export default AuthenticationSlice.reducer
