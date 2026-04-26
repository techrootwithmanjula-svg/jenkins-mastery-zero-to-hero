import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, BabyDetail } from '../../models';
import * as profileApi from '../../api/profile';

interface ProfileState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk('profile/fetch', async (_, { rejectWithValue }) => {
  try {
    return await profileApi.getProfile();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch profile';
    return rejectWithValue(message);
  }
});

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (data: Partial<Pick<User, 'name' | 'email'>>, { rejectWithValue }) => {
    try {
      return await profileApi.updateProfile(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Update failed';
      return rejectWithValue(message);
    }
  },
);

export const addBabyDetail = createAsyncThunk(
  'profile/addBaby',
  async (baby: Omit<BabyDetail, 'id'>, { rejectWithValue }) => {
    try {
      return await profileApi.addBabyDetail(baby);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to add baby detail';
      return rejectWithValue(message);
    }
  },
);

export const deleteBabyDetail = createAsyncThunk(
  'profile/deleteBaby',
  async (babyId: string, { rejectWithValue }) => {
    try {
      await profileApi.deleteBabyDetail(babyId);
      return babyId;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete baby detail';
      return rejectWithValue(message);
    }
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addBabyDetail.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.babyDetails.push(action.payload);
        }
      })
      .addCase(deleteBabyDetail.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.babyDetails = state.profile.babyDetails.filter(
            (b) => b.id !== action.payload,
          );
        }
      });
  },
});

export const { clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
