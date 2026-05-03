const { body, param, query } = require("express-validator");

const MOBILE_IN = /^[6-9]\d{9}$/;

const idParam = [param("id").isInt({ min: 1 }).withMessage("Invalid user id")];

const createUserValidation = [
  body("mobile")
    .trim()
    .matches(MOBILE_IN)
    .withMessage("mobile must be a valid 10-digit Indian mobile"),
  body("role").optional().isIn(["user", "nanny", "admin"]).withMessage("role must be user, nanny, or admin"),
  body("is_verified").optional().isBoolean(),
  body("is_active").optional().isBoolean()
];

const updateUserValidation = [
  ...idParam,
  body("mobile").optional().trim().matches(MOBILE_IN).withMessage("mobile must be a valid 10-digit Indian mobile"),
  body("role").optional().isIn(["user", "nanny", "admin"]),
  body("is_verified").optional().isBoolean(),
  body("is_active").optional().isBoolean()
];

const listUserValidation = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("is_active").optional().isIn(["true", "false"]),
  query("mobile")
    .optional()
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage("mobile search must be between 3 and 15 characters")
];

const getByIdValidation = [...idParam];

const deleteUserValidation = [...idParam];

module.exports = {
  createUserValidation,
  updateUserValidation,
  listUserValidation,
  getByIdValidation,
  deleteUserValidation
};
