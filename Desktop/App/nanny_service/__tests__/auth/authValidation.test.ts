import { mobileSchema, otpSchema } from '../../src/utils/validation';

describe('Auth Validation', () => {
  describe('mobileSchema', () => {
    it('should accept valid 10-digit mobile starting with 6-9', async () => {
      await expect(mobileSchema.validate('9876543210')).resolves.toBe('9876543210');
    });

    it('should reject mobile shorter than 10 digits', async () => {
      await expect(mobileSchema.validate('98765')).rejects.toThrow();
    });

    it('should reject mobile starting with 0-5', async () => {
      await expect(mobileSchema.validate('1234567890')).rejects.toThrow();
    });

    it('should reject empty mobile', async () => {
      await expect(mobileSchema.validate('')).rejects.toThrow('Mobile number is required');
    });
  });

  describe('otpSchema', () => {
    it('should accept valid 6-digit OTP', async () => {
      await expect(otpSchema.validate('123456')).resolves.toBe('123456');
    });

    it('should reject OTP shorter than 6 digits', async () => {
      await expect(otpSchema.validate('1234')).rejects.toThrow();
    });

    it('should reject empty OTP', async () => {
      await expect(otpSchema.validate('')).rejects.toThrow('OTP is required');
    });

    it('should reject OTP with non-digits', async () => {
      await expect(otpSchema.validate('12ab56')).rejects.toThrow();
    });
  });
});
