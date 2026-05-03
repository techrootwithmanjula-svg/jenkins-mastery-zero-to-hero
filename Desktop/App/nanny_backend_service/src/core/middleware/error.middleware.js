const { errorResponse } = require("../utils/response-formatter.util");
const { error: logError } = require("../utils/logger.util");

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  if (statusCode >= 500) {
    logError("Unhandled error", { message, stack: error.stack });
  }

  return res.status(statusCode).json(errorResponse(message, error.details || null));
};

module.exports = errorMiddleware;
