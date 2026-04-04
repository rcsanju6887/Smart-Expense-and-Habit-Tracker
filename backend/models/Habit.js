const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  study: { type: Number, required: true },
  sleep: { type: Number, required: true },
  exercise: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);