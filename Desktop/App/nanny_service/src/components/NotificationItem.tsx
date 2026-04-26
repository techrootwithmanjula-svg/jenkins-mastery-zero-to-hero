import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '../theme';
import { spacing, borderRadius } from '../theme/tokens';
import { Notification, NotificationType } from '../models';

const ICON_MAP: Record<NotificationType, string> = {
  payout: 'credit-card-outline',
  topup: 'plus-circle-outline',
  alert: 'message-text-outline',
  received: 'clock-check-outline',
};

interface NotificationItemProps {
  notification: Notification;
  testID?: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, testID }) => {
  const { theme } = useAppTheme();

  const renderHighlightedText = (title: string, amount?: string) => {
    if (!amount) {
      return (
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
          {title}
        </Text>
      );
    }

    const idx = title.indexOf(amount);
    if (idx === -1) {
      return (
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
          {title}
        </Text>
      );
    }

    const before = title.substring(0, idx);
    const after = title.substring(idx + amount.length);

    return (
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
        {before}
        <Text style={{ color: theme.colors.secondary, fontWeight: '700' }}>{amount}</Text>
        {after}
      </Text>
    );
  };

  return (
    <>
      <View
        style={styles.row}
        accessible={true}
        accessibilityLabel={`${notification.title}. ${notification.timestamp}`}
        testID={testID}
      >
        <View
          style={[
            styles.iconBadge,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
          accessibilityElementsHidden={true}
        >
          <MaterialCommunityIcons
            name={ICON_MAP[notification.type] as keyof typeof MaterialCommunityIcons.glyphMap}
            size={20}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.textContainer}>
          {renderHighlightedText(notification.title, notification.amount)}
          <Text
            variant="bodySmall"
            style={[styles.timestamp, { color: theme.colors.outline }]}
          >
            {notification.timestamp}
          </Text>
        </View>
      </View>
      <Divider style={[styles.divider, { backgroundColor: theme.colors.surfaceVariant }]} />
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  timestamp: {
    marginTop: spacing.xs,
  },
  divider: {
    marginLeft: spacing.lg + 44 + spacing.md, // 84 — aligns with text start
  },
});

export default NotificationItem;
