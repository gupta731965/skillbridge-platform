const express = require('express');
const router = express.Router();
const mockDb = require('../services/mockDb');

// POST /api/users — create or find user
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email are required' });

    let user;
    if (process.env.USE_MOCK_DB === 'true') {
      user = await mockDb.findUserByEmail(email);
      if (!user) user = await mockDb.createUser({ name, email });
    } else {
      const User = require('../models/User');
      user = await User.findOne({ email });
      if (!user) user = await new User({ name, email }).save();
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/:id — get user with badges
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let userData;

    if (process.env.USE_MOCK_DB === 'true') {
      userData = await mockDb.getUserWithBadges(id);
    } else {
      const User = require('../models/User');
      userData = await User.findById(id).populate('badges');
    }

    if (!userData) return res.status(404).json({ error: 'User not found' });
    res.json(userData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
