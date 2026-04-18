const applicationService = require('../services/application.service');
const ApiResponse = require('../utils/ApiResponse');

const createApplication = async (req, res) => {
  const data = await applicationService.createApplication(req.body, req.user);
  ApiResponse.success(res, data, 'Application created', 201);
};

const getMyApplications = async (req, res) => {
  const data = await applicationService.getMyApplications(req.user);
  ApiResponse.success(res, data, 'Applications fetched');
};

const respondApplication = async (req, res) => {
  const data = await applicationService.respondToApplication(req.params.id, req.body, req.user);
  ApiResponse.success(res, data, 'Application updated');
};

module.exports = { createApplication, getMyApplications, respondApplication };
