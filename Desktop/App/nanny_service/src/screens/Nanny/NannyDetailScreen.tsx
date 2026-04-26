import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Text, Button, Chip, Divider } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../../theme';
import { spacing, borderRadius, shadows } from '../../theme/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchNannyById } from '../../store/slices/nannySlice';
import type { RootState } from '../../store';
import { LoadingSpinner, ErrorMessage } from '../../components';
import { formatRating, formatCurrency } from '../../utils/helpers';
import { AvailabilitySlot } from '../../models';
import { DashboardStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<DashboardStackParamList, 'NannyDetail'>;

/**
 * Nanny detail screen showing full profile details.
 */
const NannyDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { nannyId } = route.params;
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { selectedNanny, isLoading, error } = useAppSelector((state: RootState) => state.nanny);

  useEffect(() => {
    dispatch(fetchNannyById(nannyId));
  }, [dispatch, nannyId]);

  if (isLoading || !selectedNanny) {
    return <LoadingSpinner message="Loading nanny details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => dispatch(fetchNannyById(nannyId))} />;
  }

  const nanny = selectedNanny;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Nanny Image */}
      <View style={[styles.imageContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        {nanny.image ? (
          <Image
            source={{ uri: nanny.image }}
            style={styles.image}
            accessibilityLabel={`Photo of ${nanny.name}`}
          />
        ) : (
          <Text style={styles.imagePlaceholder}>👩‍👧</Text>
        )}
      </View>

      {/* Name and Rating */}
      <View style={styles.nameSection}>
        <Text variant="headlineLarge" style={{ color: theme.colors.onBackground }}>
          {nanny.name}
        </Text>
        <View style={styles.ratingRow}>
          <Text style={[styles.ratingText, { color: theme.colors.primary }]}>
            ★ {formatRating(nanny.rating)}
          </Text>
          {nanny.reviewCount > 0 && (
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginLeft: spacing.sm }}
            >
              {nanny.reviewCount} reviews
            </Text>
          )}
          <Chip
            style={{
              backgroundColor: nanny.isOnline ? '#E8F5E9' : '#FFEBEE',
              marginLeft: spacing.sm,
            }}
            textStyle={{
              color: nanny.isOnline ? '#2E7D32' : '#C62828',
              fontSize: 12,
            }}
          >
            {nanny.isOnline ? 'Available' : 'Offline'}
          </Chip>
        </View>
        {nanny.distance > 0 && (
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs }}
          >
            📍 {nanny.distance} km away
          </Text>
        )}
      </View>

      <Divider style={styles.divider} />

      {/* Details */}
      <View style={styles.details}>
        <DetailRow label="Experience" value={`${nanny.experience} years`} theme={theme} />
        <DetailRow label="Hourly Rate" value={formatCurrency(nanny.hourlyRate)} theme={theme} />
      </View>

      {/* Specialties */}
      {nanny.specialties.length > 0 && (
        <View style={styles.section}>
          <Text
            variant="titleMedium"
            style={{ color: theme.colors.onBackground, marginBottom: spacing.sm }}
          >
            Specialties
          </Text>
          <View style={styles.chipRow}>
            {nanny.specialties.map((s: string, i: number) => (
              <Chip key={i} style={styles.chip}>
                {s}
              </Chip>
            ))}
          </View>
        </View>
      )}

      <Divider style={styles.divider} />

      {/* Availability */}
      <View style={styles.section}>
        <Text
          variant="titleMedium"
          style={{ color: theme.colors.onBackground, marginBottom: spacing.sm }}
        >
          Availability
        </Text>
        {nanny.availability.map((slot: AvailabilitySlot, i: number) => (
          <Text
            key={i}
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}
          >
            {slot.day}: {slot.startTime} – {slot.endTime}
          </Text>
        ))}
      </View>

      {/* Book Button */}
      {nanny.isOnline && (
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Booking', { nanny })}
          style={styles.bookButton}
          contentStyle={styles.bookButtonContent}
          accessibilityLabel={`Book ${nanny.name}`}
        >
          Book Now – {formatCurrency(nanny.hourlyRate)}/hr
        </Button>
      )}
    </ScrollView>
  );
};

const DetailRow = ({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: { colors: { onSurfaceVariant: string; onBackground: string } };
}) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
    <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
      {label}
    </Text>
    <Text variant="bodyMedium" style={{ color: theme.colors.onBackground, fontWeight: '600' }}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    fontSize: 64,
  },
  nameSection: {
    marginBottom: spacing.md,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    marginVertical: spacing.md,
  },
  details: {
    marginBottom: spacing.sm,
  },
  section: {
    marginBottom: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    marginRight: 4,
    marginBottom: 4,
  },
  bookButton: {
    marginTop: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  bookButtonContent: {
    paddingVertical: spacing.xs,
  },
});

export default NannyDetailScreen;
