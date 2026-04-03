import { useAuth } from '../context/AuthContext';

export default function Topbar({ title }) {
  const { user } = useAuth();
  return (
    <header className="w-full h-20 sticky top-0 z-40 bg-transparent backdrop-blur-xl shrink-0">
      <div className="flex justify-between items-center w-full px-8 max-w-[1600px] mx-auto h-full">
        <div className="flex items-center gap-6 flex-1">
          <h2 className="text-xl font-bold font-headline">{title}</h2>
          <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-xl ghost-border w-full max-w-md">
            <span className="material-symbols-outlined text-outline">search</span>
            <input className="bg-transparent border-none focus:outline-none text-sm w-full text-on-surface ml-2 font-label" placeholder="Search..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="h-10 w-10 rounded-full overflow-hidden ghost-border bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
