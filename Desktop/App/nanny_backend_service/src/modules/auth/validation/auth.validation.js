const { body } = require("express-validator");

const mobileValidator = body("mobile")
  .trim()
  .matches(/^[6-9]\d{9}$/)
  .withMessage("Mobile must be a valid 10-digit number");

const sendOtpValidation = [mobileValidator];

const verifyOtpValidation = [
  mobileValidator,
  body("otp")
    .trim()
    .matches(/^\d{6}$/)
    .withMessage("OTP must be a 6-digit number")
];

const resendOtpValidation = [mobileValidator];

module.exports = {
  sendOtpValidation,
  verifyOtpValidation,
  resendOtpValidation
};
