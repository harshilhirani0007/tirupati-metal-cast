import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Save } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Product } from '../types';
import DeleteModal from './DeleteModal';
import Toast from './Toast';

// Form state uses applications as a comma-separated string for easy editing
interface ProductForm {
  category: string;
  description: string;
  grade: string;
  applications: string;
  color: string;
  active: number;
  sort_order: number;
}

const colorOptions = [
  { label: 'Slate', value: 'from-slate-700 to-slate-800' },
  { label: 'Orange', value: 'from-orange-900 to-orange-800' },
  { label: 'Blue', value: 'from-blue-900 to-blue-800' },
  { label: 'Emerald', value: 'from-emerald-900 to-emerald-800' },
  { label: 'Violet', value: 'from-violet-900 to-violet-800' },
  { label: 'Rose', value: 'from-rose-900 to-rose-800' },
];

const emptyForm: ProductForm = { category: '', description: '', grade: '', applications: '', color: 'from-slate-700 to-slate-800', active: 1, sort_order: 0 };

export default function ProductsPage() {
  const { token } = useAuth();
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [products, setProducts] = useState<Product[]>([]);
  const [modal, setModal] = useState<{ open: boolean; editing: Product | null }>({ open: false, editing: null });
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const load = () =>
    fetch(`${API_BASE}/products/all`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json() as Promise<Product[]>).then(setProducts);

  useEffect(() => { load(); }, [token]);

  const openNew = () => { setForm(emptyForm); setModal({ open: true, editing: null }); };
  const openEdit = (p: Product) => {
    setForm({ ...p, applications: p.applications.join(', ') });
    setModal({ open: true, editing: p });
  };

  const save = async () => {
    setSaving(true);
    try {
      const body = { ...form, applications: form.applications };
      const url = modal.editing ? `${API_BASE}/products/${modal.editing.id}` : `${API_BASE}/products`;
      const method = modal.editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        await load();
        setModal({ open: false, editing: null });
        setToast({ message: modal.editing ? 'Product updated successfully' : 'Product created successfully', type: 'success' });
      } else {
        setToast({ message: 'Failed to save product', type: 'error' });
      }
    } catch {
      setToast({ message: 'Error saving product', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (p: Product) => {
    await fetch(`${API_BASE}/products/${p.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...p, active: p.active ? 0 : 1, applications: p.applications.join(',') }),
    });
    load();
  };

  const confirmDelete = async () => {
    if (deleteModal.id === null) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/products/${deleteModal.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        setDeleteModal({ open: false, id: null });
        load();
        setToast({ message: 'Product deleted successfully', type: 'success' });
      } else {
        setToast({ message: 'Failed to delete product', type: 'error' });
      }
    } catch {
      setToast({ message: 'Error deleting product', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const inputCls = `w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${dark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'}`;
  const labelCls = `block text-xs font-semibold mb-1 ${dark ? 'text-slate-400' : 'text-slate-600'}`;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Products</h1>
          <p className={`text-sm mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{products.length} products</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors glow-orange">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className={`rounded-2xl border overflow-hidden ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
        <table className="w-full">
          <thead>
            <tr className={`border-b text-xs font-bold uppercase tracking-wider ${dark ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Grade</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Sort</th>
              <th className="text-left px-4 py-3">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className={`divide-y ${dark ? 'divide-slate-800' : 'divide-slate-100'}`}>
            {products.map(p => (
              <tr key={p.id} className={`${dark ? 'bg-slate-900 hover:bg-slate-800' : 'bg-white hover:bg-slate-50'} transition-colors`}>
                <td className={`px-4 py-3 text-sm font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{p.category}</td>
                <td className={`px-4 py-3 text-sm hidden md:table-cell ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{p.grade}</td>
                <td className={`px-4 py-3 text-sm hidden lg:table-cell ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{p.sort_order}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(p)} className={p.active ? 'text-green-400' : 'text-slate-500'}>
                    {p.active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="text-blue-400 hover:text-blue-300 p-1"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteModal({ open: true, id: p.id })} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`font-black text-lg ${dark ? 'text-white' : 'text-slate-900'}`}>
                {modal.editing ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setModal({ open: false, editing: null })} className="text-slate-400 hover:text-slate-200 p-1">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div><label className={labelCls}>Category *</label><input className={inputCls} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Grey Iron Castings" /></div>
              <div><label className={labelCls}>Description *</label><textarea className={`${inputCls} resize-none`} rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div><label className={labelCls}>Grade/Standard *</label><input className={inputCls} value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} placeholder="IS 210 / ASTM A48" /></div>
              <div><label className={labelCls}>Applications (comma separated) *</label><input className={inputCls} value={form.applications} onChange={e => setForm({ ...form, applications: e.target.value })} placeholder="Engine blocks, Brake drums" /></div>
              <div>
                <label className={labelCls}>Card Color</label>
                <select className={inputCls} value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}>
                  {colorOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Sort Order</label><input type="number" className={inputCls} value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
                <div>
                  <label className={labelCls}>Active</label>
                  <select className={inputCls} value={form.active} onChange={e => setForm({ ...form, active: Number(e.target.value) })}>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setModal({ open: false, editing: null })} disabled={saving} className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-colors ${dark ? 'border-slate-700 text-slate-400 hover:bg-slate-800 disabled:opacity-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50'}`}>Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors">
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <><Save size={14} /> Save</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        open={deleteModal.open}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        itemName={deleteModal.id ? products.find(p => p.id === deleteModal.id)?.category : undefined}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
        loading={deleting}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
