import { profileSchema, babyDetailSchema } from '../../src/utils/validation';

describe('Profile Validation', () => {
  describe('profileSchema', () => {
    it('should accept valid profile', async () => {
      await expect(
        profileSchema.validate({ name: 'Test User', email: 'test@test.com' }),
      ).resolves.toBeDefined();
    });

    it('should accept valid profile with all extended fields', async () => {
      await expect(
        profileSchema.validate({
          name: 'Test User',
          email: 'test@test.com',
          age: 30,
          address: '123 Main Street',
          emergencyContact: '9876543210',
          gender: 'female',
          fatherName: 'John Doe',
        }),
      ).resolves.toBeDefined();
    });

    it('should reject empty name', async () => {
      await expect(
        profileSchema.validate({ name: '', email: 'test@test.com' }),
      ).rejects.toThrow(/Name is required/);
    });

    it('should reject invalid email', async () => {
      await expect(
        profileSchema.validate({ name: 'Test', email: 'not-email' }),
      ).rejects.toThrow(/valid email/);
    });

    it('should reject age below 18', async () => {
      await expect(
        profileSchema.validate({ name: 'Test', email: 'test@test.com', age: 17 }),
      ).rejects.toThrow(/at least 18/);
    });

    it('should reject age above 99', async () => {
      await expect(
        profileSchema.validate({ name: 'Test', email: 'test@test.com', age: 100 }),
      ).rejects.toThrow(/at most 99/);
    });

    it('should accept age as empty string (optional)', async () => {
      await expect(
        profileSchema.validate({ name: 'Test', email: 'test@test.com', age: '' }),
      ).resolves.toBeDefined();
    });

    it('should reject non-integer age', async () => {
      await expect(
        profileSchema.validate({ name: 'Test', email: 'test@test.com', age: 25.5 }),
      ).rejects.toThrow(/whole number/);
    });

    it('should reject invalid emergency contact', async () => {
      await expect(
        profileSchema.validate({ name: 'Test', email: 'test@test.com', emergencyContact: '12345' }),
      ).rejects.toThrow(/valid 10-digit/);
    });

    it('should accept valid emergency contact starting with 6-9', async () => {
      await expect(
        profileSchema.validate({ name: 'Test', email: 'test@test.com', emergencyContact: '7890123456' }),
      ).resolves.toBeDefined();
    });

    it('should reject invalid gender value', async () => {
      await expect(
        profileSchema.validate({ name: 'Test', email: 'test@test.com', gender: 'unknown' }),
      ).rejects.toThrow(/Invalid gender/);
    });

    it('should accept valid gender values', async () => {
      for (const g of ['male', 'female', 'other']) {
        await expect(
          profileSchema.validate({ name: 'Test', email: 'test@test.com', gender: g }),
        ).resolves.toBeDefined();
      }
    });

    it('should reject fatherName exceeding 100 characters', async () => {
      await expect(
        profileSchema.validate({ name: 'Test', email: 'test@test.com', fatherName: 'A'.repeat(101) }),
      ).rejects.toThrow(/at most 100/);
    });

    it('should reject address exceeding 500 characters', async () => {
      await expect(
        profileSchema.validate({ name: 'Test', email: 'test@test.com', address: 'A'.repeat(501) }),
      ).rejects.toThrow(/at most 500/);
    });
  });

  describe('babyDetailSchema', () => {
    it('should accept valid baby detail', async () => {
      await expect(
        babyDetailSchema.validate({ name: 'Baby', age: 2, gender: 'male' }),
      ).resolves.toBeDefined();
    });

    it('should accept baby detail with priorDisease', async () => {
      await expect(
        babyDetailSchema.validate({ name: 'Baby', age: 2, gender: 'male', priorDisease: 'Asthma' }),
      ).resolves.toBeDefined();
    });

    it('should reject empty baby name', async () => {
      await expect(
        babyDetailSchema.validate({ name: '', age: 2, gender: 'male' }),
      ).rejects.toThrow();
    });

    it('should reject age over 18', async () => {
      await expect(
        babyDetailSchema.validate({ name: 'Baby', age: 19, gender: 'male' }),
      ).rejects.toThrow(/18 or below/);
    });

    it('should reject invalid gender', async () => {
      await expect(
        babyDetailSchema.validate({ name: 'Baby', age: 2, gender: 'unknown' }),
      ).rejects.toThrow(/Invalid gender/);
    });

    it('should reject priorDisease exceeding 500 characters', async () => {
      await expect(
        babyDetailSchema.validate({
          name: 'Baby',
          age: 2,
          gender: 'male',
          priorDisease: 'A'.repeat(501),
        }),
      ).rejects.toThrow(/at most 500/);
    });
  });
});
