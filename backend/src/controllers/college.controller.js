const collegeService = require('../services/college.service');
const ApiResponse = require('../utils/ApiResponse');

const createCollege = async (req, res) => {
  const data = await collegeService.createCollege(req.body, req.user);
  ApiResponse.success(res, data, 'College created', 201);
};

const listColleges = async (req, res) => {
  const data = await collegeService.listColleges();
  ApiResponse.success(res, data, 'Colleges fetched');
};

const verifyCollege = async (req, res) => {
  const data = await collegeService.verifyCollege(req.params.id);
  ApiResponse.success(res, data, 'College verified');
};

const pendingStudents = async (req, res) => {
  const data = await collegeService.getPendingStudents(req.user);
  ApiResponse.success(res, data, 'Pending students fetched');
};

const approveStudent = async (req, res) => {
  const data = await collegeService.approveStudent(req.user, req.params.id);
  ApiResponse.success(res, data, 'Student approved');
};

module.exports = {
  createCollege,
  listColleges,
  verifyCollege,
  pendingStudents,
  approveStudent,
};
