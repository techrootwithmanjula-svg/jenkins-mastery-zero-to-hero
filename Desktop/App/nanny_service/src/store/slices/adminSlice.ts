import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Booking, Nanny } from '../../models';
import * as adminApi from '../../api/admin';

interface AdminState {
  bookings: Booking[];
  nannies: Nanny[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  bookings: [],
  nannies: [],
  isLoading: false,
  error: null,
};

export const fetchAllBookings = createAsyncThunk(
  'admin/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.getAllBookings();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch bookings';
      return rejectWithValue(message);
    }
  },
);

export const fetchAllNannies = createAsyncThunk(
  'admin/fetchNannies',
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.getAllNannies();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch nannies';
      return rejectWithValue(message);
    }
  },
);

export const refundBooking = createAsyncThunk(
  'admin/refund',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      return await adminApi.refundBooking(bookingId);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Refund failed';
      return rejectWithValue(message);
    }
  },
);

export const setNannyOffline = createAsyncThunk(
  'admin/nannyOffline',
  async (nannyId: string, { rejectWithValue }) => {
    try {
      return await adminApi.setNannyOffline(nannyId);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to set nanny offline';
      return rejectWithValue(message);
    }
  },
);

export const setNannyOnline = createAsyncThunk(
  'admin/nannyOnline',
  async (nannyId: string, { rejectWithValue }) => {
    try {
      return await adminApi.setNannyOnline(nannyId);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to set nanny online';
      return rejectWithValue(message);
    }
  },
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllNannies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllNannies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nannies = action.payload;
      })
      .addCase(fetchAllNannies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(refundBooking.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (idx >= 0) state.bookings[idx] = action.payload;
      })
      .addCase(setNannyOffline.fulfilled, (state, action) => {
        const idx = state.nannies.findIndex((n) => n.id === action.payload.id);
        if (idx >= 0) state.nannies[idx] = action.payload;
      })
      .addCase(setNannyOnline.fulfilled, (state, action) => {
        const idx = state.nannies.findIndex((n) => n.id === action.payload.id);
        if (idx >= 0) state.nannies[idx] = action.payload;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
