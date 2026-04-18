const BaseRepository = require('./base.repository');
const User = require('../models/User.model');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  findByEmail(email) {
    return this.model.findOne({ email: email.toLowerCase() }).select('+password');
  }

  findPendingStudentsByCollege(collegeId) {
    return this.model
      .find({ role: 'student', status: 'pending', college: collegeId })
      .select('-password');
  }

  findByIdWithPassword(id) {
    return this.model.findById(id).select('+password');
  }

  findActiveBrands() {
    return this.model
      .find({ role: 'brand', status: 'active' })
      .select('name email role status')
      .sort({ createdAt: -1 });
  }
}

module.exports = new UserRepository();
