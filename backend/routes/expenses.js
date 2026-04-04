const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');

// Get all expenses
router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Add expense
router.post('/', auth, async (req, res) => {
  try {
    const { date, amount, category, description } = req.body;
    const expense = await Expense.create({ user: req.user.id, date, amount, category, description });
    res.status(201).json(expense);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body, { new: true }
    );
    if (!expense) return res.status(404).json({ message: 'Not found' });
    res.json(expense);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted' });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;