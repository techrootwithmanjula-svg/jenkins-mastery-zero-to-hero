import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText, Divider } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../../theme';
import { spacing, borderRadius, shadows } from '../../theme/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createBooking } from '../../store/slices/bookingSlice';
import type { RootState } from '../../store';
import { formatCurrency, formatTime } from '../../utils/helpers';
import { APP_CONFIG } from '../../utils/config';
import { bookingTimeSchema } from '../../utils/validation';
import { DashboardStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<DashboardStackParamList, 'Booking'>;

/**
 * Booking screen with slot selection, address, promo, and payment.
 */
const BookingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { nanny } = route.params;
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state: RootState) => state.booking);

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [address, setAddress] = useState('');
  const [promo, setPromo] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const calculateAmount = (): number => {
    if (!startTime || !endTime) return 0;
    const start = parseInt(startTime.split(':')[0], 10);
    const end = parseInt(endTime.split(':')[0], 10);
    const hours = end - start;
    return hours > 0 ? hours * nanny.hourlyRate : 0;
  };

  const amount = calculateAmount();

  const handleBooking = async () => {
    setValidationErrors({});

    try {
      await bookingTimeSchema.validate({ date, startTime, endTime }, { abortEarly: false });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'inner' in err) {
        const yupError = err as { inner: Array<{ path?: string; message: string }> };
        const errors: Record<string, string> = {};
        yupError.inner.forEach((e) => {
          if (e.path) errors[e.path] = e.message;
        });
        setValidationErrors(errors);
        return;
      }
    }

    if (!address.trim()) {
      setValidationErrors({ address: 'Address is required' });
      return;
    }

    const result = await dispatch(
      createBooking({
        nannyId: nanny.id,
        slot: { date, startTime, endTime },
        address,
        promo: promo || undefined,
      }),
    );

    if (createBooking.fulfilled.match(result)) {
      navigation.navigate('BookingConfirmation', { booking: result.payload });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Nanny Summary */}
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface }, shadows.sm]}>
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {nanny.name}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              At your home
            </Text>
          </View>
          <Text variant="titleMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
            {formatCurrency(nanny.hourlyRate)}/hr
          </Text>
        </View>

        {/* Time Selection */}
        <Text
          variant="titleMedium"
          style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
        >
          Select Date & Time
        </Text>
        <TextInput
          label="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          mode="outlined"
          style={styles.input}
          placeholder="2026-04-15"
          error={!!validationErrors.date}
          accessibilityLabel="Booking date"
        />
        {validationErrors.date && <HelperText type="error">{validationErrors.date}</HelperText>}

        <View style={styles.timeRow}>
          <View style={{ flex: 1, marginRight: spacing.xs }}>
            <TextInput
              label="Start Time"
              value={startTime}
              onChangeText={setStartTime}
              mode="outlined"
              style={styles.input}
              placeholder="08:00"
              error={!!validationErrors.startTime}
              accessibilityLabel="Booking start time"
            />
            {validationErrors.startTime && (
              <HelperText type="error">{validationErrors.startTime}</HelperText>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              label="End Time"
              value={endTime}
              onChangeText={setEndTime}
              mode="outlined"
              style={styles.input}
              placeholder="14:00"
              error={!!validationErrors.endTime}
              accessibilityLabel="Booking end time"
            />
            {validationErrors.endTime && (
              <HelperText type="error">{validationErrors.endTime}</HelperText>
            )}
          </View>
        </View>

        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant, marginBottom: spacing.md }}
        >
          Min {APP_CONFIG.minBookingHours} hours | {APP_CONFIG.bookingStartHour}:00 AM –{' '}
          {APP_CONFIG.bookingEndHour > 12
            ? APP_CONFIG.bookingEndHour - 12
            : APP_CONFIG.bookingEndHour}
          :00 PM
        </Text>

        <Divider style={styles.divider} />

        {/* Address */}
        <Text
          variant="titleMedium"
          style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
        >
          Service Address
        </Text>
        <TextInput
          label="Address"
          value={address}
          onChangeText={setAddress}
          mode="outlined"
          multiline
          numberOfLines={3}
          style={styles.input}
          error={!!validationErrors.address}
          accessibilityLabel="Service address"
        />
        {validationErrors.address && (
          <HelperText type="error">{validationErrors.address}</HelperText>
        )}

        <Divider style={styles.divider} />

        {/* Promo */}
        <Text
          variant="titleMedium"
          style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
        >
          Promo Code (optional)
        </Text>
        <TextInput
          label="Promo Code"
          value={promo}
          onChangeText={setPromo}
          mode="outlined"
          style={styles.input}
          autoCapitalize="characters"
          accessibilityLabel="Promo code"
        />

        <Divider style={styles.divider} />

        {/* Amount Summary */}
        <View style={[styles.amountCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer }}>
            Total Amount
          </Text>
          <Text variant="headlineMedium" style={{ color: theme.colors.onPrimaryContainer }}>
            {formatCurrency(amount)}
          </Text>
        </View>

        {error && <HelperText type="error">{error}</HelperText>}

        {/* Book Button */}
        <Button
          mode="contained"
          onPress={handleBooking}
          loading={isLoading}
          disabled={isLoading || amount === 0}
          style={styles.bookButton}
          contentStyle={styles.bookButtonContent}
          accessibilityLabel="Confirm booking and pay"
        >
          Pay & Confirm Booking
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
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
  summaryCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  input: {
    marginBottom: spacing.xs,
  },
  timeRow: {
    flexDirection: 'row',
  },
  divider: {
    marginVertical: spacing.md,
  },
  amountCard: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  bookButton: {
    marginTop: spacing.md,
    borderRadius: borderRadius.xl,
  },
  bookButtonContent: {
    paddingVertical: spacing.xs,
  },
});

export default BookingScreen;
