import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';
import { palette } from './colors';

/**
 * Light theme configuration for React Native Paper.
 */
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.primary600,
    primaryContainer: palette.primary100,
    secondary: palette.secondary600,
    secondaryContainer: palette.secondary100,
    background: palette.grey50,
    surface: palette.white,
    surfaceVariant: palette.grey100,
    error: palette.error,
    onPrimary: palette.white,
    onPrimaryContainer: palette.primary900,
    onSecondary: palette.white,
    onSecondaryContainer: palette.secondary900,
    onBackground: palette.grey900,
    onSurface: palette.grey900,
    onSurfaceVariant: palette.grey700,
    onError: palette.white,
    outline: palette.grey400,
    outlineVariant: palette.grey200,
    inverseSurface: palette.grey800,
    inverseOnSurface: palette.grey100,
    inversePrimary: palette.primary200,
    elevation: {
      level0: 'transparent',
      level1: palette.grey50,
      level2: palette.grey100,
      level3: palette.grey200,
      level4: palette.grey200,
      level5: palette.grey300,
    },
    shadow: palette.black,
    scrim: palette.black,
    surfaceDisabled: palette.grey200,
    onSurfaceDisabled: palette.grey500,
    backdrop: palette.overlay,
  },
};

/**
 * Dark theme configuration for React Native Paper.
 */
export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: palette.primary300,
    primaryContainer: palette.primary800,
    secondary: palette.secondary300,
    secondaryContainer: palette.secondary800,
    background: palette.grey900,
    surface: palette.grey800,
    surfaceVariant: palette.grey700,
    error: '#EF9A9A',
    onPrimary: palette.primary900,
    onPrimaryContainer: palette.primary100,
    onSecondary: palette.secondary900,
    onSecondaryContainer: palette.secondary100,
    onBackground: palette.grey100,
    onSurface: palette.grey100,
    onSurfaceVariant: palette.grey300,
    onError: palette.grey900,
    outline: palette.grey500,
    outlineVariant: palette.grey600,
    inverseSurface: palette.grey100,
    inverseOnSurface: palette.grey800,
    inversePrimary: palette.primary700,
    elevation: {
      level0: 'transparent',
      level1: '#1E1E1E',
      level2: '#232323',
      level3: '#282828',
      level4: '#2D2D2D',
      level5: '#323232',
    },
    shadow: palette.black,
    scrim: palette.black,
    surfaceDisabled: 'rgba(255,255,255,0.12)',
    onSurfaceDisabled: 'rgba(255,255,255,0.38)',
    backdrop: palette.overlay,
  },
};

export type ThemeMode = 'light' | 'dark';
