const db = require("../../../config/database.config");

class AuthRepository {
  async invalidateActiveOtps(mobile) {
    await db.query(
      `
        UPDATE otp
        SET is_used = TRUE
        WHERE mobile = $1 AND is_used = FALSE
      `,
      [mobile]
    );
  }

  async createOtp({ mobile, otpHash, expiresAt, resendCount = 0 }) {
    const { rows } = await db.query(
      `
        INSERT INTO otp (mobile, otp_hash, expires_at, is_used, attempts, resend_count)
        VALUES ($1, $2, $3, FALSE, 0, $4)
        RETURNING id, mobile, otp_hash, expires_at, is_used, attempts, resend_count, created_at
      `,
      [mobile, otpHash, expiresAt, resendCount]
    );
    return rows[0];
  }

  async findLatestOtpByMobile(mobile) {
    const { rows } = await db.query(
      `
        SELECT id, mobile, otp_hash, expires_at, is_used, attempts, resend_count, created_at
        FROM otp
        WHERE mobile = $1
        ORDER BY created_at DESC
        LIMIT 1
      `,
      [mobile]
    );
    return rows[0] || null;
  }

  async incrementOtpAttempts(otpId) {
    const { rows } = await db.query(
      `
        UPDATE otp
        SET attempts = attempts + 1
        WHERE id = $1
        RETURNING id, attempts
      `,
      [otpId]
    );
    return rows[0];
  }

  async markOtpUsed(otpId) {
    await db.query(
      `
        UPDATE otp
        SET is_used = TRUE
        WHERE id = $1
      `,
      [otpId]
    );
  }

  async findUserByMobile(mobile) {
    const { rows } = await db.query(
      `
        SELECT id, mobile, role, is_verified, is_active, created_at, updated_at
        FROM users
        WHERE mobile = $1 AND is_active = TRUE
      `,
      [mobile]
    );
    return rows[0] || null;
  }

  async createUser({ mobile, role = "user" }) {
    const { rows } = await db.query(
      `
        INSERT INTO users (mobile, role, is_verified, is_active)
        VALUES ($1, $2, TRUE, TRUE)
        RETURNING id, mobile, role, is_verified, is_active, created_at, updated_at
      `,
      [mobile, role]
    );
    return rows[0];
  }
}

module.exports = new AuthRepository();
