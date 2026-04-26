/**
 * Mock data for UI testing without a backend API.
 * All API modules use this data when USE_MOCK_API is true.
 */
import {
  User,
  Nanny,
  Booking,
  Subscription,
  Notification,
  Appointment,
  APPOINTMENT_COLORS,
} from '../models';

/** Hardcoded mock address for dashboard display (no model change). */
export const MOCK_ADDRESS = '1234 Easton Rd.';

// ── Simulated network delay ────────────────────────────────────────
export const delay = (ms = 600): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// ── Users ──────────────────────────────────────────────────────────
export const mockUser: User = {
  id: 'u1',
  name: 'Anjali Sharma',
  email: 'anjali.sharma@example.com',
  mobile: '9876543210',
  babyDetails: [
    {
      id: 'baby-1',
      name: 'Arya',
      age: 2,
      gender: 'female',
      image: 'https://i.pravatar.cc/150?img=36',
      notes: 'Loves lullabies',
    },
    {
      id: 'baby-2',
      name: 'Vihaan',
      age: 4,
      gender: 'male',
      image: 'https://i.pravatar.cc/150?img=33',
    },
  ],
};

// ── Nannies ────────────────────────────────────────────────────────
export const mockNannies: Nanny[] = [
  {
    id: 'n1',
    name: 'Priya Verma',
    image: 'https://i.pravatar.cc/300?img=1',
    rating: 4.9,
    experience: 7,
    specialties: ['Infant care', 'First aid certified', 'Music therapy'],
    availability: [
      { day: 'Monday', startTime: '08:00', endTime: '18:00' },
      { day: 'Wednesday', startTime: '08:00', endTime: '18:00' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00' },
    ],
    isOnline: true,
    hourlyRate: 500,
    isFavorite: true,
    distance: 0.2,
    reviewCount: 24,
  },
  {
    id: 'n2',
    name: 'Sunita Devi',
    image: 'https://i.pravatar.cc/300?img=5',
    rating: 4.7,
    experience: 5,
    specialties: ['Toddler care', 'Meal preparation', 'Storytelling'],
    availability: [
      { day: 'Monday', startTime: '08:00', endTime: '20:00' },
      { day: 'Tuesday', startTime: '08:00', endTime: '20:00' },
      { day: 'Thursday', startTime: '10:00', endTime: '18:00' },
      { day: 'Saturday', startTime: '09:00', endTime: '15:00' },
    ],
    isOnline: true,
    hourlyRate: 450,
    isFavorite: false,
    distance: 1.5,
    reviewCount: 18,
  },
  {
    id: 'n3',
    name: 'Meena Kumari',
    image: 'https://i.pravatar.cc/300?img=9',
    rating: 4.5,
    experience: 3,
    specialties: ['Newborn care', 'Night-time care'],
    availability: [
      { day: 'Tuesday', startTime: '20:00', endTime: '08:00' },
      { day: 'Thursday', startTime: '20:00', endTime: '08:00' },
      { day: 'Sunday', startTime: '08:00', endTime: '20:00' },
    ],
    isOnline: false,
    hourlyRate: 400,
    isFavorite: false,
    distance: 3.2,
    reviewCount: 10,
  },
  {
    id: 'n4',
    name: 'Kavita Singh',
    image: 'https://i.pravatar.cc/300?img=16',
    rating: 4.8,
    experience: 10,
    specialties: ['Special needs', 'Montessori methods', 'CPR certified'],
    availability: [
      { day: 'Monday', startTime: '08:00', endTime: '16:00' },
      { day: 'Wednesday', startTime: '08:00', endTime: '16:00' },
      { day: 'Friday', startTime: '08:00', endTime: '16:00' },
    ],
    isOnline: true,
    hourlyRate: 600,
    isFavorite: true,
    distance: 0.5,
    reviewCount: 32,
  },
  {
    id: 'n5',
    name: 'Rekha Patel',
    image: 'https://i.pravatar.cc/300?img=20',
    rating: 4.6,
    experience: 4,
    specialties: ['Bilingual (Hindi/English)', 'Activity planning'],
    availability: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00' },
    ],
    isOnline: true,
    hourlyRate: 475,
    isFavorite: false,
    distance: 2.0,
    reviewCount: 15,
  },
];

