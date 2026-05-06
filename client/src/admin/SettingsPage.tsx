import { useEffect, useState } from 'react';
import { Save, KeyRound, CheckCircle2, AlertCircle, Eye, EyeOff, Building2, Globe, Phone, Mail, MapPin, Calendar, Gauge } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Toast from './Toast';

interface FieldError { [key: string]: string; }

const settingFields = [
  { key: 'company_name', label: 'Company Name',    placeholder: 'Shri Tirupati Metal Cast',        icon: Building2 },
  { key: 'tagline',      label: 'Tagline',          placeholder: 'Precision metal castings...',      icon: Globe     },
  { key: 'phone',        label: 'Phone Number',     placeholder: '+91 98242 79626', type: 'text',   icon: Phone     },
  { key: 'email',        label: 'Email Address',    placeholder: 'company@example.com', type: 'email', icon: Mail  },
  { key: 'website',      label: 'Website URL',      placeholder: 'https://example.com', type: 'url', icon: Globe    },
  { key: 'address',      label: 'Address',          placeholder: 'City, State, Country',             icon: MapPin   },
  { key: 'founded',      label: 'Founded Year',     placeholder: '1999', type: 'number',             icon: Calendar  },
  { key: 'capacity',     label: 'Monthly Capacity', placeholder: '500 MT',                           icon: Gauge    },
];

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
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  useEffect(() => {
    fetch(`${API_BASE}/settings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setSettings);
  }, [token]);

  const validateField = (key: string, value: string): string => {
    if (!value.trim()) return '';
    switch (key) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address';
      case 'website':
        return /^https?:\/\/.+\..+/.test(value) ? '' : 'Enter a valid URL (e.g., https://example.com)';
      case 'founded': {
        if (!/^\d{4}$/.test(value)) return 'Enter a valid year (e.g., 1999)';
        const y = parseInt(value);
        return y >= 1900 && y <= new Date().getFullYear() ? '' : `Year must be 1900–${new Date().getFullYear()}`;
      }
      case 'capacity':
        return /^\d+(\.\d+)?\s*(MT|tonnes?)?$/i.test(value) ? '' : 'Enter a valid capacity (e.g., 500 MT)';
      default:
        return '';
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    setSettings({ ...settings, [key]: value });
    if (touched[key]) setErrors({ ...errors, [key]: validateField(key, value) });
  };

  const handleFieldBlur = (key: string) => {
    setTouched({ ...touched, [key]: true });
    setErrors({ ...errors, [key]: validateField(key, settings[key] || '') });
  };

  const saveSettings = async () => {
    const newErrors: FieldError = {};
    let hasError = false;
    settingFields.forEach(({ key }) => {
      const val = settings[key] || '';
      if (val.trim()) {
        const err = validateField(key, val);
        if (err) { newErrors[key] = err; hasError = true; }
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

  const inputBase = `w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all`;
  const inputNormal = `${inputBase} ${dark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`;
  const inputError = `${inputBase} ${dark ? 'bg-red-950/20 border-red-500/60 text-white placeholder-slate-500 focus:ring-red-500/30 focus:border-red-500' : 'bg-red-50 border-red-300 text-slate-900 focus:ring-red-500/20 focus:border-red-500'}`;
  const pwInput = `w-full pl-3 pr-10 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${dark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`;
  const labelCls = `block text-xs font-bold mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-600'}`;
  const card = `p-6 rounded-2xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`;

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Settings</h1>
        <p className={`text-sm mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>Manage company information and account security</p>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        {/* Company Settings — 2 cols */}
        <div className={`xl:col-span-2 ${card}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Building2 size={16} className="text-orange-500" />
            </div>
            <div>
              <h2 className={`font-bold text-sm ${dark ? 'text-white' : 'text-slate-900'}`}>Company Information</h2>
              <p className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Displayed on your public website</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {settingFields.map(({ key, label, placeholder, type, icon: Icon }) => {
              const hasErr = !!(touched[key] && errors[key]);
              return (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  <div className="relative">
                    <Icon size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${hasErr ? 'text-red-400' : 'text-slate-400'}`} />
                    <input
                      type={type || 'text'}
                      className={hasErr ? inputError : inputNormal}
                      placeholder={placeholder}
                      value={settings[key] || ''}
                      onChange={e => handleFieldChange(key, e.target.value)}
                      onBlur={() => handleFieldBlur(key)}
                    />
                  </div>
                  {hasErr && (
                    <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-400">
                      <AlertCircle size={11} className="shrink-0" />
                      {errors[key]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className={`mt-6 pt-5 border-t flex items-center justify-between ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
            <p className={`text-xs ${dark ? 'text-slate-600' : 'text-slate-400'}`}>Changes are reflected on the public website immediately.</p>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-orange-500/20"
            >
              {saved ? (
                <><CheckCircle2 size={14} /> Saved!</>
              ) : saving ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              ) : (
                <><Save size={14} /> Save Changes</>
              )}
            </button>
          </div>
        </div>

        {/* Change Password */}
        <div className={`${card} h-fit`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <KeyRound size={16} className="text-orange-500" />
            </div>
            <div>
              <h2 className={`font-bold text-sm ${dark ? 'text-white' : 'text-slate-900'}`}>Change Password</h2>
              <p className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Keep your account secure</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { field: 'current' as const, label: 'Current Password', key: 'currentPassword' },
              { field: 'new'     as const, label: 'New Password',     key: 'newPassword'     },
              { field: 'confirm' as const, label: 'Confirm Password', key: 'confirm'          },
            ].map(({ field, label, key }) => (
              <div key={field}>
                <label className={labelCls}>{label}</label>
                <div className="relative">
                  <input
                    type={showPw[field] ? 'text' : 'password'}
                    className={pwInput}
                    value={pwForm[key as keyof typeof pwForm]}
                    onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${dark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {showPw[field] ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={changePassword}
            disabled={pwSaving}
            className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors"
          >
            {pwSaving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</>
            ) : (
              <><Save size={14} /> Update Password</>
            )}
          </button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
