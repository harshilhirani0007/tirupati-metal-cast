import { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Save, Package, ImagePlus, Image, Images } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Product } from '../types';
import DeleteModal from './DeleteModal';
import Toast from './Toast';

interface ProductForm {
  category: string;
  description: string;
  grade: string;
  applications: string;
  color: string;
  active: number;
  sort_order: number;
  image_url: string;
  gallery_images: string[];
}

const colorOptions = [
  { label: 'Slate',   value: 'from-slate-700 to-slate-800' },
  { label: 'Orange',  value: 'from-orange-900 to-orange-800' },
  { label: 'Blue',    value: 'from-blue-900 to-blue-800' },
  { label: 'Emerald', value: 'from-emerald-900 to-emerald-800' },
  { label: 'Violet',  value: 'from-violet-900 to-violet-800' },
  { label: 'Rose',    value: 'from-rose-900 to-rose-800' },
];

const emptyForm: ProductForm = {
  category: '', description: '', grade: '', applications: '',
  color: 'from-slate-700 to-slate-800', active: 1, sort_order: 0,
  image_url: '', gallery_images: [],
};

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
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  const load = () =>
    fetch(`${API_BASE}/products/all`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json() as Promise<Product[]>).then(setProducts);

  useEffect(() => { load(); }, [token]);

  const openNew = () => { setForm(emptyForm); setModal({ open: true, editing: null }); };
  const openEdit = (p: Product) => {
    setForm({
      ...p,
      applications: p.applications.join(', '),
      image_url: p.image_url ?? '',
      gallery_images: Array.isArray(p.gallery_images) ? p.gallery_images : (typeof p.gallery_images === 'string' ? (() => { try { return JSON.parse(p.gallery_images as unknown as string); } catch { return []; } })() : []),
    });
    setModal({ open: true, editing: p });
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch(`${API_BASE}/products/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    const data = await res.json() as { url?: string; error?: string };
    if (res.ok && data.url) return data.url;
    throw new Error(data.error ?? 'Upload failed');
  };

  const handleMainImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (url) setForm(f => ({ ...f, image_url: url }));
    } catch (e) {
      setToast({ message: (e as Error).message, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (files: FileList) => {
    const remaining = 5 - form.gallery_images.length;
    if (remaining <= 0) {
      setToast({ message: 'Maximum 5 gallery images allowed', type: 'error' });
      return;
    }
    const toUpload = Array.from(files).slice(0, remaining);
    setUploadingGallery(true);
    try {
      const urls = await Promise.all(toUpload.map(uploadImage));
      const valid = urls.filter(Boolean) as string[];
      setForm(f => ({ ...f, gallery_images: [...f.gallery_images, ...valid] }));
    } catch (e) {
      setToast({ message: (e as Error).message, type: 'error' });
    } finally {
      setUploadingGallery(false);
      if (galleryFileRef.current) galleryFileRef.current.value = '';
    }
  };

  const removeGalleryImage = (idx: number) => {
    setForm(f => ({ ...f, gallery_images: f.gallery_images.filter((_, i) => i !== idx) }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const body = { ...form, applications: form.applications, gallery_images: form.gallery_images };
      const url = modal.editing ? `${API_BASE}/products/${modal.editing.id}` : `${API_BASE}/products`;
      const method = modal.editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        await load();
        setModal({ open: false, editing: null });
        setToast({ message: modal.editing ? 'Product updated' : 'Product created', type: 'success' });
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
      body: JSON.stringify({ ...p, active: p.active ? 0 : 1, applications: Array.isArray(p.applications) ? p.applications.join(',') : p.applications, gallery_images: p.gallery_images ?? [] }),
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
        setToast({ message: 'Product deleted', type: 'success' });
      } else {
        setToast({ message: 'Failed to delete', type: 'error' });
      }
    } catch {
      setToast({ message: 'Error deleting', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const inputCls = `w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${dark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'}`;
  const labelCls = `block text-xs font-bold mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-600'}`;

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Products</h1>
          <p className={`text-sm mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{products.length} products listed</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-orange-500/25"
        >
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Cards */}
      {products.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-20 rounded-2xl border ${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <Package size={36} className={dark ? 'text-slate-700' : 'text-slate-300'} />
          <p className={`text-sm mt-3 font-semibold ${dark ? 'text-slate-500' : 'text-slate-400'}`}>No products yet</p>
          <button onClick={openNew} className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors">
            Add your first product
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map(p => (
            <div
              key={p.id}
              className={`group flex flex-col rounded-2xl border overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                dark ? 'bg-slate-900 border-slate-800 hover:border-slate-600 hover:shadow-black/40' : 'bg-white border-slate-200 hover:border-orange-200 hover:shadow-orange-500/10'
              }`}
            >
              {/* Image / gradient header */}
              <div className={`relative overflow-hidden bg-gradient-to-br ${p.color}`} style={{ height: '180px' }}>
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-20"
                      style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image size={40} className="text-white/15" />
                    </div>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-0.5">{p.grade}</p>
                  <h3 className="text-white font-black text-base leading-tight">{p.category}</h3>
                </div>

                {/* Gallery count badge */}
                {(p.gallery_images?.length ?? 0) > 0 && (
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-black/50 text-white/80 backdrop-blur-sm">
                      <Images size={11} /> {p.gallery_images.length} photos
                    </span>
                  </div>
                )}

                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => toggleActive(p)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border backdrop-blur-md transition-colors ${
                      p.active
                        ? 'bg-green-500/25 text-green-300 border-green-400/30'
                        : 'bg-black/40 text-white/50 border-white/20'
                    }`}
                  >
                    {p.active ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                    {p.active ? 'Active' : 'Off'}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-5">
                <p className={`text-xs leading-relaxed mb-4 line-clamp-3 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {p.description}
                </p>
                {p.applications.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.applications.slice(0, 4).map(app => (
                      <span key={app} className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${dark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                        {app}
                      </span>
                    ))}
                    {p.applications.length > 4 && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${dark ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        +{p.applications.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className={`flex items-center gap-2 px-4 py-3 border-t ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  onClick={() => openEdit(p)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    dark ? 'border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => setDeleteModal({ open: true, id: p.id })}
                  className="p-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-2xl rounded-3xl border shadow-2xl flex flex-col max-h-[92vh] ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center justify-between px-6 py-5 border-b shrink-0 ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div>
                <h2 className={`font-black text-lg ${dark ? 'text-white' : 'text-slate-900'}`}>
                  {modal.editing ? 'Edit Product' : 'Add Product'}
                </h2>
                <p className={`text-xs mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {modal.editing ? 'Update product details, main photo, and gallery' : 'Fill in product info and upload photos'}
                </p>
              </div>
              <button onClick={() => setModal({ open: false, editing: null })} className={`p-2 rounded-xl transition-colors ${dark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}>
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
              {/* Main image */}
              <div>
                <label className={labelCls}>Main Product Photo</label>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleMainImageUpload(f); }} />
                {form.image_url ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 h-40">
                    <img src={form.image_url} alt="Product" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button type="button" onClick={() => fileRef.current?.click()}
                        className="px-3 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-lg">Change Photo</button>
                      <button type="button" onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                        className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg">Remove</button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                    className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors ${
                      dark ? 'border-slate-700 hover:border-orange-500/50 text-slate-500 hover:text-orange-400'
                           : 'border-slate-300 hover:border-orange-400 text-slate-400 hover:text-orange-500'
                    }`}>
                    {uploading
                      ? <><div className="w-5 h-5 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" /><span className="text-xs">Uploading...</span></>
                      : <><ImagePlus size={22} /><span className="text-xs font-semibold">Click to upload main photo</span><span className="text-[10px]">JPG, PNG, WebP · Max 5 MB</span></>
                    }
                  </button>
                )}
              </div>

              {/* Gallery images */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={labelCls + ' mb-0'}>Gallery Photos <span className={`font-normal ${dark ? 'text-slate-600' : 'text-slate-400'}`}>({form.gallery_images.length}/5)</span></label>
                  {form.gallery_images.length < 5 && (
                    <button type="button" onClick={() => galleryFileRef.current?.click()} disabled={uploadingGallery}
                      className="flex items-center gap-1 text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors">
                      {uploadingGallery
                        ? <><div className="w-3 h-3 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" /> Uploading...</>
                        : <><Plus size={13} /> Add Photos</>
                      }
                    </button>
                  )}
                </div>
                <input ref={galleryFileRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={e => { if (e.target.files?.length) handleGalleryUpload(e.target.files); }} />

                {form.gallery_images.length > 0 ? (
                  <div className="grid grid-cols-5 gap-2">
                    {form.gallery_images.map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 group">
                        <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={10} className="text-white" />
                        </button>
                        <div className={`absolute bottom-0 inset-x-0 text-center text-[9px] font-bold py-0.5 ${dark ? 'bg-black/60 text-slate-400' : 'bg-black/50 text-white'}`}>
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                    {form.gallery_images.length < 5 && (
                      <button type="button" onClick={() => galleryFileRef.current?.click()}
                        className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-colors ${
                          dark ? 'border-slate-700 hover:border-orange-500/50 text-slate-600 hover:text-orange-400'
                               : 'border-slate-300 hover:border-orange-400 text-slate-300 hover:text-orange-400'
                        }`}>
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                ) : (
                  <button type="button" onClick={() => galleryFileRef.current?.click()} disabled={uploadingGallery}
                    className={`w-full h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors ${
                      dark ? 'border-slate-700 hover:border-orange-500/50 text-slate-500 hover:text-orange-400'
                           : 'border-slate-300 hover:border-orange-400 text-slate-400 hover:text-orange-500'
                    }`}>
                    <Images size={20} />
                    <span className="text-xs font-semibold">Upload up to 5 gallery photos</span>
                    <span className="text-[10px]">Select multiple files at once</span>
                  </button>
                )}
              </div>

              <div>
                <label className={labelCls}>Category *</label>
                <input className={inputCls} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Grey Iron Castings" />
              </div>
              <div>
                <label className={labelCls}>Description *</label>
                <textarea className={`${inputCls} resize-none`} rows={6} value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed product description (3 paragraphs recommended)" />
              </div>
              <div>
                <label className={labelCls}>Grade / Standard *</label>
                <input className={inputCls} value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} placeholder="e.g. IS 210 / ASTM A48" />
              </div>
              <div>
                <label className={labelCls}>Applications <span className={`font-normal ${dark ? 'text-slate-600' : 'text-slate-400'}`}>(comma separated)</span></label>
                <input className={inputCls} value={form.applications} onChange={e => setForm({ ...form, applications: e.target.value })} placeholder="Engine blocks, Brake drums, Housings" />
              </div>
              <div>
                <label className={labelCls}>Card Color <span className={`font-normal ${dark ? 'text-slate-600' : 'text-slate-400'}`}>(shown when no photo)</span></label>
                <select className={inputCls} value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}>
                  {colorOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Sort Order</label>
                  <input type="number" className={inputCls} value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select className={inputCls} value={form.active} onChange={e => setForm({ ...form, active: Number(e.target.value) })}>
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={`flex gap-3 px-6 py-4 border-t shrink-0 ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
              <button
                onClick={() => setModal({ open: false, editing: null })}
                disabled={saving}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-colors ${dark ? 'border-slate-700 text-slate-400 hover:bg-slate-800 disabled:opacity-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50'}`}
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || uploading || uploadingGallery}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors"
              >
                {saving
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  : <><Save size={14} /> {modal.editing ? 'Update' : 'Create'}</>
                }
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
