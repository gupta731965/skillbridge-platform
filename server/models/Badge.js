const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  assessmentId: { type: String, required: true },
  badgeHash: { type: String, required: true, unique: true, index: true },
  shortId: { type: String, required: true },
  track: { type: String, required: true },
  trackName: { type: String, required: true },
  overallScore: { type: Number, required: true },
  tier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], required: true },
  isPublic: { type: Boolean, default: true },
  issuedAt: { type: Date, default: Date.now },
});

badgeSchema.virtual('id').get(function () { return this._id.toHexString(); });
badgeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Badge', badgeSchema);
