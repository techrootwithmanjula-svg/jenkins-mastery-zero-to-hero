import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as StoreProvider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import { ThemeProvider, useAppTheme } from './src/theme';
import { AppNavigator } from './src/navigation';

/**
 * Inner app wrapped with theme context (needs access to useAppTheme).
 */
const ThemedApp: React.FC = () => {
  const { theme, isDark } = useAppTheme();

  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </PaperProvider>
  );
};

/**
 * Root app component with all providers.
 */
export default function App() {
  return (
    <StoreProvider store={store}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </SafeAreaProvider>
    </StoreProvider>
  );
}
