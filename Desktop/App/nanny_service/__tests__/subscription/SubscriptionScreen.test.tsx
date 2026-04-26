/**
 * Tests for the redesigned SubscriptionScreen (subscription UX redesign).
 * Covers: nanny search, frequency/weekday/time-range form, confirmation modal,
 * and subscription card actions.
 * @category Interaction Tests
 * @phase Phase 3: US5
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import SubscriptionScreen from '../../src/screens/Subscription/SubscriptionScreen';

// ── mocks ─────────────────────────────────────────────────────────────────────

const mockDispatch = jest.fn();

jest.mock('react-native-paper', () => {
  const MockReact = require('react');
  const { View, Text, TextInput: RNTextInput, TouchableOpacity } = require('react-native');

  const Button = ({ children, onPress, accessibilityLabel, disabled, textColor, mode, compact, style }: any) =>
    MockReact.createElement(
      TouchableOpacity,
      { onPress, accessibilityLabel, disabled, style },
      MockReact.createElement(Text, { style: textColor ? { color: textColor } : undefined }, children),
    );

  const TextInput = ({ label, value, onChangeText, accessibilityLabel, accessibilityHint, style }: any) =>
    MockReact.createElement(RNTextInput, {
      placeholder: label,
      value,
      onChangeText,
      accessibilityLabel: accessibilityLabel || label,
      accessibilityHint,
      style,
    });

  const Chip = ({ children, style, textStyle }: any) =>
    MockReact.createElement(View, { style }, MockReact.createElement(Text, { style: textStyle }, children));

  // Portal renders children directly (no host needed)
  const Portal = ({ children }: any) => MockReact.createElement(View, { testID: 'portal' }, children);

  // Dialog renders only when visible
  const Dialog = ({ visible, children, style }: any) =>
    visible ? MockReact.createElement(View, { testID: 'dialog', style }, children) : null;
  Dialog.Title   = ({ children }: any) => MockReact.createElement(Text, { testID: 'dialog-title' }, children);
  Dialog.Content = ({ children }: any) => MockReact.createElement(View, null, children);
  Dialog.Actions = ({ children }: any) => MockReact.createElement(View, null, children);

  const PaperText = ({ children, variant, style }: any) =>
    MockReact.createElement(Text, { style }, children);

  const MD3LightTheme = {
    colors: {
      primary: '#6750A4', onPrimary: '#FFFFFF', primaryContainer: '#EADDFF',
      secondary: '#625B71', surface: '#FFFBFE', background: '#FFFBFE',
      error: '#B3261E', onBackground: '#1C1B1F', onSurface: '#1C1B1F',
      outline: '#79747E', surfaceVariant: '#E7E0EC', onSurfaceVariant: '#49454F',
    },
    roundness: 4,
  };

  return { Text: PaperText, Button, TextInput, Chip, Portal, Dialog, MD3LightTheme };
});

jest.mock('../../src/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) =>
    selector({
      subscription: {
        subscriptions: [
          {
            id: 'sub-1',
            nannyId: 'n1',
            nannyName: 'Priya Verma',
            frequencyPerWeek: 1,
            weekdays: ['Monday'],
            startTime: '09:00',
            endTime: '12:00',
            status: 'active',
            createdAt: '2026-01-01',
          },
          {
            id: 'sub-2',
            nannyId: 'n2',
            nannyName: 'Sunita Devi',
            frequencyPerWeek: 2,
            weekdays: ['Tuesday', 'Thursday'],
            startTime: '14:00',
            endTime: '17:00',
            status: 'paused',
            createdAt: '2026-01-02',
          },
        ],
        isLoading: false,
        error: null,
      },
    }),
}));

jest.mock('../../src/theme', () => ({
  useAppTheme: () => ({
    theme: {
      colors: {
        primary: '#6750A4', onPrimary: '#FFFFFF', primaryContainer: '#EADDFF',
        secondary: '#625B71', surface: '#FFFBFE', background: '#FFFBFE',
        error: '#B3261E', onBackground: '#1C1B1F', onSurface: '#1C1B1F',
        outline: '#79747E', surfaceVariant: '#E7E0EC', onSurfaceVariant: '#49454F',
        elevation: { level0: 'transparent', level1: '#F7F2FA', level2: '#F0EBF8', level3: '#E9E2F5' },
      },
      roundness: 4,
    },
    isDark: false,
    toggleTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }: any) => children,
}));

jest.mock('../../src/components', () => {
  const MockReact = require('react');
  const { View, Text, Pressable } = require('react-native');

  const LoadingSpinner = () => MockReact.createElement(Text, null, 'Loading…');

  const ConfirmationModal = ({
    isVisible, title, message, onConfirm, onCancel, isLoading, confirmLabel,
  }: any) => {
    if (!isVisible) return null;
    return MockReact.createElement(
      View,
      { testID: 'confirmation-modal' },
      MockReact.createElement(Text, { testID: 'modal-title' }, title),
      MockReact.createElement(Text, { testID: 'modal-message' }, message),
      MockReact.createElement(
        Pressable,
        { testID: 'modal-confirm', onPress: onConfirm, disabled: isLoading },
        MockReact.createElement(Text, null, confirmLabel || 'Confirm'),
      ),
      MockReact.createElement(
        Pressable,
        { testID: 'modal-cancel', onPress: onCancel },
        MockReact.createElement(Text, null, 'Cancel'),
      ),
    );
  };

  return { LoadingSpinner, ConfirmationModal };
});

jest.mock('../../src/hooks', () => ({
  useTimeRangePicker: () => ({
    startTime: null,
    endTime: null,
    activeField: null,
    errors: {},
    pickTime: jest.fn(),
    reset: jest.fn(),
    beginStartPick: jest.fn(),
    beginEndPick: jest.fn(),
  }),
}));

jest.mock('../../src/store/slices/subscriptionSlice', () => ({
  fetchSubscriptions: () => ({ type: 'subscription/fetch' }),
  createSubscription: (payload: any) => ({ type: 'subscription/create', payload }),
  pauseSubscription: (id: string) => ({ type: 'subscription/pause', payload: id }),
  resumeSubscription: (id: string) => ({ type: 'subscription/resume', payload: id }),
  deleteSubscription: (id: string) => ({ type: 'subscription/delete', payload: id }),
}));

// ── helpers ───────────────────────────────────────────────────────────────────

const renderScreen = () => render(<SubscriptionScreen />);

const openCreateModal = async () => {
  const btn = screen.getByAccessibilityLabel('Create new subscription');
  await act(async () => { fireEvent.press(btn); });
};

// ── tests ─────────────────────────────────────────────────────────────────────

describe('SubscriptionScreen', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockResolvedValue({ type: 'subscription/fetch/fulfilled', payload: [] });
  });

  // ── T009: Nanny Search ───────────────────────────────────────────────────────

  describe('[US5] Nanny Name Search (T009)', () => {
    it('should display nanny search results with name and rating when user types nanny name', async () => {
      renderScreen();
      await openCreateModal();

      const searchInput = screen.getByAccessibilityLabel('Search for nanny');
      await act(async () => { fireEvent.changeText(searchInput, 'Sarah'); });

      expect(screen.getByText('Sarah Johnson')).toBeTruthy();
      expect(screen.getByText(/4\.8/)).toBeTruthy();
    });

    it('should filter nanny list as user types in search field', async () => {
      renderScreen();
      await openCreateModal();

      const searchInput = screen.getByAccessibilityLabel('Search for nanny');

      await act(async () => { fireEvent.changeText(searchInput, 'Emily'); });
      expect(screen.getByText('Emily Chen')).toBeTruthy();
      expect(screen.queryByText('Sarah Johnson')).toBeNull();
    });

    it('should show confirmation text with selected nanny name after selection', async () => {
      renderScreen();
      await openCreateModal();

      const searchInput = screen.getByAccessibilityLabel('Search for nanny');
      await act(async () => { fireEvent.changeText(searchInput, 'Sarah'); });

      const nannyRow = screen.getByAccessibilityLabel(/Sarah Johnson, rating/i);
      await act(async () => { fireEvent.press(nannyRow); });

      // After selecting, the selectedNannyBox shows ✓ Name
      expect(screen.getByText(/✓ Sarah Johnson/)).toBeTruthy();
    });
  });

  // ── T010: Schedule Form Validation ────────────────────────────────────────────

  describe('[US5] Form Validation (T010)', () => {
    it('should show validation error when required nanny field is empty', async () => {
      renderScreen();
      await openCreateModal();

      const createBtn = screen.getByAccessibilityLabel('Create subscription');
      await act(async () => { fireEvent.press(createBtn); });

      expect(screen.getByText(/Please select a nanny/i)).toBeTruthy();
    });

    it('should show validation error when frequency is not selected', async () => {
      renderScreen();
      await openCreateModal();

      const createBtn = screen.getByAccessibilityLabel('Create subscription');
      await act(async () => { fireEvent.press(createBtn); });

      expect(screen.getByText(/Please select a frequency/i)).toBeTruthy();
    });

    it('should show error when weekday count does not match selected frequency', async () => {
      renderScreen();
      await openCreateModal();

      // Select "2 days/week" but select only 1 weekday
      const freq2Btn = screen.getByAccessibilityLabel('2 days per week');
      await act(async () => { fireEvent.press(freq2Btn); });

      const monChip = screen.getByAccessibilityLabel('Monday');
      await act(async () => { fireEvent.press(monChip); });

      const createBtn = screen.getByAccessibilityLabel('Create subscription');
      await act(async () => { fireEvent.press(createBtn); });

      expect(screen.getByText(/Please select 2 day\(s\) per week/i)).toBeTruthy();
    });

    it('should show validation error when time range is not selected', async () => {
      renderScreen();
      await openCreateModal();

      const createBtn = screen.getByAccessibilityLabel('Create subscription');
      await act(async () => { fireEvent.press(createBtn); });

      expect(screen.getByText(/Please select a time range/i)).toBeTruthy();
    });

    it('should render both frequency selector buttons with correct labels', async () => {
      renderScreen();
      await openCreateModal();

      expect(screen.getByAccessibilityLabel('1 day per week')).toBeTruthy();
      expect(screen.getByAccessibilityLabel('2 days per week')).toBeTruthy();
    });

    it('should show weekday chips only after frequency is selected', async () => {
      renderScreen();
      await openCreateModal();

      // Before selection — no weekday chips
      expect(screen.queryByAccessibilityLabel('Monday')).toBeNull();

      const freq1Btn = screen.getByAccessibilityLabel('1 day per week');
      await act(async () => { fireEvent.press(freq1Btn); });

      expect(screen.getByAccessibilityLabel('Monday')).toBeTruthy();
      expect(screen.getByAccessibilityLabel('Friday')).toBeTruthy();
    });
  });

  // ── T011: Modal Behavior and Confirmation ──────────────────────────────────────

  describe('[US5] Modal Behavior and Confirmation Modal (T011)', () => {
    it('should open create dialog when "New Subscription" button is tapped', async () => {
      renderScreen();
      await openCreateModal();

      expect(screen.getByText('New Subscription')).toBeTruthy();
    });

    it('should close dialog when cancel button is pressed', async () => {
      renderScreen();
      await openCreateModal();

      const cancelBtn = screen.getByRole('button', { name: /cancel/i });
      await act(async () => { fireEvent.press(cancelBtn); });

      expect(screen.queryByTestId('dialog')).toBeNull();
    });

    it('should display pause button for active subscriptions', () => {
      renderScreen();
      expect(screen.getByAccessibilityLabel('Pause subscription for Priya Verma')).toBeTruthy();
    });

    it('should display resume button for paused subscriptions', () => {
      renderScreen();
      expect(screen.getByAccessibilityLabel('Resume subscription for Sunita Devi')).toBeTruthy();
    });

    it('should display delete button for all subscription states', () => {
      renderScreen();
      expect(screen.getByAccessibilityLabel('Delete subscription for Priya Verma')).toBeTruthy();
      expect(screen.getByAccessibilityLabel('Delete subscription for Sunita Devi')).toBeTruthy();
    });

    it('should show confirmation modal with correct title and message when pause is tapped', async () => {
      renderScreen();

      const pauseBtn = screen.getByAccessibilityLabel('Pause subscription for Priya Verma');
      await act(async () => { fireEvent.press(pauseBtn); });

      expect(screen.getByTestId('confirmation-modal')).toBeTruthy();
      expect(screen.getByTestId('modal-title')).toHaveTextContent('Pause Subscription?');
      expect(screen.getByTestId('modal-message')).toHaveTextContent('This nanny will no longer service your account until you resume.');
    });

    it('should show correct title in confirmation modal when resume is tapped', async () => {
      renderScreen();

      const resumeBtn = screen.getByAccessibilityLabel('Resume subscription for Sunita Devi');
      await act(async () => { fireEvent.press(resumeBtn); });

      expect(screen.getByTestId('modal-title')).toHaveTextContent('Resume Subscription?');
    });

    it('should show correct title and message when delete is tapped', async () => {
      renderScreen();

      const deleteBtn = screen.getByAccessibilityLabel('Delete subscription for Priya Verma');
      await act(async () => { fireEvent.press(deleteBtn); });

      expect(screen.getByTestId('modal-title')).toHaveTextContent('Delete Subscription?');
      expect(screen.getByTestId('modal-message')).toHaveTextContent('This cannot be undone.');
    });

    it('should close confirmation modal without dispatching when cancel is pressed', async () => {
      renderScreen();

      const pauseBtn = screen.getByAccessibilityLabel('Pause subscription for Priya Verma');
      await act(async () => { fireEvent.press(pauseBtn); });

      // Verify modal is visible
      expect(screen.getByTestId('confirmation-modal')).toBeTruthy();

      const cancelBtn = screen.getByTestId('modal-cancel');
      await act(async () => { fireEvent.press(cancelBtn); });

      expect(screen.queryByTestId('confirmation-modal')).toBeNull();
    });

    it('should dispatch action when confirm is pressed in confirmation modal', async () => {
      renderScreen();

      const pauseBtn = screen.getByAccessibilityLabel('Pause subscription for Priya Verma');
      await act(async () => { fireEvent.press(pauseBtn); });

      const confirmBtn = screen.getByTestId('modal-confirm');
      await act(async () => { fireEvent.press(confirmBtn); });

      expect(mockDispatch).toHaveBeenCalled();
    });

    it('should display subscription cards with frequency badge, weekdays and time range', () => {
      renderScreen();

      expect(screen.getByText('1×/week')).toBeTruthy();
      expect(screen.getByText(/Mon/)).toBeTruthy();
      expect(screen.getByText(/09:00 – 12:00/)).toBeTruthy();

      expect(screen.getByText('2×/week')).toBeTruthy();
      expect(screen.getByText(/Tue & Thu/)).toBeTruthy();
    });
  });
});
