const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    initiatedBy: {
      type: String,
      enum: ['brand', 'student'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    message: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ event: 1, brand: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
