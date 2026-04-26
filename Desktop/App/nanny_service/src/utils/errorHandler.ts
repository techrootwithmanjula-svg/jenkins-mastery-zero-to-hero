import { Alert, Platform } from 'react-native';

/**
 * Show user-friendly error message.
 */
export const showError = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-console
    console.error(`${title}: ${message}`);
    return;
  }
  Alert.alert(title, message, [{ text: 'OK' }]);
};

/**
 * Show success message.
 */
export const showSuccess = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-console
    console.log(`${title}: ${message}`);
    return;
  }
  Alert.alert(title, message, [{ text: 'OK' }]);
};

/**
 * Safely parse API error.
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred. Please try again.';
};
