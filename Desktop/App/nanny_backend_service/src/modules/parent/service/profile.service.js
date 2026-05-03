const messages = require("../../../core/constants/messages.constant");
const CustomError = require("../../../core/exceptions/custom-error.exception");
const parentRepository = require("../repository/parent.repository");
const babyRepository = require("../../baby/repository/baby.repository");

const normalizeParentPatch = (body, isPut) => {
  const patch = {};
  const pick = (key) => {
    if (isPut || body[key] !== undefined) patch[key] = body[key] ?? null;
  };

  pick("name");
  pick("dob");
  pick("address");
  pick("permanent_address");
  pick("emergency_contact_number");
  pick("email");
  pick("gender");
  pick("mother_name");
  pick("father_name");
  pick("mother_occupation");
  pick("father_occupation");
  pick("image_url");
  return patch;
};

const normalizeBabyPatch = (body, isPut) => {
  const patch = {};
  const pick = (key) => {
    if (isPut || body[key] !== undefined) patch[key] = body[key] ?? null;
  };
  pick("name");
  pick("dob");
  pick("gender");
  pick("image_url");
  pick("any_period_disease");
  pick("note");
  return patch;
};

class ProfileService {
  async getProfile(userId) {
    const parent = await parentRepository.findByUserId(userId);
    if (!parent) {
      throw new CustomError(messages.PARENT_NOT_FOUND, 404);
    }
    const babies = await babyRepository.findAllByParentId(parent.id);
    return { parent, babies };
  }

  async upsertProfile(userId, body, isPut) {
    const parentBody = body.parent || {};
    const babiesInput = body.babies;

    if (isPut && !parentBody.name) {
      throw new CustomError("name is required", 400);
    }

    let parent = await parentRepository.findByUserId(userId);

    if (!parent) {
      if (!parentBody.name) {
        throw new CustomError("name is required when creating a profile", 400);
      }
      parent = await parentRepository.create(userId, parentBody);
    } else {
      const patch = normalizeParentPatch(parentBody, isPut);
      if (Object.keys(patch).length > 0) {
        parent = await parentRepository.update(parent.id, patch);
      }
    }

    let babies = await babyRepository.findAllByParentId(parent.id);

    if (Array.isArray(babiesInput) && babiesInput.length > 0) {
      const existingBabyIds = new Set(babies.map((b) => b.id));

      for (const babyData of babiesInput) {
        if (babyData.id) {
          if (!existingBabyIds.has(Number(babyData.id))) {
            throw new CustomError(
              `Baby id ${babyData.id} does not belong to this parent`,
              403
            );
          }
          const patch = normalizeBabyPatch(babyData, isPut);
          await babyRepository.update(Number(babyData.id), patch);
        } else {
          if (!babyData.name) {
            throw new CustomError("Baby name is required", 400);
          }
          await babyRepository.create(parent.id, babyData);
        }
      }

      babies = await babyRepository.findAllByParentId(parent.id);
    }

    return { parent, babies };
  }
}

module.exports = new ProfileService();
