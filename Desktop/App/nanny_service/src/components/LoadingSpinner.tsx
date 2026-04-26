import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useAppTheme } from '../theme';

interface LoadingSpinnerProps {
  message?: string;
  style?: ViewStyle;
}

/**
 * Reusable loading spinner component.
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, style }) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message && (
        <Text style={[styles.message, { color: theme.colors.onSurface }]}>{message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
  },
});

export default LoadingSpinner;
