/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { PaperProvider } from 'react-native-paper';
import ProfileScreen from '../../src/screens/Profile/ProfileScreen';
import profileReducer from '../../src/store/slices/profileSlice';
import authReducer from '../../src/store/slices/authSlice';
import bookingReducer from '../../src/store/slices/bookingSlice';
import nannyReducer from '../../src/store/slices/nannySlice';
import subscriptionReducer from '../../src/store/slices/subscriptionSlice';
import adminReducer from '../../src/store/slices/adminSlice';
import { lightTheme } from '../../src/theme/themes';
import { ThemeProvider } from '../../src/theme/ThemeProvider';

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

// Mock Paper Portal to avoid native view errors in test renderer
jest.mock('react-native-paper', () => {
  const actual = jest.requireActual('react-native-paper');
  const MockR = require('react');
  const MockPortal = ({ children }: any) =>
    MockR.createElement(MockR.Fragment, null, children);
  MockPortal.Host = ({ children }: any) =>
    MockR.createElement(MockR.Fragment, null, children);
  return { ...actual, Portal: MockPortal };
});

// Mock React Native Animated native driver to avoid "Unable to locate
// attached view in the native tree" from AnimatedProps._connectAnimatedView2
jest.mock('react-native/Libraries/ReactNative/RendererProxy', () => {
  const actual = jest.requireActual('react-native/Libraries/ReactNative/RendererProxy');
  return { ...actual, findNodeHandle: jest.fn(() => 1) };
});

// Mock the profile API
jest.mock('../../src/api/profile', () => ({
  getProfile: jest.fn().mockResolvedValue({
    id: 'u1',
    name: 'Test User',
    email: 'test@test.com',
    mobile: '9876543210',
    babyDetails: [
      { id: 'baby-1', name: 'Baby One', age: 2, gender: 'female', notes: 'Test notes' },
    ],
  }),
  updateProfile: jest.fn().mockResolvedValue({}),
  addBabyDetail: jest.fn().mockResolvedValue({}),
  deleteBabyDetail: jest.fn().mockResolvedValue(undefined),
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      booking: bookingReducer,
      nanny: nannyReducer,
      profile: profileReducer,
      subscription: subscriptionReducer,
      admin: adminReducer,
    },
  });

const renderScreen = () => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <PaperProvider theme={lightTheme}>
        <ThemeProvider>
          <ProfileScreen />
        </ThemeProvider>
      </PaperProvider>
    </Provider>,
  );
};

describe('ProfileScreen Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Test 1: Renders all 8 profile fields as label-value rows in view mode', async () => {
    renderScreen();
    await waitFor(() => {
      expect(screen.getByLabelText('Name: Test User')).toBeTruthy();
    });
    // All 8 fields rendered as ProfileFieldRow with accessibility labels
    expect(screen.getByLabelText('Name: Test User')).toBeTruthy();
    expect(screen.getByLabelText('Mobile Number: 9876543210')).toBeTruthy();
    expect(screen.getByLabelText('Age: not set')).toBeTruthy();
    expect(screen.getByLabelText('Address: not set')).toBeTruthy();
    expect(screen.getByLabelText('Emergency Contact: not set')).toBeTruthy();
    expect(screen.getByLabelText('Email: test@test.com')).toBeTruthy();
    expect(screen.getByLabelText('Gender: not set')).toBeTruthy();
    expect(screen.getByLabelText('Father Name: not set')).toBeTruthy();
    // No TextInput elements should be present in view mode (no "Your name" etc.)
    expect(screen.queryByLabelText('Your name')).toBeNull();
    expect(screen.queryByLabelText('Your age')).toBeNull();
    // Edit Profile button visible in footer
    expect(screen.getByText('Edit Profile')).toBeTruthy();
  });

  it('Test 2: Tap Edit Profile toggles to Save mode with TextInputs and camera icon', async () => {
    renderScreen();
    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeTruthy();
    });
    fireEvent.press(screen.getByText('Edit Profile'));
    // Verify TextInputs appear in edit mode
    expect(screen.getByText('Save')).toBeTruthy();
    expect(screen.getByLabelText('Your name')).toBeTruthy();
    expect(screen.getByLabelText('Your age')).toBeTruthy();
    expect(screen.getByLabelText('Your address')).toBeTruthy();
    expect(screen.getByLabelText('Your email address')).toBeTruthy();
    // Camera icon visible in edit mode
    expect(screen.getByLabelText('Change profile photo')).toBeTruthy();
    // Add Baby button visible
    expect(screen.getByText('+ Add Baby')).toBeTruthy();
  });

  it('Test 3: Tap Save returns to label-value view mode', async () => {
    renderScreen();
    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeTruthy();
    });
    fireEvent.press(screen.getByText('Edit Profile'));
    expect(screen.getByText('Save')).toBeTruthy();
    // Verify TextInputs are present
    expect(screen.getByLabelText('Your name')).toBeTruthy();
    fireEvent.press(screen.getByText('Save'));
    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeTruthy();
    });
    // TextInputs should disappear, label-value rows return
    expect(screen.queryByLabelText('Your name')).toBeNull();
    expect(screen.getByLabelText('Name: Test User')).toBeTruthy();
  });

  it('Test 4: Add Baby creates a new baby card with 5 fields', async () => {
    renderScreen();
    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeTruthy();
    });
    fireEvent.press(screen.getByText('Edit Profile'));
    fireEvent.press(screen.getByText('+ Add Baby'));
    expect(screen.getAllByLabelText('Baby name').length).toBe(2);
    expect(screen.getAllByLabelText('Baby age').length).toBe(2);
    expect(screen.getAllByLabelText('Baby gender selection').length).toBe(2);
    expect(screen.getAllByLabelText('Baby prior disease').length).toBe(2);
    expect(screen.getAllByLabelText('Baby notes').length).toBe(2);
  });

  it('Test 5: Delete icon removes a baby card', async () => {
    renderScreen();
    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeTruthy();
    });
    fireEvent.press(screen.getByText('Edit Profile'));
    expect(screen.getAllByLabelText('Baby name').length).toBe(1);
    const removeButton = screen.getByLabelText('Remove Baby One');
    fireEvent.press(removeButton);
    await waitFor(() => {
      expect(screen.queryAllByLabelText('Baby name').length).toBe(0);
    });
  });

  it('Test 6: Gender dropdown shows Male, Female, Other options', async () => {
    renderScreen();
    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeTruthy();
    });
    fireEvent.press(screen.getByText('Edit Profile'));
    const genderSelectIcon = screen.getByLabelText('Select gender');
    fireEvent.press(genderSelectIcon);
    await waitFor(() => {
      expect(screen.getByText('Male')).toBeTruthy();
      expect(screen.getByText('Female')).toBeTruthy();
      expect(screen.getByText('Other')).toBeTruthy();
    });
  });

  it('Test 7: View mode hides camera icon', async () => {
    renderScreen();
    await waitFor(() => {
      expect(screen.getByLabelText('Name: Test User')).toBeTruthy();
    });
    // Camera icon should NOT be in the tree in view mode
    expect(screen.queryByLabelText('Change profile photo')).toBeNull();
  });

  it('Test 8: Sticky footer button is always visible', async () => {
    renderScreen();
    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeTruthy();
    });
    // Button is rendered (outside ScrollView as sticky footer)
    expect(screen.getByLabelText('Edit profile')).toBeTruthy();
  });
});
