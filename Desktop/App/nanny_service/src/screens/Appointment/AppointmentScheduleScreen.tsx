import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, FlatList, Pressable, StyleSheet, Platform } from 'react-native';
import { Text, IconButton, Portal, Modal, Button } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
  default as DateTimePicker,
} from '@react-native-community/datetimepicker';
import { useAppTheme, palette } from '../../theme';
import { borderRadius, shadows, spacing } from '../../theme/tokens';
import { DashboardStackParamList, MainTabParamList } from '../../navigation/types';
import { AppointmentCard } from '../../components';
import { Appointment, AppointmentCategory, CalendarViewState, TimeSlotRow } from '../../models';
import { mockAppointments } from '../../mocks/data';

interface DateCell {
  date: Date;
  dayLabel: string;
  dateNum: number;
  isSelected: boolean;
  isToday: boolean;
}

type ScreenRouteProp = RouteProp<DashboardStackParamList, 'Appointments'>;
type ScreenNavProp = NativeStackNavigationProp<DashboardStackParamList, 'Appointments'>;

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SLOT_START_HOUR = 8;
const SLOT_END_HOUR = 20;
const VALID_CATEGORIES: AppointmentCategory[] = ['babysitting', 'fulltime', 'newborn', 'education'];

const formatDateISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const formatFullDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const isSameDate = (first: Date, second: Date): boolean =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

const formatTo12Hour = (time24: string): string => {
  const [hourValue, minuteValue] = time24.split(':').map(Number);
  const suffix = hourValue >= 12 ? 'PM' : 'AM';
  const hour12 = hourValue % 12 || 12;
  const minutes = String(minuteValue).padStart(2, '0');
  return `${hour12}:${minutes} ${suffix}`;
};

const toMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const toHourTime = (hour24: number): string => `${String(hour24).padStart(2, '0')}:00`;

const buildWeekDates = (selectedDate: Date): DateCell[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);

  const weekStart = new Date(selected);
  weekStart.setDate(selected.getDate() - selected.getDay());

  return Array.from({ length: 7 }, (_, index) => {
    const current = new Date(weekStart);
    current.setDate(weekStart.getDate() + index);

    const normalized = new Date(current);
    normalized.setHours(0, 0, 0, 0);

    return {
      date: current,
      dayLabel: DAY_LABELS[current.getDay()],
      dateNum: current.getDate(),
      isSelected: isSameDate(normalized, selected),
      isToday: isSameDate(normalized, today),
    };
  });
};

const buildHourlySlots = (appointments: Appointment[]): TimeSlotRow[] => {
  return Array.from({ length: SLOT_END_HOUR - SLOT_START_HOUR }, (_, index) => {
    const hour24 = SLOT_START_HOUR + index;
    const startTime = toHourTime(hour24);
    const endTime = toHourTime(hour24 + 1);
    const startMinutes = toMinutes(startTime);
    const endMinutes = toMinutes(endTime);

    const intersecting = appointments.filter((appointment) => {
      const appointmentStart = toMinutes(appointment.startTime);
      const appointmentEnd = toMinutes(appointment.endTime);
      return appointmentStart < endMinutes && appointmentEnd > startMinutes;
    });

    const startingInSlot = intersecting.filter((appointment) => {
      const appointmentStart = toMinutes(appointment.startTime);
      return appointmentStart >= startMinutes && appointmentStart < endMinutes;
    });

    return {
      hour24,
      label12h: formatTo12Hour(startTime),
      startTime,
      endTime,
      status: intersecting.length > 0 ? 'occupied' : 'empty',
      appointments: startingInSlot,
    };
  });
};

