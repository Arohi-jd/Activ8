const ApiError = require('../utils/ApiError');
const collegeRepository = require('../repositories/college.repository');
const userRepository = require('../repositories/user.repository');

class CollegeService {
  async createCollege(payload, user) {
    const { name, domain } = payload;

    if (!name || !domain) {
      throw new ApiError(400, 'Name and domain are required');
    }

    const existing = await collegeRepository.findByDomain(domain);
    if (existing) {
      throw new ApiError(409, 'College domain already exists');
    }

    const college = await collegeRepository.create({
      name,
      domain: domain.toLowerCase(),
      admin: user._id,
    });

    await userRepository.updateById(user._id, { college: college._id });

    return college;
  }

  async listColleges() {
    return collegeRepository.listAll();
  }

  async verifyCollege(collegeId) {
    const college = await collegeRepository.findById(collegeId);
    if (!college) {
      throw new ApiError(404, 'College not found');
    }

    const updatedCollege = await collegeRepository.updateById(collegeId, { verified: true });
    await userRepository.updateById(college.admin, { status: 'active', college: updatedCollege._id });

    return updatedCollege;
  }

  async getPendingStudents(adminUser) {
    if (!adminUser.college) {
      throw new ApiError(400, 'College admin is not assigned to any college');
    }

    return userRepository.findPendingStudentsByCollege(adminUser.college);
  }

  async approveStudent(adminUser, studentId) {
    if (!adminUser.college) {
      throw new ApiError(400, 'College admin is not assigned to any college');
    }

    const student = await userRepository.findById(studentId);
    if (!student || student.role !== 'student') {
      throw new ApiError(404, 'Student not found');
    }

    if (!student.college || String(student.college) !== String(adminUser.college)) {
      throw new ApiError(403, 'Student does not belong to your college');
    }

    if (student.status !== 'pending') {
      throw new ApiError(400, 'Student is already processed');
    }

    return userRepository.updateById(studentId, { status: 'active' });
  }
}

module.exports = new CollegeService();
