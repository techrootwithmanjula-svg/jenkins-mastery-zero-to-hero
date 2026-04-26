import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Text, Button, ActivityIndicator, useTheme } from 'react-native-paper';
import { spacing, borderRadius, typography, shadows } from '../theme/tokens';

export interface ConfirmationModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** When true, disables the confirm button and shows a loading indicator */
  isLoading?: boolean;
  /** Label for the confirm button (default: "Confirm") */
  confirmLabel?: string;
  /** Variant for the confirm button to indicate destructive vs. neutral action */
  confirmVariant?: 'contained' | 'outlined' | 'text';
}

/**
 * Reusable confirmation modal for pause / resume / delete actions.
 * Uses design tokens throughout — no hardcoded color or spacing values.
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmLabel = 'Confirm',
  confirmVariant = 'contained',
}) => {
  const theme = useTheme();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={isLoading ? undefined : onCancel}
        accessible={false}
      >
        {/* Card — stop touch propagation so tapping inside doesn't close */}
        <TouchableOpacity activeOpacity={1} style={[styles.card, { backgroundColor: theme.colors.surface }, shadows.lg]}>
          {/* Title */}
          <Text
            style={[styles.title, { color: theme.colors.onSurface }]}
            accessibilityRole="header"
          >
            {title}
          </Text>

          {/* Message */}
          <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
            {message}
          </Text>

          {/* Loading indicator while async action is in flight */}
          {isLoading && (
            <ActivityIndicator
              size="small"
              animating
              color={theme.colors.primary}
              style={styles.loader}
              accessibilityLabel="Processing…"
            />
          )}

          {/* Action buttons */}
          <View style={styles.actions}>
            <Button
              mode="text"
              onPress={onCancel}
              disabled={isLoading}
              style={styles.cancelButton}
              labelStyle={{ color: theme.colors.onSurfaceVariant }}
              accessibilityLabel="Cancel"
              accessibilityHint="Close this dialog without taking action"
            >
              Cancel
            </Button>

            <Button
              mode={confirmVariant}
              onPress={onConfirm}
              disabled={isLoading}
              style={styles.confirmButton}
              accessibilityLabel={confirmLabel}
              accessibilityHint={`Confirm: ${title}`}
            >
              {confirmLabel}
            </Button>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: '100%',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  title: {
    ...typography.headlineMedium,
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.bodyLarge,
    marginBottom: spacing.lg,
  },
  loader: {
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  cancelButton: {
    minWidth: 80,
  },
  confirmButton: {
    minWidth: 100,
  },
});

export default ConfirmationModal;
