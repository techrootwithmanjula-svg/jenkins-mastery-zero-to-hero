import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useAppTheme } from '../theme';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

/**
 * Reusable error message component with optional retry button.
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, style }) => {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.icon]}>⚠️</Text>
      <Text style={[styles.message, { color: theme.colors.error }]}>{message}</Text>
      {onRetry && (
        <Button mode="outlined" onPress={onRetry} style={styles.retryButton}>
          Retry
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
  },
});

export default ErrorMessage;
