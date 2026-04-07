const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Get the stored JWT token
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  return user?.token || '';
};

// Generic fetch wrapper with auth
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
};

// ---- Auth ----
export const apiLogin = async (email, password) => {
  const user = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
};

export const apiRegister = async (username, email, password) => {
  const user = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
};

export const apiLogout = () => {
  localStorage.removeItem('currentUser');
};

export const apiGetMe = () => {
  return JSON.parse(localStorage.getItem('currentUser') || 'null');
};

// ---- Tasks ----
export const apiGetTasks = () => apiFetch('/tasks');

export const apiAddTask = (task) => apiFetch('/tasks', {
  method: 'POST',
  body: JSON.stringify(task),
});

export const apiUpdateTask = (id, updates) => apiFetch(`/tasks/${id}`, {
  method: 'PUT',
  body: JSON.stringify(updates),
});

export const apiToggleTask = (id) => apiFetch(`/tasks/${id}/toggle`, {
  method: 'PUT',
});

export const apiDeleteTask = (id) => apiFetch(`/tasks/${id}`, {
  method: 'DELETE',
});

// ---- Habits ----
export const apiGetHabits = () => apiFetch('/habits');

export const apiAddHabit = (habit) => apiFetch('/habits', {
  method: 'POST',
  body: JSON.stringify(habit),
});

export const apiCheckInHabit = (id) => apiFetch(`/habits/${id}/checkin`, {
  method: 'PUT',
});

export const apiDeleteHabit = (id) => apiFetch(`/habits/${id}`, {
  method: 'DELETE',
});

// ---- Projects ----
export const apiGetProjects = () => apiFetch('/projects');

export const apiAddProject = (project) => apiFetch('/projects', {
  method: 'POST',
  body: JSON.stringify(project),
});

export const apiUpdateProject = (id, updates) => apiFetch(`/projects/${id}`, {
  method: 'PUT',
  body: JSON.stringify(updates),
});

export const apiAddSubTask = (projectId, name) => apiFetch(`/projects/${projectId}/tasks`, {
  method: 'POST',
  body: JSON.stringify({ name }),
});

export const apiToggleSubTask = (projectId, taskId) => apiFetch(`/projects/${projectId}/tasks/${taskId}/toggle`, {
  method: 'PUT',
});

export const apiDeleteProject = (id) => apiFetch(`/projects/${id}`, {
  method: 'DELETE',
});

// ---- Streak Calc (client-side) ----
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
