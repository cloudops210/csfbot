import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export const createCheckoutSession = createAsyncThunk(
  'subscription/createCheckoutSession',
  async (priceId: string, { rejectWithValue }) => {
    try {
      const res = await api.post(
        '/api/subscription/create-checkout-session',
        { priceId }
      );
      return res.data.url;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create checkout session');
    }
  }
);

export const createPortalSession = createAsyncThunk(
  'subscription/createPortalSession',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post(
        '/api/subscription/create-portal-session',
        {}
      );
      return res.data.url;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create portal session');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    status: 'idle',
    error: null as string | null,
    checkoutUrl: null as string | null,
    loadingPriceId: null as string | null,
  },
  reducers: {
    clearCheckoutUrl(state) {
      state.checkoutUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckoutSession.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        state.loadingPriceId = action.meta.arg;
      })
      .addCase(createCheckoutSession.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.checkoutUrl = action.payload;
        state.loadingPriceId = null;
      })
      .addCase(createCheckoutSession.rejected, (state) => {
        state.status = 'failed';
        state.loadingPriceId = null;
      })
      .addCase(createPortalSession.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createPortalSession.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.checkoutUrl = action.payload;
      })
      .addCase(createPortalSession.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearCheckoutUrl } = subscriptionSlice.actions;
export default subscriptionSlice.reducer; 