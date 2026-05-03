const env = require("../../config/env.config");

const maskMobile = (mobile = "") => {
  if (!mobile || mobile.length < 4) return "****";
  const visible = mobile.slice(-4);
  return `${"*".repeat(Math.max(0, mobile.length - 4))}${visible}`;
};

const info = (message, metadata = {}) => {
  // eslint-disable-next-line no-console
  console.log(`[INFO] ${message}`, metadata);
};

const warn = (message, metadata = {}) => {
  // eslint-disable-next-line no-console
  console.warn(`[WARN] ${message}`, metadata);
};

const error = (message, metadata = {}) => {
  // eslint-disable-next-line no-console
  console.error(`[ERROR] ${message}`, metadata);
};

const logOtpForDev = (mobile, otp) => {
  if (env.nodeEnv !== "development") return;
  info("Generated OTP", { mobile: maskMobile(mobile), otp });
};

module.exports = {
  maskMobile,
  info,
  warn,
  error,
  logOtpForDev
};
