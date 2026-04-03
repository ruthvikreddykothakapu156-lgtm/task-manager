import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/tasks', icon: 'check_circle', label: 'Tasks' },
  { to: '/habits', icon: 'repeat', label: 'Habits' },
  { to: '/projects', icon: 'folder_open', label: 'Projects' },
  { to: '/profile', icon: 'person', label: 'Profile' },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="flex flex-col h-screen w-64 py-8 px-4 bg-surface-container-low shadow-bloom shrink-0">
      <div className="mb-10 px-4">
        <h1 className="text-2xl font-black tracking-tighter text-primary">Ethereal</h1>
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-50">Command Center</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-primary font-bold bg-surface-container-highest'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-label text-xs tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-2 space-y-3">
        <button onClick={logout} className="w-full btn-ghost text-xs flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-base">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
