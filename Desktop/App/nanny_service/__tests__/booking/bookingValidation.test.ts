import { bookingTimeSchema } from '../../src/utils/validation';

describe('Booking Validation', () => {
  it('should accept valid booking time (3+ hours, within 8-20)', async () => {
    await expect(
      bookingTimeSchema.validate({ date: '2026-04-15', startTime: '09:00', endTime: '12:00' }),
    ).resolves.toBeDefined();
  });

  it('should reject booking shorter than 3 hours', async () => {
    await expect(
      bookingTimeSchema.validate({ date: '2026-04-15', startTime: '09:00', endTime: '11:00' }),
    ).rejects.toThrow(/Minimum booking/);
  });

  it('should reject start time before 8 AM', async () => {
    await expect(
      bookingTimeSchema.validate({ date: '2026-04-15', startTime: '07:00', endTime: '10:00' }),
    ).rejects.toThrow(/8:00 or later/);
  });

  it('should reject end time after 8 PM', async () => {
    await expect(
      bookingTimeSchema.validate({ date: '2026-04-15', startTime: '18:00', endTime: '21:00' }),
    ).rejects.toThrow(/20:00 or earlier/);
  });

  it('should reject missing date', async () => {
    await expect(
      bookingTimeSchema.validate({ date: '', startTime: '09:00', endTime: '12:00' }),
    ).rejects.toThrow(/Date is required/);
  });
});
