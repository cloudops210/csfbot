import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

interface AuthState {
  user: {
    email: string;
    name?: string;
    subscriptionStatus?: string;
    subscriptionPlan?: string;
    hasPassword?: boolean;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  verifySuccess: string | null;
  resetSuccess: string | null;
  forgotSuccess: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  loading: false,
  error: null,
  verifySuccess: null,
  resetSuccess: null,
  forgotSuccess: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/login', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; name?: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/register', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (data: { email: string; token: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/verify-email', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Verification failed');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { email: string; token: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/reset-password', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Reset failed');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/api/auth/forgot-password', data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Request failed');
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (token: string, { dispatch, rejectWithValue }) => {
    try {
      localStorage.setItem('token', token);
      dispatch(setToken(token));
      const res = await api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.user;
    } catch (err: any) {
      localStorage.removeItem('token');
      return rejectWithValue(err.response?.data?.message || 'Google login failed.');
    }
  }
);

export const loginWithToken = (token: string) => async (dispatch: any) => {
  try {
    dispatch(setToken(token));
    localStorage.setItem('token', token);
    const res = await api.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch(setUser(res.data.user));
  } catch (err) {
    dispatch(logout());
  }
};

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: { name?: string; email?: string }, { rejectWithValue }) => {
    try {
      await api.put('/api/auth/profile', data);
      const res = await api.get('/api/auth/me');
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Profile update failed');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const res = await api.put('/api/auth/change-password', data);
      return res.data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Password change failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearVerifyState(state) {
      state.verifySuccess = null;
      state.error = null;
    },
    clearResetState(state) {
      state.resetSuccess = null;
      state.error = null;
    },
    clearForgotState(state) {
      state.forgotSuccess = null;
      state.error = null;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    clearProfileState(state) {
      state.error = null;
    },
    clearPasswordState(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.verifySuccess = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.verifySuccess = 'Email verified! You can now log in.';
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.verifySuccess = null;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.resetSuccess = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.resetSuccess = 'Password reset successful! You can now log in.';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.resetSuccess = null;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.forgotSuccess = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.forgotSuccess = 'Check your email for a reset link.';
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.forgotSuccess = null;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearVerifyState, clearResetState, clearForgotState, setToken, setUser, clearProfileState, clearPasswordState } = authSlice.actions;
export default authSlice.reducer;
