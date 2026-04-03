import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { apiGetProjects, apiAddProject, apiDeleteProject, apiAddSubTask, apiToggleSubTask } from '../services/api';
import { useToast } from '../components/Toast';

function ProjectModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, description, startDate: new Date().toISOString().split('T')[0], deadline });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="glass-card ghost-border shadow-bloom rounded-2xl p-8 w-full max-w-lg animate-scale-in" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold font-headline mb-6">New Project</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label block mb-2">Project Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required
              className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm text-on-surface font-label focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label block mb-2">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
              className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm text-on-surface font-label focus:outline-none focus:border-primary transition-colors resize-none" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label block mb-2">Deadline</label>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
              className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm text-on-surface font-label focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary text-sm flex-1">Create Project</button>
            <button type="button" onClick={onClose} className="btn-ghost text-sm">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const statusColors = {
  'not-started': 'bg-outline/10 text-outline border-outline/20',
  'in-progress': 'bg-primary/10 text-primary border-primary/20',
  'done': 'bg-secondary/10 text-secondary border-secondary/20',
};
const statusLabels = { 'not-started': 'Not Started', 'in-progress': 'In Progress', 'done': 'Completed' };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [newSubTask, setNewSubTask] = useState('');
  const { showToast } = useToast();

  const loadProjects = async () => {
    try {
      const data = await apiGetProjects();
      setProjects(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadProjects(); }, []);

  const handleAdd = async (data) => {
    try {
      await apiAddProject(data);
      await loadProjects();
      showToast('Project created!', 'success');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteProject(id);
      await loadProjects();
      showToast('Project deleted', 'warning');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleAddSubTask = async (projectId) => {
    if (!newSubTask.trim()) return;
    try {
      await apiAddSubTask(projectId, newSubTask.trim());
      await loadProjects();
      setNewSubTask('');
      showToast('Sub-task added', 'info');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleToggleSubTask = async (projectId, taskId) => {
    try {
      await apiToggleSubTask(projectId, taskId);
      await loadProjects();
    } catch (err) { showToast(err.message, 'error'); }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-background">
      <Topbar title="My Projects" />
      <div className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tighter font-headline">My Projects</h2>
            <p className="text-on-surface-variant text-sm font-label">{projects.length} projects · {projects.filter(p => p.status === 'done').length} completed</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">add</span> New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 && <p className="text-on-surface-variant text-sm font-label col-span-full text-center py-10">No projects yet. Create your first one!</p>}
          {projects.map((project, i) => {
            const totalTasks = project.tasks?.length || 0;
            const doneTasks = project.tasks?.filter(t => t.done).length || 0;
            const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
            const expanded = expandedId === project._id;

            return (
              <div key={project._id} className="glass-card ghost-border shadow-bloom rounded-xl p-6 flex flex-col hover:shadow-[0_0_60px_rgba(107,76,255,0.12)] transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-base font-headline">{project.name}</h4>
                  <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-tighter border ${statusColors[project.status]}`}>{statusLabels[project.status]}</span>
                </div>
                <p className="text-xs text-on-surface-variant font-label mb-4 line-clamp-2">{project.description}</p>
                {project.deadline && <p className="text-[10px] text-on-surface-variant font-label mb-3">Deadline: {project.deadline}</p>}
                <div className="flex justify-between text-xs font-bold font-label mb-2">
                  <span>{doneTasks}/{totalTasks} tasks</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-[0.35rem] w-full bg-surface-variant rounded-full overflow-hidden mb-4">
                  <div className="h-full premium-gradient-bg transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>

                <button onClick={() => setExpandedId(expanded ? null : project._id)} className="btn-ghost text-xs mb-3 w-full flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">{expanded ? 'expand_less' : 'expand_more'}</span>
                  {expanded ? 'Collapse' : 'View Sub-tasks'}
                </button>

                {expanded && (
                  <div className="space-y-2 animate-fade-in">
                    {project.tasks?.map(task => (
                      <div key={task._id} className="flex items-center gap-3 p-2 rounded-lg bg-surface-container-low/40">
                        <button onClick={() => handleToggleSubTask(project._id, task._id)}
                          className={`w-5 h-5 rounded flex items-center justify-center transition-all ${task.done ? 'bg-secondary' : 'bg-surface-container-highest ghost-border hover:border-secondary'}`}>
                          {task.done && <span className="material-symbols-outlined text-on-secondary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>}
                        </button>
                        <span className={`text-xs font-label ${task.done ? 'line-through opacity-50' : ''}`}>{task.name}</span>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <input value={newSubTask} onChange={e => setNewSubTask(e.target.value)} placeholder="Add sub-task..."
                        onKeyDown={e => e.key === 'Enter' && handleAddSubTask(project._id)}
                        className="flex-1 bg-surface-container-lowest ghost-border rounded-xl px-3 py-2 text-xs text-on-surface font-label focus:outline-none" />
                      <button onClick={() => handleAddSubTask(project._id)} className="btn-primary text-xs px-3">Add</button>
                    </div>
                    <button onClick={() => handleDelete(project._id)} className="btn-danger text-xs w-full mt-2">Delete Project</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showModal && <ProjectModal onClose={() => setShowModal(false)} onSave={handleAdd} />}
    </div>
  );
}
