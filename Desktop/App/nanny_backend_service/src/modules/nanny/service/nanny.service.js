const messages = require("../../../core/constants/messages.constant");
const CustomError = require("../../../core/exceptions/custom-error.exception");
const nannyRepository = require("../repository/nanny.repository");
const userRepository = require("../../user/repository/user.repository");

const DUPLICATE_MESSAGES = {
  nannies_mobile_number_key: messages.NANNY_DUPLICATE_MOBILE,
  nannies_email_id_key: messages.NANNY_DUPLICATE_EMAIL,
  nannies_aadhar_number_key: messages.NANNY_DUPLICATE_AADHAR,
  nannies_pan_card_key: messages.NANNY_DUPLICATE_PAN,
  uq_nannies_mobile_number: messages.NANNY_DUPLICATE_MOBILE,
  uq_nannies_email_id: messages.NANNY_DUPLICATE_EMAIL,
  uq_nannies_aadhar_number: messages.NANNY_DUPLICATE_AADHAR,
  uq_nannies_pan_card: messages.NANNY_DUPLICATE_PAN,
  uq_nannies_user_id: messages.NANNY_DUPLICATE_USER_ID
};

const normalizeMobile = (value) => String(value || "").replace(/\s+/g, "");
const normalizeAadhar = (value) => String(value || "").replace(/\s+/g, "");
const normalizePan = (value) => String(value || "").toUpperCase().replace(/\s+/g, "");
const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const mapUniqueViolation = (error) => {
  if (error.code !== "23505") return null;
  const key = error.constraint || "";
  return DUPLICATE_MESSAGES[key] || messages.NANNY_DUPLICATE_GENERIC;
};

const mapFkViolation = (error) => {
  if (error.code !== "23503") return null;
  if (String(error.message || "").includes("user_id")) {
    return messages.NANNY_USER_NOT_FOUND;
  }
  return null;
};

class NannyService {
  async assertUserLinkable(userId, { excludeNannyId } = {}) {
    const user = await userRepository.findActiveById(userId);
    if (!user) {
      const any = await userRepository.findById(userId);
      if (!any) {
        throw new CustomError(messages.NANNY_USER_NOT_FOUND, 404);
      }
      throw new CustomError(messages.NANNY_USER_INACTIVE, 400);
    }

    const existing = await nannyRepository.findByUserId(userId);
    if (existing && existing.id !== excludeNannyId) {
      throw new CustomError(messages.NANNY_ALREADY_LINKED, 409);
    }
  }

  async create(body) {
    const userId = Number(body.user_id);
    await this.assertUserLinkable(userId);

    const payload = {
      user_id: userId,
      first_name: body.first_name,
      middle_name: body.middle_name,
      last_name: body.last_name,
      dob: body.dob,
      image: body.image,
      mobile_number: normalizeMobile(body.mobile_number),
      email_id: normalizeEmail(body.email_id),
      gender: body.gender,
      address: body.address,
      permanent_address: body.permanent_address,
      emergency_contact: body.emergency_contact,
      certificates: body.certificates || [],
      experience_years: Number(body.experience),
      aadhar_number: normalizeAadhar(body.aadhar_number),
      pan_card: normalizePan(body.pan_card),
      is_active: body.is_active !== undefined ? Boolean(body.is_active) : true
    };

    try {
      return await nannyRepository.create(payload);
    } catch (error) {
      const duplicateMessage = mapUniqueViolation(error);
      if (duplicateMessage) {
        throw new CustomError(duplicateMessage, 409);
      }
      const fkMessage = mapFkViolation(error);
      if (fkMessage) {
        throw new CustomError(fkMessage, 404);
      }
      throw error;
    }
  }

  async getById(id) {
    const nanny = await nannyRepository.findById(id, { includeInactive: true });
    if (!nanny) {
      throw new CustomError(messages.NANNY_NOT_FOUND, 404);
    }
    return nanny;
  }

