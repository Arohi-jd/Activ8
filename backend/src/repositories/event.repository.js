const BaseRepository = require('./base.repository');
const Event = require('../models/Event.model');
const SponsorshipTier = require('../models/SponsorshipTier.model');

class EventRepository extends BaseRepository {
  constructor() {
    super(Event);
    this.tierModel = SponsorshipTier;
  }

  getPublishedEvents() {
    return this.model
      .find({ status: 'published' })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
  }

  getStudentEvents(studentId) {
    return this.model.find({ createdBy: studentId }).sort({ createdAt: -1 });
  }

  addTier(data) {
    return this.tierModel.create(data);
  }

  getTiersByEvent(eventId) {
    return this.tierModel.find({ event: eventId }).sort({ price: 1 });
  }
}

module.exports = new EventRepository();
