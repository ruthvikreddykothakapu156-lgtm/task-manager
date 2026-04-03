const Project = require('../models/Project');

// GET /api/projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const { name, description, startDate, deadline } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name is required' });

    const project = await Project.create({
      userId: req.userId,
      name,
      description: description || '',
      startDate: startDate || new Date().toISOString().split('T')[0],
      deadline: deadline || '',
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/projects/:id
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.userId });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { name, description, deadline } = req.body;
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (deadline !== undefined) project.deadline = deadline;
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/projects/:id/tasks
exports.addSubTask = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.userId });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Sub-task name is required' });

    project.tasks.push({ name, done: false });
    updateProjectStatus(project);
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/projects/:id/tasks/:taskId/toggle
exports.toggleSubTask = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.userId });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const subTask = project.tasks.id(req.params.taskId);
    if (!subTask) return res.status(404).json({ message: 'Sub-task not found' });

    subTask.done = !subTask.done;
    updateProjectStatus(project);
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper: auto-compute project status from sub-tasks
function updateProjectStatus(project) {
  const total = project.tasks.length;
  const done = project.tasks.filter(t => t.done).length;
  if (total === 0) project.status = 'not-started';
  else if (done === total) project.status = 'done';
  else project.status = 'in-progress';
}
