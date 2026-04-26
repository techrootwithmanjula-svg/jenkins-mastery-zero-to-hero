import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText, IconButton, Menu, Avatar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../theme';
import { palette } from '../../theme/colors';
import { spacing, borderRadius, shadows } from '../../theme/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import type { RootState } from '../../store';
import { fetchProfile } from '../../store/slices/profileSlice';
import { LoadingSpinner, ErrorMessage, ProfileFieldRow } from '../../components';
import { profileSchema } from '../../utils/validation';

/** Local baby card form data type. */
interface BabyFormData {
  tempId: string;
  name: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  priorDisease: string;
  notes: string;
}

const GENDER_OPTIONS: Array<{ label: string; value: 'male' | 'female' | 'other' }> = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

/**
 * Profile screen: modern card-based UI with gradient header, edit/save toggle,
 * extended profile fields, and dynamic baby cards.
 */
const ProfileScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const dispatch = useAppDispatch();
  const { profile, isLoading, error } = useAppSelector((state: RootState) => state.profile);
  const authUser = useAppSelector((state: RootState) => state.auth.user);

  // Edit mode toggle
  const [isEditing, setIsEditing] = useState(false);

  // Profile fields (local state)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [fatherName, setFatherName] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Gender dropdown
  const [genderMenuVisible, setGenderMenuVisible] = useState(false);

  // Baby cards (local state array)
  const [babies, setBabies] = useState<BabyFormData[]>([]);
  const [babyGenderMenuVisible, setBabyGenderMenuVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Sync profile data to local state
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setAge(profile.age?.toString() ?? '');
      setAddress(profile.address ?? '');
      setEmergencyContact(profile.emergencyContact ?? '');
      setGender(profile.gender ?? '');
      setFatherName(profile.fatherName ?? '');

      // Map existing babies to form data
      if (profile.babyDetails?.length) {
        setBabies(
          profile.babyDetails.map((baby) => ({
            tempId: baby.id,
            name: baby.name,
            age: baby.age.toString(),
            gender: baby.gender,
            priorDisease: baby.priorDisease ?? '',
            notes: baby.notes ?? '',
          })),
        );
      }
    }
  }, [profile]);

  /** Toggle between edit and save mode. On save, validate first. */
  const handleEditToggle = useCallback(async () => {
    if (isEditing) {
      // Validate before saving
      setValidationErrors({});
      try {
        await profileSchema.validate(
          {
            name,
            email,
            age: age ? Number(age) : undefined,
            address: address || undefined,
            emergencyContact: emergencyContact || undefined,
            gender: gender || undefined,
            fatherName: fatherName || undefined,
          },
          { abortEarly: false },
        );
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
      // Save locally (UI-only, no API dispatch)
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [isEditing, name, email, age, address, emergencyContact, gender, fatherName]);

  /** Add a new empty baby card. */
  const handleAddBaby = useCallback(() => {
    setBabies((prev) => [
      ...prev,
      {
        tempId: Date.now().toString(),
        name: '',
        age: '',
        gender: 'male',
        priorDisease: '',
        notes: '',
      },
    ]);
  }, []);

  /** Remove a baby card by tempId. */
  const handleRemoveBaby = useCallback((tempId: string) => {
    setBabies((prev) => prev.filter((b) => b.tempId !== tempId));
    setBabyGenderMenuVisible((prev) => {
      const next = { ...prev };
      delete next[tempId];
      return next;
    });
  }, []);

  /** Update a specific baby card field. */
  const updateBabyField = useCallback(
    (tempId: string, field: keyof BabyFormData, value: string) => {
      setBabies((prev) => prev.map((b) => (b.tempId === tempId ? { ...b, [field]: value } : b)));
    },
    [],
  );

  /** Get display label for gender value. */
  const getGenderLabel = (value: string): string => {
    const opt = GENDER_OPTIONS.find((o) => o.value === value);
    return opt ? opt.label : '';
  };

  if (isLoading && !profile) return <LoadingSpinner message="Loading profile..." />;
  if (error && !profile)
    return <ErrorMessage message={error} onRetry={() => dispatch(fetchProfile())} />;

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
        {/* T010: Gradient Header with Avatar */}
        <LinearGradient
          colors={[theme.colors.primary, palette.primary200]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientHeader}
        >
          <View style={styles.avatarContainer}>
            {profile?.profileImage ? (
              <Avatar.Image
                size={100}
                source={{ uri: profile.profileImage }}
                accessibilityLabel="Profile photo"
              />
            ) : (
              <Avatar.Icon
                size={100}
                icon="account"
                style={{ backgroundColor: palette.primary700 }}
                accessibilityLabel="Profile photo placeholder"
              />
            )}
            {isEditing && (
              <IconButton
                icon="camera"
                size={18}
                iconColor={palette.white}
                style={[
                  styles.cameraIcon,
                  { backgroundColor: theme.colors.primary, borderColor: palette.white },
                ]}
                accessibilityLabel="Change profile photo"
                onPress={() => {}}
              />
            )}
          </View>
          <Text
            variant="headlineMedium"
            style={[styles.userName, { color: theme.colors.onPrimary }]}
          >
            {name || 'Your Name'}
          </Text>
        </LinearGradient>

        {/* Profile Card with all fields */}
        <View style={[styles.profileCard, { backgroundColor: theme.colors.surface }, shadows.sm]}>
          {/* Name */}
          {isEditing ? (
            <>
              <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                error={!!validationErrors.name}
                accessibilityLabel="Your name"
              />
              {validationErrors.name && <HelperText type="error">{validationErrors.name}</HelperText>}
            </>
          ) : (
            <ProfileFieldRow icon="account-outline" label="Name" value={name} />
          )}

          {/* Mobile Number — always disabled */}
          {isEditing ? (
            <TextInput
              label="Mobile Number"
              value={authUser?.mobile || profile?.mobile || ''}
              mode="outlined"
              disabled
              style={styles.input}
              left={<TextInput.Affix text="+91" />}
              accessibilityLabel="Mobile number (not editable)"
            />
          ) : (
            <ProfileFieldRow icon="phone-outline" label="Mobile Number" value={authUser?.mobile || profile?.mobile || ''} />
          )}

          {/* Age */}
          {isEditing ? (
            <>
              <TextInput
                label="Age"
                value={age}
                onChangeText={setAge}
                mode="outlined"
                keyboardType="number-pad"
                style={styles.input}
                error={!!validationErrors.age}
                accessibilityLabel="Your age"
              />
              {validationErrors.age && <HelperText type="error">{validationErrors.age}</HelperText>}
            </>
          ) : (
            <ProfileFieldRow icon="calendar-account-outline" label="Age" value={age} />
          )}

          {/* Address */}
          {isEditing ? (
            <>
              <TextInput
                label="Address"
                value={address}
                onChangeText={setAddress}
                mode="outlined"
                multiline
                style={styles.input}
                error={!!validationErrors.address}
                accessibilityLabel="Your address"
              />
              {validationErrors.address && (
                <HelperText type="error">{validationErrors.address}</HelperText>
              )}
            </>
          ) : (
            <ProfileFieldRow icon="map-marker-outline" label="Address" value={address} />
          )}

          {/* Emergency Contact */}
          {isEditing ? (
            <>
              <TextInput
                label="Emergency Contact"
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
                error={!!validationErrors.emergencyContact}
                accessibilityLabel="Emergency contact number"
              />
              {validationErrors.emergencyContact && (
                <HelperText type="error">{validationErrors.emergencyContact}</HelperText>
              )}
            </>
          ) : (
            <ProfileFieldRow icon="phone-alert-outline" label="Emergency Contact" value={emergencyContact} />
          )}

          {/* Email */}
          {isEditing ? (
            <>
              <TextInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                error={!!validationErrors.email}
                accessibilityLabel="Your email address"
              />
              {validationErrors.email && <HelperText type="error">{validationErrors.email}</HelperText>}
            </>
          ) : (
            <ProfileFieldRow icon="email-outline" label="Email" value={email} />
          )}

          {/* Gender — Menu dropdown */}
          {isEditing ? (
            <>
              <Menu
                visible={genderMenuVisible}
                onDismiss={() => setGenderMenuVisible(false)}
                anchor={
                  <TextInput
                    label="Gender"
                    value={getGenderLabel(gender)}
                    mode="outlined"
                    editable={false}
                    style={styles.input}
                    right={
                      <TextInput.Icon
                        icon="chevron-down"
                        onPress={() => setGenderMenuVisible(true)}
                        accessibilityLabel="Select gender"
                      />
                    }
                    onPressIn={() => setGenderMenuVisible(true)}
                    error={!!validationErrors.gender}
                    accessibilityLabel="Gender selection"
                    accessibilityRole="button"
                  />
                }
              >
                {GENDER_OPTIONS.map((opt) => (
                  <Menu.Item
                    key={opt.value}
                    onPress={() => {
                      setGender(opt.value);
                      setGenderMenuVisible(false);
                    }}
                    title={opt.label}
                  />
                ))}
              </Menu>
              {validationErrors.gender && (
                <HelperText type="error">{validationErrors.gender}</HelperText>
              )}
            </>
          ) : (
            <ProfileFieldRow icon="gender-male-female" label="Gender" value={getGenderLabel(gender)} />
          )}

          {/* Father Name */}
          {isEditing ? (
            <>
              <TextInput
                label="Father Name"
                value={fatherName}
                onChangeText={setFatherName}
                mode="outlined"
                style={styles.input}
                error={!!validationErrors.fatherName}
                accessibilityLabel="Father's name"
              />
              {validationErrors.fatherName && (
                <HelperText type="error">{validationErrors.fatherName}</HelperText>
              )}
            </>
          ) : (
            <ProfileFieldRow icon="account-supervisor-outline" label="Father Name" value={fatherName} />
          )}
        </View>

        {/* Baby Details Section */}
        <Text
          variant="titleLarge"
          style={[styles.sectionHeader, { color: theme.colors.onBackground }]}
        >
          Baby Details
        </Text>

        {babies.map((baby) => (
          <View
            key={baby.tempId}
            style={[styles.babyCard, { backgroundColor: theme.colors.surface }, shadows.sm]}
          >
            {/* Baby card header */}
            <View style={styles.babyCardHeader}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, flex: 1 }}>
                {isEditing ? (baby.name || 'New Baby') : (baby.name || 'Baby')}
              </Text>
              {isEditing && (
                <IconButton
                  icon="delete-outline"
                  iconColor={theme.colors.error}
                  size={20}
                  onPress={() => handleRemoveBaby(baby.tempId)}
                  accessibilityLabel={`Remove ${baby.name || 'baby'}`}
                />
              )}
            </View>

            {isEditing ? (
              <>
                <TextInput
                  label="Baby Name"
                  value={baby.name}
                  onChangeText={(v) => updateBabyField(baby.tempId, 'name', v)}
                  mode="outlined"
                  style={styles.input}
                  accessibilityLabel="Baby name"
                />

                <TextInput
                  label="Age"
                  value={baby.age}
                  onChangeText={(v) => updateBabyField(baby.tempId, 'age', v)}
                  mode="outlined"
                  keyboardType="number-pad"
                  style={styles.input}
                  accessibilityLabel="Baby age"
                />

                {/* Baby Gender dropdown */}
                <Menu
                  visible={!!babyGenderMenuVisible[baby.tempId]}
                  onDismiss={() =>
                    setBabyGenderMenuVisible((prev) => ({ ...prev, [baby.tempId]: false }))
                  }
                  anchor={
                    <TextInput
                      label="Gender"
                      value={getGenderLabel(baby.gender)}
                      mode="outlined"
                      editable={false}
                      style={styles.input}
                      accessibilityRole="button"
                      right={
                        <TextInput.Icon
                          icon="chevron-down"
                          onPress={() =>
                            setBabyGenderMenuVisible((prev) => ({
                              ...prev,
                              [baby.tempId]: true,
                            }))
                          }
                          accessibilityLabel="Select baby gender"
                        />
                      }
                      onPressIn={() =>
                        setBabyGenderMenuVisible((prev) => ({
                          ...prev,
                          [baby.tempId]: true,
                        }))
                      }
                      accessibilityLabel="Baby gender selection"
                    />
                  }
                >
                  {GENDER_OPTIONS.map((opt) => (
                    <Menu.Item
                      key={opt.value}
                      onPress={() => {
                        updateBabyField(baby.tempId, 'gender', opt.value);
                        setBabyGenderMenuVisible((prev) => ({
                          ...prev,
                          [baby.tempId]: false,
                        }));
                      }}
                      title={opt.label}
                    />
                  ))}
                </Menu>

                <TextInput
                  label="Any Prior Disease"
                  value={baby.priorDisease}
                  onChangeText={(v) => updateBabyField(baby.tempId, 'priorDisease', v)}
                  mode="outlined"
                  style={styles.input}
                  accessibilityLabel="Baby prior disease"
                />

                <TextInput
                  label="Notes"
                  value={baby.notes}
                  onChangeText={(v) => updateBabyField(baby.tempId, 'notes', v)}
                  mode="outlined"
                  multiline
                  style={styles.input}
                  accessibilityLabel="Baby notes"
                />
              </>
            ) : (
              <>
                <ProfileFieldRow icon="calendar" label="Age" value={baby.age} />
                <ProfileFieldRow icon="gender-male-female"  label="Gender" value={getGenderLabel(baby.gender)} />
                <ProfileFieldRow icon="medical-bag" label="Prior Disease" value={baby.priorDisease} />
                <ProfileFieldRow icon="note-text-outline" label="Notes" value={baby.notes} />
              </>
            )}
          </View>
        ))}

        {/* T015: Add Baby button */}
        {isEditing && (
          <Button
            mode="outlined"
            onPress={handleAddBaby}
            style={[styles.addBabyButton, { borderColor: theme.colors.primary }]}
            textColor={theme.colors.primary}
            accessibilityLabel="Add a new baby"
          >
            + Add Baby
          </Button>
        )}
      </ScrollView>
      {/* Sticky footer — Edit Profile / Save button */}
      <View
        style={[
          styles.stickyFooter,
          {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.surfaceVariant,
          },
          shadows.sm,
        ]}
      >
        <Button
          mode="contained"
          onPress={handleEditToggle}
          loading={isLoading}
          style={[styles.editSaveButton, { backgroundColor: theme.colors.primary }]}
          labelStyle={{ color: theme.colors.onPrimary }}
          accessibilityLabel={isEditing ? 'Save profile changes' : 'Edit profile'}
        >
          {isEditing ? 'Save' : 'Edit Profile'}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

/* StyleSheet using design tokens — no hardcoded colors */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 80,
  },
  gradientHeader: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: spacing.lg,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    borderWidth: 2,
    width: 44,
    height: 44,
  },
  userName: {
    marginTop: spacing.sm,
    textAlign: 'center',
    fontWeight: '600',
  },
  profileCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: 20,
  },
  input: {
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  editSaveButton: {
    borderRadius: borderRadius.xl,
  },
  sectionHeader: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  babyCard: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  babyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  addBabyButton: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: borderRadius.xl,
  },
});

export default ProfileScreen;
