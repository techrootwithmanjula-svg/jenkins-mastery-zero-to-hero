import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Text, Avatar, IconButton } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAppTheme, palette } from '../theme';
import { spacing, borderRadius, shadows } from '../theme/tokens';
import { Nanny } from '../models';
import { formatRating, formatCurrency } from '../utils/helpers';

type NannyCardVariant = 'compact' | 'full' | 'featured';

interface NannyCardProps {
  nanny: Nanny;
  onPress?: () => void;
  onFavoriteToggle?: (nannyId: string) => void;
  style?: ViewStyle;
  /** @deprecated Use variant="compact" instead */
  compact?: boolean;
  variant?: NannyCardVariant;
  testID?: string;
}

/**
 * Reusable nanny card showing image, name, rating, rate, distance, heart icon.
 * Supports three variants: compact, full (default), and featured.
 */
const NannyCard: React.FC<NannyCardProps> = ({
  nanny,
  onPress,
  onFavoriteToggle,
  style,
  compact,
  variant,
  testID,
}) => {
  const { theme } = useAppTheme();

  // Backward compat: compact prop maps to 'compact' variant
  const resolvedVariant: NannyCardVariant = variant ?? (compact ? 'compact' : 'full');

  if (resolvedVariant === 'featured') {
    return (
      <Pressable
        testID={testID}
        onPress={onPress}
        style={[
          styles.featuredContainer,
          { backgroundColor: theme.colors.surface },
          shadows.sm,
          style,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`View ${nanny.name}'s profile`}
      >
        {/* Heart icon — top right */}
        <Pressable
          onPress={() => onFavoriteToggle?.(nanny.id)}
          style={styles.featuredHeart}
          accessibilityLabel={nanny.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          hitSlop={8}
        >
          <MaterialCommunityIcons
            name={nanny.isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={nanny.isFavorite ? palette.favorite : theme.colors.onSurfaceVariant}
          />
        </Pressable>

        {/* Avatar */}
        {nanny.image ? (
          <Avatar.Image size={64} source={{ uri: nanny.image }} style={{ alignSelf: 'center' }} />
        ) : (
          <Avatar.Text size={64} label={nanny.name.charAt(0)} style={{ alignSelf: 'center' }} />
        )}

        {/* Name */}
        <Text
          variant="bodyMedium"
          numberOfLines={1}
          style={{
            color: theme.colors.onSurface,
            fontWeight: '600',
            marginTop: spacing.sm,
            textAlign: 'center',
          }}
        >
          {nanny.name}
        </Text>

        {/* Distance badge */}
        <View style={styles.featuredDistanceBadge}>
          <MaterialCommunityIcons name="map-marker" size={12} color={palette.primary600} />
          <Text
            variant="labelSmall"
            style={{ color: theme.colors.onSurfaceVariant, marginLeft: 2 }}
          >
            {nanny.distance} km
          </Text>
        </View>

        {/* Rating + reviews */}
        <View style={styles.featuredRatingRow}>
          <MaterialCommunityIcons name="star" size={14} color="#FFB300" />
          <Text
            variant="labelSmall"
            style={{ color: theme.colors.onSurface, fontWeight: '600', marginLeft: 2 }}
          >
            {formatRating(nanny.rating)}
          </Text>
          <Text
            variant="labelSmall"
            style={{ color: theme.colors.onSurfaceVariant, marginLeft: spacing.xs }}
          >
            ({nanny.reviewCount})
          </Text>
        </View>

        {/* Price */}
        <Text
          variant="titleMedium"
          style={{
            color: theme.colors.onSurface,
            fontWeight: '700',
            textAlign: 'center',
            marginTop: spacing.xs,
          }}
        >
          {formatCurrency(nanny.hourlyRate)}
          <Text
            variant="labelSmall"
            style={{ color: theme.colors.onSurfaceVariant, fontWeight: '400' }}
          >
            /hr
          </Text>
        </Text>
      </Pressable>
    );
  }

  if (resolvedVariant === 'compact') {
    return (
      <Pressable
        testID={testID}
        onPress={onPress}
        style={[
          styles.compactContainer,
          { backgroundColor: theme.colors.surface },
          shadows.sm,
          style,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`View ${nanny.name}'s profile`}
      >
        {nanny.image ? (
          <Avatar.Image size={48} source={{ uri: nanny.image }} />
        ) : (
          <Avatar.Text size={48} label={nanny.name.charAt(0)} />
        )}
        <Text
          variant="bodySmall"
          numberOfLines={1}
          style={{ color: theme.colors.onSurface, marginTop: spacing.xs, fontWeight: '600' }}
        >
          {nanny.name.split(' ')[0]}
        </Text>
        <Text variant="labelSmall" style={{ color: theme.colors.primary }}>
          ★ {formatRating(nanny.rating)}
        </Text>
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {formatCurrency(nanny.hourlyRate)}/hr
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={[styles.container, { backgroundColor: theme.colors.surface }, shadows.sm, style]}
      accessibilityRole="button"
      accessibilityLabel={`View ${nanny.name}'s profile`}
    >
      <View style={styles.row}>
        <View style={{ position: 'relative' }}>
          {nanny.image ? (
            <Avatar.Image size={56} source={{ uri: nanny.image }} />
          ) : (
            <Avatar.Text size={56} label={nanny.name.charAt(0)} />
          )}
          <View
            style={[styles.statusDot, { backgroundColor: nanny.isOnline ? '#4CAF50' : '#F44336' }]}
            accessibilityLabel={nanny.isOnline ? 'Online' : 'Offline'}
          />
        </View>
        <View style={styles.info}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            {nanny.name}
          </Text>
          <View style={styles.metaRow}>
            <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
              📍 {nanny.distance} km away
            </Text>
          </View>
          <View style={styles.ratingRow}>
            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
              ★ {formatRating(nanny.rating)}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginLeft: spacing.sm }}
            >
              {nanny.reviewCount} reviews
            </Text>
          </View>
        </View>
        <View style={styles.priceColumn}>
          <IconButton
            icon={nanny.isFavorite ? 'heart' : 'heart-outline'}
            iconColor={nanny.isFavorite ? palette.favorite : theme.colors.onSurfaceVariant}
            size={22}
            onPress={() => onFavoriteToggle?.(nanny.id)}
            accessibilityLabel={nanny.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            style={{ margin: 0 }}
          />
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
            {formatCurrency(nanny.hourlyRate)}
          </Text>
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            per hour
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.xs,
  },
  compactContainer: {
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    marginRight: spacing.sm,
    alignItems: 'center',
    width: 100,
  },
  featuredContainer: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.sm,
    width: 180,
    position: 'relative',
  },
  featuredHeart: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 1,
  },
  featuredDistanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  featuredRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  priceColumn: {
    alignItems: 'center',
    minWidth: 70,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

export default NannyCard;
