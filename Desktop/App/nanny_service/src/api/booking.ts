import apiClient from './client';
import { Nanny, Booking, BookingSlot } from '../models';
import { USE_MOCK_API } from '../mocks';
import { delay, mockNannies, mockBookings, nextBookingId } from '../mocks/data';

export interface SearchNannyParams {
  date: string;
  startTime: string;
  endTime: string;
}

export interface CreateBookingRequest {
  nannyId: string;
  slot: BookingSlot;
  address: string;
  promo?: string;
}

export interface BookingResponse {
  booking: Booking;
  paymentUrl?: string;
}

/**
 * Search available nannies by date and time filters.
 */
export const searchNannies = async (params: SearchNannyParams): Promise<Nanny[]> => {
  if (USE_MOCK_API) {
    await delay(700);
    // Return online nannies to simulate search
    return mockNannies.filter((n) => n.isOnline);
  }
  const response = await apiClient.get('/nannies/search', { params });
  return response.data;
};

/**
 * Get nanny details by ID.
 */
export const getNannyById = async (nannyId: string): Promise<Nanny> => {
  if (USE_MOCK_API) {
    await delay(400);
    const nanny = mockNannies.find((n) => n.id === nannyId);
    if (!nanny) throw new Error('Nanny not found');
    return nanny;
  }
  const response = await apiClient.get(`/nannies/${nannyId}`);
  return response.data;
};

/**
 * Create a new booking.
 */
export const createBooking = async (data: CreateBookingRequest): Promise<BookingResponse> => {
  if (USE_MOCK_API) {
    await delay(1000);
    const nanny = mockNannies.find((n) => n.id === data.nannyId);
    const startH = parseInt(data.slot.startTime.split(':')[0], 10);
    const endH = parseInt(data.slot.endTime.split(':')[0], 10);
    const hours = endH - startH;
    const amount = hours * (nanny?.hourlyRate ?? 500);
    const discount = data.promo ? Math.round(amount * 0.1) : 0;

    const booking: Booking = {
      id: nextBookingId(),
      userId: 'u1',
      nannyId: data.nannyId,
      nannyName: nanny?.name ?? 'Nanny',
      nannyImage: nanny?.image ?? '',
      slot: data.slot,
      address: data.address,
      amount: amount - discount,
      promo: data.promo,
      discount: discount || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    mockBookings.unshift(booking);
    return { booking };
  }
  const response = await apiClient.post('/bookings', data);
  return response.data;
};

/**
 * Confirm booking after payment.
 */
export const confirmBooking = async (bookingId: string): Promise<Booking> => {
  if (USE_MOCK_API) {
    await delay(600);
    const booking = mockBookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');
    booking.status = 'confirmed';
    return { ...booking };
  }
  const response = await apiClient.post(`/bookings/${bookingId}/confirm`);
  return response.data;
};

/**
 * Get user's booking history.
 */
export const getBookings = async (): Promise<Booking[]> => {
  if (USE_MOCK_API) {
    await delay(500);
    return [...mockBookings];
  }
  const response = await apiClient.get('/bookings');
  return response.data;
};

/**
 * Cancel a booking.
 */
export const cancelBooking = async (bookingId: string): Promise<Booking> => {
  if (USE_MOCK_API) {
    await delay(600);
    const booking = mockBookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');
    booking.status = 'cancelled';
    return { ...booking };
  }
  const response = await apiClient.post(`/bookings/${bookingId}/cancel`);
  return response.data;
};
