const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    status: {
      type: String,
      enum: ['Under Review', 'Selected', 'Rejected'],
      default: 'Under Review',
    },
    appliedOn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
