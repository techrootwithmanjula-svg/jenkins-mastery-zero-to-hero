const messages = require("../../../core/constants/messages.constant");
const CustomError = require("../../../core/exceptions/custom-error.exception");
const babyRepository = require("../repository/baby.repository");
const parentRepository = require("../../parent/repository/parent.repository");

class BabyService {
  async deleteBaby(babyId, userId) {
    const baby = await babyRepository.findById(babyId);
    if (!baby) {
      throw new CustomError(messages.BABY_NOT_FOUND, 404);
    }

    const parent = await parentRepository.findById(baby.parent_id);
    if (!parent || parent.user_id !== userId) {
      throw new CustomError(messages.BABY_FORBIDDEN, 403);
    }

    await babyRepository.delete(babyId);
  }
}

module.exports = new BabyService();
