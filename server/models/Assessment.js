const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  track: { type: String, required: true },
  trackName: { type: String, required: true },
  submittedCode: { type: String, required: true },
  aiScores: {
    quality: { type: Number, min: 0, max: 100 },
    logic: { type: Number, min: 0, max: 100 },
    performance: { type: Number, min: 0, max: 100 },
    overall: { type: Number, min: 0, max: 100 },
  },
  aiLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'] },
  tier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'] },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  engine: { type: String, default: 'simulated' },
  submittedAt: { type: Date, default: Date.now },
});

assessmentSchema.virtual('id').get(function () { return this._id.toHexString(); });
assessmentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
