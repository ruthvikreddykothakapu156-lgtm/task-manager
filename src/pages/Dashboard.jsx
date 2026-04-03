import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { apiGetTasks, apiAddTask, apiToggleTask, apiGetHabits, apiGetProjects, calcStreak } from '../services/api';
import { useToast } from '../components/Toast';

function KpiCard({ label, value, suffix, icon, delay }) {
  return (
    <div className="glass-card rounded-xl p-6 shadow-bloom ghost-border flex flex-col justify-between h-40 hover:shadow-[0_0_60px_rgba(107,76,255,0.12)] transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex justify-between items-start">
        <span className="text-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{label}</span>
        <span className="material-symbols-outlined text-primary">{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-extrabold font-headline">{value}</span>
        {suffix && <span className="text-secondary text-xs font-bold font-label">{suffix}</span>}
      </div>
    </div>
  );
}

function DailyTaskItem({ task, onToggle }) {
  const priorityColors = {
    high: 'bg-error/10 text-error border-error/20',
    medium: 'bg-primary/10 text-primary border-primary/20',
    low: 'bg-secondary/10 text-secondary border-secondary/20',
  };
  const isCompleted = task.status === 'completed';

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low/40 hover:bg-surface-container-high transition-colors group animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onToggle(task._id)}
          className={`w-6 h-6 rounded flex items-center justify-center cursor-pointer transition-all duration-200 ${
            isCompleted
              ? 'bg-secondary scale-110'
              : 'bg-surface-container-highest ghost-border hover:border-secondary hover:scale-110'
          }`}
        >
          {isCompleted && (
            <span className="material-symbols-outlined text-on-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
          )}
        </button>
        <div>
          <p className={`font-bold text-sm ${isCompleted ? 'line-through opacity-50' : ''}`}>{task.name}</p>
          <p className="text-xs text-on-surface-variant font-label">{task.description || task.tags?.[0] || ''}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {task.dueDate && (
          <span className="text-[9px] font-bold font-label text-on-surface-variant px-2 py-1 rounded bg-surface-container-highest">
            {task.dueDate === new Date().toISOString().split('T')[0] ? 'Today' : task.dueDate}
          </span>
        )}
        <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-tighter border ${priorityColors[task.priority] || priorityColors.medium}`}>
          {isCompleted ? 'Done ✓' : task.priority}
        </span>
      </div>
    </div>
  );
}

function AddDailyTaskForm({ onAdd }) {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('medium');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), priority, dueDate: new Date().toISOString().split('T')[0], description: '', tags: ['Daily'] });
    setName('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-container-low/30 hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-all duration-200 ghost-border mt-4">
        <span className="material-symbols-outlined text-base">add</span>
        <span className="text-xs font-bold font-label">Add daily task</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2 items-center animate-fade-in">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="What needs to be done today?"
        autoFocus
        className="flex-1 bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm text-on-surface font-label focus:outline-none focus:border-primary transition-colors"
      />
      <select
        value={priority}
        onChange={e => setPriority(e.target.value)}
        className="bg-surface-container-lowest ghost-border rounded-xl px-3 py-3 text-xs text-on-surface font-label focus:outline-none"
      >
        <option value="high">High</option>
        <option value="medium">Med</option>
        <option value="low">Low</option>
      </select>
      <button type="submit" className="btn-primary text-xs px-4 py-3">Add</button>
      <button type="button" onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-error transition-colors">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </form>
  );
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [projects, setProjects] = useState([]);
  const { showToast } = useToast();

  const loadAll = async () => {
    try {
      const [t, h, p] = await Promise.all([apiGetTasks(), apiGetHabits(), apiGetProjects()]);
      setTasks(t);
      setHabits(h);
      setProjects(p);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadAll(); }, []);

  const today = new Date().toISOString().split('T')[0];

  const dailyTasks = tasks.filter(t =>
    t.dueDate === today || (t.dueDate && t.dueDate <= today && t.status === 'pending')
  );

  const completedToday = dailyTasks.filter(t => t.status === 'completed');
  const pendingToday = dailyTasks.filter(t => t.status === 'pending');
  const longestStreak = habits.reduce((max, h) => Math.max(max, calcStreak(h.checkIns)), 0);

  const progressPct = dailyTasks.length > 0 ? Math.round((completedToday.length / dailyTasks.length) * 100) : 0;

  const productivityScore = (() => {
    const taskScore = dailyTasks.length > 0 ? (completedToday.length / dailyTasks.length) * 40 : 20;
    const habitChecked = habits.filter(h => h.checkIns?.includes(today)).length;
    const habitScore = habits.length > 0 ? (habitChecked / habits.length) * 40 : 20;
    const avgProgress = projects.length > 0
      ? projects.reduce((sum, p) => { const done = p.tasks?.filter(t => t.done).length || 0; return sum + (p.tasks?.length ? done / p.tasks.length : 0); }, 0) / projects.length * 20
      : 10;
    return Math.round(taskScore + habitScore + avgProgress);
  })();

  const handleToggle = async (id) => {
    try {
      await apiToggleTask(id);
      await loadAll();
      const task = tasks.find(t => t._id === id);
      if (task?.status === 'pending') {
        showToast('Task completed! ✓', 'success');
      }
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleAddDaily = async (data) => {
    try {
      await apiAddTask(data);
      await loadAll();
      showToast('Daily task added', 'success');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const barHeights = [40, 65, 85, 55, 95, 30, 25];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-background">
      <Topbar title="The Command Deck" />
      <div className="p-8 max-w-[1600px] mx-auto w-full space-y-12">
        <section className="space-y-2 animate-fade-in">
          <h2 className="text-5xl font-extrabold tracking-tighter text-white font-headline">The Command Deck.</h2>
          <p className="text-on-surface-variant font-label text-sm tracking-wide">Good morning, Commander. Here is your situational briefing.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard label="Daily Tasks" value={dailyTasks.length} suffix={completedToday.length > 0 ? `${completedToday.length} done` : null} icon="assignment_turned_in" delay={0} />
          <KpiCard label="Active Habits" value={`${habits.filter(h => h.checkIns?.includes(today)).length}/${habits.length}`} icon="auto_awesome" delay={100} />
          <KpiCard label="Current Streak 🔥" value={longestStreak} suffix="Days" icon="local_fire_department" delay={200} />
          <KpiCard label="Productivity Score" value={productivityScore} suffix={productivityScore >= 80 ? 'A+' : productivityScore >= 60 ? 'B' : 'C'} icon="speed" delay={300} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="glass-card rounded-xl p-8 shadow-bloom ghost-border animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold font-headline">Daily Tasks</h3>
                <span className="text-xs font-bold font-label text-on-surface-variant">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant font-label mb-1">Mandatory tasks scheduled for today. Check them off as you go.</p>

              <div className="flex items-center gap-3 mb-6 mt-3">
                <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${progressPct}%`,
                      boxShadow: progressPct > 0 ? '0 0 12px rgba(78, 222, 163, 0.5)' : 'none'
                    }}
                  />
                </div>
                <span className="text-xs font-bold font-label text-secondary">{progressPct}%</span>
              </div>

              <div className="space-y-3">
                {pendingToday.length === 0 && completedToday.length === 0 && (
                  <p className="text-on-surface-variant text-sm font-label text-center py-4">No daily tasks yet. Add one below!</p>
                )}
                {pendingToday.map(task => (
                  <DailyTaskItem key={task._id} task={task} onToggle={handleToggle} />
                ))}
                {completedToday.length > 0 && pendingToday.length > 0 && (
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 h-px bg-outline-variant/20" />
                    <span className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">Completed</span>
                    <div className="flex-1 h-px bg-outline-variant/20" />
                  </div>
                )}
                {completedToday.map(task => (
                  <DailyTaskItem key={task._id} task={task} onToggle={handleToggle} />
                ))}
              </div>

              <AddDailyTaskForm onAdd={handleAddDaily} />
            </div>

            <div className="glass-card rounded-xl p-8 shadow-bloom ghost-border animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h3 className="text-xl font-bold font-headline mb-2">Productivity Trends</h3>
              <p className="text-xs text-on-surface-variant font-label mb-8">Weekly performance overview</p>
              <div className="h-52 flex items-end justify-between gap-4 px-2">
                {days.map((day, i) => (
                  <div key={day} className="w-full bg-surface-container-high rounded-t-lg relative group h-full">
                    <div className={`absolute bottom-0 w-full bg-primary/40 rounded-t-lg group-hover:bg-primary/60 transition-all duration-300`} style={{ height: `${barHeights[i]}%` }} />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-outline">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="glass-card rounded-xl p-8 shadow-bloom ghost-border animate-fade-in" style={{ animationDelay: '250ms' }}>
              <h3 className="text-xl font-bold font-headline mb-6">Habit Tracker</h3>
              <div className="space-y-6">
                {habits.length === 0 && <p className="text-on-surface-variant text-sm font-label">No habits tracked yet.</p>}
                {habits.slice(0, 3).map(habit => {
                  const streak = calcStreak(habit.checkIns);
                  const progress = habit.goal > 0 ? Math.round((habit.checkIns?.filter(d => { const dw = new Date(d); const now = new Date(); return dw >= new Date(now - 7 * 86400000); }).length / habit.goal) * 100) : 0;
                  return (
                    <div key={habit._id} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-bold font-label">{habit.name}</span>
                        <span className="text-[10px] text-secondary font-bold">{Math.min(progress, 100)}%</span>
                      </div>
                      <div className="h-[0.35rem] w-full bg-surface-variant rounded-full overflow-hidden">
                        <div className="h-full bg-secondary shadow-[0_0_8px_#4edea3] transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-on-surface-variant font-label">
                        <span>🔥 {streak} day streak</span>
                        <span>{habit.frequency}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card rounded-xl p-8 shadow-bloom ghost-border animate-fade-in" style={{ animationDelay: '350ms' }}>
              <h3 className="text-xl font-bold font-headline mb-6">Active Projects</h3>
              <div className="space-y-6">
                {projects.length === 0 && <p className="text-on-surface-variant text-sm font-label">No active projects yet.</p>}
                {projects.slice(0, 3).map(project => {
                  const totalTasks = project.tasks?.length || 0;
                  const doneTasks = project.tasks?.filter(t => t.done).length || 0;
                  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
                  return (
                    <div key={project._id} className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-bold">{project.name}</span>
                        <span className="text-xs font-bold font-label text-on-surface-variant">{pct}%</span>
                      </div>
                      <div className="h-[0.35rem] w-full bg-surface-variant rounded-full overflow-hidden">
                        <div className="h-full premium-gradient-bg transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
