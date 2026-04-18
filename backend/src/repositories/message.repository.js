const BaseRepository = require('./base.repository');
const Message = require('../models/Message.model');

class MessageRepository extends BaseRepository {
  constructor() {
    super(Message);
  }

  findByConversation(conversationId) {
    return this.model
      .find({ conversation: conversationId })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });
  }
}

module.exports = new MessageRepository();
