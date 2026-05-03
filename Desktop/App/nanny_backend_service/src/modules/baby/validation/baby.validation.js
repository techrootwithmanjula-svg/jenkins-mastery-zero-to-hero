const { param } = require("express-validator");

const deleteBabyValidation = [
  param("id").isInt({ min: 1 }).withMessage("Invalid baby id")
];

module.exports = { deleteBabyValidation };
