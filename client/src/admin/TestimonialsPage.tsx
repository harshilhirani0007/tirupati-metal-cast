import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Star, X, Save } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Testimonial } from '../types';

const statusColors: Record<string, string> = {
  approved: 'bg-green-500/20 text-green-400 border-green-500/30',
  pending: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

type TestimonialForm = Omit<Testimonial, 'id' | 'created_at'>;

const empty: TestimonialForm = { name: '', role: '', company: '', text: '', rating: 5, status: 'approved' };

export default function TestimonialsPage() {
  const { token } = useAuth();
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [items, setItems] = useState<Testimonial[]>([]);
  const [modal, setModal] = useState<{ open: boolean; editing: Testimonial | null }>({ open: false, editing: null });
  const [form, setForm] = useState<TestimonialForm>(empty);
  const [saving, setSaving] = useState(false);

  const load = () =>
    fetch(`${API_BASE}/testimonials/all`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json() as Promise<Testimonial[]>).then(setItems);

  useEffect(() => { load(); }, [token]);

  const openNew = () => { setForm(empty); setModal({ open: true, editing: null }); };
  const openEdit = (t: Testimonial) => {
    const { id: _id, created_at: _ca, ...rest } = t;
    void _id; void _ca;
    setForm(rest);
    setModal({ open: true, editing: t });
  };

  const save = async () => {
    setSaving(true);
    const url = modal.editing ? `${API_BASE}/testimonials/${modal.editing.id}` : `${API_BASE}/testimonials`;
    await fetch(url, {
      method: modal.editing ? 'PUT' : 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    await load();
    setModal({ open: false, editing: null });
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    await fetch(`${API_BASE}/testimonials/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  const inputCls = `w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${dark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'}`;
  const labelCls = `block text-xs font-semibold mb-1 ${dark ? 'text-slate-400' : 'text-slate-600'}`;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Testimonials</h1>
          <p className={`text-sm mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{items.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors glow-orange">
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {items.map(t => (
          <div key={t.id} className={`p-5 rounded-2xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={13} fill={s <= t.rating ? '#f97316' : 'transparent'} className={s <= t.rating ? 'text-orange-500' : 'text-slate-600'} />
                ))}
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[t.status]}`}>{t.status}</span>
            </div>
            <p className={`text-sm leading-relaxed mb-4 line-clamp-3 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>"{t.text}"</p>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{t.name}</p>
                <p className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{t.role}, {t.company}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(t)} className="text-blue-400 hover:text-blue-300 p-1.5 rounded-lg"><Pencil size={14} /></button>
                <button onClick={() => del(t.id)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`font-black text-lg ${dark ? 'text-white' : 'text-slate-900'}`}>
                {modal.editing ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button onClick={() => setModal({ open: false, editing: null })} className="text-slate-400 p-1"><X size={18} /></button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div><label className={labelCls}>Name *</label><input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div><label className={labelCls}>Role *</label><input className={inputCls} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Purchase Manager" /></div>
              <div><label className={labelCls}>Company *</label><input className={inputCls} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
              <div><label className={labelCls}>Review Text *</label><textarea className={`${inputCls} resize-none`} rows={3} value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Rating</label>
                  <select className={inputCls} value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select className={inputCls} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Testimonial['status'] })}>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setModal({ open: false, editing: null })} className={`flex-1 py-2.5 rounded-xl border text-sm font-bold ${dark ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-600'}`}>Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={14} /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
