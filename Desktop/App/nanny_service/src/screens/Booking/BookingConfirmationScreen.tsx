import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button, Divider, Chip } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../../theme';
import { spacing, borderRadius, shadows } from '../../theme/tokens';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { DashboardStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<DashboardStackParamList, 'BookingConfirmation'>;

/**
 * Booking confirmation screen shown after successful payment.
 */
const BookingConfirmationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { booking } = route.params;
  const { theme } = useAppTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Success Icon */}
      <View style={styles.successIcon}>
        <Text style={{ fontSize: 72 }}>✅</Text>
      </View>

      <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
        Booking Confirmed!
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
      >
        Your nanny has been booked successfully.
      </Text>

      {/* Booking Details */}
      <View style={[styles.card, { backgroundColor: theme.colors.surface }, shadows.sm]}>
        <View style={styles.statusRow}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            Request
          </Text>
          <Chip
            style={{ backgroundColor: '#FFF3E0' }}
            textStyle={{ color: '#F57C00', fontSize: 11 }}
          >
            {booking.status.toUpperCase()}
          </Chip>
        </View>
        <DetailRow label="Booking ID" value={booking.id} theme={theme} />
        <DetailRow label="Nanny" value={booking.nannyName} theme={theme} />
        <DetailRow label="Date" value={formatDate(booking.slot.date)} theme={theme} />
        <DetailRow
          label="Time"
          value={`${booking.slot.startTime} – ${booking.slot.endTime}`}
          theme={theme}
        />
        <DetailRow label="Address" value={booking.address} theme={theme} />
        <Divider style={styles.divider} />
        <DetailRow label="Amount" value={formatCurrency(booking.amount)} theme={theme} bold />
        {booking.promo && <DetailRow label="Promo" value={booking.promo} theme={theme} />}
        <DetailRow label="Status" value={booking.status.toUpperCase()} theme={theme} />
      </View>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Dashboard')}
        style={styles.button}
        accessibilityLabel="Go back to dashboard"
      >
        Back to Home
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.getParent()?.navigate('BookingsTab')}
        style={styles.secondaryButton}
        accessibilityLabel="View all bookings"
      >
        View My Bookings
      </Button>
    </ScrollView>
  );
};

const DetailRow = ({
  label,
  value,
  theme,
  bold,
}: {
  label: string;
  value: string;
  theme: { colors: { onSurfaceVariant: string; onSurface: string } };
  bold?: boolean;
}) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
      {label}
    </Text>
    <Text
      variant="bodyMedium"
      style={{
        color: theme.colors.onSurface,
        fontWeight: bold ? '700' : '400',
        flexShrink: 1,
        textAlign: 'right',
        marginLeft: 16,
      }}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  card: {
    width: '100%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  divider: {
    marginVertical: spacing.sm,
  },
  button: {
    width: '100%',
    borderRadius: borderRadius.xl,
    marginBottom: spacing.sm,
  },
  secondaryButton: {
    width: '100%',
    borderRadius: borderRadius.xl,
  },
});

export default BookingConfirmationScreen;
