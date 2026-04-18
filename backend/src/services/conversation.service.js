const ApiError = require('../utils/ApiError');
const applicationRepository = require('../repositories/application.repository');
const conversationRepository = require('../repositories/conversation.repository');
const messageRepository = require('../repositories/message.repository');

class ConversationService {
  async getConversationByApplication(applicationId, user) {
    const application = await applicationRepository.findByIdDetailed(applicationId);
    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    const isParticipant =
      String(application.brand._id || application.brand) === String(user._id) ||
      String(application.student._id || application.student) === String(user._id);

    if (!isParticipant) {
      throw new ApiError(403, 'Forbidden');
    }

    const conversation = await conversationRepository.findByApplication(applicationId);
    if (!conversation) {
      throw new ApiError(403, 'Chat locked. Application not accepted.');
    }

    return conversation;
  }

  async postMessage(conversationId, payload, user) {
    const { content } = payload;
    if (!content) {
      throw new ApiError(400, 'content is required');
    }

    const conversation = await conversationRepository.findByIdWithApplication(conversationId);
    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    const brandId = String(conversation.application.brand._id || conversation.application.brand);
    const studentId = String(conversation.application.student._id || conversation.application.student);

    if (![brandId, studentId].includes(String(user._id))) {
      throw new ApiError(403, 'Only participants can send messages');
    }

    return messageRepository.create({
      conversation: conversationId,
      sender: user._id,
      content,
    });
  }

  async getMessages(conversationId, user) {
    const conversation = await conversationRepository.findByIdWithApplication(conversationId);
    if (!conversation) {
      throw new ApiError(404, 'Conversation not found');
    }

    const brandId = String(conversation.application.brand._id || conversation.application.brand);
    const studentId = String(conversation.application.student._id || conversation.application.student);

    if (![brandId, studentId].includes(String(user._id))) {
      throw new ApiError(403, 'Only participants can view messages');
    }

    return messageRepository.findByConversation(conversationId);
  }
}

module.exports = new ConversationService();
