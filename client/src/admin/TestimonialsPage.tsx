import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Star, X, Save, Quote } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Testimonial } from '../types';
import DeleteModal from './DeleteModal';
import Toast from './Toast';

const STATUS_CFG = {
  approved: { color: 'bg-green-500/15 text-green-400 border border-green-500/20', dot: 'bg-green-400' },
  pending:  { color: 'bg-orange-500/15 text-orange-400 border border-orange-500/20', dot: 'bg-orange-400' },
  rejected: { color: 'bg-red-500/15 text-red-400 border border-red-500/20', dot: 'bg-red-400' },
} as const;

type TestimonialForm = Omit<Testimonial, 'id' | 'created_at'>;
const empty: TestimonialForm = { name: '', role: '', company: '', text: '', rating: 5, status: 'approved' };

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={12}
          fill={i < rating ? '#f97316' : 'transparent'}
          className={i < rating ? 'text-orange-500' : 'text-slate-600'}
        />
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const { token } = useAuth();
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [items, setItems] = useState<Testimonial[]>([]);
  const [modal, setModal] = useState<{ open: boolean; editing: Testimonial | null }>({ open: false, editing: null });
  const [form, setForm] = useState<TestimonialForm>(empty);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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
    try {
      const url = modal.editing ? `${API_BASE}/testimonials/${modal.editing.id}` : `${API_BASE}/testimonials`;
      const res = await fetch(url, {
        method: modal.editing ? 'PUT' : 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        await load();
        setModal({ open: false, editing: null });
        setToast({ message: modal.editing ? 'Testimonial updated' : 'Testimonial created', type: 'success' });
      } else {
        setToast({ message: 'Failed to save', type: 'error' });
      }
    } catch {
      setToast({ message: 'Error saving', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteModal.id === null) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/testimonials/${deleteModal.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setDeleteModal({ open: false, id: null });
      if (res.ok) { load(); setToast({ message: 'Testimonial deleted', type: 'success' }); }
      else { setToast({ message: 'Failed to delete', type: 'error' }); }
    } catch {
      setToast({ message: 'Error deleting', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const inputCls = `w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${dark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`;
  const labelCls = `block text-xs font-bold mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-600'}`;

  const approved = items.filter(t => t.status === 'approved').length;
  const pending = items.filter(t => t.status === 'pending').length;

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Testimonials</h1>
          <p className={`text-sm mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>
            {approved} approved · {pending} pending
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-orange-500/25"
        >
          <Plus size={15} /> Add Testimonial
        </button>
      </div>

      {/* Cards */}
      {items.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-20 rounded-2xl border ${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <Star size={36} className={dark ? 'text-slate-700' : 'text-slate-300'} />
          <p className={`text-sm mt-3 font-semibold ${dark ? 'text-slate-500' : 'text-slate-400'}`}>No testimonials yet</p>
          <button onClick={openNew} className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors">
            Add first testimonial
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map(t => {
            const cfg = STATUS_CFG[t.status as keyof typeof STATUS_CFG];
            return (
              <div
                key={t.id}
                className={`group flex flex-col p-5 rounded-2xl border transition-all hover:-translate-y-0.5 ${dark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'}`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <StarRating rating={t.rating} />
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg?.color ?? ''}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg?.dot ?? ''}`} />
                    {t.status}
                  </span>
                </div>

                {/* Quote */}
                <div className="flex-1 mb-4">
                  <Quote size={16} className="text-orange-500/40 mb-1" />
                  <p className={`text-sm leading-relaxed line-clamp-4 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{t.text}</p>
                </div>

                {/* Author */}
                <div className={`flex items-center justify-between pt-3 border-t ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0 text-white text-xs font-black">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold truncate ${dark ? 'text-white' : 'text-slate-900'}`}>{t.name}</p>
                      <p className={`text-[11px] truncate ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{t.role}, {t.company}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0 ml-2">
                    <button
                      onClick={() => openEdit(t)}
                      className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-slate-500 hover:text-blue-400 hover:bg-blue-500/10' : 'text-slate-300 hover:text-blue-500 hover:bg-blue-50'}`}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ open: true, id: t.id })}
                      className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-slate-500 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center justify-between px-6 py-5 border-b ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div>
                <h2 className={`font-black text-lg ${dark ? 'text-white' : 'text-slate-900'}`}>
                  {modal.editing ? 'Edit Testimonial' : 'Add Testimonial'}
                </h2>
                <p className={`text-xs mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {modal.editing ? 'Update the review details' : 'Add a new customer review'}
                </p>
              </div>
              <button onClick={() => setModal({ open: false, editing: null })} className={`p-2 rounded-xl transition-colors ${dark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}>
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[55vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Name *</label>
                  <input className={inputCls} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Rajesh Kumar" />
                </div>
                <div>
                  <label className={labelCls}>Role *</label>
                  <input className={inputCls} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Purchase Manager" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Company *</label>
                <input className={inputCls} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
              </div>
              <div>
                <label className={labelCls}>Review Text *</label>
                <textarea className={`${inputCls} resize-none`} rows={4} value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} placeholder="What did the customer say?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Rating</label>
                  <select className={inputCls} value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}>
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} star{n !== 1 ? 's' : ''}</option>)}
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
            <div className={`flex gap-3 px-6 py-4 border-t ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
              <button
                onClick={() => setModal({ open: false, editing: null })}
                disabled={saving}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-colors ${dark ? 'border-slate-700 text-slate-400 hover:bg-slate-800 disabled:opacity-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50'}`}
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors"
              >
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                ) : (
                  <><Save size={14} /> {modal.editing ? 'Update' : 'Publish'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        open={deleteModal.open}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        itemName={deleteModal.id ? items.find(t => t.id === deleteModal.id)?.name : undefined}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
        loading={deleting}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
