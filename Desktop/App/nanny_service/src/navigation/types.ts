import { Booking, Nanny } from '../models';

/**
 * Navigation param type definitions for all stacks.
 */
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  AdminMain: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  OtpVerify: { mobile: string };
};

export type MainTabParamList = {
  DashboardTab: undefined;
  BookingsTab: undefined;
  SubscriptionsTab: undefined;
  ProfileTab: undefined;
};

export type DashboardStackParamList = {
  Dashboard: undefined;
  NannyList: { date: string; startTime: string; endTime: string };
  NannyDetail: { nannyId: string };
  Booking: { nanny: Nanny };
  BookingConfirmation: { booking: Booking };
  Notifications: undefined;
  Appointments:
    | {
        serviceId?: string;
        serviceTitle?: string;
      }
    | undefined;
};

export type BookingStackParamList = {
  BookingHistory: undefined;
};

export type SubscriptionStackParamList = {
  SubscriptionList: undefined;
  CreateSubscription: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type AdminStackParamList = {
  AdminDashboard: undefined;
};
