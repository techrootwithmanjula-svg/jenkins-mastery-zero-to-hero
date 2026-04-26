// Jest setup file
// Add any global test configuration here

// Mock @react-native-community/datetimepicker
jest.mock('@react-native-community/datetimepicker', () => {
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  const React = require('react');
  return function MockDateTimePicker() {
    return React.createElement('View');
  };
});

// Suppress React warnings in test output
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
