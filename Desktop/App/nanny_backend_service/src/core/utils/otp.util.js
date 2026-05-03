const crypto = require("crypto");
const env = require("../../config/env.config");

const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

const getOtpExpiryDate = () => {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + env.otpExpiryMinutes);
  return expiresAt;
};

module.exports = {
  generateOtp,
  getOtpExpiryDate
};
