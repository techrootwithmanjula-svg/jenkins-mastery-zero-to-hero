import profileReducer, {
  fetchProfile,
  updateProfile,
  addBabyDetail,
  deleteBabyDetail,
  clearProfileError,
} from '../../src/store/slices/profileSlice';

describe('profileSlice', () => {
  const initialState = {
    profile: null,
    isLoading: false,
    error: null,
  };

  const mockProfile = {
    id: 'u1',
    name: 'Test User',
    email: 'test@test.com',
    mobile: '9876543210',
    babyDetails: [{ id: 'b1', name: 'Baby', age: 2, gender: 'male' as const }],
  };

  it('should return initial state', () => {
    expect(profileReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearProfileError', () => {
    const state = profileReducer({ ...initialState, error: 'Error' }, clearProfileError());
    expect(state.error).toBeNull();
  });

  it('should set profile on fetchProfile.fulfilled', () => {
    const state = profileReducer(initialState, {
      type: fetchProfile.fulfilled.type,
      payload: mockProfile,
    });
    expect(state.profile).toEqual(mockProfile);
    expect(state.isLoading).toBe(false);
  });

  it('should update profile on updateProfile.fulfilled', () => {
    const updated = { ...mockProfile, name: 'Updated' };
    const state = profileReducer({ ...initialState, profile: mockProfile }, {
      type: updateProfile.fulfilled.type,
      payload: updated,
    });
    expect(state.profile?.name).toBe('Updated');
  });

  it('should add baby detail on addBabyDetail.fulfilled', () => {
    const newBaby = { id: 'b2', name: 'Baby2', age: 1, gender: 'female' as const };
    const state = profileReducer({ ...initialState, profile: mockProfile }, {
      type: addBabyDetail.fulfilled.type,
      payload: newBaby,
    });
    expect(state.profile?.babyDetails).toHaveLength(2);
  });

  it('should delete baby detail on deleteBabyDetail.fulfilled', () => {
    const state = profileReducer({ ...initialState, profile: mockProfile }, {
      type: deleteBabyDetail.fulfilled.type,
      payload: 'b1',
    });
    expect(state.profile?.babyDetails).toHaveLength(0);
  });
});
