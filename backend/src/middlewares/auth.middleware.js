const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const userRepository = require('../repositories/user.repository');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = req.cookies.token || bearerToken;

  if (!token) {
    throw new ApiError(401, 'Unauthorized');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, 'Invalid token');
  }

  const user = await userRepository.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  req.user = user;
  next();
};

module.exports = { protect };
