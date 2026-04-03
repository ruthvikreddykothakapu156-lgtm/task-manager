const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  done: { type: Boolean, default: false },
});

const projectSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  startDate:   { type: String, default: '' },
  deadline:    { type: String, default: '' },
  status:      { type: String, enum: ['not-started', 'in-progress', 'done'], default: 'not-started' },
  tasks:       [subTaskSchema],
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
