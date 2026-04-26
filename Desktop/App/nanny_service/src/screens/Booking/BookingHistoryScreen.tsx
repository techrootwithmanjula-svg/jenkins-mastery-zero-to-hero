import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text, Chip, SegmentedButtons } from 'react-native-paper';
import { useAppTheme } from '../../theme';
import { spacing, borderRadius, shadows } from '../../theme/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchBookings } from '../../store/slices/bookingSlice';
import type { RootState } from '../../store';
import { LoadingSpinner, ErrorMessage, AppCard } from '../../components';
import { Booking } from '../../models';
import { formatCurrency, formatDate } from '../../utils/helpers';

/**
 * Booking history screen showing past and upcoming bookings.
 */
const BookingHistoryScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { bookings, isLoading, error } = useAppSelector((state: RootState) => state.booking);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const filteredBookings = bookings.filter((b: Booking) => {
    if (filter === 'upcoming') return b.status === 'confirmed' || b.status === 'pending';
    if (filter === 'past')
      return b.status === 'completed' || b.status === 'cancelled' || b.status === 'refunded';
    return true;
  });

  const getStatusColor = (status: string): { bg: string; text: string } => {
    switch (status) {
      case 'confirmed':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'pending':
        return { bg: '#FFF3E0', text: '#F57C00' };
      case 'completed':
        return { bg: theme.colors.primaryContainer, text: theme.colors.onPrimaryContainer };
      case 'cancelled':
        return { bg: '#FFEBEE', text: '#C62828' };
      case 'refunded':
        return { bg: '#F3E5F5', text: '#6A1B9A' };
      default:
        return { bg: theme.colors.surfaceVariant, text: theme.colors.onSurfaceVariant };
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading bookings..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => dispatch(fetchBookings())} />;

  const renderBooking = ({ item }: { item: Booking }) => {
    const statusColors = getStatusColor(item.status);
    return (
      <View style={[styles.bookingCard, { backgroundColor: theme.colors.surface }, shadows.sm]}>
        <View style={styles.bookingHeader}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {item.nannyName}
          </Text>
          <Chip
            style={{ backgroundColor: statusColors.bg }}
            textStyle={{ color: statusColors.text, fontSize: 11 }}
          >
            {item.status.toUpperCase()}
          </Chip>
        </View>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {formatDate(item.slot.date)} | {item.slot.startTime} – {item.slot.endTime}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {item.address}
        </Text>
        <Text variant="labelLarge" style={{ color: theme.colors.primary, marginTop: spacing.xs }}>
          {formatCurrency(item.amount)}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: 'all', label: 'All' },
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'past', label: 'Past' },
        ]}
        style={styles.segmentedButtons}
      />
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBooking}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>No bookings found.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  segmentedButtons: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  bookingCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.xs,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  empty: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
});

export default BookingHistoryScreen;
