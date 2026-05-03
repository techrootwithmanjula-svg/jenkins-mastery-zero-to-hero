const status = require("../constants/status.constant");

const successResponse = (message, data = null) => ({
  status: status.SUCCESS,
  message,
  data
});

const errorResponse = (message, details = null) => ({
  status: status.ERROR,
  message,
  details
});

module.exports = {
  successResponse,
  errorResponse
};
