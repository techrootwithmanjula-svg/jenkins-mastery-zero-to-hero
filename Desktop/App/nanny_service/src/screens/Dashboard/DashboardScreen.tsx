import React, { useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, FlatList, Pressable, Platform } from 'react-native';
import { Text, Button, IconButton, Avatar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppTheme, palette } from '../../theme';
import { spacing, borderRadius, shadows } from '../../theme/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import type { RootState } from '../../store';
import { NannyCard, ScheduleModal } from '../../components';
import { DashboardStackParamList, RootStackParamList } from '../../navigation/types';
import { mockNannies, MOCK_ADDRESS } from '../../mocks/data';

type DashboardNavProp = CompositeNavigationProp<
  NativeStackNavigationProp<DashboardStackParamList, 'Dashboard'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const MARKETING_CARDS = [
  {
    id: 'trained-care',
    title: 'Trained Caregivers',
    subtitle: 'Verified and experienced nannies',
    icon: 'shield-check-outline' as const,
  },
  {
    id: 'fulltime',
    title: 'Full-Time Nanny',
    subtitle: 'Ideal for working families',
    icon: 'baby-face-outline' as const,
  },
  {
    id: 'newborn',
    title: 'Newborn and Infant Care',
    subtitle: 'Covering feeding, swaddling etc',
    icon: 'baby-bottle-outline' as const,
  },
  {
    id: 'education',
    title: 'Childhood Education',
    subtitle: 'Early childhood development',
    icon: 'book-open-variant' as const,
  },
  {
    id: 'backup-care',
    title: 'Backup Care',
    subtitle: 'Reliable help when plans change',
    icon: 'clock-check-outline' as const,
  },
];

const ACTION_CARDS = [
  {
    id: 'babysitting',
    title: 'Babysitting',
    subtitle: 'Find available babysitters now',
    icon: 'home-outline' as const,
    ctaLabel: 'Book now',
  },
  {
    id: 'admin',
    title: 'Admin',
    subtitle: 'Open admin controls dashboard',
    icon: 'shield-account-outline' as const,
    ctaLabel: 'Open admin',
  },
] as const;

/**
 * Dashboard screen with gradient header, collapsible baby card,
 * schedule section, service grid, and featured nanny list.
 */
