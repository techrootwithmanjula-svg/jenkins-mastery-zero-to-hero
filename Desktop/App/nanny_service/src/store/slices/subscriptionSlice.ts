/**
 * Redux slice for subscription state management.
 * Updated (2026-04-20): Thunks support weekly recurrence schema:
 *   - frequencyPerWeek: 1 | 2
 *   - weekdays: string[] (count equals frequencyPerWeek)
 *   - startTime / endTime: HH:mm, 3hr min, within 08:00–20:00
 *
 * Validation is performed in the createSubscription thunk before the API call.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Subscription } from '../../models';
import * as subscriptionApi from '../../api/subscription';

interface SubscriptionState {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  subscriptions: [],
  isLoading: false,
  error: null,
};

export const fetchSubscriptions = createAsyncThunk(
  'subscription/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await subscriptionApi.getSubscriptions();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch subscriptions';
      return rejectWithValue(message);
    }
  },
);

/** Parses HH:mm time string into total minutes from midnight. */
const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

/** Validates subscription create payload against business rules. Returns error message or null. */
export const validateSubscriptionPayload = (
  data: subscriptionApi.CreateSubscriptionRequest,
): string | null => {
  if (data.frequencyPerWeek !== 1 && data.frequencyPerWeek !== 2) {
    return 'Frequency per week must be 1 or 2.';
  }
  if (!data.weekdays || data.weekdays.length !== data.frequencyPerWeek) {
    return `Please select exactly ${data.frequencyPerWeek} weekday${data.frequencyPerWeek > 1 ? 's' : ''}.`;
  }
  if (!data.startTime || !data.endTime) {
    return 'Start time and end time are required.';
  }
  const startMin = toMinutes(data.startTime);
  const endMin = toMinutes(data.endTime);
  const minBound = toMinutes('08:00');
  const maxBound = toMinutes('20:00');
  if (startMin < minBound || endMin > maxBound) {
    return 'Service hours are 08:00 – 20:00.';
  }
  if (endMin <= startMin) {
    return 'End time must be after start time.';
  }
  if (endMin - startMin < 180) {
    return 'Minimum booking duration is 3 hours.';
  }
  return null;
};

export const createSubscription = createAsyncThunk(
  'subscription/create',
  async (data: subscriptionApi.CreateSubscriptionRequest, { rejectWithValue }) => {
    const validationError = validateSubscriptionPayload(data);
    if (validationError) return rejectWithValue(validationError);
    try {
      return await subscriptionApi.createSubscription(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Subscription creation failed';
      return rejectWithValue(message);
    }
  },
);

export const pauseSubscription = createAsyncThunk(
  'subscription/pause',
  async (id: string, { rejectWithValue }) => {
    try {
      return await subscriptionApi.pauseSubscription(id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to pause subscription';
      return rejectWithValue(message);
    }
  },
);

export const resumeSubscription = createAsyncThunk(
  'subscription/resume',
  async (id: string, { rejectWithValue }) => {
    try {
      return await subscriptionApi.resumeSubscription(id);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to resume subscription';
      return rejectWithValue(message);
    }
  },
);

export const deleteSubscription = createAsyncThunk(
  'subscription/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await subscriptionApi.deleteSubscription(id);
      return id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete subscription';
      return rejectWithValue(message);
    }
  },
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptions.unshift(action.payload);
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(pauseSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(pauseSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.subscriptions.findIndex((s) => s.id === action.payload.id);
        if (idx >= 0) state.subscriptions[idx] = action.payload;
      })
      .addCase(pauseSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(resumeSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resumeSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        const idx = state.subscriptions.findIndex((s) => s.id === action.payload.id);
        if (idx >= 0) state.subscriptions[idx] = action.payload;
      })
      .addCase(resumeSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptions = state.subscriptions.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSubscriptionError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