// ── Bookings ───────────────────────────────────────────────────────
export const mockBookings: Booking[] = [
  {
    id: 'bk-1',
    userId: 'u1',
    nannyId: 'n1',
    nannyName: 'Priya Verma',
    nannyImage: 'https://i.pravatar.cc/300?img=1',
    slot: { date: '2026-04-15', startTime: '09:00', endTime: '14:00' },
    address: '42 MG Road, Sector 14, Gurugram',
    amount: 2500,
    status: 'confirmed',
    createdAt: '2026-04-10T10:30:00Z',
  },
  {
    id: 'bk-2',
    userId: 'u1',
    nannyId: 'n2',
    nannyName: 'Sunita Devi',
    nannyImage: 'https://i.pravatar.cc/300?img=5',
    slot: { date: '2026-04-12', startTime: '10:00', endTime: '16:00' },
    address: '18 Lajpat Nagar, New Delhi',
    amount: 2700,
    promo: 'WELCOME10',
    discount: 270,
    status: 'completed',
    createdAt: '2026-04-08T08:00:00Z',
  },
  {
    id: 'bk-3',
    userId: 'u1',
    nannyId: 'n4',
    nannyName: 'Kavita Singh',
    nannyImage: 'https://i.pravatar.cc/300?img=16',
    slot: { date: '2026-04-20', startTime: '08:00', endTime: '12:00' },
    address: '7 Connaught Place, New Delhi',
    amount: 2400,
    status: 'pending',
    createdAt: '2026-04-11T09:15:00Z',
  },
  {
    id: 'bk-4',
    userId: 'u1',
    nannyId: 'n1',
    nannyName: 'Priya Verma',
    nannyImage: 'https://i.pravatar.cc/300?img=1',
    slot: { date: '2026-03-25', startTime: '09:00', endTime: '15:00' },
    address: '42 MG Road, Sector 14, Gurugram',
    amount: 3000,
    status: 'cancelled',
    createdAt: '2026-03-20T14:00:00Z',
  },
];

// ── Subscriptions ──────────────────────────────────────────────────
export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    userId: 'u1',
    nannyId: 'n1',
    nannyName: 'Priya Verma',
    frequencyPerWeek: 1,
    weekdays: ['Monday'],
    startTime: '09:00',
    endTime: '12:00',
    status: 'active',
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'sub-2',
    userId: 'u1',
    nannyId: 'n2',
    nannyName: 'Sunita Devi',
    frequencyPerWeek: 2,
    weekdays: ['Tuesday', 'Thursday'],
    startTime: '14:00',
    endTime: '17:00',
    status: 'paused',
    createdAt: '2026-02-15T12:00:00Z',
  },
  {
    id: 'sub-3',
    userId: 'u1',
    nannyId: 'n4',
    nannyName: 'Kavita Singh',
    frequencyPerWeek: 2,
    weekdays: ['Wednesday', 'Friday'],
    startTime: '10:00',
    endTime: '13:30',
    status: 'active',
    createdAt: '2026-03-15T14:30:00Z',
  },
];

// ── Notifications ─────────────────────────────────────────────────
const todayISO = new Date().toISOString().split('T')[0];
const yesterdayISO = (() => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
})();

const tomorrowISO = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
})();

