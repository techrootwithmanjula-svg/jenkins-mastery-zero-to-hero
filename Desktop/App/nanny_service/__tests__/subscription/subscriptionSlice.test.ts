/**
 * Redux slice tests for subscription state management.
 * Tests verify reducer/thunk behavior with weekly recurrence schema:
 *   frequencyPerWeek, weekdays, startTime, endTime.
 */

import subscriptionReducer, {
  fetchSubscriptions,
  createSubscription,
  pauseSubscription,
  resumeSubscription,
  deleteSubscription,
  clearSubscriptionError,
  validateSubscriptionPayload,
} from '../../src/store/slices/subscriptionSlice';
import { Subscription } from '../../src/models';

describe('subscriptionSlice', () => {
  const initialState = {
    subscriptions: [],
    isLoading: false,
    error: null,
  };

  const mockSub: Subscription = {
    id: 's1',
    userId: 'u1',
    nannyId: 'n1',
    nannyName: 'Jane',
    frequencyPerWeek: 1,
    weekdays: ['Monday'],
    startTime: '09:00',
    endTime: '12:00',
    status: 'active',
    createdAt: '2026-04-10',
  };

  it('should return initial state', () => {
    expect(subscriptionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearSubscriptionError', () => {
    const state = subscriptionReducer(
      { ...initialState, error: 'Error' },
      clearSubscriptionError(),
    );
    expect(state.error).toBeNull();
  });

  it('should populate subscriptions on fetch.fulfilled', () => {
    const state = subscriptionReducer(initialState, {
      type: fetchSubscriptions.fulfilled.type,
      payload: [mockSub],
    });
    expect(state.subscriptions).toHaveLength(1);
  });

  it('should add subscription on create.fulfilled', () => {
    const state = subscriptionReducer(initialState, {
      type: createSubscription.fulfilled.type,
      payload: mockSub,
    });
    expect(state.subscriptions).toHaveLength(1);
    expect(state.isLoading).toBe(false);
  });

  it('should set isLoading true on create.pending', () => {
    const state = subscriptionReducer(initialState, {
      type: createSubscription.pending.type,
    });
    expect(state.isLoading).toBe(true);
  });

  it('should set error on create.rejected', () => {
    const state = subscriptionReducer(initialState, {
      type: createSubscription.rejected.type,
      payload: 'Frequency per week must be 1 or 2.',
    });
    expect(state.error).toBe('Frequency per week must be 1 or 2.');
    expect(state.isLoading).toBe(false);
  });

  it('should update status on pause.fulfilled', () => {
    const paused = { ...mockSub, status: 'paused' as const };
    const state = subscriptionReducer(
      { ...initialState, subscriptions: [mockSub] },
      { type: pauseSubscription.fulfilled.type, payload: paused },
    );
    expect(state.subscriptions[0].status).toBe('paused');
    expect(state.isLoading).toBe(false);
  });

  it('should update status on resume.fulfilled', () => {
    const pausedSub = { ...mockSub, status: 'paused' as const };
    const resumed = { ...mockSub, status: 'active' as const };
    const state = subscriptionReducer(
      { ...initialState, subscriptions: [pausedSub] },
      { type: resumeSubscription.fulfilled.type, payload: resumed },
    );
    expect(state.subscriptions[0].status).toBe('active');
    expect(state.isLoading).toBe(false);
  });

  it('should remove subscription on delete.fulfilled', () => {
    const state = subscriptionReducer(
      { ...initialState, subscriptions: [mockSub] },
      { type: deleteSubscription.fulfilled.type, payload: 's1' },
    );
    expect(state.subscriptions).toHaveLength(0);
    expect(state.isLoading).toBe(false);
  });
});

describe('validateSubscriptionPayload', () => {
  const validPayload = {
    nannyId: 'n1',
    nannyName: 'Jane',
    frequencyPerWeek: 1 as 1 | 2,
    weekdays: ['Monday'],
    startTime: '09:00',
    endTime: '12:00',
  };

  it('should pass with valid 1-day/week payload', () => {
    expect(validateSubscriptionPayload(validPayload)).toBeNull();
  });

  it('should pass with valid 2-day/week payload', () => {
    expect(
      validateSubscriptionPayload({
        ...validPayload,
        frequencyPerWeek: 2,
        weekdays: ['Monday', 'Wednesday'],
      }),
    ).toBeNull();
  });

  it('should reject invalid frequencyPerWeek', () => {
    expect(
      validateSubscriptionPayload({ ...validPayload, frequencyPerWeek: 3 as 1 | 2 }),
    ).toBe('Frequency per week must be 1 or 2.');
  });

  it('should reject weekday count mismatch', () => {
    expect(
      validateSubscriptionPayload({ ...validPayload, weekdays: ['Monday', 'Tuesday'] }),
    ).toMatch(/exactly 1 weekday/);
  });

  it('should reject missing weekdays', () => {
    expect(validateSubscriptionPayload({ ...validPayload, weekdays: [] })).toMatch(
      /exactly 1 weekday/,
    );
  });

  it('should reject times outside 08:00–20:00', () => {
    expect(
      validateSubscriptionPayload({ ...validPayload, startTime: '07:00', endTime: '10:00' }),
    ).toMatch(/08:00/);
  });

  it('should reject endTime before startTime', () => {
    expect(
      validateSubscriptionPayload({ ...validPayload, startTime: '12:00', endTime: '10:00' }),
    ).toMatch(/after start time/);
  });

  it('should reject duration less than 3 hours', () => {
    expect(
      validateSubscriptionPayload({ ...validPayload, startTime: '09:00', endTime: '10:30' }),
    ).toMatch(/3 hours/);
  });
});
