const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    registerNo: { type: String, unique: true, sparse: true },
    department: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['volunteer', 'admin'], default: 'volunteer' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    hoursContributed: { type: Number, default: 0 },
    badgesEarned: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
