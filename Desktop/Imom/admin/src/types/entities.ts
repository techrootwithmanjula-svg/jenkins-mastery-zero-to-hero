/**
 * Entity Type Definitions
 * Centralized type definitions for all domain entities (User, Nanny, Stats, etc.)
 * Used across services, components, and pages for type consistency
 */

import type { ReactNode } from "react";

// ============================================================================
// USER ENTITY TYPES
// ============================================================================

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  NANNY = "nanny",
}

export interface User {
  id: string;
  mobile: string;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUserPayload {
  mobile: string;
  role: UserRole;
  is_verified?: boolean;
  is_active?: boolean;
}

export interface UpdateUserPayload {
  mobile?: string;
  role?: UserRole;
  is_verified?: boolean;
  is_active?: boolean;
}

export type UserResponse = User;

// ============================================================================
// NANNY ENTITY TYPES
// ============================================================================

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export interface Nanny {
  id: number;
  user_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  dob: string;
  image: string;
  mobile_number: string;
  email_id: string;
  gender: Gender;
  address: string;
  permanent_address: string;
  emergency_contact: string;
  certificates: string[];
  experience: number;
  aadhar_number: string;
  pan_card: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNannyPayload {
  first_name: string;
  middle_name: string;
  last_name: string;
  dob: string;
  mobile_number: string;
  email_id: string;
  gender: Gender;
  address: string;
  permanent_address: string;
  emergency_contact: string;
  certificates?: string[];
  experience: number;
  aadhar_number: string;
  pan_card: string;
  is_active?: boolean;
}

export interface UpdateNannyPayload {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  dob?: string;
  mobile_number?: string;
  email_id?: string;
  gender?: Gender;
  address?: string;
  permanent_address?: string;
  emergency_contact?: string;
  certificates?: string[];
  experience?: number;
  aadhar_number?: string;
  pan_card?: string;
  is_active?: boolean;
}

export type NannyResponse = Nanny;

// ============================================================================
// STATS ENTITY TYPES
// ============================================================================

export interface StatsBreakdown {
  total: number;
  active: number;
  inactive: number;
}

export interface StatsResponse {
  nannies: StatsBreakdown;
  parents: StatsBreakdown;
  users: StatsBreakdown;
  admins: StatsBreakdown;
}

export interface MetricItem {
  title: string;
  value: string;
  change: string;
  isUp: boolean;
  icon: ReactNode;
  onClick?: () => void;
}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface SendOtpRequest {
  mobile: string;
}

export interface SendOtpResponse {
  message: string;
  status: string;
}

export interface VerifyOtpRequest {
  mobile: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  status: string;
  data?: {
    token: string;
    user?: User;
  };
}

export interface ResendOtpRequest {
  mobile: string;
}

export interface ResendOtpResponse {
  message: string;
  status: string;
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface UserFilterParams extends PaginationParams {
  mobile?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface NannyFilterParams extends PaginationParams {
  mobile?: string;
  gender?: Gender;
  is_active?: boolean;
  experience_min?: number;
  experience_max?: number;
}

// ============================================================================
// SUBSCRIPTION ENTITY TYPES
// ============================================================================

export type SubscriptionPlanTier =
  | "silver"
  | "gold"
  | "platinum"
  | "elite"
  | "diamond";

export type SubscriptionStatus = "active" | "paused" | "cancelled";

export type ReplacementStatus = "requested" | "approved" | "completed" | "rejected";

export interface SubscriptionPauseRecord {
  id: number;
  subscription_id: number;
  pause_start_date: string;
  pause_end_date: string;
  pause_days: number;
  status: string;
  created_at: string;
}

export interface SubscriptionReplacementRecord {
  id: number;
  subscription_id: number;
  old_nanny_id: number;
  new_nanny_id: number | null;
  reason: string | null;
  replacement_type: string | null;
  status: ReplacementStatus;
  effective_date: string;
  created_at: string;
}

export interface Subscription {
  id: number;
  parent_id: number;
  user_id: number;
  parent_name?: string;
  nanny_id: number;
  nanny_name: string;
  plan_tier: SubscriptionPlanTier;
  plan_name: string;
  plan_price_inr: number;
  nanny_salary_inr: number;
  frequency_per_week: number;
  weekdays: string[];
  start_time: string;
  end_time: string;
  start_date: string;
  expiry_date: string;
  tax_amount_inr: number;
  total_amount_inr: number;
  gst_rate: number;
  status: SubscriptionStatus;
  pause_allowance_days: number;
  pause_allowance_per_month: number;
  pause_days_used: number;
  remaining_pause_days: number;
  replacement_allowance: number;
  replacement_per_month: number;
  replacement_used: number;
  remaining_replacements: number | null;
  pause_history: SubscriptionPauseRecord[];
  replacement_history: SubscriptionReplacementRecord[];
  created_at: string;
}

export interface SubscriptionReplacementRequest {
  id: number;
  subscription_id: number;
  old_nanny_id: number;
  new_nanny_id: number | null;
  reason: string | null;
  replacement_type: string | null;
  status: ReplacementStatus;
  effective_date: string;
  created_at: string;
  plan_tier: SubscriptionPlanTier;
  plan_name: string;
  parent_id: number;
  current_nanny_id: number;
  subscription_status: SubscriptionStatus;
  parent_name: string;
  user_id: number;
  old_nanny_name: string;
}

export interface SubscriptionListResponse {
  items: Subscription[];
  page: number;
  limit: number;
}

export interface ReplacementListResponse {
  items: SubscriptionReplacementRequest[];
  page: number;
  limit: number;
}

export interface SubscriptionFilterParams extends PaginationParams {
  status?: SubscriptionStatus;
  plan_tier?: SubscriptionPlanTier;
}

export interface ReplacementFilterParams extends PaginationParams {
  status?: ReplacementStatus;
}

export interface CompleteReplacementPayload {
  new_nanny_id: number;
}

export interface RejectReplacementPayload {
  reason?: string;
}

export interface SubscriptionPlan {
  id: SubscriptionPlanTier;
  name: string;
  nanny_salary_inr: number | null;
  price_inr: number | null;
  pause_allowance_days: number;
  pause_allowance_per_month: number;
  pause_label: string | null;
  replacement_allowance: number;
  replacement_per_month: number;
  replacement_label: string | null;
  is_active?: boolean;
  validity_label?: string;
  duration_months?: number;
}

export interface SubscriptionPlanListResponse {
  items: SubscriptionPlan[];
}

export interface UpdateSubscriptionPlanPayload {
  pause_allowance_days?: number;
  pause_allowance_per_month?: number;
  pause_label?: string;
  replacement_allowance?: number;
  replacement_per_month?: number;
  replacement_label?: string;
  nanny_salary_inr?: number;
  price_inr?: number | null;
  is_active?: boolean;
}

export interface UpdateSubscriptionLimitsPayload {
  pause_allowance_days?: number;
  pause_allowance_per_month?: number;
  replacement_allowance?: number;
  replacement_per_month?: number;
  pause_days_used?: number;
  replacement_used?: number;
}

// ============================================================================
// BOOKING ENTITY TYPES
// ============================================================================

export type BookingStatus = "active" | "cancelled" | "completed";

export type BookingServiceStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "missed"
  | "paused";

export interface Booking {
  id: number;
  parent_id: number;
  nanny_id: number | null;
  parent_name?: string | null;
  nanny_name?: string | null;
  booking_mode: string;
  booking_type: string;
  booking_status: BookingStatus;
  assignment_status: string;
  service_status: BookingServiceStatus;
  start_datetime: string;
  end_datetime: string;
  notes?: string | null;
  total_charges_inr: number | null;
  cancellation_reason?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingFilterParams extends PaginationParams {
  status?: BookingStatus;
  service_status?: BookingServiceStatus;
  start_date?: string;
  end_date?: string;
}

export interface CancelBookingPayload {
  cancellation_reason?: string;
}

// ============================================================================
// SHARED UI CONSTANTS  (used by nanny modals — defined once, imported everywhere)
// ============================================================================

export interface SelectOption {
  label: string;
  value: string;
}

export const GENDER_OPTIONS = ["male", "female", "other"] as const;

export const CERTIFICATE_OPTIONS: SelectOption[] = [
  { label: "First Aid", value: "first_aid" },
  { label: "Child Care", value: "child_care" },
  { label: "CPR", value: "cpr" },
  { label: "Nutrition", value: "nutrition" },
];
