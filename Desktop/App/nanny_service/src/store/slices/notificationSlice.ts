import { createSlice, createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { Notification, NotificationSection } from '../../models';
import { fetchNotificationsApi } from '../../api/notification';

// Avoid circular import — define a local RootState projection
interface RootStateWithNotification {
  notification: NotificationState;
}

export interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  isLoading: false,
  error: null,
};

// ── Async thunk ────────────────────────────────────────────────────
export const fetchNotifications = createAsyncThunk<Notification[]>(
  'notification/fetchNotifications',
  async () => {
    const data = await fetchNotificationsApi();
    return data;
  },
);

// ── Date label helper ──────────────────────────────────────────────
const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

export const getDateLabel = (dateStr: string): string => {
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString().split('T')[0];

  if (dateStr === todayISO) return 'TODAY';
  if (dateStr === yesterdayISO) return 'YESTERDAY';

  const d = new Date(dateStr + 'T00:00:00');
  const month = MONTH_NAMES[d.getMonth()];
  const day = String(d.getDate()).padStart(2, '0');
  return `${month} ${day}`;
};

// ── Slice ──────────────────────────────────────────────────────────
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.isRead = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch notifications';
      });
  },
});

// ── Selectors ──────────────────────────────────────────────────────
const selectNotifications = (state: RootStateWithNotification) =>
  state.notification.notifications;

export const selectGroupedNotifications = createSelector(
  [selectNotifications],
  (notifications): NotificationSection[] => {
    // Group by date
    const groupMap = new Map<string, Notification[]>();
    for (const n of notifications) {
      const existing = groupMap.get(n.date) || [];
      existing.push(n);
      groupMap.set(n.date, existing);
    }

    // Convert to sections and sort: today first, yesterday second, then older descending
    const sections: NotificationSection[] = [];
    for (const [date, data] of groupMap.entries()) {
      sections.push({ title: getDateLabel(date), data });
    }

    const order = (title: string): number => {
      if (title === 'TODAY') return 0;
      if (title === 'YESTERDAY') return 1;
      return 2;
    };

    sections.sort((a, b) => {
      const oa = order(a.title);
      const ob = order(b.title);
      if (oa !== ob) return oa - ob;
      // Both are older dates — sort descending by date string
      return b.title.localeCompare(a.title);
    });

    return sections;
  },
);

export const selectNotificationLoading = (state: RootStateWithNotification): boolean =>
  state.notification.isLoading;

export const selectNotificationError = (state: RootStateWithNotification): string | null =>
  state.notification.error;

export const { markAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;
