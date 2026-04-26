import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput as RNTextInput,
  StatusBar,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Text, Button, HelperText } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { palette } from '../../theme';
import { spacing, borderRadius } from '../../theme/tokens';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { verifyOtp, sendOtp, clearError } from '../../store/slices/authSlice';
import type { RootState } from '../../store';
import { otpSchema } from '../../utils/validation';
import { APP_CONFIG } from '../../utils/config';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpVerify'>;

/**
 * OTP verification screen — full-screen purple branded layout.
 */
const OtpVerifyScreen: React.FC<Props> = ({ route }) => {
  const { mobile } = route.params;
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state: RootState) => state.auth);

  const [otp, setOtp] = useState('');
  const [validationError, setValidationError] = useState('');
  const [resendCooldown, setResendCooldown] = useState<number>(APP_CONFIG.otpResendCooldown);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((c) => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerify = async () => {
    setValidationError('');
    dispatch(clearError());

    try {
      await otpSchema.validate(otp);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setValidationError(err.message);
      }
      return;
    }

    dispatch(verifyOtp({ mobile, otp }));
  };

  const handleResend = () => {
    dispatch(sendOtp(mobile));
    setResendCooldown(APP_CONFIG.otpResendCooldown);
  };

  const isSubmitDisabled = isLoading || otp.length < APP_CONFIG.otpLength;

  /** Mask mobile: show first 2 and last 2 digits */
  const maskedMobile =
    mobile.length >= 4
      ? `${mobile.slice(0, 2)}${'X'.repeat(mobile.length - 4)}${mobile.slice(-2)}`
      : mobile;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={palette.primary800} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Logo Section (smaller) */}
        <View style={styles.logoSection}>
          <Text style={styles.logoEmoji}>👶</Text>
          <Text variant="titleLarge" style={styles.appName}>
            Nanny Service
          </Text>
        </View>

        {/* Heading */}
        <View>
        <View style={styles.headingSection}>
          <Text variant="headlineMedium" style={styles.heading}>
            Verify OTP
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Enter the {APP_CONFIG.otpLength}-digit code sent to +91 {maskedMobile}
          </Text>
        </View>

        {/* OTP Input Section */}
        <View style={styles.inputSection}>
          <View style={styles.pillContainer}>
            <RNTextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={(text) => {
                setOtp(text.replace(/[^0-9]/g, ''));
                setValidationError('');
              }}
              keyboardType="number-pad"
              maxLength={APP_CONFIG.otpLength}
              placeholder="••••••"
              placeholderTextColor={palette.grey400}
              editable={!isLoading}
              accessibilityLabel="OTP input"
              accessibilityHint={`Enter the ${APP_CONFIG.otpLength}-digit code`}
            />
            <Pressable
              style={[styles.arrowButton, isSubmitDisabled && styles.arrowButtonDisabled]}
              onPress={handleVerify}
              disabled={isSubmitDisabled}
              accessibilityLabel="Verify OTP"
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

          <Button
            mode="text"
            onPress={handleResend}
            disabled={resendCooldown > 0 || isLoading}
            style={styles.resendButton}
            textColor={resendCooldown > 0 ? 'rgba(255,255,255,0.5)' : palette.white}
            accessibilityLabel="Resend OTP button"
          >
            {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
          </Button>
        </View>
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
    marginBottom: spacing.lg,
  },
  logoEmoji: {
    fontSize: 56,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  appName: {
    color: palette.white,
    fontWeight: '700',
  },
  headingSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  heading: {
    color: palette.white,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  inputSection: {
    width: '100%',
    marginBottom: spacing.md,
  },
  pillContainer: {
    backgroundColor: palette.white,
    borderRadius: borderRadius.md,
    height: 56,
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingLeft: spacing.lg,
    paddingRight: 6,
  },
  otpInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 12,
    color: palette.grey900,
    paddingVertical: 0,
  },
  errorText: {
    color: palette.secondary100,
    paddingLeft: spacing.md,
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
  resendButton: {
    marginTop: spacing.md,
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

export default OtpVerifyScreen;
