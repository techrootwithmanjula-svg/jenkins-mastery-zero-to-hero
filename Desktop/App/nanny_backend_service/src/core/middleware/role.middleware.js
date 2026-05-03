const messages = require("../constants/messages.constant");
const CustomError = require("../exceptions/custom-error.exception");

const roleMiddleware = (...allowedRoles) => (req, _res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return next(new CustomError(messages.FORBIDDEN, 403));
  }

  return next();
};

module.exports = roleMiddleware;
