const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Application = require('../models/Application');
const RoleAllocation = require('../models/RoleAllocation');
const Opportunity = require('../models/Opportunity');
const Announcement = require('../models/Announcement');
const { auth, adminOnly } = require('../middleware/auth');

// GET all volunteers (admin) - "All Volunteers" table
router.get('/', auth, adminOnly, async (req, res) => {
  const volunteers = await User.find({ role: 'volunteer' }).select('-password');
  res.json(volunteers);
});

// GET single volunteer detail (admin) - Volunteer detail page
router.get('/:id', auth, adminOnly, async (req, res) => {
  const volunteer = await User.findById(req.params.id).select('-password');
  if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
  res.json(volunteer);
});

// GET logged-in volunteer's own profile - "My Profile"
router.get('/me/profile', auth, async (req, res) => {
  const me = await User.findById(req.user.id).select('-password');
  res.json(me);
});

// PUT edit own profile
router.put('/me/profile', auth, async (req, res) => {
  const { fullName, department, phone } = req.body;
  const me = await User.findByIdAndUpdate(
    req.user.id,
    { fullName, department, phone },
    { new: true }
  ).select('-password');
  res.json(me);
});

// GET admin dashboard stats - Admin "Dashboard" cards
router.get('/stats/admin', auth, adminOnly, async (req, res) => {
  const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
  const rolesAllocated = await RoleAllocation.countDocuments();
  const teams = await Opportunity.countDocuments();
  const announcements = await Announcement.countDocuments();
  res.json({ totalVolunteers, rolesAllocated, teams, announcements });
});

// GET volunteer dashboard stats - Volunteer "Dashboard" cards
router.get('/stats/mine', auth, async (req, res) => {
  const applicationsSubmitted = await Application.countDocuments({ volunteer: req.user.id });
  const rolesAllocated = await RoleAllocation.countDocuments({ volunteer: req.user.id });
  const me = await User.findById(req.user.id);
  res.json({
    applicationsSubmitted,
    rolesAllocated,
    hoursContributed: me.hoursContributed,
    badgesEarned: me.badgesEarned,
  });
});

module.exports = router;
