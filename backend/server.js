require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/opportunities', require('./routes/opportunities'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/role-allocation', require('./routes/roleAllocation'));
app.use('/api/volunteers', require('./routes/volunteers'));

// Serve the frontend (static HTML/CSS/JS/AngularJS files)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
  res.redirect('/volunteer/login.html');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
