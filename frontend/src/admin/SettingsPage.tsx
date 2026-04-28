import { useEffect, useState } from 'react';
import { Save, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SettingsPage() {
  const { token } = useAuth();
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/settings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setSettings);
  }, [token]);

  const saveSettings = async () => {
    setSaving(true);
    await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const changePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirm) { setPwMsg({ text: 'Passwords do not match', ok: false }); return; }
    if (pwForm.newPassword.length < 6) { setPwMsg({ text: 'Password must be at least 6 characters', ok: false }); return; }
    setPwSaving(true);
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
    });
    const data = await res.json();
    setPwMsg({ text: data.message || data.error, ok: res.ok });
    if (res.ok) setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    setPwSaving(false);
  };

  const inputCls = `w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${dark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'}`;
  const labelCls = `block text-xs font-semibold mb-1 ${dark ? 'text-slate-400' : 'text-slate-600'}`;

  const sectionCls = `p-6 rounded-2xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`;

  const settingFields = [
    { key: 'company_name', label: 'Company Name' },
    { key: 'tagline', label: 'Tagline' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'email', label: 'Email Address' },
    { key: 'address', label: 'Address' },
    { key: 'founded', label: 'Founded Year' },
    { key: 'capacity', label: 'Monthly Capacity' },
  ];

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
          {settingFields.map(({ key, label }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input
                className={inputCls}
                value={settings[key] || ''}
                onChange={e => setSettings({ ...settings, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-colors glow-orange"
        >
          {saved ? <><CheckCircle2 size={15} /> Saved!</> : saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={15} /> Save Settings</>}
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
        {pwMsg && (
          <div className={`mt-3 px-3 py-2 rounded-lg text-xs font-medium ${pwMsg.ok ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {pwMsg.text}
          </div>
        )}
        <button
          onClick={changePassword}
          disabled={pwSaving}
          className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-colors"
        >
          {pwSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={15} /> Update Password</>}
        </button>
      </div>
    </div>
  );
}
