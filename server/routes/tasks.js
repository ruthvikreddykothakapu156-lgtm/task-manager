const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTasks, createTask, updateTask, toggleTask, deleteTask } = require('../controllers/taskController');

router.get('/', auth, getTasks);
router.post('/', auth, createTask);
router.put('/:id', auth, updateTask);
router.put('/:id/toggle', auth, toggleTask);
router.delete('/:id', auth, deleteTask);

module.exports = router;
