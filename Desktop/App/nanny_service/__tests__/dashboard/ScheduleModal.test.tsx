/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ScheduleModal from '../../src/components/ScheduleModal';

jest.mock('@expo/vector-icons/MaterialCommunityIcons', () => {
  const MockReact = require('react');
  const { Text } = require('react-native');
  return ({ name }: { name: string }) => MockReact.createElement(Text, null, name);
});

jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  const MockReact = require('react');
  const Modal = ({ children, visible }: any) =>
    visible ? MockReact.createElement(MockReact.Fragment, null, children) : null;
  const Portal = ({ children }: any) => MockReact.createElement(MockReact.Fragment, null, children);
  Portal.Host = ({ children }: any) => MockReact.createElement(MockReact.Fragment, null, children);

  return {
    ...actual,
    Modal,
    Portal,
  };
});

jest.mock('@react-native-community/datetimepicker', () => {
  const MockReact = require('react');
  const { Pressable, Text } = require('react-native');

  const MockDateTimePicker = ({ onChange, testID, mode }: any) =>
    MockReact.createElement(
      Pressable,
      {
        testID: `${testID}-confirm`,
        onPress: () => {
          const next = new Date('2026-04-22T09:00:00');
          if (testID === 'date-picker') {
            next.setHours(0, 0, 0, 0);
          }
          if (testID === 'start-time-picker') {
            next.setHours(9, 0, 0, 0);
          }
          if (testID === 'end-time-picker') {
            next.setHours(10, 0, 0, 0);
          }
          onChange?.({}, next);
        },
      },
      MockReact.createElement(Text, null, `mock-picker-${mode}`),
    );

  return {
    __esModule: true,
    default: MockDateTimePicker,
  };
});

jest.mock('../../src/theme', () => {
  const actual = jest.requireActual('../../src/theme');
  const { lightTheme } = jest.requireActual('../../src/theme/themes');
  return {
    ...actual,
    useAppTheme: () => ({
      theme: lightTheme,
      isDark: false,
      toggleTheme: jest.fn(),
    }),
  };
});

const onDismissMock = jest.fn();
const onScheduleMock = jest.fn();

const renderModal = () =>
  render(
    <ScheduleModal
      visible
      onDismiss={onDismissMock}
      onSchedule={onScheduleMock}
      babyName="Mia"
    />,
  );

describe('ScheduleModal', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.setSystemTime(new Date('2026-04-20T09:00:00'));
  });

  it('renders summary and booking rule hints', () => {
    renderModal();

    expect(screen.getByText('Schedule Summary')).toBeTruthy();
    expect(screen.getByText(/Minimum booking: 3 hours/)).toBeTruthy();
    expect(screen.getByText(/Service hours: 8:00 - 20:00/)).toBeTruthy();
  });

  it('calls onSchedule with formatted date and time on valid search', () => {
    renderModal();

    fireEvent.press(screen.getByLabelText('Search for nannies'));

    expect(onScheduleMock).toHaveBeenCalledTimes(1);
    const [date, startTime, endTime] = onScheduleMock.mock.calls[0];
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(startTime).toMatch(/^\d{2}:\d{2}$/);
    expect(endTime).toMatch(/^\d{2}:\d{2}$/);
  });

  it('shows inline validation and disables search for invalid time range', () => {
    renderModal();

    fireEvent.press(screen.getByLabelText('Select to time'));
    fireEvent.press(screen.getByTestId('end-time-picker-confirm'));

    expect(screen.getByText(/End time must be between/)).toBeTruthy();
    const searchButton = screen.getByLabelText('Search for nannies');
    expect(searchButton.props.accessibilityState.disabled).toBe(true);
  });

  it('calls onDismiss when cancel is pressed', () => {
    renderModal();

    fireEvent.press(screen.getByLabelText('Cancel scheduling'));

    expect(onDismissMock).toHaveBeenCalledTimes(1);
  });
});
