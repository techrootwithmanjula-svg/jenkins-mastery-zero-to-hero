const jwt = require("jsonwebtoken");
const env = require("../../config/env.config");
const CustomError = require("../exceptions/custom-error.exception");

const signToken = (payload) => {
  if (!env.jwtSecret) {
    throw new CustomError("JWT_SECRET is not configured", 500);
  }

  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
};

const verifyToken = (token) => {
  if (!env.jwtSecret) {
    throw new CustomError("JWT_SECRET is not configured", 500);
  }

  return jwt.verify(token, env.jwtSecret);
};

module.exports = {
  signToken,
  verifyToken
};