  async list(query) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));

    let isActive;
    if (query.is_active === "true") isActive = true;
    else if (query.is_active === "false") isActive = false;

    const gender =
      query.gender && ["male", "female", "other"].includes(query.gender) ? query.gender : undefined;

    let experienceMin;
    let experienceMax;
    if (query.experience_min !== undefined && query.experience_min !== "") {
      experienceMin = Number(query.experience_min);
    }
    if (query.experience_max !== undefined && query.experience_max !== "") {
      experienceMax = Number(query.experience_max);
    }

    if (
      Number.isFinite(experienceMin) &&
      Number.isFinite(experienceMax) &&
      experienceMin > experienceMax
    ) {
      throw new CustomError("experience_min must be less than or equal to experience_max", 400);
    }

    const mobileSearch = query.mobile ? normalizeMobile(query.mobile) : undefined;

    const result = await nannyRepository.findAll({
      page,
      limit,
      isActive,
      gender,
      experienceMin: Number.isFinite(experienceMin) ? experienceMin : undefined,
      experienceMax: Number.isFinite(experienceMax) ? experienceMax : undefined,
      mobileSearch
    });

    return {
      items: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / result.limit) || 0
      }
    };
  }

  async update(id, body) {
    await this.getById(id);

    if (body.user_id !== undefined) {
      const userId = Number(body.user_id);
      await this.assertUserLinkable(userId, { excludeNannyId: id });
    }

    const patch = {};
    if (body.user_id !== undefined) patch.user_id = Number(body.user_id);
    if (body.first_name !== undefined) patch.first_name = body.first_name;
    if (body.middle_name !== undefined) patch.middle_name = body.middle_name;
    if (body.last_name !== undefined) patch.last_name = body.last_name;
    if (body.dob !== undefined) patch.dob = body.dob;
    if (body.image !== undefined) patch.image = body.image;
    if (body.mobile_number !== undefined) patch.mobile_number = normalizeMobile(body.mobile_number);
    if (body.email_id !== undefined) patch.email_id = normalizeEmail(body.email_id);
    if (body.gender !== undefined) patch.gender = body.gender;
    if (body.address !== undefined) patch.address = body.address;
    if (body.permanent_address !== undefined) patch.permanent_address = body.permanent_address;
    if (body.emergency_contact !== undefined) patch.emergency_contact = body.emergency_contact;
    if (body.certificates !== undefined) patch.certificates = body.certificates;
    if (body.experience !== undefined) patch.experience_years = Number(body.experience);
    if (body.aadhar_number !== undefined) patch.aadhar_number = normalizeAadhar(body.aadhar_number);
    if (body.pan_card !== undefined) patch.pan_card = normalizePan(body.pan_card);
    if (body.is_active !== undefined) patch.is_active = Boolean(body.is_active);

    try {
      const updated = await nannyRepository.update(id, patch);
      if (!updated) {
        throw new CustomError(messages.NANNY_NOT_FOUND, 404);
      }
      return updated;
    } catch (error) {
      const duplicateMessage = mapUniqueViolation(error);
      if (duplicateMessage) {
        throw new CustomError(duplicateMessage, 409);
      }
      const fkMessage = mapFkViolation(error);
      if (fkMessage) {
        throw new CustomError(fkMessage, 404);
      }
      throw error;
    }
  }

  async softDelete(id) {
    const existing = await nannyRepository.findById(id, { includeInactive: true });
    if (!existing) {
      throw new CustomError(messages.NANNY_NOT_FOUND, 404);
    }
    if (!existing.is_active) {
      throw new CustomError(messages.NANNY_ALREADY_INACTIVE, 400);
    }
    const updated = await nannyRepository.softDelete(id);
    if (!updated) {
      throw new CustomError(messages.NANNY_NOT_FOUND, 404);
    }
    return updated;
  }
}

module.exports = new NannyService();
