const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  token: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
