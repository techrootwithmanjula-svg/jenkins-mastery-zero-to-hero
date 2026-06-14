/**
 * Validation Utilities
 * Reusable validation functions for forms, API payloads, and data validation
 */

// ============================================================================
// PHONE NUMBER VALIDATION
// ============================================================================

/**
 * Validate Indian phone number (10 digits starting with 6-9)
 */
export function validatePhoneNumber(phone: string): boolean {
  // Remove whitespace and common separators
  const cleaned = phone.replace(/[\s\-()]/g, "");

  // Check if Indian phone number (10 digits, starts with 6-9)
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Format phone number with validation
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, "");

  if (!validatePhoneNumber(phone)) {
    return phone; // Return original if invalid
  }

  // Format: +91 XXXXX XXXXX
  return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
}

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================================================
// OTP VALIDATION
// ============================================================================

/**
 * Validate OTP (6 digits)
 */
export function validateOTP(otp: string): boolean {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
}

// ============================================================================
// NAME VALIDATION
// ============================================================================

/**
 * Validate first name (min 2 chars, only letters and spaces)
 */
export function validateFirstName(name: string): boolean {
  if (!name || name.trim().length < 2) {
    return false;
  }

  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name);
}

/**
 * Validate last name (min 1 char, only letters and spaces)
 */
export function validateLastName(name: string): boolean {
  if (!name || name.trim().length < 1) {
    return false;
  }

  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name);
}

/**
 * Validate middle name (optional but if provided min 1 char)
 */
export function validateMiddleName(name: string): boolean {
  if (!name) return true; // Optional field

  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name);
}

// ============================================================================
// AADHAR AND PAN VALIDATION
// ============================================================================

/**
 * Validate Aadhar number (12 digits, no spaces except for formatting)
 */
export function validateAadhar(aadhar: string): boolean {
  // Accept both with and without spaces (XXXX XXXX XXXX or XXXXXXXXXXXX)
  const cleaned = aadhar.replace(/\s/g, "");
  const aadharRegex = /^\d{12}$/;
  return aadharRegex.test(cleaned);
}

/**
 * Format Aadhar with spaces (XXXX XXXX XXXX)
 */
export function formatAadhar(aadhar: string): string {
  const cleaned = aadhar.replace(/\s/g, "");

  if (!validateAadhar(aadhar)) {
    return aadhar;
  }

  // Format: XXXX XXXX XXXX
  return cleaned.replace(/(.{4})/g, "$1 ").trim();
}

/**
 * Validate PAN number (10 chars: AAAAA9999A)
 * Format: 5 letters, 4 digits, 1 letter
 */
export function validatePAN(pan: string): boolean {
  const cleaned = pan.replace(/\s/g, "").toUpperCase();
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(cleaned);
}

/**
 * Format PAN number
 */
export function formatPAN(pan: string): string {
  const cleaned = pan.replace(/\s/g, "").toUpperCase();

  if (!validatePAN(pan)) {
    return pan;
  }

  return cleaned; // PAN is typically not space-separated
}

// ============================================================================
// DATE VALIDATION
// ============================================================================

/**
 * Validate date format (YYYY-MM-DD)
 */
