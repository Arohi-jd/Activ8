const ApiError = require('../utils/ApiError');

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, 'Forbidden: insufficient permissions');
  }
  next();
};

module.exports = { authorize };
