const express = require('express');
const router = express.Router();
const RoleAllocation = require('../models/RoleAllocation');
const User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

// GET all role allocations (admin)
router.get('/', auth, adminOnly, async (req, res) => {
  const items = await RoleAllocation.find().populate('volunteer', 'fullName registerNo');
  res.json(items);
});

// GET role allocation for logged-in volunteer - shown on volunteer Dashboard
router.get('/mine', auth, async (req, res) => {
  const items = await RoleAllocation.find({ volunteer: req.user.id });
  res.json(items);
});

// POST assign role (admin) - Role Allocation page "Assign Role" button
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { volunteer, volunteerRole, teamArea, startDate, endDate } = req.body;
    const item = await RoleAllocation.create({
      volunteer,
      volunteerRole,
      teamArea,
      startDate,
      endDate,
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
