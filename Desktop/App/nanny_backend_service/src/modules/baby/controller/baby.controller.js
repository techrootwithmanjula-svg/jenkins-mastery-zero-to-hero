const { successResponse } = require("../../../core/utils/response-formatter.util");
const messages = require("../../../core/constants/messages.constant");
const babyService = require("../service/baby.service");

class BabyController {
  async deleteBaby(req, res, next) {
    try {
      const userId = req.user.id;
      const babyId = Number(req.params.id);
      await babyService.deleteBaby(babyId, userId);
      return res.status(200).json(successResponse(messages.BABY_DELETED));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new BabyController();
