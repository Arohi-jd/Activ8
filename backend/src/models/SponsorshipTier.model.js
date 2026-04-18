const mongoose = require('mongoose');

const sponsorshipTierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    benefits: { type: String, required: true, trim: true },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SponsorshipTier', sponsorshipTierSchema);
