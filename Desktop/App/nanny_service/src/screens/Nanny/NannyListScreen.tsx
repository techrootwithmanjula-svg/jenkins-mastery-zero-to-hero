import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Modal } from 'react-native';
import { Text, IconButton, Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../../theme';
import { spacing, borderRadius } from '../../theme/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { searchNannies } from '../../store/slices/nannySlice';
import type { RootState } from '../../store';
import { NannyCard, LoadingSpinner, ErrorMessage } from '../../components';
import { DashboardStackParamList } from '../../navigation/types';
import { Nanny, NannyListPreviewState } from '../../models';

type Props = NativeStackScreenProps<DashboardStackParamList, 'NannyList'>;

/**
 * Nanny listing screen with modal profile preview.
 */
const NannyListScreen: React.FC<Props> = ({ route, navigation: _navigation }) => {
  const { date, startTime, endTime } = route.params;
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { nannies, isLoading, error } = useAppSelector((state: RootState) => state.nanny);

  // Screen-local preview state
  const [previewState, setPreviewState] = useState<NannyListPreviewState>({
    isPreviewOpen: false,
    selectedNannyId: null,
    selectedNannySnapshot: undefined,
  });

  useEffect(() => {
    dispatch(searchNannies({ date, startTime, endTime }));
  }, [dispatch, date, startTime, endTime]);

  const handleNannyPress = (nanny: Nanny) => {
    setPreviewState({
      isPreviewOpen: true,
      selectedNannyId: nanny.id,
      selectedNannySnapshot: nanny,
    });
  };

  const handleClosePreview = () => {
    setPreviewState({
      isPreviewOpen: false,
      selectedNannyId: null,
      selectedNannySnapshot: undefined,
    });
  };

  const handleBooking = () => {
    // Booking action from modal - maintain consistency with standard nanny detail flow
    if (previewState.selectedNannySnapshot) {
      handleClosePreview();
      // TODO: Navigate to booking confirmation or initiate booking flow
      // For now, just close modal to return to list context
      // Example future implementation:
      // navigation.navigate('BookingConfirmation', {
      //   nannyId: previewState.selectedNannySnapshot.id,
      //   nannyName: previewState.selectedNannySnapshot.name,
      //   date,
      //   startTime,
      //   endTime,
      // });
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Finding nannies..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => dispatch(searchNannies({ date, startTime, endTime }))}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text
        testID="result-count"
        variant="bodyMedium"
        style={[styles.resultCount, { color: theme.colors.onSurfaceVariant }]}
      >
        {nannies.length} nannies available{date ? ` on ${date}` : ''}
      </Text>
      <FlatList
        data={nannies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NannyCard testID={`nanny-card-${item.id}`} nanny={item} onPress={() => handleNannyPress(item)} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              No nannies available for the selected time. Try different dates or time slots.
            </Text>
          </View>
        }
      />

      {/* Modal Profile Preview */}
      <Modal
        testID="nanny-preview-modal"
        visible={previewState.isPreviewOpen}
        transparent
        animationType="slide"
        onRequestClose={handleClosePreview}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface, borderTopLeftRadius: borderRadius.lg, borderTopRightRadius: borderRadius.lg }]}>
            {/* Modal Header */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.outlineVariant }]}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
                Nanny Profile
              </Text>
              <IconButton
                testID="modal-close-button"
                icon="close"
                iconColor={theme.colors.onSurface}
                size={24}
                onPress={handleClosePreview}
              />
            </View>

            {/* Modal Profile Content */}
            {previewState.selectedNannySnapshot && (
              <View style={styles.profileContent}>
                <Text variant="headlineMedium" style={{ color: theme.colors.onSurface, marginBottom: spacing.sm }}>
                  {previewState.selectedNannySnapshot.name}
                </Text>

                <View style={styles.ratingRow}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                    ★ {previewState.selectedNannySnapshot.rating}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    ({previewState.selectedNannySnapshot.reviewCount} reviews)
                  </Text>
                </View>

                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      Distance
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                      {previewState.selectedNannySnapshot.distance} km
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      Hourly Rate
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                      ${previewState.selectedNannySnapshot.hourlyRate}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      Experience
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                      {previewState.selectedNannySnapshot.experience} yrs
                    </Text>
                  </View>
                </View>

                <View style={styles.specialtiesSection}>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Specialties
                  </Text>
                  <View style={styles.specialtiesList}>
                    {previewState.selectedNannySnapshot.specialties.map((specialty, idx) => (
                      <View key={idx} style={[styles.specialtyTag, { backgroundColor: theme.colors.surfaceVariant }]}>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                          {specialty}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Book Button */}
                <Button
                  testID="modal-book-button"
                  mode="contained"
                  onPress={handleBooking}
                  style={styles.bookButton}
                >
                  Book Now
                </Button>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultCount: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  empty: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    maxHeight: '90%',
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    paddingBottom: spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  profileContent: {
    padding: spacing.md,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  infoItem: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  specialtiesSection: {
    marginBottom: spacing.md,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  specialtyTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  bookButton: {
    marginTop: spacing.md,
  },
});

export default NannyListScreen;
