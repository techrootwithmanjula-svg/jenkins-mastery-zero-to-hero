const express = require("express");
const authController = require("../controller/auth.controller");
const validationMiddleware = require("../../../core/middleware/validation.middleware");
const {
  sendOtpValidation,
  verifyOtpValidation,
  resendOtpValidation
} = require("../validation/auth.validation");

const router = express.Router();

router.post("/send-otp", sendOtpValidation, validationMiddleware, (req, res, next) =>
  authController.sendOtp(req, res, next)
);
router.post("/verify-otp", verifyOtpValidation, validationMiddleware, (req, res, next) =>
  authController.verifyOtp(req, res, next)
);
router.post("/resend-otp", resendOtpValidation, validationMiddleware, (req, res, next) =>
  authController.resendOtp(req, res, next)
);

module.exports = router;
