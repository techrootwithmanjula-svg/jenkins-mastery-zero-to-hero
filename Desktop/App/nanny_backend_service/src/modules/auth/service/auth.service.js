const bcrypt = require("bcrypt");
const env = require("../../../config/env.config");
const messages = require("../../../core/constants/messages.constant");
const roles = require("../../../core/constants/roles.constant");
const CustomError = require("../../../core/exceptions/custom-error.exception");
const { signToken } = require("../../../core/utils/jwt.util");
const { info, logOtpForDev, maskMobile } = require("../../../core/utils/logger.util");
const { generateOtp, getOtpExpiryDate } = require("../../../core/utils/otp.util");
const authRepository = require("../repository/auth.repository");

const MAX_ATTEMPTS = 3;

class AuthService {
  async sendOtp(mobile) {
    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = getOtpExpiryDate();

    await authRepository.invalidateActiveOtps(mobile);
    await authRepository.createOtp({ mobile, otpHash, expiresAt, resendCount: 0 });

    logOtpForDev(mobile, otp);
    info("OTP sent", { mobile: maskMobile(mobile) });

    return { message: messages.OTP_SENT };
  }

  async verifyOtp({ mobile, otp }) {
    const latestOtp = await authRepository.findLatestOtpByMobile(mobile);
    if (!latestOtp || latestOtp.is_used) {
      throw new CustomError(messages.OTP_NOT_FOUND, 400);
    }

    if (new Date(latestOtp.expires_at).getTime() < Date.now()) {
      throw new CustomError(messages.OTP_EXPIRED, 400);
    }

    if (latestOtp.attempts >= MAX_ATTEMPTS) {
      throw new CustomError(messages.OTP_MAX_ATTEMPTS, 429);
    }

    const isOtpMatch = await bcrypt.compare(otp, latestOtp.otp_hash);
    if (!isOtpMatch) {
      const updated = await authRepository.incrementOtpAttempts(latestOtp.id);
      if (updated.attempts >= MAX_ATTEMPTS) {
        throw new CustomError(messages.OTP_MAX_ATTEMPTS, 429);
      }
      throw new CustomError(messages.OTP_INVALID, 400);
    }

    await authRepository.markOtpUsed(latestOtp.id);

    let user = await authRepository.findUserByMobile(mobile);
    if (!user) {
      user = await authRepository.createUser({ mobile, role: roles.USER });
    }

    const token = signToken({
      id: user.id,
      role: user.role,
      mobile: user.mobile
    });

    return {
      token,
      user
    };
  }

  async resendOtp(mobile) {
    const latestOtp = await authRepository.findLatestOtpByMobile(mobile);
    if (!latestOtp) {
      throw new CustomError(messages.OTP_NOT_FOUND, 400);
    }

    if (latestOtp.resend_count >= env.otpResendLimit) {
      throw new CustomError(messages.OTP_RESEND_LIMIT, 429);
    }

    const elapsedSeconds = (Date.now() - new Date(latestOtp.created_at).getTime()) / 1000;
    if (elapsedSeconds < env.otpResendCooldown) {
      throw new CustomError(messages.OTP_RESEND_COOLDOWN, 429, {
        waitSeconds: Math.ceil(env.otpResendCooldown - elapsedSeconds)
      });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = getOtpExpiryDate();

    await authRepository.invalidateActiveOtps(mobile);
    await authRepository.createOtp({
      mobile,
      otpHash,
      expiresAt,
      resendCount: latestOtp.resend_count + 1
    });

    logOtpForDev(mobile, otp);
    info("OTP resent", { mobile: maskMobile(mobile) });

    return { message: messages.OTP_RESEND_SUCCESS };
  }
}

module.exports = new AuthService();
