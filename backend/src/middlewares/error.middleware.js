const ApiResponse = require('../utils/ApiResponse');

const errorHandler = (err, req, res, next) => {
  if (err && err.isOperational) {
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  console.error(err);
  return ApiResponse.error(res, 'Internal Server Error', 500);
};

module.exports = { errorHandler };
