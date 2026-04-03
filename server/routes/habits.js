const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getHabits, createHabit, checkIn, deleteHabit } = require('../controllers/habitController');

router.get('/', auth, getHabits);
router.post('/', auth, createHabit);
router.put('/:id/checkin', auth, checkIn);
router.delete('/:id', auth, deleteHabit);

module.exports = router;
