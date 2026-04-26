import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Card as PaperCard, Text } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { shadows, borderRadius, spacing } from '../theme/tokens';

interface AppCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevated?: boolean;
}

/**
 * Reusable card component following the design system.
 */
const AppCard: React.FC<AppCardProps> = ({
  title,
  subtitle,
  children,
  onPress,
  style,
  elevated = true,
}) => {
  const { theme } = useAppTheme();

  return (
    <PaperCard
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface },
        elevated && shadows.md,
        style,
      ]}
      onPress={onPress}
    >
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && (
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
      {children && <PaperCard.Content style={styles.content}>{children}</PaperCard.Content>}
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.xs,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  content: {
    paddingTop: spacing.xs,
  },
});

export default AppCard;
