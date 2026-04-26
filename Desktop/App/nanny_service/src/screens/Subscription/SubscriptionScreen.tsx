import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import {
  Text,
  Button,
  TextInput,
  Dialog,
  Portal,
  Chip,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppTheme } from '../../theme';
import { spacing, borderRadius, shadows, typography } from '../../theme/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import {
  fetchSubscriptions,
  createSubscription,
  pauseSubscription,
  resumeSubscription,
  deleteSubscription,
} from '../../store/slices/subscriptionSlice';
import { LoadingSpinner, ConfirmationModal } from '../../components';
import { useTimeRangePicker } from '../../hooks';
import { Subscription } from '../../models';

// ---------- constants -----------------------------------------------------------

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const WEEKDAY_ABBR: Record<string, string> = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed', Thursday: 'Thu',
  Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun',
};

const MOCK_NANNIES = [
  { id: 'nanny-1', name: 'Sarah Johnson', image: '👩‍🍼', rating: 4.8 },
  { id: 'nanny-2', name: 'Emily Chen', image: '👩‍🍼', rating: 4.9 },
  { id: 'nanny-3', name: 'Jessica Garcia', image: '👩‍🍼', rating: 4.7 },
  { id: 'nanny-4', name: 'Lisa Anderson', image: '👩‍🍼', rating: 4.6 },
];

// ---------- helpers -------------------------------------------------------------

