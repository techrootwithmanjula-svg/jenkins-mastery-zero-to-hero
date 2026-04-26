import bookingReducer, {
  fetchBookings,
  createBooking,
  confirmBooking,
  cancelBooking,
  clearCurrentBooking,
  clearBookingError,
} from '../../src/store/slices/bookingSlice';
import { Booking } from '../../src/models';

describe('bookingSlice', () => {
  const initialState = {
    bookings: [],
    currentBooking: null,
    isLoading: false,
    error: null,
  };

  const mockBooking: Booking = {
    id: 'b1',
    userId: 'u1',
    nannyId: 'n1',
    nannyName: 'Jane',
    nannyImage: '',
    slot: { date: '2026-04-15', startTime: '09:00', endTime: '12:00' },
    address: '123 Main St',
    amount: 1500,
    status: 'confirmed',
    createdAt: '2026-04-10',
  };

  it('should return initial state', () => {
    expect(bookingReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearCurrentBooking', () => {
    const state = bookingReducer(
      { ...initialState, currentBooking: mockBooking },
      clearCurrentBooking(),
    );
    expect(state.currentBooking).toBeNull();
  });

  it('should handle clearBookingError', () => {
    const state = bookingReducer(
      { ...initialState, error: 'Something went wrong' },
      clearBookingError(),
    );
    expect(state.error).toBeNull();
  });

  it('should set isLoading on fetchBookings.pending', () => {
    const state = bookingReducer(initialState, { type: fetchBookings.pending.type });
    expect(state.isLoading).toBe(true);
  });

  it('should populate bookings on fetchBookings.fulfilled', () => {
    const state = bookingReducer(initialState, {
      type: fetchBookings.fulfilled.type,
      payload: [mockBooking],
    });
    expect(state.bookings).toHaveLength(1);
    expect(state.isLoading).toBe(false);
  });

  it('should set error on fetchBookings.rejected', () => {
    const state = bookingReducer(initialState, {
      type: fetchBookings.rejected.type,
      payload: 'Fetch failed',
    });
    expect(state.error).toBe('Fetch failed');
  });

  it('should add booking on createBooking.fulfilled', () => {
    const state = bookingReducer(initialState, {
      type: createBooking.fulfilled.type,
      payload: mockBooking,
    });
    expect(state.bookings).toHaveLength(1);
    expect(state.currentBooking).toEqual(mockBooking);
  });

  it('should update booking on confirmBooking.fulfilled', () => {
    const confirmedBooking = { ...mockBooking, status: 'completed' as const };
    const stateWithBooking = { ...initialState, bookings: [mockBooking] };
    const state = bookingReducer(stateWithBooking, {
      type: confirmBooking.fulfilled.type,
      payload: confirmedBooking,
    });
    expect(state.bookings[0].status).toBe('completed');
  });

  it('should update booking on cancelBooking.fulfilled', () => {
    const cancelledBooking = { ...mockBooking, status: 'cancelled' as const };
    const stateWithBooking = { ...initialState, bookings: [mockBooking] };
    const state = bookingReducer(stateWithBooking, {
      type: cancelBooking.fulfilled.type,
      payload: cancelledBooking,
    });
    expect(state.bookings[0].status).toBe('cancelled');
  });
});
