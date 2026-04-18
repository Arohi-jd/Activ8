const BaseRepository = require('./base.repository');
const Application = require('../models/Application.model');

class ApplicationRepository extends BaseRepository {
  constructor() {
    super(Application);
  }

  findExisting(eventId, brandId, studentId) {
    return this.model.findOne({ event: eventId, brand: brandId, student: studentId });
  }

  findMine(userId, role) {
    if (role === 'brand') {
      return this.model
        .find({ brand: userId })
        .populate('event', 'title status date location')
        .populate('student', 'name email')
        .sort({ createdAt: -1 });
    }

    return this.model
      .find({ student: userId })
      .populate('event', 'title status date location')
      .populate('brand', 'name email')
      .sort({ createdAt: -1 });
  }

  findByIdDetailed(id) {
    return this.model
      .findById(id)
      .populate('event', 'title createdBy status')
      .populate('brand', 'name email role')
      .populate('student', 'name email role');
  }
}

module.exports = new ApplicationRepository();
