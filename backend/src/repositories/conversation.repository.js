const BaseRepository = require('./base.repository');
const Conversation = require('../models/Conversation.model');

class ConversationRepository extends BaseRepository {
  constructor() {
    super(Conversation);
  }

  findByApplication(applicationId) {
    return this.model.findOne({ application: applicationId });
  }

  findByIdWithApplication(id) {
    return this.model.findById(id).populate({
      path: 'application',
      populate: [
        { path: 'brand', select: 'name email role' },
        { path: 'student', select: 'name email role' },
        { path: 'event', select: 'title createdBy' },
      ],
    });
  }
}

module.exports = new ConversationRepository();
