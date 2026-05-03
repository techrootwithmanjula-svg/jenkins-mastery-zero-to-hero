const { body, param, query } = require("express-validator");

const MOBILE_IN = /^[6-9]\d{9}$/;
const AADHAR = /^\d{12}$/;
const PAN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const certificatesValidator = body("certificates")
  .optional()
  .isArray()
  .withMessage("certificates must be an array")
  .custom((arr) => {
    if (!Array.isArray(arr)) return true;
    const invalid = arr.some((item) => typeof item !== "string" || !/^https?:\/\//i.test(item));
    if (invalid) {
      throw new Error("Each certificate must be a string URL");
    }
    return true;
  });

const idParam = [param("id").isInt({ min: 1 }).withMessage("Invalid nanny id")];

const createNannyValidation = [
  body("user_id").isInt({ min: 1 }).withMessage("user_id must be a positive integer"),
  body("first_name").trim().notEmpty().withMessage("first_name is required"),
  body("middle_name").optional({ nullable: true }).trim(),
  body("last_name").trim().notEmpty().withMessage("last_name is required"),
  body("dob").isISO8601().withMessage("dob must be a valid date (YYYY-MM-DD)"),
  body("image")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isURL({ require_protocol: true })
    .withMessage("image must be a valid URL"),
  body("mobile_number")
    .trim()
    .matches(MOBILE_IN)
    .withMessage("mobile_number must be a valid 10-digit Indian mobile"),
  body("email_id").trim().isEmail().withMessage("email_id must be a valid email"),
  body("gender").isIn(["male", "female", "other"]).withMessage("gender must be male, female, or other"),
  body("address").optional({ nullable: true }).trim(),
  body("permanent_address").optional({ nullable: true }).trim(),
  body("emergency_contact").optional({ nullable: true }).trim(),
  certificatesValidator,
  body("experience")
    .isFloat({ min: 0, max: 80 })
    .withMessage("experience must be a number of years between 0 and 80"),
  body("aadhar_number")
    .trim()
    .customSanitizer((v) => String(v).replace(/\s+/g, ""))
    .matches(AADHAR)
    .withMessage("aadhar_number must be exactly 12 digits"),
  body("pan_card")
    .trim()
    .customSanitizer((v) => String(v).toUpperCase().replace(/\s+/g, ""))
    .matches(PAN)
    .withMessage("pan_card must be a valid PAN (e.g., ABCDE1234F)"),
  body("is_active").optional().isBoolean().withMessage("is_active must be boolean")
];

const updateNannyValidation = [
  ...idParam,
  body("user_id").optional().isInt({ min: 1 }).withMessage("user_id must be a positive integer"),
  body("first_name").optional().trim().notEmpty(),
  body("middle_name").optional({ nullable: true }).trim(),
  body("last_name").optional().trim().notEmpty(),
  body("dob").optional().isISO8601(),
  body("image")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isURL({ require_protocol: true }),
  body("mobile_number")
    .optional()
    .trim()
    .matches(MOBILE_IN)
    .withMessage("mobile_number must be a valid 10-digit Indian mobile"),
  body("email_id").optional().trim().isEmail(),
  body("gender").optional().isIn(["male", "female", "other"]),
  body("address").optional({ nullable: true }).trim(),
  body("permanent_address").optional({ nullable: true }).trim(),
  body("emergency_contact").optional({ nullable: true }).trim(),
  certificatesValidator,
  body("experience")
    .optional()
    .isFloat({ min: 0, max: 80 })
    .withMessage("experience must be a number of years between 0 and 80"),
  body("aadhar_number")
    .optional()
    .trim()
    .customSanitizer((v) => String(v).replace(/\s+/g, ""))
    .matches(AADHAR)
    .withMessage("aadhar_number must be exactly 12 digits"),
  body("pan_card")
    .optional()
    .trim()
    .customSanitizer((v) => String(v).toUpperCase().replace(/\s+/g, ""))
    .matches(PAN)
    .withMessage("pan_card must be a valid PAN"),
  body("is_active").optional().isBoolean()
];

const listNannyValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100"),
  query("is_active").optional().isIn(["true", "false"]).withMessage("is_active must be true or false"),
  query("gender").optional().isIn(["male", "female", "other"]),
  query("experience_min").optional().isFloat({ min: 0, max: 80 }),
  query("experience_max").optional().isFloat({ min: 0, max: 80 }),
  query("mobile")
    .optional()
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage("mobile search must be between 3 and 15 characters")
];

const getByIdValidation = [...idParam];

const deleteNannyValidation = [...idParam];

module.exports = {
  createNannyValidation,
  updateNannyValidation,
  listNannyValidation,
  getByIdValidation,
  deleteNannyValidation
};
