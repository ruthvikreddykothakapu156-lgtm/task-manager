import { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import { apiGetHabits, apiAddHabit, apiCheckInHabit, apiDeleteHabit, calcStreak } from '../services/api';
import { useToast } from '../components/Toast';

function HabitModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [goal, setGoal] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, frequency, goal: Number(goal), startDate: new Date().toISOString().split('T')[0] });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="glass-card ghost-border shadow-bloom rounded-2xl p-8 w-full max-w-lg animate-scale-in" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold font-headline mb-6">New Habit</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label block mb-2">Habit Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Exercise, Read, Meditate"
              className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm text-on-surface font-label focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label block mb-2">Frequency</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value)}
                className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm text-on-surface font-label focus:outline-none">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label block mb-2">Goal (days/week)</label>
              <input type="number" min={1} max={7} value={goal} onChange={e => setGoal(e.target.value)}
                className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm text-on-surface font-label focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary text-sm flex-1">Add Habit</button>
            <button type="button" onClick={onClose} className="btn-ghost text-sm">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CalendarHeatmap({ checkIns }) {
  const today = new Date();
  const cells = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const checked = checkIns?.includes(dateStr);
    cells.push(
      <div key={dateStr} title={dateStr}
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold font-label transition-all duration-200 ${
          checked ? 'bg-secondary/80 text-on-secondary shadow-[0_0_8px_#4edea3]' : 'bg-surface-container-highest ghost-border text-on-surface-variant'
        }`}>
        {d.getDate()}
      </div>
    );
  }
  return <div className="flex gap-1.5">{cells}</div>;
}

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  const loadHabits = async () => {
    try {
      const data = await apiGetHabits();
      setHabits(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadHabits(); }, []);

  const handleAdd = async (data) => {
    try {
      await apiAddHabit(data);
      await loadHabits();
      showToast('Habit created!', 'success');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleCheckIn = async (id) => {
    try {
      await apiCheckInHabit(id);
      await loadHabits();
      showToast('Checked in! 🔥', 'success');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteHabit(id);
      await loadHabits();
      showToast('Habit removed', 'warning');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const totalCheckIns = habits.reduce((s, h) => s + (h.checkIns?.length || 0), 0);
  const longestStreak = habits.reduce((max, h) => Math.max(max, calcStreak(h.checkIns)), 0);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-background">
      <Topbar title="Habit Tracker" />
      <div className="p-8 max-w-[1600px] mx-auto w-full space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tighter font-headline">Habit Tracker</h2>
            <p className="text-on-surface-variant text-sm font-label">Build consistency, one day at a time.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">add</span> Add New Habit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-xl p-6 shadow-bloom ghost-border animate-fade-in">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label">Active Habits</span>
            <p className="text-3xl font-extrabold font-headline mt-2">{habits.length}</p>
          </div>
          <div className="glass-card rounded-xl p-6 shadow-bloom ghost-border animate-fade-in" style={{ animationDelay: '100ms' }}>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label">Longest Streak 🔥</span>
            <p className="text-3xl font-extrabold font-headline mt-2">{longestStreak} <span className="text-sm text-on-surface-variant font-label">days</span></p>
          </div>
          <div className="glass-card rounded-xl p-6 shadow-bloom ghost-border animate-fade-in" style={{ animationDelay: '200ms' }}>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label">Total Check-ins</span>
            <p className="text-3xl font-extrabold font-headline mt-2">{totalCheckIns}</p>
          </div>
        </div>

        <div className="space-y-4">
          {habits.length === 0 && <p className="text-on-surface-variant text-sm font-label text-center py-10">No habits yet. Start building yours!</p>}
          {habits.map((habit, i) => {
            const streak = calcStreak(habit.checkIns);
            const checkedToday = habit.checkIns?.includes(today);
            return (
              <div key={habit._id} className="glass-card ghost-border shadow-bloom rounded-xl p-6 hover:shadow-[0_0_60px_rgba(107,76,255,0.12)] transition-all duration-300 group animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-base font-headline">{habit.name}</h4>
                      <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold font-label px-2 py-0.5 rounded bg-surface-container-highest">{habit.frequency}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant font-label">Goal: {habit.goal} days/week · 🔥 {streak} day streak</p>
                  </div>
                  <CalendarHeatmap checkIns={habit.checkIns} />
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleCheckIn(habit._id)} disabled={checkedToday}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        checkedToday
                          ? 'bg-secondary text-on-secondary shadow-[0_0_20px_rgba(78,222,163,0.4)]'
                          : 'ghost-border bg-surface-container-highest hover:bg-secondary/20 hover:border-secondary hover:shadow-[0_0_20px_rgba(78,222,163,0.2)]'
                      }`}>
                      <span className="material-symbols-outlined" style={checkedToday ? { fontVariationSettings: "'FILL' 1" } : {}}>
                        {checkedToday ? 'check' : 'add'}
                      </span>
                    </button>
                    <button onClick={() => handleDelete(habit._id)} className="material-symbols-outlined text-on-surface-variant text-lg opacity-0 group-hover:opacity-100 transition-opacity hover:text-error">delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && <HabitModal onClose={() => setShowModal(false)} onSave={handleAdd} />}
    </div>
  );
}
