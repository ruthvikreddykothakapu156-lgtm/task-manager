const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:      { type: String, required: true, trim: true },
  frequency: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
  goal:      { type: Number, default: 5 },   // days per week
  startDate: { type: String, default: '' },  // YYYY-MM-DD
  checkIns:  [{ type: String }],             // array of YYYY-MM-DD strings
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);
