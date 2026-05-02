import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, RefreshCw, Mail, Building, Phone } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Enquiry, PaginatedResponse } from '../types';
import DeleteModal from './DeleteModal';
import Toast from './Toast';

const statusColors: Record<string, string> = {
  new: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  read: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  replied: 'bg-green-500/20 text-green-400 border-green-500/30',
  archived: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

function EnquiryDetail() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const navigate = useNavigate();
  const [enq, setEnq] = useState<Enquiry | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/enquiries/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json() as Promise<Enquiry>)
      .then(setEnq);
  }, [id, token]);

  const updateStatus = async (status: Enquiry['status']) => {
    try {
      const res = await fetch(`${API_BASE}/enquiries/${id}/status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setEnq(prev => prev ? { ...prev, status } : null);
        setToast({ message: 'Status updated successfully', type: 'success' });
      } else {
        setToast({ message: 'Failed to update status', type: 'error' });
      }
    } catch {
      setToast({ message: 'Error updating status', type: 'error' });
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/enquiries/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        setDeleteModal(false);
        setToast({ message: 'Enquiry deleted successfully', type: 'success' });
        setTimeout(() => navigate('/admin/enquiries'), 500);
      } else {
        setToast({ message: 'Failed to delete enquiry', type: 'error' });
      }
    } catch {
      setToast({ message: 'Error deleting enquiry', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  if (!enq) return <div className={`text-sm ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Loading…</div>;

  const fields: { icon: typeof Mail; label: string; value: string }[] = [
    { icon: Mail, label: 'Name', value: enq.name },
    { icon: Building, label: 'Company', value: enq.company },
    { icon: Mail, label: 'Email', value: enq.email },
    { icon: Phone, label: 'Phone', value: enq.phone || 'N/A' },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to="/admin/enquiries" className={`p-2 rounded-xl border ${dark ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-500 hover:text-slate-900'}`}>
          <ArrowLeft size={16} />
        </Link>
        <h1 className={`text-xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Enquiry #{enq.id}</h1>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColors[enq.status]}`}>{enq.status}</span>
      </div>

      <div className={`p-6 rounded-2xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {fields.map(({ icon: Icon, label, value }) => (
            <div key={label} className={`p-3 rounded-xl ${dark ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={13} className="text-orange-500" />
                <span className={`text-xs font-bold ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>
              </div>
              <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className={`p-4 rounded-xl mb-4 ${dark ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <p className={`text-xs font-bold mb-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>MESSAGE</p>
          <p className={`text-sm leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{enq.message}</p>
        </div>

        <p className={`text-xs mb-6 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
          Received: {new Date(enq.created_at).toLocaleString('en-IN')}
        </p>

        <div className="flex flex-wrap gap-2">
          {(['new', 'read', 'replied', 'archived'] as Enquiry['status'][]).map(s => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                enq.status === s ? statusColors[s] : dark ? 'border-slate-700 text-slate-400 hover:border-slate-600' : 'border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          <button onClick={() => setDeleteModal(true)} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      <DeleteModal
        open={deleteModal}
        title="Delete Enquiry"
        message="Are you sure you want to delete this enquiry? This action cannot be undone."
        itemName={enq ? `Enquiry #${enq.id} from ${enq.name}` : undefined}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal(false)}
        loading={deleting}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default function EnquiriesPage() {
  const { id } = useParams<{ id: string }>();
  if (id) return <EnquiryDetail />;
  return <EnquiriesList />;
}

function EnquiriesList() {
  const { token } = useAuth();
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: number | null; name: string }>({ open: false, id: null, name: '' });
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    const url = filter ? `${API_BASE}/enquiries?status=${filter}` : `${API_BASE}/enquiries`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json() as Promise<PaginatedResponse<Enquiry>>)
      .then(d => { setEnquiries(d.data); setTotal(d.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter, token]);

  const confirmDelete = async () => {
    if (deleteModal.id === null) return;
    setDeleting(true);
    await fetch(`${API_BASE}/enquiries/${deleteModal.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setDeleteModal({ open: false, id: null, name: '' });
    setDeleting(false);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Enquiries</h1>
          <p className={`text-sm mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{total} total</p>
        </div>
        <button onClick={load} className={`p-2 rounded-xl border ${dark ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-500 hover:text-slate-900'}`}>
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['', 'new', 'read', 'replied', 'archived'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              filter === s
                ? 'bg-orange-500 text-white border-orange-500'
                : dark ? 'border-slate-700 text-slate-400 hover:border-slate-600' : 'border-slate-200 text-slate-500'
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      <div className={`rounded-2xl border overflow-hidden ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
        {loading ? (
          <div className={`p-8 text-center text-sm ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Loading…</div>
        ) : enquiries.length === 0 ? (
          <div className={`p-8 text-center text-sm ${dark ? 'text-slate-500' : 'text-slate-400'}`}>No enquiries found.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className={`border-b text-xs font-bold uppercase tracking-wider ${dark ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <th className="text-left px-4 py-3">#</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Company</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Email</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className={`divide-y ${dark ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {enquiries.map(enq => (
                <tr key={enq.id} className={`transition-colors ${dark ? 'bg-slate-900 hover:bg-slate-800' : 'bg-white hover:bg-slate-50'}`}>
                  <td className={`px-4 py-3 text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{enq.id}</td>
                  <td className={`px-4 py-3 text-sm font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{enq.name}</td>
                  <td className={`px-4 py-3 text-sm hidden md:table-cell ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{enq.company}</td>
                  <td className={`px-4 py-3 text-sm hidden lg:table-cell ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{enq.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[enq.status]}`}>{enq.status}</span>
                  </td>
                  <td className={`px-4 py-3 text-xs hidden sm:table-cell ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {new Date(enq.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Link to={`/admin/enquiries/${enq.id}`} className="text-orange-500 text-xs font-semibold hover:text-orange-400">View</Link>
                    <button onClick={() => setDeleteModal({ open: true, id: enq.id, name: enq.name })} className={`flex items-center gap-1.5 px-3 py-1 border text-xs font-semibold rounded-lg transition-colors ${dark ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'}`}>
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <DeleteModal
        open={deleteModal.open}
        title="Delete Enquiry"
        message="Are you sure you want to delete this enquiry? This action cannot be undone."
        itemName={deleteModal.name}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, name: '' })}
        loading={deleting}
      />
    </div>
  );
}
