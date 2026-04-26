import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList, SectionList } from 'react-native';
import { Text, Button, Chip, Divider } from 'react-native-paper';
import { useAppTheme } from '../../theme';
import { spacing, borderRadius, shadows } from '../../theme/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import {
  fetchAllBookings,
  fetchAllNannies,
  refundBooking,
  setNannyOffline,
  setNannyOnline,
} from '../../store/slices/adminSlice';
import { LoadingSpinner, ErrorMessage } from '../../components';
import { Booking, Nanny } from '../../models';
import { formatCurrency, formatDate } from '../../utils/helpers';

/**
 * Admin Dashboard screen: view bookings, refund users, manage nannies.
 */
const AdminDashboardScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { bookings, nannies, isLoading, error } = useAppSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchAllBookings());
    dispatch(fetchAllNannies());
  }, [dispatch]);

  if (isLoading && bookings.length === 0) return <LoadingSpinner message="Loading admin data..." />;
  if (error)
    return (
      <ErrorMessage
        message={error}
        onRetry={() => {
          dispatch(fetchAllBookings());
          dispatch(fetchAllNannies());
        }}
      />
    );

  const renderBooking = ({ item }: { item: Booking }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }, shadows.sm]}>
      <View style={styles.cardHeader}>
        <View>
          <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
            {item.nannyName}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            User: {item.userId} | {formatDate(item.slot.date)}
          </Text>
        </View>
        <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
          {formatCurrency(item.amount)}
        </Text>
      </View>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
        Status: {item.status}
      </Text>
      {(item.status === 'confirmed' || item.status === 'completed') && (
        <Button
          mode="outlined"
          compact
          onPress={() => dispatch(refundBooking(item.id))}
          style={styles.actionButton}
          textColor={theme.colors.error}
        >
          Refund
        </Button>
      )}
    </View>
  );

  const renderNanny = ({ item }: { item: Nanny }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }, shadows.sm]}>
      <View style={styles.cardHeader}>
        <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
          {item.name}
        </Text>
        <Chip
          style={{ backgroundColor: item.isOnline ? '#E8F5E9' : '#FFEBEE' }}
          textStyle={{ color: item.isOnline ? '#2E7D32' : '#C62828', fontSize: 10 }}
        >
          {item.isOnline ? 'Online' : 'Offline'}
        </Chip>
      </View>
      <Button
        mode="outlined"
        compact
        onPress={() =>
          item.isOnline ? dispatch(setNannyOffline(item.id)) : dispatch(setNannyOnline(item.id))
        }
        style={styles.actionButton}
      >
        {item.isOnline ? 'Make Offline' : 'Make Online'}
      </Button>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <>
            <Text
              variant="headlineMedium"
              style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
            >
              Admin Dashboard
            </Text>

            <Text
              variant="titleMedium"
              style={[styles.subTitle, { color: theme.colors.onBackground }]}
            >
              Bookings ({bookings.length})
            </Text>
            {bookings.map((b: Booking) => (
              <View key={b.id}>{renderBooking({ item: b })}</View>
            ))}

            <Divider style={styles.divider} />

            <Text
              variant="titleMedium"
              style={[styles.subTitle, { color: theme.colors.onBackground }]}
            >
              Nannies ({nannies.length})
            </Text>
            {nannies.map((n: Nanny) => (
              <View key={n.id}>{renderNanny({ item: n })}</View>
            ))}
          </>
        }
        contentContainerStyle={styles.content}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  subTitle: {
    marginBottom: spacing.sm,
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  actionButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: spacing.lg,
  },
});

export default AdminDashboardScreen;
