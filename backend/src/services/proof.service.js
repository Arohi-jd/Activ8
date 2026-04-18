const ApiError = require('../utils/ApiError');
const proofRepository = require('../repositories/proof.repository');
const eventRepository = require('../repositories/event.repository');
const applicationRepository = require('../repositories/application.repository');

class ProofService {
  async uploadProof(payload, file, user) {
    const { eventId, type } = payload;

    if (!eventId || !type) {
      throw new ApiError(400, 'eventId and type are required');
    }

    if (!file) {
      throw new ApiError(400, 'File is required');
    }

    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (String(event.createdBy) !== String(user._id)) {
      throw new ApiError(403, 'Only event owner can upload proof');
    }

    return proofRepository.create({
      event: eventId,
      uploadedBy: user._id,
      fileUrl: `/uploads/${file.filename}`,
      type,
      approved: false,
    });
  }

  async getProofsByEvent(eventId, user) {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    const acceptedApplication = await applicationRepository.findOne({
      event: eventId,
      brand: user._id,
      status: 'accepted',
    });

    if (!acceptedApplication) {
      throw new ApiError(403, 'Only associated brand can review proofs');
    }

    return proofRepository.findByEvent(eventId);
  }

  async approveProof(proofId, user) {
    const proof = await proofRepository.findById(proofId);
    if (!proof) {
      throw new ApiError(404, 'Proof not found');
    }

    const acceptedApplication = await applicationRepository.findOne({
      event: proof.event,
      brand: user._id,
      status: 'accepted',
    });

    if (!acceptedApplication) {
      throw new ApiError(403, 'Only associated brand can approve proofs');
    }

    const updatedProof = await proofRepository.updateById(proofId, { approved: true });

    const total = await proofRepository.countByEvent(proof.event);
    const approved = await proofRepository.countApprovedByEvent(proof.event);

    if (total > 0 && total === approved) {
      await eventRepository.updateById(proof.event, { status: 'completed' });
    }

    return updatedProof;
  }
}

module.exports = new ProofService();
