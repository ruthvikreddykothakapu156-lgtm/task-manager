// localStorage helpers — all data is scoped per user

const getUser = () => {
  const raw = sessionStorage.getItem('currentUser');
  return raw ? JSON.parse(raw) : null;
};

const getData = (key) => {
  const user = getUser();
  if (!user) return [];
  const raw = localStorage.getItem(`${user.id}_${key}`);
  return raw ? JSON.parse(raw) : [];
};

const setData = (key, value) => {
  const user = getUser();
  if (!user) return;
  localStorage.setItem(`${user.id}_${key}`, JSON.stringify(value));
};

// --- Users ---
export const getUsers = () => {
  const raw = localStorage.getItem('users');
  return raw ? JSON.parse(raw) : [];
};

export const registerUser = (username, email, password) => {
  const users = getUsers();
  if (users.find(u => u.email === email)) throw new Error('Email already registered');
  const user = { id: crypto.randomUUID(), username, email, password, darkMode: true, createdAt: new Date().toISOString() };
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  sessionStorage.setItem('currentUser', JSON.stringify(user));
  return user;
};

export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid email or password');
  sessionStorage.setItem('currentUser', JSON.stringify(user));
  return user;
};

export const logoutUser = () => { sessionStorage.removeItem('currentUser'); };
export const getCurrentUser = getUser;

// --- Tasks ---
export const getTasks = () => getData('tasks');
export const addTask = (task) => {
  const tasks = getData('tasks');
  tasks.push({ id: crypto.randomUUID(), ...task, status: 'pending', createdAt: new Date().toISOString(), completedAt: null });
  setData('tasks', tasks);
  return tasks;
};
export const updateTask = (id, updates) => {
  let tasks = getData('tasks');
  tasks = tasks.map(t => t.id === id ? { ...t, ...updates } : t);
  setData('tasks', tasks);
  return tasks;
};
export const deleteTask = (id) => {
  let tasks = getData('tasks').filter(t => t.id !== id);
  setData('tasks', tasks);
  return tasks;
};
export const toggleTask = (id) => {
  let tasks = getData('tasks');
  tasks = tasks.map(t => {
    if (t.id === id) {
      const newStatus = t.status === 'completed' ? 'pending' : 'completed';
      return { ...t, status: newStatus, completedAt: newStatus === 'completed' ? new Date().toISOString() : null };
    }
    return t;
  });
  setData('tasks', tasks);
  return tasks;
};

// --- Habits ---
export const getHabits = () => getData('habits');
export const addHabit = (habit) => {
  const habits = getData('habits');
  habits.push({ id: crypto.randomUUID(), ...habit, checkIns: [], createdAt: new Date().toISOString() });
  setData('habits', habits);
  return habits;
};
export const updateHabit = (id, updates) => {
  let habits = getData('habits');
  habits = habits.map(h => h.id === id ? { ...h, ...updates } : h);
  setData('habits', habits);
  return habits;
};
export const deleteHabit = (id) => {
  let habits = getData('habits').filter(h => h.id !== id);
  setData('habits', habits);
  return habits;
};
export const checkInHabit = (id) => {
  const today = new Date().toISOString().split('T')[0];
  let habits = getData('habits');
  habits = habits.map(h => {
    if (h.id === id && !h.checkIns.includes(today)) {
      return { ...h, checkIns: [...h.checkIns, today] };
    }
    return h;
  });
  setData('habits', habits);
  return habits;
};
export const calcStreak = (checkIns) => {
  if (!checkIns || checkIns.length === 0) return 0;
  const sorted = [...checkIns].sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const dateStr of sorted) {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    const diffDays = Math.round((today - d) / 86400000);
    if (diffDays === streak) streak++;
    else break;
  }
  return streak;
};

// --- Projects ---
export const getProjects = () => getData('projects');
export const addProject = (project) => {
  const projects = getData('projects');
  projects.push({ id: crypto.randomUUID(), ...project, tasks: [], status: 'not-started', createdAt: new Date().toISOString() });
  setData('projects', projects);
  return projects;
};
export const updateProject = (id, updates) => {
  let projects = getData('projects');
  projects = projects.map(p => p.id === id ? { ...p, ...updates } : p);
  setData('projects', projects);
  return projects;
};
export const deleteProject = (id) => {
  let projects = getData('projects').filter(p => p.id !== id);
  setData('projects', projects);
  return projects;
};
export const addSubTask = (projectId, taskName) => {
  let projects = getData('projects');
  projects = projects.map(p => {
    if (p.id === projectId) {
      const tasks = [...p.tasks, { id: crypto.randomUUID(), name: taskName, done: false }];
      const done = tasks.filter(t => t.done).length;
      const status = done === 0 ? 'not-started' : done === tasks.length ? 'done' : 'in-progress';
      return { ...p, tasks, status };
    }
    return p;
  });
  setData('projects', projects);
  return projects;
};
export const toggleSubTask = (projectId, taskId) => {
  let projects = getData('projects');
  projects = projects.map(p => {
    if (p.id === projectId) {
      const tasks = p.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t);
      const done = tasks.filter(t => t.done).length;
      const status = done === 0 ? 'not-started' : done === tasks.length ? 'done' : 'in-progress';
      return { ...p, tasks, status };
    }
    return p;
  });
  setData('projects', projects);
  return projects;
};
