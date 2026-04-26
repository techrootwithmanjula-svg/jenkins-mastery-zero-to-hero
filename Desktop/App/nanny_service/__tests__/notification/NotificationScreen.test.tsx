/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { PaperProvider } from 'react-native-paper';
import NotificationScreen from '../../src/screens/Notification/NotificationScreen';
import notificationReducer from '../../src/store/slices/notificationSlice';
import { lightTheme } from '../../src/theme/themes';
import { ThemeProvider } from '../../src/theme/ThemeProvider';

// Compute today/yesterday for mock data
const todayISO = new Date().toISOString().split('T')[0];
const yesterdayISO = (() => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
})();

const mockNotifications = [
  {
    id: 'n1',
    type: 'payout' as const,
    title: 'A Netflix payout of $19 has been successful!',
    amount: '$19',
    timestamp: '11.00 AM',
    date: todayISO,
    isRead: false,
  },
  {
    id: 'n2',
    type: 'topup' as const,
    title: 'Successfully top up balance $150 from US CITIBAN. See details here.',
    amount: '$150',
    timestamp: '08.00 AM',
    date: todayISO,
    isRead: true,
  },
  {
    id: 'n3',
    type: 'alert' as const,
    title: 'Please top up to continue transactions on Netflix',
    timestamp: '01.00 AM',
    date: todayISO,
    isRead: true,
  },
  {
    id: 'n4',
    type: 'received' as const,
    title: 'You received money from JENNIFER BACHDIM $640',
    amount: '$640',
    timestamp: '11.00 AM',
    date: yesterdayISO,
    isRead: true,
  },
];

// Mock the notification API
jest.mock('../../src/api/notification', () => ({
  fetchNotificationsApi: jest.fn().mockResolvedValue([]),
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  const MockReact = require('react');
  return {
    LinearGradient: ({ children, ...props }: any) =>
      MockReact.createElement(View, { ...props, testID: 'linear-gradient' }, children),
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const MockReact2 = require('react');
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  const frame = { x: 0, y: 0, width: 390, height: 844 };
  const SafeAreaInsetsContext = MockReact2.createContext(insets);
  const SafeAreaFrameContext = MockReact2.createContext(frame);
  return {
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaConsumer: SafeAreaInsetsContext.Consumer,
    SafeAreaInsetsContext,
    SafeAreaFrameContext,
    useSafeAreaInsets: () => insets,
    useSafeAreaFrame: () => frame,
    SafeAreaView: ({ children }: any) => children,
    initialWindowMetrics: { frame, insets },
  };
});

// Mock Paper Portal
jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  const MockR = require('react');
  const MockPortal = ({ children }: any) =>
    MockR.createElement(MockR.Fragment, null, children);
  MockPortal.Host = ({ children }: any) =>
    MockR.createElement(MockR.Fragment, null, children);
  return { ...actual, Portal: MockPortal };
});

// Mock RendererProxy for Animated views
jest.mock('react-native/Libraries/ReactNative/RendererProxy', () => {
  const actual = jest.requireActual('react-native/Libraries/ReactNative/RendererProxy');
  return { ...actual, findNodeHandle: jest.fn(() => 1) };
});

const { fetchNotificationsApi } = require('../../src/api/notification');

const createTestStore = (preloadedNotifications = [] as any[]) =>
  configureStore({
    reducer: {
      notification: notificationReducer,
    },
    preloadedState: {
      notification: {
        notifications: preloadedNotifications,
        isLoading: false,
        error: null,
      },
    },
  });

const renderScreen = (preloadedNotifications = [] as any[]) => {
  const store = createTestStore(preloadedNotifications);
  return render(
    <Provider store={store}>
      <PaperProvider theme={lightTheme}>
        <ThemeProvider>
          <NotificationScreen />
        </ThemeProvider>
      </PaperProvider>
    </Provider>,
  );
};

describe('NotificationScreen Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Test 1: renders section headers TODAY and YESTERDAY', async () => {
    fetchNotificationsApi.mockResolvedValue(mockNotifications);
    renderScreen(mockNotifications);

    await waitFor(() => {
      expect(screen.getByText('TODAY')).toBeTruthy();
    });
    expect(screen.getByText('YESTERDAY')).toBeTruthy();
  });

  it('Test 2: renders notification items with correct titles', async () => {
    fetchNotificationsApi.mockResolvedValue(mockNotifications);
    renderScreen(mockNotifications);

    await waitFor(() => {
      expect(screen.getByTestId('notification-n1')).toBeTruthy();
    });
    expect(screen.getByTestId('notification-n2')).toBeTruthy();
    expect(screen.getByTestId('notification-n3')).toBeTruthy();
    expect(screen.getByTestId('notification-n4')).toBeTruthy();
  });

  it('Test 3: highlights dollar amounts in notification text', async () => {
    fetchNotificationsApi.mockResolvedValue(mockNotifications);
    renderScreen(mockNotifications);

    await waitFor(() => {
      expect(screen.getByText('$19')).toBeTruthy();
    });
    expect(screen.getByText('$150')).toBeTruthy();
    expect(screen.getByText('$640')).toBeTruthy();
  });

  it('Test 4: renders timestamps for each notification', async () => {
    fetchNotificationsApi.mockResolvedValue(mockNotifications);
    renderScreen(mockNotifications);

    await waitFor(() => {
      // Multiple "11.00 AM" entries (n1 and n4)
      expect(screen.getAllByText('11.00 AM').length).toBeGreaterThanOrEqual(1);
    });
    expect(screen.getByText('08.00 AM')).toBeTruthy();
    expect(screen.getByText('01.00 AM')).toBeTruthy();
  });

  it('Test 5: renders empty state when no notifications', async () => {
    fetchNotificationsApi.mockResolvedValue([]);
    renderScreen([]);

    await waitFor(() => {
      expect(screen.getByText('No notifications yet')).toBeTruthy();
    });
    expect(screen.getByText("You'll see your notifications here")).toBeTruthy();
  });

  it('Test 6: renders loading indicator while fetching', () => {
    // Create store with loading state
    const store = configureStore({
      reducer: { notification: notificationReducer },
      preloadedState: {
        notification: {
          notifications: [],
          isLoading: true,
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <PaperProvider theme={lightTheme}>
          <ThemeProvider>
            <NotificationScreen />
          </ThemeProvider>
        </PaperProvider>
      </Provider>,
    );

    expect(screen.getByText('Loading notifications…')).toBeTruthy();
  });
});
