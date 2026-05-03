const { body } = require("express-validator");

const PHONE = /^\d{10,15}$/;
const VALID_GENDERS = ["male", "female", "other"];

const babyRules = (prefix = "") => {
  const f = (field) => `${prefix}${field}`;
  return [
    body(f("name")).trim().notEmpty().withMessage("Baby name is required"),
    body(f("dob"))
      .optional({ nullable: true })
      .isISO8601()
      .withMessage("Baby dob must be a valid date")
      .custom((val) => {
        if (val && new Date(val) > new Date()) {
          throw new Error("Baby dob cannot be a future date");
        }
        return true;
      }),
    body(f("gender"))
      .optional({ nullable: true })
      .isIn(VALID_GENDERS)
      .withMessage("Baby gender must be male, female, or other"),
    body(f("image_url"))
      .optional({ nullable: true, checkFalsy: true })
      .isURL({ require_protocol: true })
      .withMessage("Baby image_url must be a valid URL")
  ];
};

const upsertProfileValidation = [
  body("parent").optional().isObject().withMessage("parent must be an object"),
  body("parent.name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("parent.name must not be empty"),
  body("parent.email")
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage("parent.email must be a valid email"),
  body("parent.emergency_contact_number")
    .optional({ nullable: true, checkFalsy: true })
    .matches(PHONE)
    .withMessage("emergency_contact_number must be numeric (10–15 digits)"),
  body("parent.gender")
    .optional({ nullable: true })
    .isIn(VALID_GENDERS)
    .withMessage("parent.gender must be male, female, or other"),
  body("parent.dob")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("parent.dob must be a valid date"),
  body("parent.image_url")
    .optional({ nullable: true, checkFalsy: true })
    .isURL({ require_protocol: true })
    .withMessage("parent.image_url must be a valid URL"),
  body("babies").optional().isArray().withMessage("babies must be an array"),
  body("babies.*.id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("babies[].id must be a positive integer"),
  ...babyRules("babies.*.").map((rule) => rule.optional())
];

module.exports = { upsertProfileValidation };
