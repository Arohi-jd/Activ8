const conversationService = require('../services/conversation.service');
const ApiResponse = require('../utils/ApiResponse');

const getConversation = async (req, res) => {
  const data = await conversationService.getConversationByApplication(req.params.applicationId, req.user);
  ApiResponse.success(res, data, 'Conversation fetched');
};

const sendMessage = async (req, res) => {
  const data = await conversationService.postMessage(req.params.id, req.body, req.user);
  ApiResponse.success(res, data, 'Message sent', 201);
};

const getMessages = async (req, res) => {
  const data = await conversationService.getMessages(req.params.id, req.user);
  ApiResponse.success(res, data, 'Messages fetched');
};

module.exports = { getConversation, sendMessage, getMessages };
