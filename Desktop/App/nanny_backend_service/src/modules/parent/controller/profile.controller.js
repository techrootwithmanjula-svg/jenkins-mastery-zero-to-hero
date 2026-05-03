const { successResponse } = require("../../../core/utils/response-formatter.util");
const messages = require("../../../core/constants/messages.constant");
const profileService = require("../service/profile.service");

class ProfileController {
  async get(req, res, next) {
    try {
      const userId = req.user.id;
      const data = await profileService.getProfile(userId);
      return res.status(200).json(successResponse(messages.PROFILE_FETCHED, data));
    } catch (error) {
      return next(error);
    }
  }

  async upsert(req, res, next) {
    try {
      const userId = req.user.id;
      const isPut = req.method === "PUT";
      const data = await profileService.upsertProfile(userId, req.body, isPut);
      return res.status(200).json(successResponse(messages.PROFILE_SAVED, data));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ProfileController();
