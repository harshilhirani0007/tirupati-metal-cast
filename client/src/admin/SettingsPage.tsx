import { useEffect, useState } from 'react';
import { Save, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Toast from './Toast';

interface FieldError {
  [key: string]: string;
}

export default function SettingsPage() {
  const { token } = useAuth();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<FieldError>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);

  const settingFields = [
    { key: 'company_name', label: 'Company Name', placeholder: 'Shree Tirupati Metal Cast' },
    { key: 'tagline', label: 'Tagline', placeholder: 'Precision metal castings for industry' },
    { key: 'phone', label: 'Phone Number', placeholder: '+91 98242 79626', type: 'text' },
    { key: 'email', label: 'Email Address', placeholder: 'company@example.com', type: 'email' },
    { key: 'website', label: 'Website URL', placeholder: 'https://example.com', type: 'url' },
    { key: 'address', label: 'Address', placeholder: 'City, State, Country' },
    { key: 'founded', label: 'Founded Year', placeholder: '1999', type: 'number' },
    { key: 'capacity', label: 'Monthly Capacity', placeholder: '500 MT', type: 'text' },
  ];

  useEffect(() => {
    fetch(`${API_BASE}/settings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setSettings);
  }, [token]);

  const validateField = (key: string, value: string): string => {
    if (!value.trim()) return '';

    switch (key) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';

      case 'website':
        if (!/^https?:\/\/.+\..+/.test(value)) {
          return 'Please enter a valid website URL (e.g., https://example.com)';
        }
        return '';

      case 'founded':
        if (!/^\d{4}$/.test(value)) {
          return 'Please enter a valid year (e.g., 1999)';
        }
        const year = parseInt(value);
        if (year < 1900 || year > new Date().getFullYear()) {
          return `Year must be between 1900 and ${new Date().getFullYear()}`;
        }
        return '';

      case 'capacity':
        if (!/^\d+(\.\d+)?\s*(MT|tonnes?)?$/i.test(value)) {
          return 'Please enter a valid capacity (e.g., 500 MT or 500)';
        }
        return '';

      default:
        return '';
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
    if (touched[key]) {
      const error = validateField(key, value);
      setErrors({ ...errors, [key]: error });
    }
  };

  const handleFieldBlur = (key: string) => {
    setTouched({ ...touched, [key]: true });
    const error = validateField(key, settings[key] || '');
    setErrors({ ...errors, [key]: error });
  };

  const saveSettings = async () => {
    const newErrors: FieldError = {};
    let hasError = false;

    settingFields.forEach(({ key }) => {
      const value = settings[key] || '';
      if (value.trim()) {
        const error = validateField(key, value);
        if (error) {
          newErrors[key] = error;
          hasError = true;
        }
      }
    });

    setErrors(newErrors);
    if (hasError) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setToast({ message: 'Settings saved successfully', type: 'success' });
        setTimeout(() => setSaved(false), 2500);
      } else {
        setToast({ message: 'Failed to save settings', type: 'error' });
      }
    } catch {
      setToast({ message: 'Error saving settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirm) { setToast({ message: 'Passwords do not match', type: 'error' }); return; }
    if (pwForm.newPassword.length < 6) { setToast({ message: 'Password must be at least 6 characters', type: 'error' }); return; }
    setPwSaving(true);
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
        setToast({ message: 'Password updated successfully', type: 'success' });
      } else {
        setToast({ message: data.error || 'Failed to update password', type: 'error' });
      }
    } catch {
      setToast({ message: 'Error updating password', type: 'error' });
    } finally {
      setPwSaving(false);
    }
  };

  const inputCls = `w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${dark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'}`;
  const labelCls = `block text-xs font-semibold mb-1 ${dark ? 'text-slate-400' : 'text-slate-600'}`;

  const sectionCls = `p-6 rounded-2xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Settings</h1>
        <p className={`text-sm mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>Manage company info and account</p>
      </div>

      {/* Company Settings */}
      <div className={sectionCls}>
        <h2 className={`font-bold mb-5 ${dark ? 'text-white' : 'text-slate-900'}`}>Company Information</h2>
        <div className="space-y-4">
          {settingFields.map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input
                type={type || 'text'}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all ${
                  touched[key] && errors[key]
                    ? dark
                      ? 'bg-red-950/20 border-red-500/60 text-white placeholder-slate-500 focus:ring-red-500/30 focus:border-red-500'
                      : 'bg-red-50 border-red-400 text-slate-900 placeholder-slate-400 focus:ring-red-500/20 focus:border-red-500'
                    : dark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-orange-500/30 focus:border-orange-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-orange-500/30 focus:border-orange-500'
                }`}
                placeholder={placeholder}
                value={settings[key] || ''}
                onChange={e => handleFieldChange(key, e.target.value)}
                onBlur={() => handleFieldBlur(key)}
              />
              {touched[key] && errors[key] && (
                <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
                  <AlertCircle size={12} className="shrink-0" />
                  {errors[key]}
                </p>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors glow-orange"
        >
          {saved ? (
            <><CheckCircle2 size={15} /> Saved!</>
          ) : saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <><Save size={15} /> Save Settings</>
          )}
        </button>
      </div>

      {/* Change Password */}
      <div className={sectionCls}>
        <div className="flex items-center gap-3 mb-5">
          <KeyRound size={18} className="text-orange-500" />
          <h2 className={`font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Change Password</h2>
        </div>
        <div className="space-y-4">
          <div><label className={labelCls}>Current Password</label><input type="password" className={inputCls} value={pwForm.currentPassword} onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })} /></div>
          <div><label className={labelCls}>New Password</label><input type="password" className={inputCls} value={pwForm.newPassword} onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} /></div>
          <div><label className={labelCls}>Confirm New Password</label><input type="password" className={inputCls} value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} /></div>
        </div>
        <button
          onClick={changePassword}
          disabled={pwSaving}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors"
        >
          {pwSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Updating...
            </>
          ) : (
            <><Save size={15} /> Update Password</>
          )}
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