const dayAfterTomorrowISO = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split('T')[0];
})();

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'payout',
    title: 'A Netflix payout of $19 has been successful!',
    amount: '$19',
    timestamp: '11.00 AM',
    date: todayISO,
    isRead: false,
  },
  {
    id: 'n2',
    type: 'topup',
    title: 'Successfully top up balance $150 from US CITIBAN. See details here.',
    amount: '$150',
    timestamp: '08.00 AM',
    date: todayISO,
    isRead: true,
  },
  {
    id: 'n3',
    type: 'alert',
    title: 'Please top up to continue transactions on Netflix',
    timestamp: '01.00 AM',
    date: todayISO,
    isRead: true,
  },
  {
    id: 'n4',
    type: 'received',
    title: 'You received money from JENNIFER BACHDIM $640',
    amount: '$640',
    timestamp: '11.00 AM',
    date: yesterdayISO,
    isRead: true,
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt1',
    userName: 'Priya Sharma',
    userContact: '+91 98765 43210',
    userAddress: '12 MG Road, Bangalore',
    date: todayISO,
    startTime: '08:10',
    endTime: '08:30',
    category: 'babysitting',
    categoryLabel: 'Babysitting',
    title: 'Morning babysitting session',
    color: APPOINTMENT_COLORS.babysitting,
  },
  {
    id: 'apt2',
    userName: 'Ravi Kumar',
    userContact: '+91 87654 32109',
    userAddress: '45 Park Street, Delhi',
    date: todayISO,
    startTime: '10:10',
    endTime: '11:30',
    category: 'education',
    categoryLabel: 'Childhood Education',
    title: 'Creative reading and phonics',
    color: APPOINTMENT_COLORS.education,
  },
  {
    id: 'apt3',
    userName: 'Anita Devi',
    userContact: '+91 76543 21098',
    userAddress: '78 Lake View, Mumbai',
    date: todayISO,
    startTime: '12:00',
    endTime: '12:30',
    category: 'fulltime',
    categoryLabel: 'Full-Time Nanny',
    title: 'Lunch prep and nap routine',
    color: APPOINTMENT_COLORS.fulltime,
  },
  {
    id: 'apt4',
    userName: 'Sunita Patel',
    userContact: '+91 65432 10987',
    userAddress: '23 Hill Road, Pune',
    date: tomorrowISO,
    startTime: '09:00',
    endTime: '10:30',
    category: 'newborn',
    categoryLabel: 'Newborn Care',
    title: 'Feeding and soothing session',
    color: APPOINTMENT_COLORS.newborn,
  },
  {
    id: 'apt5',
    userName: 'Meena Kumari',
    userContact: '+91 54321 09876',
    userAddress: '56 Green Park, Chennai',
    date: tomorrowISO,
    startTime: '14:00',
    endTime: '15:30',
    category: 'babysitting',
    categoryLabel: 'Babysitting',
    title: 'Afternoon play and activities',
    color: APPOINTMENT_COLORS.babysitting,
  },
  {
    id: 'apt6',
    userName: 'Kavita Singh',
    userContact: '+91 43210 98765',
    userAddress: '89 Sector 12, Noida',
    date: dayAfterTomorrowISO,
    startTime: '11:00',
    endTime: '13:00',
    category: 'education',
    categoryLabel: 'Childhood Education',
    title: 'Storytelling and craft activities',
    color: APPOINTMENT_COLORS.education,
  },
  {
    id: 'apt7',
    userName: 'Pooja Mehta',
    userContact: '+91 99887 77665',
    userAddress: '15 Residency Road, Bangalore',
    date: todayISO,
    startTime: '08:00',
    endTime: '09:00',
    category: 'babysitting',
    categoryLabel: 'Babysitting',
    title: 'Morning school drop routine',
    color: APPOINTMENT_COLORS.babysitting,
  },
  {
    id: 'apt8',
    userName: 'Neha Arora',
    userContact: '+91 98770 12345',
    userAddress: '22 Civil Lines, Jaipur',
    date: todayISO,
    startTime: '19:00',
    endTime: '20:00',
    category: 'fulltime',
    categoryLabel: 'Full-Time Nanny',
    title: 'Evening dinner and wind-down care',
    color: APPOINTMENT_COLORS.fulltime,
  },
];

export const getMockAppointmentsForDate = (dateISO: string): Appointment[] =>
  mockAppointments.filter((appointment) => appointment.date === dateISO);

// ── Helpers for mutation ───────────────────────────────────────────
let bookingCounter = mockBookings.length;
export const nextBookingId = (): string => `bk-${++bookingCounter}`;

let subCounter = mockSubscriptions.length;
export const nextSubId = (): string => `sub-${++subCounter}`;

let babyCounter = mockUser.babyDetails.length;
export const nextBabyId = (): string => `baby-${++babyCounter}`;
