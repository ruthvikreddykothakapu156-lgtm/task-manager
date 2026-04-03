import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { apiGetTasks, apiAddTask, apiToggleTask, apiDeleteTask, apiUpdateTask } from '../services/api';
import { useToast } from '../components/Toast';

function TaskModal({ onClose, onSave, editTask }) {
  const [name, setName] = useState(editTask?.name || '');
  const [description, setDescription] = useState(editTask?.description || '');
  const [dueDate, setDueDate] = useState(editTask?.dueDate || new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState(editTask?.priority || 'medium');
  const [tags, setTags] = useState(editTask?.tags?.join(', ') || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, description, dueDate, priority, tags: tags.split(',').map(t => t.trim()).filter(Boolean) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="glass-card ghost-border shadow-bloom rounded-2xl p-8 w-full max-w-lg animate-scale-in" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold font-headline mb-6">{editTask ? 'Edit Task' : 'New Task'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label block mb-2">Task Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required
              className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm text-on-surface font-label focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label block mb-2">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2}
              className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm text-on-surface font-label focus:outline-none focus:border-primary transition-colors resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label block mb-2">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm text-on-surface font-label focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label block mb-2">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)}
                className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm text-on-surface font-label focus:outline-none focus:border-primary transition-colors">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label block mb-2">Tags (comma sep.)</label>
            <input value={tags} onChange={e => setTags(e.target.value)}
              className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm text-on-surface font-label focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary text-sm flex-1">{editTask ? 'Update' : 'Add Task'}</button>
            <button type="button" onClick={onClose} className="btn-ghost text-sm">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const { showToast } = useToast();

  const loadTasks = async () => {
    try {
      const data = await apiGetTasks();
      setTasks(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadTasks(); }, []);

  const handleAdd = async (data) => {
    try {
      await apiAddTask(data);
      await loadTasks();
      showToast('Task added successfully', 'success');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleEdit = async (data) => {
    try {
      await apiUpdateTask(editTask._id, data);
      await loadTasks();
      setEditTask(null);
      showToast('Task updated', 'info');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleToggle = async (id) => {
    try {
      await apiToggleTask(id);
      await loadTasks();
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteTask(id);
      await loadTasks();
      showToast('Task deleted', 'warning');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const filtered = tasks.filter(t => {
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    return true;
  });

  const priorityColors = {
    high: 'bg-error/10 text-error border-error/20',
    medium: 'bg-primary/10 text-primary border-primary/20',
    low: 'bg-secondary/10 text-secondary border-secondary/20',
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-background">
      <Topbar title="My Tasks" />
      <div className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tighter font-headline">My Tasks</h2>
            <p className="text-on-surface-variant text-sm font-label">{tasks.length} total · {tasks.filter(t => t.status === 'completed').length} completed</p>
          </div>
          <button onClick={() => { setEditTask(null); setShowModal(true); }} className="btn-primary text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">add</span> Add New Task
          </button>
        </div>

        <div className="flex gap-3 flex-wrap">
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
            className="bg-surface-container-lowest ghost-border rounded-xl px-4 py-2 text-xs text-on-surface font-label focus:outline-none">
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-surface-container-lowest ghost-border rounded-xl px-4 py-2 text-xs text-on-surface font-label focus:outline-none">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 && <p className="text-on-surface-variant text-sm font-label text-center py-10">No tasks found. Create your first task!</p>}
          {filtered.map((task, i) => (
            <div key={task._id} className="flex items-center justify-between p-5 rounded-xl glass-card ghost-border shadow-bloom hover:shadow-[0_0_60px_rgba(107,76,255,0.12)] transition-all duration-300 hover:-translate-y-0.5 group animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-center gap-4">
                <button onClick={() => handleToggle(task._id)}
                  className={`w-6 h-6 rounded flex items-center justify-center transition-all duration-200 ${task.status === 'completed' ? 'bg-secondary scale-110' : 'bg-surface-container-highest ghost-border hover:border-secondary hover:scale-110'}`}>
                  {task.status === 'completed' && <span className="material-symbols-outlined text-on-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>}
                </button>
                <div>
                  <p className={`font-bold text-sm ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>{task.name}</p>
                  <p className="text-xs text-on-surface-variant font-label mt-0.5">{task.description} {task.dueDate && `· Due ${task.dueDate}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-tighter border ${priorityColors[task.priority]}`}>{task.priority}</span>
                <button onClick={() => { setEditTask(task); setShowModal(true); }} className="material-symbols-outlined text-on-surface-variant text-lg opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary">edit</button>
                <button onClick={() => handleDelete(task._id)} className="material-symbols-outlined text-on-surface-variant text-lg opacity-0 group-hover:opacity-100 transition-opacity hover:text-error">delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && <TaskModal onClose={() => { setShowModal(false); setEditTask(null); }} onSave={editTask ? handleEdit : handleAdd} editTask={editTask} />}
    </div>
  );
}
