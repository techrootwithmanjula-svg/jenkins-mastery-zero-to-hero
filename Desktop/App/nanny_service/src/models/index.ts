/**
 * User entity model.
 */
export interface BabyDetail {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  priorDisease?: string;
  image?: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  age?: number;
  address?: string;
  emergencyContact?: string;
  gender?: 'male' | 'female' | 'other';
  fatherName?: string;
  profileImage?: string;
  babyDetails: BabyDetail[];
}

/**
 * Nanny entity model.
 */
export interface AvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Nanny {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience: number;
  specialties: string[];
  availability: AvailabilitySlot[];
  isOnline: boolean;
  hourlyRate: number;
  isFavorite: boolean;
  distance: number;
  reviewCount: number;
}

/**
 * Booking entity model.
 */
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';

export interface BookingSlot {
  date: string;
  startTime: string;
  endTime: string;
}

export interface Booking {
  id: string;
  userId: string;
  nannyId: string;
  nannyName: string;
  nannyImage: string;
  slot: BookingSlot;
  address: string;
  amount: number;
  promo?: string;
  discount?: number;
  status: BookingStatus;
  createdAt: string;
}

/**
 * Subscription entity model.
 * Updated for redesign: weekly recurrence with frequency, weekdays, and time range.
 */
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export interface Subscription {
  id: string;
  userId: string;
  nannyId: string;
  nannyName: string;
  /** Weekly frequency: 1 (one day/week) or 2 (two days/week) */
  frequencyPerWeek: 1 | 2;
  /** Weekday names matching frequency (e.g., ["Monday"] or ["Monday", "Wednesday"]) */
  weekdays: string[];
  /** Start time in HH:mm format (e.g., "09:00") */
  startTime: string;
  /** End time in HH:mm format (e.g., "12:00") */
  endTime: string;
  status: SubscriptionStatus;
  createdAt: string;
}

/**
 * Admin entity model.
 */
export interface Admin {
  id: string;
  name: string;
  permissions: string[];
}

/**
 * Notification entity model.
 */
export type NotificationType = 'payout' | 'topup' | 'alert' | 'received';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  amount?: string;
  timestamp: string;
  date: string;
  isRead: boolean;
}

export interface NotificationSection {
  title: string;
  data: Notification[];
}

export type AppointmentCategory = 'babysitting' | 'fulltime' | 'newborn' | 'education';

export interface Appointment {
  id: string;
  userName: string;
  userContact: string;
  userAddress: string;
  date: string;
  startTime: string;
  endTime: string;
  category: AppointmentCategory;
  categoryLabel: string;
  title: string;
  color: string;
}

export interface CalendarViewState {
  selectedDate: Date;
  visibleMonthDate: Date;
  isPickerOpen: boolean;
  draftDate?: Date;
}

export type TimeSlotStatus = 'occupied' | 'empty';

export interface TimeSlotRow {
  hour24: number;
  label12h: string;
  startTime: string;
  endTime: string;
  status: TimeSlotStatus;
  appointments: Appointment[];
}

export const APPOINTMENT_COLORS: Record<AppointmentCategory, string> = {
  babysitting: '#F4845F',
  fulltime: '#7C5CFC',
  newborn: '#4CAF50',
  education: '#9B7FFF',
};

/**
 * Nanny List Modal Preview state model (screen-local UI state).
 */
export interface NannyListPreviewState {
  isPreviewOpen: boolean;
  selectedNannyId: string | null;
  selectedNannySnapshot?: Nanny;
}

/**
 * Nanny List Header state model (derived presentation state).
 */
export interface NannyListHeaderState {
  resultCount: number;
  scheduleLabel?: string;
  showFilterBar: boolean;
}
