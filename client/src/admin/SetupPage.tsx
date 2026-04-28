import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cog, AlertCircle } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface SetupResponse {
  token: string;
  admin: { id: number; email: string; name: string };
  error?: string;
}

export default function SetupPage() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const dark = theme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setServerError('All fields are required');
      return;
    }
    if (password.length < 6) {
      setServerError('Password must be at least 6 characters');
      return;
    }
    setServerError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json() as SetupResponse;
      if (!res.ok) throw new Error(data.error ?? 'Setup failed');
      // Log in using the credentials just created
      await login(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 ${
    dark
      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
  }`;
  const labelCls = `block text-xs font-semibold mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-600'}`;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${dark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className={`relative w-full max-w-md rounded-3xl border p-8 shadow-2xl ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-4 glow-orange">
            <Cog size={28} className="text-white" />
          </div>
          <h1 className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Create Admin Account</h1>
          <p className={`text-sm mt-1 text-center ${dark ? 'text-slate-500' : 'text-slate-500'}`}>
            Set up your admin account to manage the panel
          </p>
        </div>

        {serverError && (
          <div className="mb-5 flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-400 text-sm">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label className={labelCls}>Full Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your full name"
              className={inputCls}
              autoComplete="name"
            />
          </div>
          <div>
            <label className={labelCls}>Email Address <span className="text-red-400">*</span></label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your admin email"
              className={inputCls}
              autoComplete="email"
            />
          </div>
          <div>
            <label className={labelCls}>Password <span className="text-red-400">*</span></label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className={inputCls}
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 glow-orange text-sm mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Create Admin Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
