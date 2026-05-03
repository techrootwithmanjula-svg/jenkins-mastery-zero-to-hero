const { successResponse } = require("../../../core/utils/response-formatter.util");
const authService = require("../service/auth.service");

class AuthController {
  async sendOtp(req, res, next) {
    try {
      const { mobile } = req.body;
      const result = await authService.sendOtp(mobile);
      return res.status(200).json(successResponse(result.message));
    } catch (error) {
      return next(error);
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const { mobile, otp } = req.body;
      const result = await authService.verifyOtp({ mobile, otp });
      return res.status(200).json(successResponse("Login successful", result));
    } catch (error) {
      return next(error);
    }
  }

  async resendOtp(req, res, next) {
    try {
      const { mobile } = req.body;
      const result = await authService.resendOtp(mobile);
      return res.status(200).json(successResponse(result.message));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new AuthController();
