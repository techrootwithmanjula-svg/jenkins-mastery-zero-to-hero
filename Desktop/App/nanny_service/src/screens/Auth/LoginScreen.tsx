import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput as RNTextInput,
  Pressable,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Text, HelperText } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { palette } from '../../theme';
import { spacing, borderRadius } from '../../theme/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { sendOtp, clearError } from '../../store/slices/authSlice';
import type { RootState } from '../../store';
import { mobileSchema } from '../../utils/validation';
import { AuthStackParamList } from '../../navigation/types';

type LoginNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

/**
 * Login screen: full-screen purple branded layout.
 * User enters mobile number to receive OTP.
 */
const LoginScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<LoginNavProp>();
  const { isLoading, error } = useAppSelector((state: RootState) => state.auth);

  const [mobile, setMobile] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSendOtp = async () => {
    setValidationError('');
    dispatch(clearError());

    try {
      await mobileSchema.validate(mobile);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setValidationError(err.message);
      }
      return;
    }

    const result = await dispatch(sendOtp(mobile));
    if (sendOtp.fulfilled.match(result)) {
      navigation.navigate('OtpVerify', { mobile });
    }
  };

  const isSubmitDisabled = isLoading || mobile.length < 10;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={palette.primary800} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Text style={styles.logoEmoji}>👶</Text>
          <Text variant="headlineLarge" style={styles.appName}>
            Nanny Service
          </Text>
          <Text variant="bodyMedium" style={styles.tagline}>
            Safe Babysitters Near You
          </Text>
        </View>

        {/* Phone Input Section */}
        <View style={styles.inputSection}>
          <View style={styles.pillContainer}>
            <Text style={styles.countryCode}>+91 ▾</Text>
            <View style={styles.divider} />
            <RNTextInput
              style={styles.phoneInput}
              value={mobile}
              onChangeText={(text) => {
                setMobile(text.replace(/[^0-9]/g, ''));
                setValidationError('');
              }}
              keyboardType="phone-pad"
              maxLength={10}
              placeholder="98765 43210"
              placeholderTextColor={palette.grey400}
              editable={!isLoading}
              accessibilityLabel="Mobile number input"
              accessibilityHint="Enter your 10-digit mobile number"
            />
            <Pressable
              style={[styles.arrowButton, isSubmitDisabled && styles.arrowButtonDisabled]}
              onPress={handleSendOtp}
              disabled={isSubmitDisabled}
              accessibilityLabel="Send OTP"
              accessibilityRole="button"
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={palette.white} />
              ) : (
                <MaterialCommunityIcons name="arrow-right" size={24} color={palette.white} />
              )}
            </Pressable>
          </View>

          {validationError || error ? (
            <HelperText type="error" style={styles.errorText} visible>
              {validationError || error}
            </HelperText>
          ) : null}
        </View>

        {/* Terms Footer */}
        <View style={styles.termsContainer}>
          <Text variant="bodySmall" style={styles.termsText}>
            By Continuing, you agree to our{' '}
            <Text
              style={styles.termsLink}
              accessibilityLabel="Terms and Conditions"
              accessibilityRole="link"
            >
              Terms &amp; Conditions
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.primary800,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoEmoji: {
    fontSize: 72,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  appName: {
    color: palette.white,
    fontWeight: '700',
  },
  tagline: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  inputSection: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  pillContainer: {
    backgroundColor: palette.white,
    borderRadius: borderRadius.md,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: spacing.md,
    paddingRight: 6,
  },
  countryCode: {
    color: palette.grey900,
    fontWeight: '600',
    fontSize: 16,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: palette.grey300,
    marginHorizontal: spacing.sm,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: palette.grey900,
    paddingVertical: 0,
  },
  arrowButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: palette.primary600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowButtonDisabled: {
    opacity: 0.5,
  },
  errorText: {
    color: palette.secondary100,
    paddingLeft: spacing.md,
  },
  termsContainer: {
    alignItems: 'center',
    paddingBottom: spacing.sm,
  },
  termsText: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  termsLink: {
    color: palette.primary300,
  },
});

export default LoginScreen;
