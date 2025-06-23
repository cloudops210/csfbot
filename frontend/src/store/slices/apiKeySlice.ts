import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiKey {
  _id: string;
  exchange: string;
  apiKey: string; // This will be the decrypted key from the server
  createdAt: string;
}

interface ApiKeyState {
  keys: ApiKey[];
  loading: boolean;
  error: string | null;
}

const initialState: ApiKeyState = {
  keys: [],
  loading: false,
  error: null,
};

// Async thunk for getting API keys
export const getApiKeys = createAsyncThunk('apiKeys/getApiKeys', async (_, { getState, rejectWithValue }) => {
  try {
    const token = (getState() as any).auth.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(`${SERVER_URL}/api/keys`, config);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch API keys');
  }
});

// Async thunk for adding an API key
export const addApiKey = createAsyncThunk(
  'apiKeys/addApiKey',
  async ({ exchange, apiKey, apiSecret }: { exchange: string; apiKey: string; apiSecret: string }, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const body = { exchange, apiKey, apiSecret };
      const response = await axios.post(`${SERVER_URL}/api/keys`, body, config);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add API key');
    }
  }
);

// Async thunk for deleting an API key
export const deleteApiKey = createAsyncThunk('apiKeys/deleteApiKey', async (keyId: string, { getState, rejectWithValue }) => {
  try {
    const token = (getState() as any).auth.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axios.delete(`${SERVER_URL}/api/keys/${keyId}`, config);
    return keyId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete API key');
  }
});

const apiKeySlice = createSlice({
  name: 'apiKeys',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Keys
      .addCase(getApiKeys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApiKeys.fulfilled, (state, action: PayloadAction<ApiKey[]>) => {
        state.loading = false;
        state.keys = action.payload;
      })
      .addCase(getApiKeys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Key
      .addCase(addApiKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addApiKey.fulfilled, (state) => {
        state.loading = false;
        // We don't add the key to the state here.
        // We will refetch the list to ensure data is consistent.
      })
      .addCase(addApiKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Key
      .addCase(deleteApiKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApiKey.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.keys = state.keys.filter((key) => key._id !== action.payload);
      })
      .addCase(deleteApiKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default apiKeySlice.reducer; 