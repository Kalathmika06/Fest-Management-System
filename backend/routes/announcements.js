const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { auth, adminOnly } = require('../middleware/auth');

// GET all announcements (volunteer + admin)
router.get('/', auth, async (req, res) => {
  const items = await Announcement.find().sort({ createdAt: -1 });
  res.json(items);
});

// POST new announcement (admin) - "+ New Announcements"
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, message } = req.body;
    const item = await Announcement.create({ title, message });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE announcement (admin)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: 'Announcement removed' });
});

module.exports = router;
