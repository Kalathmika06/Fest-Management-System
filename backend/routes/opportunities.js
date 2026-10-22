const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');
const { auth, adminOnly } = require('../middleware/auth');

// GET all opportunities (both volunteer + admin use this)
router.get('/', auth, async (req, res) => {
  const opps = await Opportunity.find().sort({ createdAt: -1 });
  res.json(opps);
});

// POST create opportunity (admin only) - "Add opportunity" quick action
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const opp = await Opportunity.create(req.body);
    res.status(201).json(opp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update opportunity (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  const opp = await Opportunity.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(opp);
});

// DELETE opportunity (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  await Opportunity.findByIdAndDelete(req.params.id);
  res.json({ message: 'Opportunity removed' });
});

module.exports = router;