const padTime = (d: Date): string => {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

const getStatusColors = (status: string): { bg: string; text: string } => {
  switch (status) {
    case 'active':   return { bg: '#E8F5E9', text: '#2E7D32' };
    case 'paused':   return { bg: '#FFF3E0', text: '#F57C00' };
    case 'cancelled': return { bg: '#FFEBEE', text: '#C62828' };
    default:         return { bg: '#F5F5F5', text: '#757575' };
  }
};

// ---------- types ---------------------------------------------------------------

type PendingAction = 'pause' | 'resume' | 'delete' | null;

interface PendingActionState {
  action: PendingAction;
  subscriptionId: string | null;
  nannyName: string;
}

// ---------- component -----------------------------------------------------------

/**
 * Subscription screen – weekly subscription management.
 * - Frequency selector (1 or 2 days/week)
 * - Weekday chip grid constrained by frequency
 * - Two-click time range picker (start → end via useTimeRangePicker)
 * - Confirmation modal for pause/resume/delete card actions
 */
const SubscriptionScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { subscriptions, isLoading, error } = useAppSelector(
    (state: RootState) => state.subscription,
  );

  // ── modal ──────────────────────────────────────────────────────────────────
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // ── nanny search ───────────────────────────────────────────────────────────
  const [selectedNanny, setSelectedNanny] = useState<typeof MOCK_NANNIES[0] | null>(null);
  const [nannySearch, setNannySearch] = useState('');

  // ── schedule form ──────────────────────────────────────────────────────────
  const [frequencyPerWeek, setFrequencyPerWeek] = useState<1 | 2 | null>(null);
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const timeRange = useTimeRangePicker();
  const [showTimePicker, setShowTimePicker] = useState(false);

  // ── validation ─────────────────────────────────────────────────────────────
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // ── confirmation modal ─────────────────────────────────────────────────────
  const [pending, setPending] = useState<PendingActionState>({
    action: null,
    subscriptionId: null,
    nannyName: '',
  });

  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  // ── nanny search ───────────────────────────────────────────────────────────
  const filteredNannies = useMemo(() => {
    if (!nannySearch.trim()) return [];
    return MOCK_NANNIES.filter((n) =>
      n.name.toLowerCase().includes(nannySearch.toLowerCase()),
    );
  }, [nannySearch]);

  const handleSearchChange = (text: string) => {
    setNannySearch(text);
    setSelectedNanny(null);
  };

  const handleSelectNanny = (nanny: typeof MOCK_NANNIES[0]) => {
    setSelectedNanny(nanny);
    setNannySearch(nanny.name);
  };

  // ── frequency / weekday ────────────────────────────────────────────────────
  const handleFrequencySelect = (freq: 1 | 2) => {
    setFrequencyPerWeek(freq);
    setSelectedWeekdays((prev) => prev.slice(0, freq));
  };

  const handleWeekdayToggle = (day: string) => {
    setSelectedWeekdays((prev) => {
      if (prev.includes(day)) return prev.filter((d) => d !== day);
      if (frequencyPerWeek && prev.length >= frequencyPerWeek) return prev;
      return [...prev, day];
    });
  };

  // ── time range ─────────────────────────────────────────────────────────────
  const handleNativeTimeChange = (_event: unknown, date?: Date) => {
    setShowTimePicker(false);
    if (date) timeRange.pickTime(padTime(date));
  };

  const handleTimeTap = () => {
    if (timeRange.activeField === null) timeRange.beginStartPick();
    setShowTimePicker(true);
  };

  useEffect(() => {
    if (timeRange.activeField === 'end') setShowTimePicker(true);
  }, [timeRange.activeField]);

  // ── form reset / open ──────────────────────────────────────────────────────
  const handleOpenDialog = () => {
    setNannySearch('');
    setSelectedNanny(null);
    setFrequencyPerWeek(null);
    setSelectedWeekdays([]);
    timeRange.reset();
    setFormErrors([]);
    setShowCreateDialog(true);
  };

  // ── submission ─────────────────────────────────────────────────────────────

  const validateForm = (): boolean => {
    const errs: string[] = [];
    if (!selectedNanny) errs.push('Please select a nanny');
    if (!frequencyPerWeek) errs.push('Please select a frequency');
    if (frequencyPerWeek && selectedWeekdays.length !== frequencyPerWeek) {
      errs.push(`Please select ${frequencyPerWeek} day(s) per week`);
    }
    if (!timeRange.startTime || !timeRange.endTime) {
      errs.push('Please select a time range (start, then end)');
    }
    errs.push(...Object.values(timeRange.errors));
    setFormErrors(errs);
    return errs.length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    if (!selectedNanny || !frequencyPerWeek || !timeRange.startTime || !timeRange.endTime) return;

    const result = await dispatch(
      createSubscription({
        nannyId: selectedNanny.id,
        nannyName: selectedNanny.name,
        frequencyPerWeek,
        weekdays: selectedWeekdays,
        startTime: timeRange.startTime,
        endTime: timeRange.endTime,
      }),
    );

    if (createSubscription.fulfilled.match(result)) {
      setShowCreateDialog(false);
    }
  };

  // ── confirmation modal helpers ─────────────────────────────────────────────

  const requestAction = (action: PendingAction, sub: Subscription) => {
    setPending({ action, subscriptionId: sub.id, nannyName: sub.nannyName });
  };

  const confirmationConfig = useMemo((): {
    title: string;
    message: string;
    confirmLabel: string;
    confirmVariant: 'contained' | 'outlined';
  } => {
    switch (pending.action) {
      case 'pause':
        return {
          title: 'Pause Subscription?',
          message: 'This nanny will no longer service your account until you resume.',
          confirmLabel: 'Pause',
          confirmVariant: 'outlined',
        };
      case 'resume':
        return {
          title: 'Resume Subscription?',
          message: 'This nanny will resume service on the next scheduled date.',
          confirmLabel: 'Resume',
          confirmVariant: 'contained',
        };
      case 'delete':
        return {
          title: 'Delete Subscription?',
          message: 'This cannot be undone.',
          confirmLabel: 'Delete',
          confirmVariant: 'contained',
        };
      default:
        return { title: '', message: '', confirmLabel: 'Confirm', confirmVariant: 'contained' };
    }
  }, [pending.action]);

  const handleConfirmAction = async () => {
    if (!pending.subscriptionId || !pending.action) return;
    let result;
    switch (pending.action) {
      case 'pause':
        result = await dispatch(pauseSubscription(pending.subscriptionId));
        break;
      case 'resume':
        result = await dispatch(resumeSubscription(pending.subscriptionId));
        break;
      case 'delete':
        result = await dispatch(deleteSubscription(pending.subscriptionId));
        break;
    }
    if (result && (
      pauseSubscription.fulfilled.match(result) ||
      resumeSubscription.fulfilled.match(result) ||
      deleteSubscription.fulfilled.match(result)
    )) {
      setPending({ action: null, subscriptionId: null, nannyName: '' });
    }
  };

  const handleCancelAction = () => {
    setPending({ action: null, subscriptionId: null, nannyName: '' });
  };

  // ── render nanny search row ────────────────────────────────────────────────

  const renderNannyResult = (nanny: typeof MOCK_NANNIES[0]) => (
    <TouchableOpacity
      key={nanny.id}
      onPress={() => handleSelectNanny(nanny)}
      style={[styles.nannyResultRow, { borderBottomColor: theme.colors.outlineVariant }]}
      accessible={true}
      accessibilityLabel={`${nanny.name}, rating ${nanny.rating} stars`}
      accessibilityHint="Double tap to select this nanny"
    >
      <Text style={styles.nannyAvatar}>{nanny.image}</Text>
      <View style={styles.nannyInfo}>
        <Text style={[typography.bodyMedium, { color: theme.colors.onSurface, fontWeight: '600' }]}>
          {nanny.name}
        </Text>
        <Text style={[typography.bodySmall, { color: theme.colors.onSurfaceVariant }]}>
          ⭐ {nanny.rating}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // ── render subscription card ───────────────────────────────────────────────

  const renderSubscription = ({ item }: { item: Subscription }) => {
    const statusColors = getStatusColors(item.status);
    const freqLabel = item.frequencyPerWeek === 1 ? '1×/week' : '2×/week';
    const daysLabel = item.weekdays.map((d) => WEEKDAY_ABBR[d] ?? d).join(' & ');
    const timeLabel = `${item.startTime} – ${item.endTime}`;

    return (
      <View
        style={[styles.card, { backgroundColor: theme.colors.surface }, shadows.sm]}
        accessible={true}
        accessibilityLabel={`Subscription with ${item.nannyName}`}
      >
        <View style={styles.cardHeader}>
          <Text style={[typography.titleMedium, { color: theme.colors.onSurface }]}>
            {item.nannyName}
          </Text>
          <Chip
            style={{ backgroundColor: statusColors.bg }}
            textStyle={{ color: statusColors.text, ...typography.labelSmall }}
          >
            {item.status.toUpperCase()}
          </Chip>
        </View>

        <View style={styles.scheduleInfo}>
          <View style={[styles.freqBadge, { backgroundColor: theme.colors.primaryContainer }]}>
            <Text style={[typography.labelMedium, { color: theme.colors.onPrimaryContainer }]}>
              {freqLabel}
            </Text>
          </View>
          <Text style={[typography.bodySmall, { color: theme.colors.onSurfaceVariant, marginTop: spacing.xs }]}>
            📅 {daysLabel}
          </Text>
          <Text style={[typography.bodySmall, { color: theme.colors.onSurfaceVariant, marginTop: spacing.xs }]}>
            🕐 {timeLabel}
          </Text>
        </View>

        <View style={styles.actionRow}>
          {item.status === 'active' && (
            <Button
              mode="outlined"
              compact
              onPress={() => requestAction('pause', item)}
              style={styles.actionButton}
              accessibilityLabel={`Pause subscription for ${item.nannyName}`}
            >
              Pause
            </Button>
          )}
          {item.status === 'paused' && (
            <Button
              mode="outlined"
              compact
              onPress={() => requestAction('resume', item)}
              style={styles.actionButton}
              accessibilityLabel={`Resume subscription for ${item.nannyName}`}
            >
              Resume
            </Button>
          )}
          <Button
            mode="text"
            compact
            textColor={theme.colors.error}
            onPress={() => requestAction('delete', item)}
            style={styles.actionButton}
            accessibilityLabel={`Delete subscription for ${item.nannyName}`}
          >
            Delete
          </Button>
        </View>
      </View>
    );
  };

  // ── early return ───────────────────────────────────────────────────────────

  if (isLoading && subscriptions.length === 0) {
    return <LoadingSpinner message="Loading subscriptions..." />;
  }

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <FlatList
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={renderSubscription}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Button
            mode="contained"
            onPress={handleOpenDialog}
            style={styles.createButton}
            accessibilityLabel="Create new subscription"
          >
            + New Subscription
          </Button>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              No subscriptions yet. Create one to get started!
            </Text>
          </View>
        }
      />

      {error && subscriptions.length > 0 && (
        <View style={[styles.errorBanner, { backgroundColor: theme.colors.errorContainer }]}>
          <Text style={{ color: theme.colors.onErrorContainer }}>{error}</Text>
        </View>
      )}

      {/* ── Create Subscription Dialog ──────────────────────────────────────── */}
      <Portal>
        <Dialog
          visible={showCreateDialog}
          onDismiss={() => setShowCreateDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title>New Subscription</Dialog.Title>
          <Dialog.Content>
            <ScrollView showsVerticalScrollIndicator nestedScrollEnabled style={styles.dialogScroll}>

              {/* Validation errors */}
              {formErrors.length > 0 && (
                <View style={[styles.errorBox, { backgroundColor: theme.colors.errorContainer }]}>
                  {formErrors.map((err, idx) => (
                    <Text
                      key={idx}
                      style={[typography.bodySmall, { color: theme.colors.onErrorContainer, marginBottom: spacing.xs }]}
                    >
                      • {err}
                    </Text>
                  ))}
                </View>
              )}

              {/* Nanny Search */}
              <Text style={[typography.labelMedium, { color: theme.colors.onSurface, marginBottom: spacing.xs }]}>
                Select Nanny
              </Text>
              <TextInput
                label="Search nanny by name"
                value={nannySearch}
                onChangeText={handleSearchChange}
                mode="outlined"
                style={styles.dialogInput}
                accessibilityLabel="Search for nanny"
                accessibilityHint="Start typing nanny name to filter results"
              />

              {nannySearch.length > 0 && filteredNannies.length > 0 && (
                <View style={[styles.nannyResultsContainer, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outlineVariant }]}>
                  {filteredNannies.map(renderNannyResult)}
                </View>
              )}

              {nannySearch.length > 0 && filteredNannies.length === 0 && !selectedNanny && (
                <Text style={[typography.bodySmall, { color: theme.colors.error, marginVertical: spacing.sm, textAlign: 'center' }]}>
                  No nannies found
                </Text>
              )}

              {selectedNanny && (
                <View style={[styles.selectedNannyBox, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Text style={[typography.bodyMedium, { color: theme.colors.onPrimaryContainer }]}>
                    ✓ {selectedNanny.name} (Rating: {selectedNanny.rating}⭐)
                  </Text>
                </View>
              )}

              {/* Frequency Selector */}
              <Text style={[typography.labelMedium, { color: theme.colors.onSurface, marginTop: spacing.md, marginBottom: spacing.sm }]}>
                Frequency
              </Text>
              <View style={styles.frequencyRow}>
                {([1, 2] as const).map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    onPress={() => handleFrequencySelect(freq)}
                    style={[
                      styles.frequencyButton,
                      {
                        backgroundColor: frequencyPerWeek === freq ? theme.colors.primary : theme.colors.surfaceVariant,
                        borderColor: frequencyPerWeek === freq ? theme.colors.primary : theme.colors.outline,
                      },
                    ]}
                    accessibilityLabel={`${freq} day${freq === 1 ? '' : 's'} per week`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: frequencyPerWeek === freq }}
                  >
                    <Text style={[typography.labelLarge, { color: frequencyPerWeek === freq ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }]}>
                      {freq === 1 ? '1 day/week' : '2 days/week'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Weekday Chips */}
              {frequencyPerWeek !== null && (
                <>
                  <Text style={[typography.labelMedium, { color: theme.colors.onSurface, marginTop: spacing.md, marginBottom: spacing.sm }]}>
                    Select {frequencyPerWeek} day{frequencyPerWeek > 1 ? 's' : ''}
                  </Text>
                  <View style={styles.weekdayGrid}>
                    {WEEKDAYS.map((day) => {
                      const isSelected = selectedWeekdays.includes(day);
                      const isDisabled = !isSelected && selectedWeekdays.length >= frequencyPerWeek;
                      return (
                        <TouchableOpacity
                          key={day}
                          onPress={() => !isDisabled && handleWeekdayToggle(day)}
                          style={[
                            styles.weekdayChip,
                            {
                              backgroundColor: isSelected ? theme.colors.secondary : theme.colors.surfaceVariant,
                              borderColor: isSelected ? theme.colors.secondary : theme.colors.outline,
                              opacity: isDisabled ? 0.4 : 1,
                            },
                          ]}
                          accessibilityLabel={day}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: isSelected, disabled: isDisabled }}
                        >
                          <Text style={[typography.labelMedium, { color: isSelected ? theme.colors.onSecondary : theme.colors.onSurfaceVariant }]}>
                            {WEEKDAY_ABBR[day]}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              )}

              {/* Time Range Picker */}
              <Text style={[typography.labelMedium, { color: theme.colors.onSurface, marginTop: spacing.md, marginBottom: spacing.sm }]}>
                Time Range (08:00–20:00, min 3 hrs)
              </Text>
              <TouchableOpacity
                onPress={handleTimeTap}
                style={[styles.timeRangeButton, { borderColor: theme.colors.outline, backgroundColor: theme.colors.surfaceVariant }]}
                accessibilityLabel={
                  timeRange.startTime && timeRange.endTime
                    ? `Time range ${timeRange.startTime} to ${timeRange.endTime}`
                    : timeRange.startTime
                    ? 'Start time selected, tap to pick end time'
                    : 'Tap to pick start time'
                }
                accessibilityHint="Two-step selection: first tap picks start, second tap picks end"
              >
                <Text style={[typography.bodyMedium, { color: theme.colors.onSurface }]}>
                  {timeRange.startTime && timeRange.endTime
                    ? `🕐 ${timeRange.startTime} – ${timeRange.endTime}`
                    : timeRange.startTime
                    ? `🕐 ${timeRange.startTime} → tap to pick end time`
                    : '🕐 Tap to pick start time'}
                </Text>
              </TouchableOpacity>

              {Object.values(timeRange.errors).map((err, idx) => (
                <Text key={idx} style={[typography.bodySmall, { color: theme.colors.error, marginTop: spacing.xs }]}>
                  {err}
                </Text>
              ))}

              {showTimePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="time"
                  is24Hour
                  display="default"
                  onChange={handleNativeTimeChange}
                />
              )}

            </ScrollView>
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button
              onPress={handleCreate}
              disabled={isLoading}
              accessibilityLabel="Create subscription"
            >
              {isLoading ? 'Creating…' : 'Create'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* ── Confirmation Modal ──────────────────────────────────────────────── */}
      <ConfirmationModal
        isVisible={pending.action !== null}
        title={confirmationConfig.title}
        message={confirmationConfig.message}
        confirmLabel={confirmationConfig.confirmLabel}
        confirmVariant={confirmationConfig.confirmVariant}
        isLoading={isLoading}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </View>
  );
};

// ---------- styles ---------------------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.sm, paddingBottom: spacing.xxl },
  createButton: {
    marginHorizontal: spacing.xs,
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
  },
  // ── card ──────────────────────────────────────────────────────────────────
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  scheduleInfo: { marginVertical: spacing.sm },
  freqBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.full,
  },
  actionRow: { flexDirection: 'row', marginTop: spacing.sm },
  actionButton: { marginRight: spacing.xs },
  // ── empty / error ──────────────────────────────────────────────────────────
  empty: { padding: spacing.xxl, alignItems: 'center' },
  errorBanner: { padding: spacing.md, margin: spacing.sm, borderRadius: borderRadius.md },
  // ── dialog ─────────────────────────────────────────────────────────────────
  dialog: { maxHeight: '90%' },
  dialogScroll: { maxHeight: 500 },
  dialogInput: { marginBottom: spacing.md },
  errorBox: { padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.md },
  // ── nanny search ───────────────────────────────────────────────────────────
  nannyResultsContainer: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    marginVertical: spacing.sm,
    maxHeight: 200,
  },
  nannyResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  nannyAvatar: { fontSize: 28, marginRight: spacing.md },
  nannyInfo: { flex: 1 },
  selectedNannyBox: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  // ── frequency ──────────────────────────────────────────────────────────────
  frequencyRow: { flexDirection: 'row', gap: spacing.sm },
  frequencyButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  // ── weekday chips ──────────────────────────────────────────────────────────
  weekdayGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  weekdayChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.full,
    alignItems: 'center',
  },
  // ── time range ──────────────────────────────────────────────────────────────
  timeRangeButton: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
});

export default SubscriptionScreen;
