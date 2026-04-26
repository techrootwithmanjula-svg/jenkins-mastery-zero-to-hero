/**
 * Environment configuration.
 * In production, use react-native-dotenv or expo-constants.
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://api.nannyservice.example.com/v1';

export const APP_CONFIG = {
  appName: 'Nanny Service',
  version: '1.0.0',
  minBookingHours: 3,
  bookingStartHour: 8,
  bookingEndHour: 20,
  otpLength: 6,
  otpResendCooldown: 30, // seconds
} as const;
