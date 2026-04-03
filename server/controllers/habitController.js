const Habit = require('../models/Habit');

// GET /api/habits
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/habits
exports.createHabit = async (req, res) => {
  try {
    const { name, frequency, goal, startDate } = req.body;
    if (!name) return res.status(400).json({ message: 'Habit name is required' });

    const habit = await Habit.create({
      userId: req.userId,
      name,
      frequency: frequency || 'daily',
      goal: goal || 5,
      startDate: startDate || new Date().toISOString().split('T')[0],
    });
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/habits/:id/checkin
exports.checkIn = async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.userId });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const today = new Date().toISOString().split('T')[0];
    if (!habit.checkIns.includes(today)) {
      habit.checkIns.push(today);
      await habit.save();
    }
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/habits/:id
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });
    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
