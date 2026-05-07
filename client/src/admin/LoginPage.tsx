import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cog, Eye, EyeOff, LogIn, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface FormErrors {
  email?: string;
  password?: string;
}

function validateEmail(value: string): string {
  if (!value.trim()) return 'Email address is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return 'Please enter a valid email address';
  return '';
}

function validatePassword(value: string): string {
  if (!value) return 'Password is required';
  if (value.length < 6) return 'Password must be at least 6 characters';
  return '';
}

export default function LoginPage() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dark = theme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;

    const ping = () => {
      fetch(`${API_BASE}/auth/setup-status`)
        .then(r => r.json() as Promise<{ needsSetup: boolean }>)
        .then(data => {
          if (data.needsSetup) navigate('/admin/setup', { replace: true });
        })
        .catch(() => {
          attempts++;
          if (attempts < maxAttempts) setTimeout(ping, 3000);
        });
    };

    ping();
  }, [navigate]);

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'email') setErrors(prev => ({ ...prev, email: validateEmail(email) }));
    if (field === 'password') setErrors(prev => ({ ...prev, password: validatePassword(password) }));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) setErrors(prev => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) setErrors(prev => ({ ...prev, password: validatePassword(value) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    setErrors({ email: emailErr, password: passwordErr });
    if (emailErr || passwordErr) return;

    setServerError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = 'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200';
  const inputNormal = dark
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500'
    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500';
  const inputError = dark
    ? 'bg-red-950/20 border-red-500/60 text-white placeholder-slate-500 focus:ring-2 focus:ring-red-500/30 focus:border-red-500'
    : 'bg-red-50 border-red-400 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-red-500/20 focus:border-red-500';

  const getInputClass = (field: string) =>
    `${inputBase} ${touched[field] && errors[field as keyof FormErrors] ? inputError : inputNormal}`;

  return (
    <div className={`relative flex flex-col min-h-screen px-4 py-6 overflow-x-hidden ${dark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className={`self-start p-2 rounded-lg transition-colors mb-4 ${dark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'}`}
        aria-label="Go back to home"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Centered form container */}
      <div className="flex items-center justify-center flex-1">
        <div className={`relative w-full max-w-md rounded-3xl border p-8 shadow-2xl ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-4 glow-orange">
            <Cog size={28} className="text-white" />
          </div>
          <h1 className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Admin Panel</h1>
          <p className={`text-sm mt-1 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>Shri Tirupati Metal Cast</p>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="mb-5 flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
            <p className="text-red-400 text-sm">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Email */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => handleEmailChange(e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="Enter your admin email"
              className={getInputClass('email')}
              autoComplete="email"
            />
            {touched.email && errors.email && (
              <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
                <AlertCircle size={12} className="shrink-0" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => handlePasswordChange(e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Enter your password"
                className={`${getInputClass('password')} pr-11`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
                <AlertCircle size={12} className="shrink-0" />
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 glow-orange text-sm mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><LogIn size={16} /> Sign In</>
            )}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}
