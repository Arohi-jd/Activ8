const BaseRepository = require('./base.repository');
const ProofSubmission = require('../models/ProofSubmission.model');

class ProofRepository extends BaseRepository {
  constructor() {
    super(ProofSubmission);
  }

  findByEvent(eventId) {
    return this.model
      .find({ event: eventId })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
  }

  countByEvent(eventId) {
    return this.model.countDocuments({ event: eventId });
  }

  countApprovedByEvent(eventId) {
    return this.model.countDocuments({ event: eventId, approved: true });
  }
}

module.exports = new ProofRepository();
