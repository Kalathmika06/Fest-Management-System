const mongoose = require('mongoose');

const roleAllocationSchema = new mongoose.Schema(
  {
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    volunteerRole: { type: String, required: true }, // e.g. "Technical Role"
    teamArea: { type: String, required: true }, // e.g. "Web and app development"
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RoleAllocation', roleAllocationSchema);
