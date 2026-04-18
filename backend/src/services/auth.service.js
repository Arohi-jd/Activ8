const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const userRepository = require('../repositories/user.repository');
const collegeRepository = require('../repositories/college.repository');

class AuthService {
  async register(payload) {
    const { name, email, password, role, collegeDomain, collegeName } = payload;

    if (!name || !email || !password || !role) {
      throw new ApiError(400, 'Name, email, password and role are required');
    }

    const existing = await userRepository.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new ApiError(409, 'Email already registered');
    }

    let status = 'pending';
    let collegeId = null;

    if (role === 'student') {
      if (!collegeDomain) {
        throw new ApiError(400, 'collegeDomain is required for student');
      }

      const college = await collegeRepository.findOne({ domain: collegeDomain.toLowerCase(), verified: true });
      if (!college) {
        throw new ApiError(400, 'College domain not found or not verified');
      }

      collegeId = college._id;
      status = 'pending';
    } else if (role === 'brand') {
      status = 'active';
    } else if (role === 'college_admin') {
      if (!collegeName || !collegeDomain) {
        throw new ApiError(400, 'collegeName and collegeDomain are required for college_admin');
      }

      const existingCollege = await collegeRepository.findOne({ domain: collegeDomain.toLowerCase() });
      if (existingCollege) {
        throw new ApiError(409, 'College domain already exists');
      }

      status = 'pending';
    } else if (role === 'platform_admin') {
      status = 'active';
    } else {
      throw new ApiError(400, 'Invalid role');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      status,
      college: collegeId,
    });

    if (role === 'college_admin') {
      const college = await collegeRepository.create({
        name: collegeName,
        domain: collegeDomain.toLowerCase(),
        admin: user._id,
      });

      await userRepository.updateById(user._id, { college: college._id });
      collegeId = college._id;
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      college: collegeId || user.college,
    };
  }

  async login(payload, res) {
    const { email, password } = payload;
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    if (user.status !== 'active') {
      throw new ApiError(403, 'Account not active');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      college: user.college,
      token,
    };
  }

  async logout(res) {
    const isProduction = process.env.NODE_ENV === 'production';

    res.clearCookie('token', {
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
    });

    return { loggedOut: true };
  }

  async me(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  async getBrands(user) {
    if (user.role !== 'student') {
      throw new ApiError(403, 'Only students can view brands');
    }

    return userRepository.findActiveBrands();
  }
}

module.exports = new AuthService();
