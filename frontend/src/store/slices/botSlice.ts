import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';

export interface Bot {
  _id: string;
  name: string;
  exchange: string;
  apiKeyRef: string;
  strategy: any;
  status: 'stopped' | 'running' | 'error';
  performance?: {
    pnl: number;
    winRate: number;
    tradeCount: number;
    lastTradeAt?: string;
  };
}

export interface BotLog {
  _id: string;
  bot: string;
  timestamp: string;
  type: string;
  message: string;
  data?: any;
}

interface BotState {
  bots: Bot[];
  selectedBot: Bot | null;
  logs: BotLog[];
  performance: Bot['performance'] | null;
  loading: boolean;
  error: string | null;
}

const initialState: BotState = {
  bots: [],
  selectedBot: null,
  logs: [],
  performance: null,
  loading: false,
  error: null,
};

export const listBots = createAsyncThunk('bots/list', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/api/bots');
    return res.data.bots;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch bots');
  }
});

export const createBot = createAsyncThunk('bots/create', async (data: Partial<Bot>, { rejectWithValue }) => {
  try {
    const res = await api.post('/api/bots', data);
    return res.data.bot;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create bot');
  }
});

export const updateBot = createAsyncThunk('bots/update', async ({ id, data }: { id: string; data: Partial<Bot> }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/api/bots/${id}`, data);
    return res.data.bot;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update bot');
  }
});

export const deleteBot = createAsyncThunk('bots/delete', async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/api/bots/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete bot');
  }
});

export const toggleBot = createAsyncThunk('bots/toggle', async ({ id, action }: { id: string; action: 'start' | 'stop' }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/api/bots/${id}/toggle`, { action });
    return res.data.bot;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to toggle bot');
  }
});

export const getBotLogs = createAsyncThunk('bots/getLogs', async (id: string, { rejectWithValue }) => {
  try {
    const res = await api.get(`/api/bots/${id}/logs`);
    return res.data.logs;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch logs');
  }
});

export const getBotPerformance = createAsyncThunk('bots/getPerformance', async (id: string, { rejectWithValue }) => {
  try {
    const res = await api.get(`/api/bots/${id}/performance`);
    return res.data.performance;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch performance');
  }
});

const botSlice = createSlice({
  name: 'bots',
  initialState,
  reducers: {
    setSelectedBot(state, action: PayloadAction<Bot | null>) {
      state.selectedBot = action.payload;
      state.logs = [];
      state.performance = null;
    },
    clearBotError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listBots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listBots.fulfilled, (state, action) => {
        state.loading = false;
        state.bots = action.payload;
      })
      .addCase(listBots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBot.fulfilled, (state, action) => {
        state.loading = false;
        state.bots.push(action.payload);
      })
      .addCase(createBot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBot.fulfilled, (state, action) => {
        state.loading = false;
        state.bots = state.bots.map((bot) => (bot._id === action.payload._id ? action.payload : bot));
        if (state.selectedBot && state.selectedBot._id === action.payload._id) {
          state.selectedBot = action.payload;
        }
      })
      .addCase(updateBot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBot.fulfilled, (state, action) => {
        state.loading = false;
        state.bots = state.bots.filter((bot) => bot._id !== action.payload);
        if (state.selectedBot && state.selectedBot._id === action.payload) {
          state.selectedBot = null;
          state.logs = [];
          state.performance = null;
        }
      })
      .addCase(deleteBot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleBot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleBot.fulfilled, (state, action) => {
        state.loading = false;
        state.bots = state.bots.map((bot) => (bot._id === action.payload._id ? action.payload : bot));
        if (state.selectedBot && state.selectedBot._id === action.payload._id) {
          state.selectedBot = action.payload;
        }
      })
      .addCase(toggleBot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getBotLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBotLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(getBotLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getBotPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBotPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.performance = action.payload;
      })
      .addCase(getBotPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedBot, clearBotError } = botSlice.actions;
export default botSlice.reducer; 