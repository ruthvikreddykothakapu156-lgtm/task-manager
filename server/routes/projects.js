const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProjects, createProject, updateProject, addSubTask, toggleSubTask, deleteProject } = require('../controllers/projectController');

router.get('/', auth, getProjects);
router.post('/', auth, createProject);
router.put('/:id', auth, updateProject);
router.post('/:id/tasks', auth, addSubTask);
router.put('/:id/tasks/:taskId/toggle', auth, toggleSubTask);
router.delete('/:id', auth, deleteProject);

module.exports = router;
