const messages = require("../../../core/constants/messages.constant");
const CustomError = require("../../../core/exceptions/custom-error.exception");
const userRepository = require("../repository/user.repository");

const normalizeMobile = (value) => String(value || "").replace(/\s+/g, "");

const mapUniqueViolation = (error) => {
  if (error.code !== "23505") return null;
  const key = error.constraint || "";
  if (key.includes("mobile") || key === "users_mobile_key") {
    return messages.USER_DUPLICATE_MOBILE;
  }
  return messages.USER_DUPLICATE_GENERIC;
};

class UserService {
  async create(body) {
    const mobile = normalizeMobile(body.mobile);
    const role = body.role || "user";
    const is_verified = body.is_verified !== undefined ? Boolean(body.is_verified) : false;
    const is_active = body.is_active !== undefined ? Boolean(body.is_active) : true;

    try {
      return await userRepository.create({ mobile, role, is_verified, is_active });
    } catch (error) {
      const duplicateMessage = mapUniqueViolation(error);
      if (duplicateMessage) {
        throw new CustomError(duplicateMessage, 409);
      }
      throw error;
    }
  }

  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new CustomError(messages.USER_NOT_FOUND, 404);
    }
    return user;
  }

  async list(query) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));

    let isActive;
    if (query.is_active === "true") isActive = true;
    else if (query.is_active === "false") isActive = false;

    const mobileSearch = query.mobile ? normalizeMobile(query.mobile) : undefined;

    const result = await userRepository.findAll({
      page,
      limit,
      isActive,
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

    const patch = {};
    if (body.mobile !== undefined) patch.mobile = normalizeMobile(body.mobile);
    if (body.role !== undefined) patch.role = body.role;
    if (body.is_verified !== undefined) patch.is_verified = Boolean(body.is_verified);
    if (body.is_active !== undefined) patch.is_active = Boolean(body.is_active);

    try {
      const updated = await userRepository.update(id, patch);
      if (!updated) {
        throw new CustomError(messages.USER_NOT_FOUND, 404);
      }
      return updated;
    } catch (error) {
      const duplicateMessage = mapUniqueViolation(error);
      if (duplicateMessage) {
        throw new CustomError(duplicateMessage, 409);
      }
      throw error;
    }
  }

  async softDelete(id) {
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new CustomError(messages.USER_NOT_FOUND, 404);
    }
    if (!existing.is_active) {
      throw new CustomError(messages.USER_ALREADY_INACTIVE, 400);
    }
    const updated = await userRepository.softDeleteAndRemoveNannies(id);
    if (!updated) {
      throw new CustomError(messages.USER_NOT_FOUND, 404);
    }
    return updated;
  }
}

module.exports = new UserService();
