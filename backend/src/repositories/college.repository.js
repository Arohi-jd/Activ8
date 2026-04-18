const BaseRepository = require('./base.repository');
const College = require('../models/College.model');

class CollegeRepository extends BaseRepository {
  constructor() {
    super(College);
  }

  findByDomain(domain) {
    return this.model.findOne({ domain: domain.toLowerCase() });
  }

  listAll() {
    return this.model.find().populate('admin', 'name email status');
  }

  findByAdmin(adminId) {
    return this.model.findOne({ admin: adminId });
  }
}

module.exports = new CollegeRepository();
