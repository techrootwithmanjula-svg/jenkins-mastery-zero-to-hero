/**
 * Centralized color tokens for multi-theme support.
 * All color values are defined here and consumed by theme configs.
 */

export const palette = {
  // Primary — Purple/Violet
  primary50: '#F3EEFF',
  primary100: '#E1D5FF',
  primary200: '#C9ADFF',
  primary300: '#B08DFF',
  primary400: '#9B7FFF',
  primary500: '#8B6FEF',
  primary600: '#7C5CFC',
  primary700: '#6A4DE0',
  primary800: '#5A3EC7',
  primary900: '#3D2A8A',

  // Secondary — Red/Coral (favorites, hearts)
  secondary50: '#FFF5F5',
  secondary100: '#FFE0E0',
  secondary200: '#FFB3B3',
  secondary300: '#FF8080',
  secondary400: '#FF5252',
  secondary500: '#E53935',
  secondary600: '#D32F2F',
  secondary700: '#C62828',
  secondary800: '#B71C1C',
  secondary900: '#880E0E',

  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  grey50: '#FAFAFA',
  grey100: '#F5F5F5',
  grey200: '#EEEEEE',
  grey300: '#E0E0E0',
  grey400: '#BDBDBD',
  grey500: '#9E9E9E',
  grey600: '#757575',
  grey700: '#616161',
  grey800: '#424242',
  grey900: '#212121',

  // Semantic
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  favorite: '#FF5252',

  // Transparent
  transparent: 'transparent',
  overlay: 'rgba(0,0,0,0.5)',
} as const;

export type PaletteKey = keyof typeof palette;
