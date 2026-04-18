const ApiError = require('../utils/ApiError');
const applicationRepository = require('../repositories/application.repository');
const eventRepository = require('../repositories/event.repository');
const conversationRepository = require('../repositories/conversation.repository');
const userRepository = require('../repositories/user.repository');

class ApplicationService {
  async createApplication(payload, user) {
    const { eventId, brandId, message } = payload;

    if (!eventId) {
      throw new ApiError(400, 'eventId is required');
    }

    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }

    let brand;
    let student;
    let initiatedBy;

    if (user.role === 'brand') {
      brand = user._id;
      student = event.createdBy;
      initiatedBy = 'brand';
    } else if (user.role === 'student') {
      if (String(event.createdBy) !== String(user._id)) {
        throw new ApiError(403, 'You can only apply for your own event');
      }

      if (!brandId) {
        throw new ApiError(400, 'brandId is required for student initiated application');
      }

      const brandUser = await userRepository.findById(brandId);
      if (!brandUser || brandUser.role !== 'brand') {
        throw new ApiError(404, 'Brand not found');
      }

      brand = brandUser._id;
      student = user._id;
      initiatedBy = 'student';
    } else {
      throw new ApiError(403, 'Only student or brand can create application');
    }

    const existing = await applicationRepository.findExisting(event._id, brand, student);
    if (existing) {
      throw new ApiError(409, 'Application already exists');
    }

    return applicationRepository.create({
      event: event._id,
      brand,
      student,
      initiatedBy,
      message: message || '',
    });
  }

  async getMyApplications(user) {
    if (user.role !== 'student' && user.role !== 'brand') {
      throw new ApiError(403, 'Forbidden');
    }

    return applicationRepository.findMine(user._id, user.role);
  }

  async respondToApplication(applicationId, payload, user) {
    const { status } = payload;

    if (!['accepted', 'rejected'].includes(status)) {
      throw new ApiError(400, 'status must be accepted or rejected');
    }

    const application = await applicationRepository.findByIdDetailed(applicationId);
    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    if (application.status !== 'pending') {
      throw new ApiError(400, 'Application already resolved');
    }

    const brandId = String(application.brand._id || application.brand);
    const studentId = String(application.student._id || application.student);
    const userId = String(user._id);

    if (application.initiatedBy === 'brand' && userId !== studentId) {
      throw new ApiError(403, 'Only student can respond to this application');
    }

    if (application.initiatedBy === 'student' && userId !== brandId) {
      throw new ApiError(403, 'Only brand can respond to this application');
    }

    const updated = await applicationRepository.updateById(applicationId, { status });

    if (status === 'accepted') {
      const existingConversation = await conversationRepository.findByApplication(applicationId);
      if (!existingConversation) {
        await conversationRepository.create({ application: applicationId, status: 'open' });
      }
    }

    return updated;
  }
}

module.exports = new ApplicationService();
