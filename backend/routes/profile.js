const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Update profile
router.put('/', auth, async (req, res) => {
  try {
    const { name, email, monthlyBudget } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, monthlyBudget },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;