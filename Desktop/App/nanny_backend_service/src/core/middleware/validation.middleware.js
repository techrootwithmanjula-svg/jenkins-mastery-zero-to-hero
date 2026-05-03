const { validationResult } = require("express-validator");
const CustomError = require("../exceptions/custom-error.exception");

const validationMiddleware = (req, _res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  return next(new CustomError("Validation failed", 400, errors.array()));
};

module.exports = validationMiddleware;
