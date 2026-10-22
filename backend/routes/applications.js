const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { auth, adminOnly } = require('../middleware/auth');

// POST apply to an opportunity (volunteer)
router.post('/', auth, async (req, res) => {
  try {
    const { opportunity } = req.body;
    const existing = await Application.findOne({ volunteer: req.user.id, opportunity });
    if (existing) return res.status(400).json({ message: 'Already applied to this opportunity' });

    const app = await Application.create({ volunteer: req.user.id, opportunity });
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET my applications (volunteer) - "My Applications" page
router.get('/mine', auth, async (req, res) => {
  const apps = await Application.find({ volunteer: req.user.id })
    .populate('opportunity')
    .sort({ appliedOn: -1 });
  res.json(apps);
});

// GET applications for a given volunteer (admin - volunteer detail page)
router.get('/volunteer/:volunteerId', auth, adminOnly, async (req, res) => {
  const apps = await Application.find({ volunteer: req.params.volunteerId }).populate('opportunity');
  res.json(apps);
});

// PUT update application status (admin) - Selected / Rejected / Under Review
router.put('/:id', auth, adminOnly, async (req, res) => {
  const app = await Application.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  ).populate('opportunity');
  res.json(app);
});

module.exports = router;
