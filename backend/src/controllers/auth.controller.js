const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');

const register = async (req, res) => {
  const data = await authService.register(req.body);
  ApiResponse.success(res, data, 'Registered successfully', 201);
};

const login = async (req, res) => {
  const data = await authService.login(req.body, res);
  ApiResponse.success(res, data, 'Logged in successfully');
};

const logout = async (req, res) => {
  const data = await authService.logout(res);
  ApiResponse.success(res, data, 'Logged out successfully');
};

const me = async (req, res) => {
  const data = await authService.me(req.user._id);
  ApiResponse.success(res, data, 'Current user');
};

const brands = async (req, res) => {
  const data = await authService.getBrands(req.user);
  ApiResponse.success(res, data, 'Brands fetched');
};

module.exports = { register, login, logout, me, brands };
