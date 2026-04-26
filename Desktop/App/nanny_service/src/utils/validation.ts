import * as yup from 'yup';
import { APP_CONFIG } from './config';

/**
 * Phone number validation: Indian 10-digit mobile.
 */
export const mobileSchema = yup
  .string()
  .required('Mobile number is required')
  .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number');

/**
 * OTP validation.
 */
export const otpSchema = yup
  .string()
  .required('OTP is required')
  .matches(
    new RegExp(`^\\d{${APP_CONFIG.otpLength}}$`),
    `OTP must be ${APP_CONFIG.otpLength} digits`,
  );

/**
 * Profile update validation.
 */
export const profileSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  email: yup.string().required('Email is required').email('Enter a valid email'),
  age: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .optional()
    .nullable()
    .integer('Age must be a whole number')
    .min(18, 'Age must be at least 18')
    .max(99, 'Age must be at most 99'),
  address: yup.string().optional().max(500, 'Address must be at most 500 characters'),
  emergencyContact: yup
    .string()
    .optional()
    .matches(/^$|^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  gender: yup.string().optional().oneOf(['male', 'female', 'other', ''], 'Invalid gender'),
  fatherName: yup.string().optional().max(100, "Father's name must be at most 100 characters"),
});

/**
 * Baby detail validation.
 */
export const babyDetailSchema = yup.object({
  name: yup.string().required('Baby name is required').min(2, 'Name too short'),
  age: yup
    .number()
    .required('Age is required')
    .min(0, 'Age cannot be negative')
    .max(18, 'Age must be 18 or below'),
  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(['male', 'female', 'other'], 'Invalid gender'),
  priorDisease: yup
    .string()
    .optional()
    .max(500, 'Prior disease details must be at most 500 characters'),
  notes: yup.string().optional(),
});

/**
 * Booking time validation.
 */
export const bookingTimeSchema = yup.object({
  date: yup.string().required('Date is required'),
  startTime: yup
    .string()
    .required('Start time is required')
    .test('min-hour', `Start time must be ${APP_CONFIG.bookingStartHour}:00 or later`, (val) => {
      if (!val) return false;
      const hour = parseInt(val.split(':')[0], 10);
      return hour >= APP_CONFIG.bookingStartHour;
    }),
  endTime: yup
    .string()
    .required('End time is required')
    .test('max-hour', `End time must be ${APP_CONFIG.bookingEndHour}:00 or earlier`, (val) => {
      if (!val) return false;
      const hour = parseInt(val.split(':')[0], 10);
      return hour <= APP_CONFIG.bookingEndHour;
    })
    .test('min-duration', `Minimum booking is ${APP_CONFIG.minBookingHours} hours`, function (val) {
      const { startTime } = this.parent;
      if (!val || !startTime) return false;
      const start = parseInt(startTime.split(':')[0], 10);
      const end = parseInt(val.split(':')[0], 10);
      return end - start >= APP_CONFIG.minBookingHours;
    }),
});

/**
 * Generic helper: format validation errors for display.
 */
export const formatValidationError = (error: yup.ValidationError): string => {
  return error.errors.join(', ');
};
