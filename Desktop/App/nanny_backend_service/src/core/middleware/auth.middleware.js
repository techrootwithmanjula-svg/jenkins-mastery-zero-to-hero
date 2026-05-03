const messages = require("../constants/messages.constant");
const CustomError = require("../exceptions/custom-error.exception");
const { verifyToken } = require("../utils/jwt.util");

const authMiddleware = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new CustomError(messages.UNAUTHORIZED, 401);
    }

    req.user = verifyToken(token);
    next();
  } catch (_error) {
    next(new CustomError(messages.UNAUTHORIZED, 401));
  }
};

module.exports = authMiddleware;
