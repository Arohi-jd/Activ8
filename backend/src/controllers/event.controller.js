const eventService = require('../services/event.service');
const ApiResponse = require('../utils/ApiResponse');

const createEvent = async (req, res) => {
  const data = await eventService.createEvent(req.body, req.user);
  ApiResponse.success(res, data, 'Event created', 201);
};

const listEvents = async (req, res) => {
  const data = await eventService.listEvents(req.user);
  ApiResponse.success(res, data, 'Events fetched');
};

const getEvent = async (req, res) => {
  const data = await eventService.getEventById(req.params.id);
  ApiResponse.success(res, data, 'Event fetched');
};

const publishEvent = async (req, res) => {
  const data = await eventService.publishEvent(req.params.id, req.user);
  ApiResponse.success(res, data, 'Event published');
};

const addTier = async (req, res) => {
  const data = await eventService.addTier(req.params.id, req.body, req.user);
  ApiResponse.success(res, data, 'Tier added', 201);
};

const getTiers = async (req, res) => {
  const data = await eventService.getTiers(req.params.id);
  ApiResponse.success(res, data, 'Tiers fetched');
};

module.exports = { createEvent, listEvents, getEvent, publishEvent, addTier, getTiers };
