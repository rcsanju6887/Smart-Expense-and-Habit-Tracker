const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Habit = require('../models/Habit');

// Get all habits
router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({ date: -1 });
    res.json(habits);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Add habit
router.post('/', auth, async (req, res) => {
  try {
    const { date, study, sleep, exercise } = req.body;
    const exists = await Habit.findOne({ user: req.user.id, date });
    if (exists) return res.status(400).json({ message: 'Habit already logged for this date' });
    const habit = await Habit.create({ user: req.user.id, date, study, sleep, exercise });
    res.status(201).json(habit);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Update habit
router.put('/:id', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body, { new: true }
    );
    if (!habit) return res.status(404).json({ message: 'Not found' });
    res.json(habit);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Delete habit
router.delete('/:id', auth, async (req, res) => {
  try {
    await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;