import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, Platform, ScrollView, Dimensions } from 'react-native';
import { Text, Button, Portal, Modal, IconButton } from 'react-native-paper';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme } from '../theme';
import { spacing, borderRadius, shadows } from '../theme/tokens';
import { APP_CONFIG } from '../utils/config';

interface ScheduleModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSchedule: (date: string, startTime: string, endTime: string) => void;
  babyName: string;
}

/**
 * Modal with input-box styled date/time fields for scheduling a nanny service.
 * Tapping an input box opens the native picker. Cancel + Search buttons.
 */
const ScheduleModal: React.FC<ScheduleModalProps> = ({
  visible,
  onDismiss,
  onSchedule,
  babyName,
}) => {
  const { theme } = useAppTheme();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date>(() => {
    const d = new Date();
    d.setHours(9, 0, 0, 0);
    return d;
  });
  const [endTime, setEndTime] = useState<Date>(() => {
    const d = new Date();
    d.setHours(14, 0, 0, 0);
    return d;
  });

  const [activePicker, setActivePicker] = useState<'date' | 'startTime' | 'endTime' | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /** Normalize a time to use selectedDate's calendar day (prevents date-component mismatch crashes). */
  const normalizeToSelectedDate = (time: Date): Date => {
    const d = new Date(selectedDate);
    d.setHours(time.getHours(), time.getMinutes(), 0, 0);
    return d;
  };

  /** Clamp a Date to be within [min, max] — prevents native picker crash when value is out of range. */
  const clampDate = (value: Date, min: Date, max: Date): Date => {
    if (value < min) return new Date(min);
    if (value > max) return new Date(max);
    return value;
  };

  /** Earliest selectable start time: current time (rounded up to 15 min) on today, or 8 AM on future dates. */
  const getStartTimeMin = (): Date => {
    const min = new Date(selectedDate);
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();

    if (isToday && now.getHours() >= APP_CONFIG.bookingStartHour) {
      const nextQuarter = Math.ceil(now.getMinutes() / 15) * 15;
      min.setHours(now.getHours(), nextQuarter, 0, 0);
      if (nextQuarter >= 60) {
        min.setHours(now.getHours() + 1, 0, 0, 0);
      }
      // Cap at the max start time to prevent minimumDate > maximumDate crash
      const maxStart = new Date(selectedDate);
      maxStart.setHours(APP_CONFIG.bookingEndHour - APP_CONFIG.minBookingHours, 0, 0, 0);
      if (min > maxStart) return maxStart;
    } else {
      min.setHours(APP_CONFIG.bookingStartHour, 0, 0, 0);
    }
    return min;
  };

  /** Latest selectable start time: bookingEndHour − minBookingHours (5 PM). */
  const getStartTimeMax = (): Date => {
    const max = new Date(selectedDate);
    max.setHours(APP_CONFIG.bookingEndHour - APP_CONFIG.minBookingHours, 0, 0, 0);
    return max;
  };

  /** Earliest selectable end time: startTime + minBookingHours. */
  const getEndTimeMin = (): Date => {
    const min = new Date(selectedDate);
    min.setHours(startTime.getHours() + APP_CONFIG.minBookingHours, startTime.getMinutes(), 0, 0);
    // Cap at the max end time to prevent minimumDate > maximumDate crash
    const maxEnd = new Date(selectedDate);
    maxEnd.setHours(APP_CONFIG.bookingEndHour, 0, 0, 0);
    if (min > maxEnd) return maxEnd;
    return min;
  };

  /** Latest selectable end time: bookingEndHour (8 PM). */
  const getEndTimeMax = (): Date => {
    const max = new Date(selectedDate);
    max.setHours(APP_CONFIG.bookingEndHour, 0, 0, 0);
    return max;
  };

  const onDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    setActivePicker(null);
    if (date) {
      setSelectedDate(date);
      // Sync time states to new calendar day to prevent date-component mismatch
      setStartTime((prev) => {
        const synced = new Date(date);
        synced.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
        return synced;
      });
      setEndTime((prev) => {
        const synced = new Date(date);
        synced.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
        return synced;
      });
    }
  };

  const onStartChange = (_event: DateTimePickerEvent, date?: Date) => {
    setActivePicker(null);
    if (date) {
      // Normalize picker result to selectedDate's calendar day
      const normalized = new Date(selectedDate);
      normalized.setHours(date.getHours(), date.getMinutes(), 0, 0);
      setStartTime(normalized);
      // Auto-adjust endTime if now less than minBookingHours after new start
      const minEnd = new Date(selectedDate);
      minEnd.setHours(date.getHours() + APP_CONFIG.minBookingHours, date.getMinutes(), 0, 0);
      if (endTime < minEnd) {
        setEndTime(minEnd);
      }
    }
  };

  const onEndChange = (_event: DateTimePickerEvent, date?: Date) => {
    setActivePicker(null);
    if (date) {
      // Normalize picker result to selectedDate's calendar day
      const normalized = new Date(selectedDate);
      normalized.setHours(date.getHours(), date.getMinutes(), 0, 0);
      setEndTime(normalized);
    }
  };

  const handleSearch = () => {
    const dateStr = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const start = `${String(startTime.getHours()).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(2, '0')}`;
    const end = `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`;
    onSchedule(dateStr, start, end);
  };

  const formatDisplayDate = (d: Date): string => {
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDisplayTime = (d: Date): string => {
    const h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const durationHours = useMemo(() => {
    const diffMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    return Math.max(diffMinutes / 60, 0);
  }, [startTime, endTime]);

  const validationMessage = useMemo(() => {
    const startMin = getStartTimeMin();
    const startMax = getStartTimeMax();
    const endMin = getEndTimeMin();
    const endMax = getEndTimeMax();

    if (startMin >= startMax) {
      return 'No available start times for today. Please choose a future date.';
    }

    if (startTime < startMin || startTime > startMax) {
      return `Start time must be between ${formatDisplayTime(startMin)} and ${formatDisplayTime(startMax)}.`;
    }

    if (endTime < endMin || endTime > endMax) {
      return `End time must be between ${formatDisplayTime(endMin)} and ${formatDisplayTime(endMax)}.`;
    }

    if (durationHours < APP_CONFIG.minBookingHours) {
      return `Please select at least ${APP_CONFIG.minBookingHours} hours.`;
    }

    return null;
  }, [durationHours, endTime, startTime, selectedDate]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[styles.modal, { backgroundColor: theme.colors.surface }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            variant="titleLarge"
            style={{ color: theme.colors.onSurface, fontWeight: '700', flex: 1 }}
          >
            Schedule for {babyName}
          </Text>
          <IconButton
            icon="close"
            size={20}
            onPress={onDismiss}
            accessibilityLabel="Close schedule modal"
          />
        </View>

        <View
          style={[
            styles.summaryCard,
            { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outlineVariant },
          ]}
          accessibilityLabel={`Schedule summary. Date ${formatDisplayDate(selectedDate)}. From ${formatDisplayTime(startTime)} to ${formatDisplayTime(endTime)}. Duration ${durationHours.toFixed(1)} hours.`}
        >
          <Text variant="labelLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
            Schedule Summary
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs }}>
            {formatDisplayDate(selectedDate)} • {formatDisplayTime(startTime)} - {formatDisplayTime(endTime)}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.primary, marginTop: spacing.xs }}>
            Duration: {durationHours.toFixed(1)} hours
          </Text>
        </View>

        <View style={styles.ruleHints}>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Minimum booking: {APP_CONFIG.minBookingHours} hours
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Service hours: {APP_CONFIG.bookingStartHour}:00 - {APP_CONFIG.bookingEndHour}:00
          </Text>
        </View>

        {validationMessage ? (
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.error, marginTop: spacing.sm }}
            accessibilityLabel={validationMessage}
          >
            {validationMessage}
          </Text>
        ) : null}

        {/* Scrollable form fields */}
        <ScrollView
          style={{ maxHeight: '100%', flexGrow: 0, marginTop: spacing.sm }}
          showsVerticalScrollIndicator={true}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Date Input Box */}
          <Text
            variant="labelLarge"
            style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            Date
          </Text>
          <Pressable
            style={[styles.inputBox, { borderColor: theme.colors.outline }]}
            onPress={() => setActivePicker('date')}
            accessibilityLabel="Select date"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons
              name="calendar-outline"
              size={20}
              color={theme.colors.onSurfaceVariant}
              style={styles.inputBoxIcon}
            />
            <Text
              variant="bodyLarge"
              style={[styles.inputBoxText, { color: theme.colors.onSurface }]}
            >
              {formatDisplayDate(selectedDate)}
            </Text>
          </Pressable>
          {activePicker === 'date' && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              minimumDate={today}
              onChange={onDateChange}
              testID="date-picker"
            />
          )}

          {/* From Time Input Box */}
          <Text
            variant="labelLarge"
            style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            From
          </Text>
          <Pressable
            style={[styles.inputBox, { borderColor: theme.colors.outline }]}
            onPress={() => setActivePicker('startTime')}
            accessibilityLabel="Select from time"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color={theme.colors.onSurfaceVariant}
              style={styles.inputBoxIcon}
            />
            <Text
              variant="bodyLarge"
              style={[styles.inputBoxText, { color: theme.colors.onSurface }]}
            >
              {formatDisplayTime(startTime)}
            </Text>
          </Pressable>
          {activePicker === 'startTime' &&
            (() => {
              const min = getStartTimeMin();
              const max = getStartTimeMax();
              // Guard: if min >= max after capping, no valid times — show message instead of crashing
              if (min >= max) {
                return (
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.error, marginTop: spacing.xs }}
                  >
                    No available start times for today. Please select a future date.
                  </Text>
                );
              }
              return (
                <DateTimePicker
                  value={clampDate(normalizeToSelectedDate(startTime), min, max)}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minuteInterval={15}
                  minimumDate={min}
                  maximumDate={max}
                  onChange={onStartChange}
                  testID="start-time-picker"
                />
              );
            })()}

          {/* To Time Input Box */}
          <Text
            variant="labelLarge"
            style={[styles.fieldLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            To
          </Text>
          <Pressable
            style={[styles.inputBox, { borderColor: theme.colors.outline }]}
            onPress={() => setActivePicker('endTime')}
            accessibilityLabel="Select to time"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color={theme.colors.onSurfaceVariant}
              style={styles.inputBoxIcon}
            />
            <Text
              variant="bodyLarge"
              style={[styles.inputBoxText, { color: theme.colors.onSurface }]}
            >
              {formatDisplayTime(endTime)}
            </Text>
          </Pressable>
          {activePicker === 'endTime' &&
            (() => {
              const min = getEndTimeMin();
              const max = getEndTimeMax();
              // Guard: if min >= max after capping, no valid times — show message instead of crashing
              if (min >= max) {
                return (
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.error, marginTop: spacing.xs }}
                  >
                    No available end times. Please adjust the start time or select a future date.
                  </Text>
                );
              }
              return (
                <DateTimePicker
                  value={clampDate(normalizeToSelectedDate(endTime), min, max)}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  minuteInterval={15}
                  minimumDate={min}
                  maximumDate={max}
                  onChange={onEndChange}
                  testID="end-time-picker"
                />
              );
            })()}
        </ScrollView>

        {/* Cancel / Search Button Row — fixed at bottom */}
        <View style={styles.buttonRow}>
          <Button
            mode="outlined"
            onPress={onDismiss}
            style={[styles.actionButton, { marginRight: spacing.sm }]}
            contentStyle={styles.actionButtonContent}
            accessibilityLabel="Cancel scheduling"
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSearch}
            disabled={!!validationMessage}
            style={styles.actionButton}
            contentStyle={styles.actionButtonContent}
            accessibilityLabel="Search for nannies"
          >
            Search
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    maxHeight: Dimensions.get('window').height * 0.85,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  fieldLabel: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  inputBoxIcon: {
    marginRight: spacing.sm,
  },
  inputBoxText: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  ruleHints: {
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  actionButton: {
    flex: 1,
    borderRadius: borderRadius.xl,
  },
  actionButtonContent: {
    paddingVertical: spacing.xs,
  },
});

export default ScheduleModal;
