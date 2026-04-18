const ApiError = require('../utils/ApiError');
const eventRepository = require('../repositories/event.repository');

class EventService {
  async createEvent(payload, user) {
    const { title, description, date, location, footfall } = payload;

    if (!title || !description || !date || !location || footfall === undefined) {
      throw new ApiError(400, 'All event fields are required');
    }

    return eventRepository.create({
      title,
      description,
      date,
      location,
      footfall,
      createdBy: user._id,
    });
  }

  async listEvents(user) {
    if (user.role === 'brand') {
      return eventRepository.getPublishedEvents();
    }

    if (user.role === 'student') {
      return eventRepository.getStudentEvents(user._id);
    }

    throw new ApiError(403, 'Forbidden');
  }

  async getEventById(eventId) {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    return event;
  }

  async publishEvent(eventId, user) {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (String(event.createdBy) !== String(user._id)) {
      throw new ApiError(403, 'Only event owner can publish');
    }

    return eventRepository.updateById(eventId, { status: 'published' });
  }

  async addTier(eventId, payload, user) {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    if (String(event.createdBy) !== String(user._id)) {
      throw new ApiError(403, 'Only event owner can add tiers');
    }

    const { name, price, benefits } = payload;
    if (!name || price === undefined || !benefits) {
      throw new ApiError(400, 'name, price and benefits are required');
    }

    return eventRepository.addTier({ name, price, benefits, event: eventId });
  }

  async getTiers(eventId) {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    return eventRepository.getTiersByEvent(eventId);
  }
}

module.exports = new EventService();
