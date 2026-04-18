const proofService = require('../services/proof.service');
const ApiResponse = require('../utils/ApiResponse');

const uploadProof = async (req, res) => {
  const data = await proofService.uploadProof(req.body, req.file, req.user);
  ApiResponse.success(res, data, 'Proof uploaded', 201);
};

const getProofsByEvent = async (req, res) => {
  const data = await proofService.getProofsByEvent(req.params.eventId, req.user);
  ApiResponse.success(res, data, 'Proofs fetched');
};

const approveProof = async (req, res) => {
  const data = await proofService.approveProof(req.params.id, req.user);
  ApiResponse.success(res, data, 'Proof approved');
};

module.exports = { uploadProof, getProofsByEvent, approveProof };