const AppointmentScheduleScreen: React.FC = () => {
  const { theme, isDark } = useAppTheme();
  const navigation = useNavigation<ScreenNavProp>();
  const route = useRoute<ScreenRouteProp>();
  const routeServiceId = route.params?.serviceId;
  const serviceId = VALID_CATEGORIES.includes(routeServiceId as AppointmentCategory)
    ? (routeServiceId as AppointmentCategory)
    : null;
  const serviceTitle = route.params?.serviceTitle?.trim()
    || (serviceId === 'babysitting' ? 'Babysitting' : 'Appointments');

  const [calendarState, setCalendarState] = useState<CalendarViewState>({
    selectedDate: new Date(),
    visibleMonthDate: new Date(),
    isPickerOpen: false,
    draftDate: new Date(),
  });

  const selectedDate = calendarState.selectedDate;

  const weekDates = useMemo(() => buildWeekDates(selectedDate), [selectedDate]);

  const filteredAppointments = useMemo<Appointment[]>(() => {
    const selectedDateISO = formatDateISO(selectedDate);
    return mockAppointments
      .filter(
        (appointment) =>
          appointment.date === selectedDateISO &&
          (serviceId ? appointment.category === serviceId : true),
      )
      .sort((first, second) => first.startTime.localeCompare(second.startTime));
  }, [selectedDate, serviceId]);

  const hourlySlots = useMemo<TimeSlotRow[]>(() => buildHourlySlots(filteredAppointments), [filteredAppointments]);

  const monthYearLabel = useMemo(() => formatMonthYear(selectedDate), [selectedDate]);
  const selectedDateLabel = useMemo(() => formatFullDate(selectedDate), [selectedDate]);

  const handleDateSelect = useCallback((date: Date) => {
    setCalendarState((previous) => ({
      ...previous,
      selectedDate: date,
      visibleMonthDate: date,
      draftDate: date,
    }));
  }, []);

  const closePicker = useCallback(() => {
    setCalendarState((previous) => ({
      ...previous,
      isPickerOpen: false,
      draftDate: previous.selectedDate,
      visibleMonthDate: previous.selectedDate,
    }));
  }, []);

  const applyPickerSelection = useCallback(() => {
    setCalendarState((previous) => {
      const nextDate = previous.draftDate ?? previous.selectedDate;
      return {
        ...previous,
        selectedDate: nextDate,
        visibleMonthDate: nextDate,
        isPickerOpen: false,
      };
    });
  }, []);

  const onIOSPickerChange = useCallback((event: DateTimePickerEvent, date?: Date) => {
    if (event.type !== 'set' || !date) {
      return;
    }

    setCalendarState((previous) => ({
      ...previous,
      draftDate: date,
      visibleMonthDate: date,
    }));
  }, []);

  const openAndroidPicker = useCallback(() => {
    DateTimePickerAndroid.open({
      value: calendarState.selectedDate,
      mode: 'date',
      onChange: (event, date) => {
        if (event.type === 'set' && date) {
          setCalendarState((previous) => ({
            ...previous,
            selectedDate: date,
            visibleMonthDate: date,
            draftDate: date,
            isPickerOpen: false,
          }));
          return;
        }

        if (event.type === 'dismissed') {
          setCalendarState((previous) => ({
            ...previous,
            isPickerOpen: false,
          }));
        }
      },
    });
  }, [calendarState.selectedDate]);

  const openPicker = useCallback(() => {
    if (Platform.OS === 'android') {
      openAndroidPicker();
      return;
    }

    setCalendarState((previous) => ({
      ...previous,
      isPickerOpen: true,
      draftDate: previous.selectedDate,
      visibleMonthDate: previous.selectedDate,
    }));
  }, [openAndroidPicker]);

  const handleCardPress = useCallback(() => {
    const tabNavigation = navigation.getParent<BottomTabNavigationProp<MainTabParamList>>();
    if (tabNavigation) {
      tabNavigation.navigate('ProfileTab');
    }
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={[styles.dateStripContainer, { backgroundColor: theme.colors.surface }]}> 
        <View style={styles.monthHeaderRow}>
          <Pressable
            onPress={openPicker}
            accessibilityRole="button"
            accessibilityLabel={`Selected date ${selectedDateLabel}. Tap to choose date`}
            accessibilityHint="Opens date picker"
            accessibilityState={{ expanded: calendarState.isPickerOpen }}
            style={[
              styles.monthTrigger,
              {
                backgroundColor: theme.colors.surfaceVariant,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
          >
            <View style={styles.monthLabelContent}>
              <Text variant="titleMedium" style={[styles.monthLabel, { color: theme.colors.onSurface }]}> 
                {monthYearLabel}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {selectedDateLabel}
              </Text>
            </View>
            <IconButton icon="calendar-month-outline" size={20} iconColor={theme.colors.primary} />
          </Pressable>
          <Text variant="titleSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {serviceTitle}
          </Text>
        </View>
        <FlatList
          horizontal
          data={weekDates}
          keyExtractor={(item) => item.date.toISOString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateListContent}
          renderItem={({ item }) => {
            const selectedColor = isDark ? palette.primary400 : palette.primary600;
            const showTodayRing = item.isToday && !item.isSelected;

            return (
              <Pressable
                style={styles.dateCell}
                onPress={() => handleDateSelect(item.date)}
                accessibilityRole="button"
                accessibilityLabel={`${item.dayLabel}, ${item.dateNum}. ${item.isSelected ? 'Selected' : 'Tap to select'}`}
              >
                <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {item.dayLabel}
                </Text>

                {item.isSelected ? (
                  <View style={[styles.dateCircle, { backgroundColor: selectedColor }]}> 
                    <Text
                      variant="bodyLarge"
                      style={[styles.selectedDateText, { color: theme.colors.onPrimary }]}
                    >
                      {item.dateNum}
                    </Text>
                  </View>
                ) : showTodayRing ? (
                  <View style={[styles.dateCircle, { borderWidth: 2, borderColor: selectedColor }]}> 
                    <Text variant="bodyLarge" style={{ color: selectedColor, fontWeight: '600' }}>
                      {item.dateNum}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.dateCircle}> 
                    <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                      {item.dateNum}
                    </Text>
                  </View>
                )}
              </Pressable>
            );
          }}
        />
      </View>

      {Platform.OS === 'ios' && calendarState.isPickerOpen ? (
        <Portal>
          <Modal
            visible={calendarState.isPickerOpen}
            onDismiss={closePicker}
            contentContainerStyle={[styles.pickerModal, { backgroundColor: theme.colors.surface }]}
          >
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: spacing.xs }}>
              Choose date
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: spacing.md }}>
              {formatFullDate(calendarState.draftDate ?? calendarState.selectedDate)}
            </Text>
            <DateTimePicker
              value={calendarState.draftDate ?? calendarState.selectedDate}
              mode="date"
              display="inline"
              onChange={onIOSPickerChange}
            />
            <View style={styles.pickerActionRow}>
              <Button
                mode="outlined"
                onPress={closePicker}
                accessibilityLabel="Cancel date selection"
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={applyPickerSelection}
                accessibilityLabel="Apply date selection"
                style={styles.actionButton}
              >
                Apply
              </Button>
            </View>
          </Modal>
        </Portal>
      ) : null}

      <ScrollView style={styles.timelineContainer} contentContainerStyle={styles.timelineContent}> 
        {hourlySlots.map((slot) => (
          <View key={slot.startTime} style={styles.timelineRow}> 
            <View style={styles.timeColumn}> 
              <Text
                variant="bodySmall"
                style={[styles.timeLabel, { color: theme.colors.onSurfaceVariant }]}
                accessibilityRole="text"
              >
                {slot.label12h}
              </Text>
            </View>

            <View style={styles.cardColumn}> 
              {slot.status === 'occupied' && slot.appointments.length > 0 ? (
                slot.appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onPress={handleCardPress}
                  />
                ))
              ) : (
                <View
                  style={[
                    styles.emptySlot,
                    {
                      backgroundColor: theme.colors.surfaceVariant,
                      borderColor: theme.colors.outlineVariant,
                    },
                  ]}
                >
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    No appointments
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dateStripContainer: {
    paddingVertical: spacing.md,
    paddingBottom: spacing.sm,
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  monthTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: spacing.xs,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    borderRadius: borderRadius.lg,
    minHeight: 48,
    ...shadows.sm,
  },
  monthLabelContent: {
    justifyContent: 'center',
  },
  monthLabel: {
    fontWeight: '600',
  },
  dateListContent: {
    paddingHorizontal: spacing.md,
    justifyContent: 'space-around',
    flexGrow: 1,
  },
  dateCell: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  selectedDateText: {
    fontWeight: '700',
  },
  timelineContainer: {
    flex: 1,
  },
  timelineContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    minHeight: 64,
  },
  timeColumn: {
    width: 50,
    paddingTop: spacing.sm,
  },
  timeLabel: {
    fontWeight: '500',
  },
  cardColumn: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  emptySlot: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  pickerModal: {
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  pickerActionRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: spacing.sm,
  },
});

export default AppointmentScheduleScreen;
