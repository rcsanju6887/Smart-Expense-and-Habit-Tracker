const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);