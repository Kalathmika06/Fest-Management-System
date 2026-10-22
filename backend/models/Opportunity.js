const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, default: 'General' },
    openings: { type: Number, default: 1 },
    icon: { type: String, default: '🎪' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Opportunity', opportunitySchema);
