import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { MD3Theme } from 'react-native-paper';
import { lightTheme, darkTheme, ThemeMode } from './themes';

interface ThemeContextType {
  theme: MD3Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  mode: 'light',
  toggleTheme: () => {},
  setMode: () => {},
  isDark: false,
});

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme provider wrapping the app with multi-theme support.
 * Defaults to system color scheme, can be toggled manually.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemScheme === 'dark' ? 'dark' : 'light');

  const toggleTheme = () => setMode((m) => (m === 'light' ? 'dark' : 'light'));

  const value = useMemo(
    () => ({
      theme: mode === 'dark' ? darkTheme : lightTheme,
      mode,
      toggleTheme,
      setMode,
      isDark: mode === 'dark',
    }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useAppTheme = () => useContext(ThemeContext);
