import notificationReducer, {
  fetchNotifications,
  markAsRead,
  getDateLabel,
  selectGroupedNotifications,
  NotificationState,
} from '../../src/store/slices/notificationSlice';
import { configureStore } from '@reduxjs/toolkit';
import { Notification } from '../../src/models';

// Helper to compute today / yesterday ISO strings
const todayISO = new Date().toISOString().split('T')[0];
const yesterdayISO = (() => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
})();

const mockNotification: Notification = {
  id: 'n1',
  type: 'payout',
  title: 'A Netflix payout of $19 has been successful!',
  amount: '$19',
  timestamp: '11.00 AM',
  date: todayISO,
  isRead: false,
};

describe('notificationSlice', () => {
  const initialState: NotificationState = {
    notifications: [],
    isLoading: false,
    error: null,
  };

  it('Test 1: initial state has empty notifications, isLoading false, error null', () => {
    expect(notificationReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('Test 2: fetchNotifications/pending sets isLoading true', () => {
    const state = notificationReducer(initialState, {
      type: fetchNotifications.pending.type,
    });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Test 3: fetchNotifications/fulfilled populates notifications and sets isLoading false', () => {
    const notifications = [mockNotification];
    const state = notificationReducer(initialState, {
      type: fetchNotifications.fulfilled.type,
      payload: notifications,
    });
    expect(state.notifications).toEqual(notifications);
    expect(state.isLoading).toBe(false);
  });

  it('Test 4: fetchNotifications/rejected sets error message and isLoading false', () => {
    const state = notificationReducer(initialState, {
      type: fetchNotifications.rejected.type,
      error: { message: 'Network error' },
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network error');
  });

  it('Test 5: markAsRead sets isRead true for matching notification id', () => {
    const stateWithNotifications: NotificationState = {
      ...initialState,
      notifications: [mockNotification],
    };
    const state = notificationReducer(stateWithNotifications, markAsRead('n1'));
    expect(state.notifications[0].isRead).toBe(true);
  });

  it('Test 6: getDateLabel returns "TODAY" for today\'s date', () => {
    expect(getDateLabel(todayISO)).toBe('TODAY');
  });

  it('Test 7: getDateLabel returns "YESTERDAY" for yesterday\'s date', () => {
    expect(getDateLabel(yesterdayISO)).toBe('YESTERDAY');
  });

  it('Test 8: getDateLabel returns formatted "MMM DD" for older dates', () => {
    const result = getDateLabel('2026-01-15');
    expect(result).toBe('JAN 15');
  });

  it('Test 9: selectGroupedNotifications groups notifications by date with correct section titles', () => {
    const store = configureStore({
      reducer: { notification: notificationReducer },
      preloadedState: {
        notification: {
          notifications: [
            { ...mockNotification, id: 'n1', date: todayISO },
            { ...mockNotification, id: 'n2', date: todayISO },
            { ...mockNotification, id: 'n3', date: yesterdayISO },
          ],
          isLoading: false,
          error: null,
        },
      },
    });

    const sections = selectGroupedNotifications(store.getState());
    expect(sections).toHaveLength(2);
    expect(sections[0].title).toBe('TODAY');
    expect(sections[0].data).toHaveLength(2);
    expect(sections[1].title).toBe('YESTERDAY');
    expect(sections[1].data).toHaveLength(1);
  });
});
