import authReducer, {
  sendOtp,
  verifyOtp,
  logout,
  clearError,
  restoreSession,
} from '../../src/store/slices/authSlice';

describe('authSlice', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    otpSent: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle logout', () => {
    const loggedInState = {
      ...initialState,
      user: { id: '1', name: 'Test', email: 'test@test.com', mobile: '9876543210', babyDetails: [] },
      token: 'abc123',
      isAuthenticated: true,
    };
    const state = authReducer(loggedInState, logout());
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('should handle clearError', () => {
    const errorState = { ...initialState, error: 'Some error' };
    const state = authReducer(errorState, clearError());
    expect(state.error).toBeNull();
  });

  it('should handle restoreSession', () => {
    const user = { id: '1', name: 'Test', email: 'test@test.com', mobile: '9876543210', babyDetails: [] };
    const state = authReducer(initialState, restoreSession({ user, token: 'token123' }));
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(user);
    expect(state.token).toBe('token123');
  });

  it('should set isLoading on sendOtp.pending', () => {
    const state = authReducer(initialState, { type: sendOtp.pending.type });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should set otpSent on sendOtp.fulfilled', () => {
    const state = authReducer(initialState, { type: sendOtp.fulfilled.type });
    expect(state.isLoading).toBe(false);
    expect(state.otpSent).toBe(true);
  });

  it('should set error on sendOtp.rejected', () => {
    const state = authReducer(initialState, {
      type: sendOtp.rejected.type,
      payload: 'Network error',
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('should set isAuthenticated on verifyOtp.fulfilled', () => {
    const payload = {
      token: 'jwt123',
      user: { id: '1', name: 'Test', email: 'test@test.com', mobile: '9876543210' },
    };
    const state = authReducer(initialState, {
      type: verifyOtp.fulfilled.type,
      payload,
    });
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('jwt123');
  });
});
