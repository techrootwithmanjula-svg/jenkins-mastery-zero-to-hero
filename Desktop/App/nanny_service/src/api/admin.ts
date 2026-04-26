import apiClient from './client';
import { Booking, Nanny } from '../models';
import { USE_MOCK_API } from '../mocks';
import { delay, mockBookings, mockNannies } from '../mocks/data';

/**
 * Admin: Get all bookings.
 */
export const getAllBookings = async (): Promise<Booking[]> => {
  if (USE_MOCK_API) {
    await delay(500);
    return [...mockBookings];
  }
  const response = await apiClient.get('/admin/bookings');
  return response.data;
};

/**
 * Admin: Refund a booking.
 */
export const refundBooking = async (bookingId: string): Promise<Booking> => {
  if (USE_MOCK_API) {
    await delay(600);
    const booking = mockBookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');
    booking.status = 'refunded';
    return { ...booking };
  }
  const response = await apiClient.post(`/admin/bookings/${bookingId}/refund`);
  return response.data;
};

/**
 * Admin: Make nanny offline.
 */
export const setNannyOffline = async (nannyId: string): Promise<Nanny> => {
  if (USE_MOCK_API) {
    await delay(400);
    const nanny = mockNannies.find((n) => n.id === nannyId);
    if (!nanny) throw new Error('Nanny not found');
    nanny.isOnline = false;
    return { ...nanny };
  }
  const response = await apiClient.post(`/admin/nannies/${nannyId}/offline`);
  return response.data;
};

/**
 * Admin: Make nanny online.
 */
export const setNannyOnline = async (nannyId: string): Promise<Nanny> => {
  if (USE_MOCK_API) {
    await delay(400);
    const nanny = mockNannies.find((n) => n.id === nannyId);
    if (!nanny) throw new Error('Nanny not found');
    nanny.isOnline = true;
    return { ...nanny };
  }
  const response = await apiClient.post(`/admin/nannies/${nannyId}/online`);
  return response.data;
};

/**
 * Admin: Get all nannies.
 */
export const getAllNannies = async (): Promise<Nanny[]> => {
  if (USE_MOCK_API) {
    await delay(500);
    return [...mockNannies];
  }
  const response = await apiClient.get('/admin/nannies');
  return response.data;
};