export function validateDate(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Calculate age from DOB
 */
export function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

/**
 * Validate if person is 18+ years old
 */
export function isAdult(dob: string): boolean {
  return calculateAge(dob) >= 18;
}

/**
 * Validate if person is 60+ years old
 */
export function isSenior(dob: string): boolean {
  return calculateAge(dob) >= 60;
}

// ============================================================================
// EXPERIENCE VALIDATION
// ============================================================================

/**
 * Validate experience in years (0-100)
 */
export function validateExperience(years: number): boolean {
  return !isNaN(years) && years >= 0 && years <= 100 && Number.isInteger(years);
}

// ============================================================================
// ROLE VALIDATION
// ============================================================================

/**
 * Valid user roles
 */
export const VALID_ROLES = ["admin", "user", "nanny"] as const;
type ValidRole = (typeof VALID_ROLES)[number];

/**
 * Validate user role
 */
export function validateRole(role: string): role is ValidRole {
  return (VALID_ROLES as readonly string[]).includes(role);
}

// ============================================================================
// GENDER VALIDATION
// ============================================================================

/**
 * Valid gender values
 */
export const VALID_GENDERS = ["male", "female", "other"] as const;
type ValidGender = (typeof VALID_GENDERS)[number];

/**
 * Validate gender
 */
export function validateGender(gender: string): gender is ValidGender {
  return (VALID_GENDERS as readonly string[]).includes(gender);
}

// ============================================================================
// BATCH VALIDATION
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate user creation payload
 */
export function validateCreateUserPayload(data: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  const mobile = typeof data.mobile === "string" ? data.mobile : "";
  const role = typeof data.role === "string" ? data.role : "";

  if (!mobile) {
    errors.mobile = "Mobile number is required";
  } else if (!validatePhoneNumber(mobile)) {
    errors.mobile = "Invalid Indian phone number (10 digits, start with 6-9)";
  }

  if (!role) {
    errors.role = "Role is required";
  } else if (!validateRole(role)) {
    errors.role = "Invalid role";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate nanny creation payload
 */
export function validateCreateNannyPayload(data: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string> = {};

  const str = (key: string): string =>
    typeof data[key] === "string" ? (data[key] as string) : "";

  const first_name = str("first_name");
  const last_name = str("last_name");
  const middle_name = str("middle_name");
  const dob = str("dob");
  const mobile_number = str("mobile_number");
  const email_id = str("email_id");
  const gender = str("gender");
  const address = str("address");
  const permanent_address = str("permanent_address");
  const emergency_contact = str("emergency_contact");
  const aadhar_number = str("aadhar_number");
  const pan_card = str("pan_card");
  const experience = data.experience;

  if (!first_name) {
    errors.first_name = "First name is required";
  } else if (!validateFirstName(first_name)) {
    errors.first_name = "First name must be at least 2 characters with only letters";
  }

  if (!last_name) {
    errors.last_name = "Last name is required";
  } else if (!validateLastName(last_name)) {
    errors.last_name = "Last name must contain only letters";
  }

  if (middle_name && !validateMiddleName(middle_name)) {
    errors.middle_name = "Middle name must contain only letters";
  }

  if (!dob) {
    errors.dob = "Date of birth is required";
  } else if (!validateDate(dob)) {
    errors.dob = "Invalid date format (YYYY-MM-DD)";
  } else if (!isAdult(dob)) {
    errors.dob = "Must be at least 18 years old";
  }

  if (!mobile_number) {
    errors.mobile_number = "Mobile number is required";
  } else if (!validatePhoneNumber(mobile_number)) {
    errors.mobile_number = "Invalid Indian phone number";
  }

  if (!email_id) {
    errors.email_id = "Email is required";
  } else if (!validateEmail(email_id)) {
    errors.email_id = "Invalid email address";
  }

  if (!gender) {
    errors.gender = "Gender is required";
  } else if (!validateGender(gender)) {
    errors.gender = "Invalid gender";
  }

  if (!address) {
    errors.address = "Address is required";
  }

  if (!permanent_address) {
    errors.permanent_address = "Permanent address is required";
  }

  if (!emergency_contact) {
    errors.emergency_contact = "Emergency contact is required";
  } else if (!validatePhoneNumber(emergency_contact)) {
    errors.emergency_contact = "Invalid emergency contact phone number";
  }

  if (!aadhar_number) {
    errors.aadhar_number = "Aadhar number is required";
  } else if (!validateAadhar(aadhar_number)) {
    errors.aadhar_number = "Invalid Aadhar number (12 digits)";
  }

  if (!pan_card) {
    errors.pan_card = "PAN card is required";
  } else if (!validatePAN(pan_card)) {
    errors.pan_card = "Invalid PAN card format";
  }

  if (typeof experience !== "number" || !validateExperience(experience)) {
    errors.experience = "Experience must be a valid number (0-100)";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================================
// COMMON VALIDATION ERRORS
// ============================================================================

export const ValidationMessages = {
  REQUIRED: "This field is required",
  INVALID_FORMAT: "Invalid format",
  MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max: number) => `Must be at most ${max} characters`,
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",
  INVALID_DATE: "Please enter a valid date",
  INVALID_AADHAR: "Aadhar must be 12 digits",
  INVALID_PAN: "Invalid PAN format",
} as const;
