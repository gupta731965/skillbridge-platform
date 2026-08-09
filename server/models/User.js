const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  avatarUrl: { type: String, default: '' },
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  createdAt: { type: Date, default: Date.now },
});

userSchema.virtual('id').get(function () { return this._id.toHexString(); });
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
