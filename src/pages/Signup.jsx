import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    setError('');
    try {
      await register(username, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="glass-card ghost-border shadow-bloom rounded-2xl p-10 w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-primary">Ethereal</h1>
          <p className="text-on-surface-variant text-xs font-label mt-1 uppercase tracking-widest">Create Account</p>
        </div>
        {error && <div className="mb-4 px-4 py-2 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-label">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label block mb-2">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
              className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm text-on-surface font-label focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label block mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm text-on-surface font-label focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label block mb-2">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm text-on-surface font-label focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold font-label block mb-2">Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
              className="w-full bg-surface-container-lowest ghost-border rounded-xl px-4 py-3 text-sm text-on-surface font-label focus:outline-none focus:border-primary transition-colors" />
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary text-sm">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-6 text-xs font-label text-on-surface-variant">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
