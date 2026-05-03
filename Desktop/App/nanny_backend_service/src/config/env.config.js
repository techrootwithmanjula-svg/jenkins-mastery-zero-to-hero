const dotenv = require("dotenv");

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toNumber(process.env.PORT, 3000),
  databaseUrl: process.env.DATABASE_URL || "",
  redisUrl: process.env.REDIS_URL || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  otpExpiryMinutes: toNumber(process.env.OTP_EXPIRY_MINUTES, 5),
  otpResendLimit: toNumber(process.env.OTP_RESEND_LIMIT, 3),
  otpResendCooldown: toNumber(process.env.OTP_RESEND_COOLDOWN, 30)
};