const DashboardScreen: React.FC = () => {
  const { theme, toggleTheme, isDark } = useAppTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<DashboardNavProp>();
  const user = useAppSelector((state: RootState) => state.auth.user);

  const [selectedBabyIndex, setSelectedBabyIndex] = useState(0);
  const [babyCardExpanded, setBabyCardExpanded] = useState(true);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);

  const babies = user?.babyDetails ?? [];
  const selectedBaby = babies[selectedBabyIndex] ?? null;
  const childName = selectedBaby?.name || 'your child';

  const handleBabyToggle = useCallback(() => {
    setBabyCardExpanded((prev) => !prev);
  }, []);

  const handleBabyCycle = useCallback(() => {
    if (babies.length > 1) {
      setSelectedBabyIndex((prev) => (prev + 1) % babies.length);
    }
  }, [babies.length]);

  const handleSchedule = useCallback(
    (date: string, startTime: string, endTime: string) => {
      setScheduleModalVisible(false);
      navigation.navigate('NannyList', { date, startTime, endTime });
    },
    [navigation],
  );

  const handleActionCardPress = useCallback(
    (actionId: 'babysitting' | 'admin') => {
      if (actionId === 'babysitting') {
        navigation.navigate('Appointments', {
          serviceId: 'babysitting',
          serviceTitle: 'Babysitting',
        });
        return;
      }

      navigation.navigate('AdminMain');
    },
    [navigation],
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* ── Purple Gradient Header ────────────────────────────── */}
      <LinearGradient
        colors={['#5A3EC7', '#9B7FFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        {/* Greeting row */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text variant="headlineMedium" style={styles.greetingText}>
              Hi, {user?.name?.split(' ')[0] || 'there'}!
            </Text>
            <Text variant="bodyMedium" style={styles.greetingSubtext}>
              Welcome back! 👋
            </Text>
          </View>
          <IconButton
            icon="bell-outline"
            iconColor="#FFFFFF"
            size={24}
            onPress={() => navigation.navigate('Notifications')}
            accessibilityLabel="Notifications"
          />
          <IconButton
            icon={isDark ? 'weather-sunny' : 'weather-night'}
            iconColor="#FFFFFF"
            size={24}
            onPress={toggleTheme}
            accessibilityLabel="Toggle theme"
          />
        </View>

        {/* ── Collapsible Baby Selector Card ──────────────── */}
        <Pressable
          style={[styles.childCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}
          onPress={handleBabyToggle}
          onLongPress={handleBabyCycle}
          accessibilityRole="button"
          accessibilityLabel={`Baby selector: ${childName}. ${babyCardExpanded ? 'Tap to collapse' : 'Tap to expand'}. Long press to switch baby.`}
        >
          {babyCardExpanded ? (
            <View style={styles.childCardExpanded}>
              {selectedBaby?.image ? (
                <Avatar.Image
                  size={48}
                  source={{ uri: selectedBaby.image }}
                  style={styles.babyAvatar}
                />
              ) : (
                <Avatar.Text size={48} label={childName.charAt(0)} style={styles.babyAvatar} />
              )}
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium" style={{ color: '#FFFFFF', fontWeight: '600' }}>
                  {childName}
                </Text>
                <View style={styles.locationRow}>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={14}
                    color="rgba(255,255,255,0.7)"
                  />
                  <Text
                    variant="bodySmall"
                    style={{ color: 'rgba(255,255,255,0.7)', marginLeft: 4 }}
                  >
                    {MOCK_ADDRESS}
                  </Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-up" size={22} color="rgba(255,255,255,0.7)" />
            </View>
          ) : (
            <View style={styles.childCardCollapsed}>
              <Text variant="titleMedium" style={{ color: '#FFFFFF', fontWeight: '600', flex: 1 }}>
                {childName}
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={22} color="rgba(255,255,255,0.7)" />
            </View>
          )}
        </Pressable>
      </LinearGradient>

      {/* ── No Services Planned / Schedule Row ───────────── */}
      <View style={[styles.scheduleCard, { backgroundColor: theme.colors.surface }, shadows.sm]}>
        <View style={{ flex: 1 }}>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
            No services planned for <Text style={{ fontWeight: '700' }}>{childName}</Text>
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={() => setScheduleModalVisible(true)}
          style={styles.scheduleButton}
          contentStyle={styles.scheduleButtonContent}
          accessibilityLabel="Schedule a nanny session"
        >
          Schedule
        </Button>
      </View>

      {/* ── Marketing Cards (view-only) ───────────────────── */}
      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={{ color: theme.colors.onBackground }}>
          Why parents choose us
        </Text>
      </View>
      <View style={styles.serviceGrid}>
        {MARKETING_CARDS.map((card) => (
          <View
            key={card.id}
            testID={`marketing-card-${card.id}`}
            accessibilityLabel={`${card.title}. ${card.subtitle}`}
            style={[styles.serviceCard, { backgroundColor: theme.colors.surface }, shadows.sm]}
          >
            <View style={styles.serviceIconCircle}>
              <MaterialCommunityIcons name={card.icon} size={28} color={palette.primary600} />
            </View>
            <Text
              variant="labelLarge"
              style={{ color: theme.colors.onSurface, marginTop: spacing.sm }}
              numberOfLines={2}
            >
              {card.title}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
              numberOfLines={2}
            >
              {card.subtitle}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Action Cards (clickable) ─────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={{ color: theme.colors.onBackground }}>
          Quick actions
        </Text>
      </View>
      <View style={styles.actionGrid}>
        {ACTION_CARDS.map((action) => (
          <Pressable
            key={action.id}
            testID={`action-card-${action.id}`}
            onPress={() => handleActionCardPress(action.id)}
            accessibilityRole="button"
            accessibilityLabel={`${action.title}. ${action.subtitle}. ${action.ctaLabel}`}
            style={[styles.actionCard, { backgroundColor: theme.colors.surface }, shadows.sm]}
          >
            <View style={styles.actionCardHeader}>
              <View style={styles.serviceIconCircle}>
                <MaterialCommunityIcons name={action.icon} size={28} color={palette.primary600} />
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={22}
                color={theme.colors.onSurfaceVariant}
              />
            </View>
            <Text
              variant="titleSmall"
              style={{ color: theme.colors.onSurface, marginTop: spacing.sm }}
              numberOfLines={1}
            >
              {action.title}
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: spacing.xs }}
              numberOfLines={2}
            >
              {action.subtitle}
            </Text>
            <Text
              variant="labelMedium"
              style={{ color: theme.colors.primary, marginTop: spacing.sm }}
            >
              {action.ctaLabel}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ── Best Baby Sitters ─────────────────────────────── */}
      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={{ color: theme.colors.onBackground }}>
          Best baby sitters
        </Text>
        <Pressable
          onPress={() => navigation.navigate('NannyList', { date: '', startTime: '', endTime: '' })}
        >
          <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
            See all
          </Text>
        </Pressable>
      </View>
      <FlatList
        data={mockNannies.filter((n) => n.isOnline).slice(0, 4)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NannyCard
            nanny={item}
            variant="full"
            style={{ width: 320 }}
            onPress={() => navigation.navigate('NannyDetail', { nannyId: item.id })}
            onFavoriteToggle={() => {}}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: spacing.md }}
      />

      {/* ── Logout ────────────────────────────────────────── */}
      <Button
        mode="text"
        onPress={() => dispatch(logout())}
        style={styles.logoutButton}
        textColor={theme.colors.error}
        accessibilityLabel="Logout"
      >
        Logout
      </Button>

      {/* ── Schedule Modal ────────────────────────────────── */}
      <ScheduleModal
        visible={scheduleModalVisible}
        onDismiss={() => setScheduleModalVisible(false)}
        onSchedule={handleSchedule}
        babyName={childName}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  gradientHeader: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  greetingText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  greetingSubtext: {
    color: 'rgba(255,255,255,0.85)',
  },

  /* Baby selector card */
  childCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  childCardExpanded: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childCardCollapsed: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  babyAvatar: {
    marginRight: spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  /* Schedule card */
  scheduleCard: {
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleButton: {
    borderRadius: borderRadius.xl,
    marginLeft: spacing.sm,
  },
  scheduleButtonContent: {
    paddingVertical: spacing.xs,
  },

  /* Section headers */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  /* Service category grid */
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '46%',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    marginHorizontal: '1.5%',
    alignItems: 'center',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.sm,
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '46%',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    marginHorizontal: '1.5%',
  },
  actionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: palette.primary50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Logout */
  logoutButton: {
    marginTop: spacing.xl,
  },
});

export default DashboardScreen;
