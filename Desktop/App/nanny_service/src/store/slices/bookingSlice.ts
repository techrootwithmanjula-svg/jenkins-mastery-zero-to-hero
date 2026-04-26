import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Booking } from '../../models';
import * as bookingApi from '../../api/booking';

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  isLoading: false,
  error: null,
};

export const fetchBookings = createAsyncThunk(
  'booking/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await bookingApi.getBookings();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch bookings';
      return rejectWithValue(message);
    }
  },
);

export const createBooking = createAsyncThunk(
  'booking/create',
  async (data: bookingApi.CreateBookingRequest, { rejectWithValue }) => {
    try {
      const response = await bookingApi.createBooking(data);
      return response.booking;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Booking failed';
      return rejectWithValue(message);
    }
  },
);

export const confirmBooking = createAsyncThunk(
  'booking/confirm',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      return await bookingApi.confirmBooking(bookingId);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Confirmation failed';
      return rejectWithValue(message);
    }
  },
);

export const cancelBooking = createAsyncThunk(
  'booking/cancel',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      return await bookingApi.cancelBooking(bookingId);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Cancellation failed';
      return rejectWithValue(message);
    }
  },
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBooking = action.payload;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(confirmBooking.fulfilled, (state, action) => {
        state.currentBooking = action.payload;
        const idx = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (idx >= 0) state.bookings[idx] = action.payload;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const idx = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (idx >= 0) state.bookings[idx] = action.payload;
      });
  },
});

export const { clearCurrentBooking, clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
