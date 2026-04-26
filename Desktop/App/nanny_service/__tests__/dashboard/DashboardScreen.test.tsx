/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import DashboardScreen from '../../src/screens/Dashboard/DashboardScreen';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('expo-linear-gradient', () => {
  const MockReact = require('react');
  const { View: MockView } = require('react-native');
  return {
    LinearGradient: ({ children, ...props }: any) =>
      MockReact.createElement(MockView, { ...props, testID: 'linear-gradient' }, children),
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('../../src/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) =>
    selector({
      auth: {
        user: {
          name: 'Test Parent',
          babyDetails: [{ id: 'baby-1', name: 'Mia', age: 2, gender: 'female' }],
        },
      },
    }),
}));

jest.mock('../../src/theme', () => {
  const actual = jest.requireActual('../../src/theme');
  const { lightTheme: mockedLightTheme } = jest.requireActual('../../src/theme/themes');
  return {
    ...actual,
    useAppTheme: () => ({
      theme: mockedLightTheme,
      isDark: false,
      toggleTheme: jest.fn(),
    }),
  };
});

jest.mock('../../src/components', () => ({
  NannyCard: () => {
    const MockReact = require('react');
    const { Text: MockText } = require('react-native');
    return MockReact.createElement(MockText, null, 'Mock Nanny');
  },
  ScheduleModal: ({ visible, onDismiss, onSchedule }: any) => {
    const MockReact = require('react');
    const { View: MockView, Text: MockText, Pressable: MockPressable } = require('react-native');

    if (!visible) {
      return null;
    }

    return MockReact.createElement(
      MockView,
      { testID: 'mock-schedule-modal' },
      MockReact.createElement(MockText, null, 'Mock Schedule Modal'),
      MockReact.createElement(
        MockPressable,
        {
          accessibilityLabel: 'Mock confirm schedule',
          onPress: () => onSchedule('2026-04-22', '09:00', '12:00'),
        },
        MockReact.createElement(MockText, null, 'Confirm schedule'),
      ),
      MockReact.createElement(
        MockPressable,
        { accessibilityLabel: 'Mock dismiss schedule', onPress: onDismiss },
        MockReact.createElement(MockText, null, 'Dismiss schedule'),
      ),
    );
  },
}));

const renderScreen = () => render(<DashboardScreen />);

describe('DashboardScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders 4 marketing cards and 2 action cards', () => {
    renderScreen();

    expect(screen.getByTestId('marketing-card-trained-care')).toBeTruthy();
    expect(screen.getByTestId('marketing-card-fulltime')).toBeTruthy();
    expect(screen.getByTestId('marketing-card-newborn')).toBeTruthy();
    expect(screen.getByTestId('marketing-card-education')).toBeTruthy();

    expect(screen.getByTestId('action-card-babysitting')).toBeTruthy();
    expect(screen.getByTestId('action-card-admin')).toBeTruthy();
  });

  it('marketing cards do not navigate on press', () => {
    renderScreen();

    fireEvent.press(screen.getByTestId('marketing-card-trained-care'));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('babysitting action card routes to appointments with context', () => {
    renderScreen();

    fireEvent.press(screen.getByTestId('action-card-babysitting'));

    expect(mockNavigate).toHaveBeenCalledWith('Appointments', {
      serviceId: 'babysitting',
      serviceTitle: 'Babysitting',
    });
  });

  it('admin action card routes to root admin screen', () => {
    renderScreen();

    fireEvent.press(screen.getByTestId('action-card-admin'));

    expect(mockNavigate).toHaveBeenCalledWith('AdminMain');
  });

  it('schedule flow still routes to nanny list from modal selection', () => {
    renderScreen();

    fireEvent.press(screen.getByLabelText('Schedule a nanny session'));
    fireEvent.press(screen.getByLabelText('Mock confirm schedule'));

    expect(mockNavigate).toHaveBeenCalledWith('NannyList', {
      date: '2026-04-22',
      startTime: '09:00',
      endTime: '12:00',
    });
  });

  it('theme toggle button remains accessible', () => {
    renderScreen();

    expect(screen.getByLabelText('Toggle theme')).toBeTruthy();
  });
});
