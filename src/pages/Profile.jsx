import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-background">
      <Topbar title="Profile" />
      <div className="p-8 max-w-[800px] mx-auto w-full space-y-8">
        <div className="glass-card ghost-border shadow-bloom rounded-2xl p-10 animate-scale-in">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center text-3xl font-black text-on-primary-container">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-extrabold font-headline">{user?.username}</h2>
              <p className="text-sm text-on-surface-variant font-label">{user?.email}</p>
              <p className="text-xs text-on-surface-variant font-label mt-1">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-container-low/40">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label">Username</span>
              <p className="text-sm font-bold mt-1">{user?.username}</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low/40">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label">Email</span>
              <p className="text-sm font-bold mt-1">{user?.email}</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low/40">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label">Account Created</span>
              <p className="text-sm font-bold mt-1">{new Date(user?.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <button onClick={handleLogout} className="btn-danger text-sm w-full mt-8 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
