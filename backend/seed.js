// Run with: node seed.js
// Creates a default admin account and a few starter opportunities/announcements.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Opportunity = require('./models/Opportunity');
const Announcement = require('./models/Announcement');

async function seed() {
  await connectDB();

  // --- Default admin account ---
  const adminEmail = 'admin@tce.edu';
  const existingAdmin = await User.findOne({ email: adminEmail, role: 'admin' });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash('admin123', 10);
    await User.create({
      fullName: 'Admin',
      email: adminEmail,
      password: hashed,
      role: 'admin',
    });
    console.log('Default admin created -> email: admin@tce.edu | password: admin123');
  } else {
    console.log('Admin already exists, skipping.');
  }

  // --- Starter opportunities (matches the wireframe) ---
  const oppCount = await Opportunity.countDocuments();
  if (oppCount === 0) {
    await Opportunity.insertMany([
      { title: 'Event management Team', description: 'Manage events and coordination', category: 'Events', openings: 10, icon: '🎪' },
      { title: 'Technical Team', description: 'Handle technical events', category: 'Technical', openings: 8, icon: '🛠️' },
      { title: 'Hospitality Team', description: 'Guest management and assistance', category: 'Hospitality', openings: 13, icon: '🧑‍🤝‍🧑' },
      { title: 'Media & PR Team', description: 'Photography, social media management', category: 'Media', openings: 20, icon: '📷' },
    ]);
    console.log('Starter opportunities added.');
  }

  // --- Starter announcements (matches the wireframe) ---
  const annCount = await Announcement.countDocuments();
  if (annCount === 0) {
    await Announcement.insertMany([
      { title: 'Volunteers Meeting', message: 'All announcements meeting on 20.06.26 in seminar hall.' },
      { title: 'ID card collection', message: 'Collect your ID cards from admin block before July 25.' },
      { title: 'Stage Rehearsal', message: 'Stage rehearsal for all events teams on 10 July.' },
    ]);
    console.log('Starter announcements added.');
  }

  console.log('Seeding complete.');
  mongoose.connection.close();
}

seed();
