const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'fest_volunteer_super_secret_key_change_me',
    { expiresIn: '7d' }
  );

// @route  POST /api/auth/register  (volunteer sign up)
router.post('/register', async (req, res) => {
  try {
    const { fullName, registerNo, department, email, password } = req.body;
    if (!fullName || !registerNo || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await User.findOne({ $or: [{ email }, { registerNo }] });
    if (existing) return res.status(400).json({ message: 'Account already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      registerNo,
      department,
      email,
      password: hashed,
      role: 'volunteer',
    });

    const token = signToken(user);
    res.status(201).json({
      token,
      user: { id: user._id, fullName: user.fullName, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  POST /api/auth/login  (volunteer login by email OR register number)
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({
      role: 'volunteer',
      $or: [{ email: identifier }, { registerNo: identifier }],
    });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        registerNo: user.registerNo,
        department: user.department,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route  POST /api/auth/admin-login
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ role: 'admin', email });
    if (!admin) return res.status(400).json({ message: 'Invalid admin credentials' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: 'Invalid admin credentials' });

    const token = signToken(admin);
    res.json({ token, user: { id: admin._id, fullName: admin.fullName, role: admin.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
