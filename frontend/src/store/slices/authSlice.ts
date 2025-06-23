import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface AuthState {
  user: { email: string; name?: string } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  verifySuccess: string | null;
  resetSuccess: string | null;
  forgotSuccess: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
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
      const res = await axios.post(`${SERVER_URL}/api/auth/login`, data);
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
      const res = await axios.post(`${SERVER_URL}/api/auth/register`, data);
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
      const res = await axios.post(`${SERVER_URL}/api/auth/verify-email`, data);
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
      const res = await axios.post(`${SERVER_URL}/api/auth/reset-password`, data);
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
      const res = await axios.post(`${SERVER_URL}/api/auth/forgot-password`, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Request failed');
    }
  }
);

export const loginWithToken = (token: string) => async (dispatch: any) => {
  try {
    // Store token (in Redux and localStorage)
    dispatch(setToken(token));
    localStorage.setItem("token", token);

    // Optionally, fetch user info
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/me`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(setUser(res.data.user));
  } catch (err) {
    dispatch(logout());
  }
};

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
      });
  },
});

export const { logout, clearVerifyState, clearResetState, clearForgotState, setToken, setUser } = authSlice.actions;
export default authSlice.reducer;
