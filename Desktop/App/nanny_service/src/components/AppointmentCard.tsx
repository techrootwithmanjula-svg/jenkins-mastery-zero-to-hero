import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { spacing, borderRadius, shadows } from '../theme/tokens';
import { Appointment } from '../models';

interface AppointmentCardProps {
  appointment: Appointment;
  onPress: () => void;
  onMorePress?: () => void;
  style?: ViewStyle;
}

const formatTo12Hour = (time24: string): string => {
  const [hourPart, minutePart] = time24.split(':').map(Number);
  const period = hourPart >= 12 ? 'PM' : 'AM';
  const hour12 = hourPart % 12 || 12;
  const minutes = String(minutePart).padStart(2, '0');
  return `${hour12}:${minutes} ${period}`;
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onPress,
  onMorePress,
  style,
}) => {
  const timeRangeLabel = `${formatTo12Hour(appointment.startTime)} - ${formatTo12Hour(appointment.endTime)}`;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { backgroundColor: appointment.color }, style]}
      accessibilityRole="button"
      accessibilityLabel={`${appointment.title}. ${appointment.categoryLabel}. ${timeRangeLabel}. User: ${appointment.userName}. Address: ${appointment.userAddress}`}
    >
      <View style={styles.topRow}>
        <View style={styles.categoryChip}>
          <Text variant="labelSmall" style={styles.categoryText}>
            {appointment.categoryLabel}
          </Text>
        </View>
        {onMorePress ? (
          <IconButton icon="dots-horizontal" iconColor="#FFFFFF" size={20} onPress={onMorePress} />
        ) : null}
      </View>

      <Text variant="titleMedium" style={styles.titleText}>
        {appointment.title}
      </Text>

      <View style={styles.timeRow}>
        <MaterialCommunityIcons name="clock-outline" size={14} color="rgba(255,255,255,0.8)" />
        <Text variant="bodySmall" style={styles.timeText}>
          {timeRangeLabel}
        </Text>
      </View>

      <View style={styles.userRow}>
        <MaterialCommunityIcons name="account-outline" size={14} color="rgba(255,255,255,0.7)" />
        <Text variant="bodySmall" style={styles.userText}>
          {appointment.userName}
        </Text>
        <Text variant="bodySmall" style={styles.contactText}>
          {appointment.userContact}
        </Text>
      </View>

      <View style={styles.addressRow}>
        <MaterialCommunityIcons name="map-marker-outline" size={14} color="rgba(255,255,255,0.7)" />
        <Text variant="bodySmall" style={styles.addressText} numberOfLines={1}>
          {appointment.userAddress}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: 80,
    ...shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  categoryChip: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  categoryText: {
    color: '#FFFFFF',
  },
  titleText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  timeText: {
    color: 'rgba(255,255,255,0.8)',
    marginLeft: spacing.xs,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  userText: {
    color: 'rgba(255,255,255,0.7)',
    marginLeft: spacing.xs,
  },
  contactText: {
    color: 'rgba(255,255,255,0.6)',
    marginLeft: spacing.sm,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  addressText: {
    color: 'rgba(255,255,255,0.7)',
    marginLeft: spacing.xs,
    flex: 1,
  },
});

export default AppointmentCard;
