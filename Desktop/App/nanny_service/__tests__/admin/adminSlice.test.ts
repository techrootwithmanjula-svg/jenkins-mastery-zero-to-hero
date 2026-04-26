import adminReducer, {
  fetchAllBookings,
  fetchAllNannies,
  refundBooking,
  setNannyOffline,
  setNannyOnline,
  clearAdminError,
} from '../../src/store/slices/adminSlice';
import { Booking, Nanny } from '../../src/models';

describe('adminSlice', () => {
  const initialState = {
    bookings: [],
    nannies: [],
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

  const mockNanny: Nanny = {
    id: 'n1',
    name: 'Jane',
    image: '',
    rating: 4.8,
    experience: 5,
    specialties: ['infant care'],
    availability: [],
    isOnline: true,
    hourlyRate: 500,
    isFavorite: false,
    distance: 1.0,
    reviewCount: 10,
  };

  it('should return initial state', () => {
    expect(adminReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearAdminError', () => {
    const state = adminReducer({ ...initialState, error: 'Error' }, clearAdminError());
    expect(state.error).toBeNull();
  });

  it('should populate bookings on fetchAllBookings.fulfilled', () => {
    const state = adminReducer(initialState, {
      type: fetchAllBookings.fulfilled.type,
      payload: [mockBooking],
    });
    expect(state.bookings).toHaveLength(1);
  });

  it('should populate nannies on fetchAllNannies.fulfilled', () => {
    const state = adminReducer(initialState, {
      type: fetchAllNannies.fulfilled.type,
      payload: [mockNanny],
    });
    expect(state.nannies).toHaveLength(1);
  });

  it('should update booking on refundBooking.fulfilled', () => {
    const refunded = { ...mockBooking, status: 'refunded' as const };
    const state = adminReducer(
      { ...initialState, bookings: [mockBooking] },
      { type: refundBooking.fulfilled.type, payload: refunded },
    );
    expect(state.bookings[0].status).toBe('refunded');
  });

  it('should set nanny offline on setNannyOffline.fulfilled', () => {
    const offlineNanny = { ...mockNanny, isOnline: false };
    const state = adminReducer(
      { ...initialState, nannies: [mockNanny] },
      { type: setNannyOffline.fulfilled.type, payload: offlineNanny },
    );
    expect(state.nannies[0].isOnline).toBe(false);
  });

  it('should set nanny online on setNannyOnline.fulfilled', () => {
    const offlineNanny = { ...mockNanny, isOnline: false };
    const onlineNanny = { ...mockNanny, isOnline: true };
    const state = adminReducer(
      { ...initialState, nannies: [offlineNanny] },
      { type: setNannyOnline.fulfilled.type, payload: onlineNanny },
    );
    expect(state.nannies[0].isOnline).toBe(true);
  });
});
