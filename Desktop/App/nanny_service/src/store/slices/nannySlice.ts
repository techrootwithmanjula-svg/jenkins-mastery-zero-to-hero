import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Nanny } from '../../models';
import * as bookingApi from '../../api/booking';

interface NannyState {
  nannies: Nanny[];
  selectedNanny: Nanny | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: NannyState = {
  nannies: [],
  selectedNanny: null,
  isLoading: false,
  error: null,
};

export const searchNannies = createAsyncThunk(
  'nanny/search',
  async (params: bookingApi.SearchNannyParams, { rejectWithValue }) => {
    try {
      return await bookingApi.searchNannies(params);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Search failed';
      return rejectWithValue(message);
    }
  },
);

export const fetchNannyById = createAsyncThunk(
  'nanny/fetchById',
  async (nannyId: string, { rejectWithValue }) => {
    try {
      return await bookingApi.getNannyById(nannyId);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch nanny details';
      return rejectWithValue(message);
    }
  },
);

const nannySlice = createSlice({
  name: 'nanny',
  initialState,
  reducers: {
    clearNannies: (state) => {
      state.nannies = [];
      state.error = null;
    },
    clearSelectedNanny: (state) => {
      state.selectedNanny = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchNannies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchNannies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nannies = action.payload;
      })
      .addCase(searchNannies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchNannyById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNannyById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedNanny = action.payload;
      })
      .addCase(fetchNannyById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearNannies, clearSelectedNanny } = nannySlice.actions;
export default nannySlice.reducer;
