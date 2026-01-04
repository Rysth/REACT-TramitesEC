import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

// Change from sessionStorage to localStorage
const getActiveUser = JSON.parse(localStorage.getItem('activeUser'))
const getActiveToken = localStorage.getItem('activeToken')
const getActiveSession = localStorage.getItem('active')

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
    } else if (error.response.status === 403) {
      return error.response.data?.error || "Tu cuenta ha sido desactivada. Contacta al administrador.";
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

      // Store the login time
      const loginTime = Date.now();
      localStorage.setItem('loginTime', loginTime);
      
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

// New thunk to validate the token on app initialization
export const validateToken = createAsyncThunk(
  'authentication/validateToken',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const { activeToken } = getState().authentication;
      
      if (!activeToken) {
        return rejectWithValue('No token found');
      }
      
      // Check token age - example: expire after 12 hours
      const loginTime = parseInt(localStorage.getItem('loginTime') || '0');
      const currentTime = Date.now();
      const TOKEN_EXPIRY = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
      
      if (currentTime - loginTime > TOKEN_EXPIRY) {
        dispatch(AuthenticationActions.destroySession());
        toast.error("Su sesión ha expirado. Por favor, inicie sesión nuevamente.", { theme: 'colored' });
        return rejectWithValue('Token expired');
      }
      
      const response = await axios.get(`${API_URL}/api/v1/users/1`, {
        headers: {
          Authorization: activeToken,
        },
        withCredentials: true,
      });
      
      return response.data;
    } catch (error) {
      dispatch(AuthenticationActions.destroySession());
      return rejectWithValue('Invalid token');
    }
  }
);

// Update the updateSessionStorage function to use localStorage
const updateSessionStorage = (state) => {
  localStorage.setItem('active', state.active)
  localStorage.setItem('activeToken', state.activeToken)
  localStorage.setItem('activeUser', JSON.stringify(state.activeUser))
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
      // Update to clear localStorage instead of sessionStorage
      localStorage.removeItem('active')
      localStorage.removeItem('activeUser')
      localStorage.removeItem('activeToken')
      localStorage.removeItem('loginTime') // Clear login time
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
    
    builder.addCase(validateToken.fulfilled, (state, action) => {
      state.activeUser = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(validateToken.rejected, (state) => {
      // Token is invalid, we already cleared the session in the thunk
      state.loading = false;
    });
  },
})

export const AuthenticationActions = AuthenticationSlice.actions

export default AuthenticationSlice.reducer
