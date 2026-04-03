const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  dueDate:     { type: String, default: '' },   // YYYY-MM-DD
  priority:    { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status:      { type: String, enum: ['pending', 'completed'], default: 'pending' },
  tags:        [{ type: String }],
  completedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
