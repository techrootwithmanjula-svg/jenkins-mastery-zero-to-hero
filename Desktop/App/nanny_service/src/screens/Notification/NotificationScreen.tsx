import React, { useEffect } from 'react';
import { StyleSheet, View, SectionList } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '../../theme';
import { spacing } from '../../theme/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchNotifications,
  selectGroupedNotifications,
  selectNotificationLoading,
  selectNotificationError,
} from '../../store/slices/notificationSlice';
import { LoadingSpinner, ErrorMessage, NotificationItem } from '../../components';
import { Notification, NotificationSection } from '../../models';

const NotificationScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();

  const sections = useAppSelector(selectGroupedNotifications);
  const isLoading = useAppSelector(selectNotificationLoading);
  const error = useAppSelector(selectNotificationError);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // ── Loading state ──────────────────────────────────────────────
  if (isLoading) {
    return <LoadingSpinner message="Loading notifications…" />;
  }

  // ── Error state ────────────────────────────────────────────────
  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ErrorMessage
          message={error}
          onRetry={() => dispatch(fetchNotifications())}
        />
      </View>
    );
  }

  // ── Empty state ────────────────────────────────────────────────
  if (sections.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <MaterialCommunityIcons
          name="bell-outline"
          size={64}
          color={theme.colors.surfaceVariant}
        />
        <Text
          variant="titleMedium"
          style={[styles.emptyTitle, { color: theme.colors.onSurfaceVariant }]}
        >
          No notifications yet
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.outline }}
        >
          You'll see your notifications here
        </Text>
      </View>
    );
  }

  // ── Notification list ──────────────────────────────────────────
  return (
    <SectionList<Notification, NotificationSection>
      sections={sections}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NotificationItem
          notification={item}
          testID={`notification-${item.id}`}
        />
      )}
      renderSectionHeader={({ section }) => (
        <Text
          variant="labelLarge"
          style={[
            styles.sectionHeader,
            { color: theme.colors.primary },
          ]}
          accessibilityRole="header"
        >
          {section.title}
        </Text>
      )}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={styles.listContent}
      style={{ backgroundColor: theme.colors.background }}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyTitle: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  sectionHeader: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  listContent: {
    flexGrow: 1,
  },
});

export default NotificationScreen;
