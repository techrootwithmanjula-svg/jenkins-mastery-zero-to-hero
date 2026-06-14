import api from "./api";
import { BOOKING_URLS } from "./urls";
import type { BookingFilterParams, CancelBookingPayload } from "../types/entities";
import { buildQueryString } from "../utils/queryParams";

export const getBookingsService = async (params: BookingFilterParams) => {
  const response = await api.get(`${BOOKING_URLS.LIST}${buildQueryString(params)}`);
  return response.data;
};

export const cancelBookingService = async (
  bookingId: number,
  payload?: CancelBookingPayload
) => {
  const response = await api.post(BOOKING_URLS.CANCEL(bookingId), {
    cancellation_reason: payload?.cancellation_reason,
  });
  return response.data;
};
