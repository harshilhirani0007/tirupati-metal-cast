import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, RefreshCw, Mail, Building, Phone, User, Calendar, MessageSquare, Filter, Send, X } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Enquiry, PaginatedResponse } from '../types';
import DeleteModal from './DeleteModal';
import Toast from './Toast';

const STATUS_CFG = {
  new:      { color: 'bg-orange-500/15 text-orange-400 border border-orange-500/25', dot: 'bg-orange-400' },
  read:     { color: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',   dot: 'bg-blue-400'   },
  replied:  { color: 'bg-green-500/15 text-green-400 border border-green-500/25', dot: 'bg-green-400'  },
  archived: { color: 'bg-slate-500/15 text-slate-400 border border-slate-500/25', dot: 'bg-slate-400'  },
} as const;

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status as keyof typeof STATUS_CFG];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${cfg?.color ?? ''}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg?.dot ?? 'bg-slate-400'}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

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
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [replyModal, setReplyModal] = useState(false);
  const [replyForm, setReplyForm] = useState({ subject: '', body: '' });
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/enquiries/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json() as Promise<Enquiry>).then(setEnq);
  }, [id, token]);

  const updateStatus = async (status: Enquiry['status']) => {
    setUpdatingStatus(status);
    try {
      const res = await fetch(`${API_BASE}/enquiries/${id}/status`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setEnq(prev => prev ? { ...prev, status } : null);
        setToast({ message: 'Status updated', type: 'success' });
      } else {
        setToast({ message: 'Failed to update status', type: 'error' });
      }
    } catch {
      setToast({ message: 'Error updating status', type: 'error' });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const openReply = () => {
    setReplyForm({ subject: `Re: Enquiry from ${enq?.company}`, body: '' });
    setReplyModal(true);
  };

  const sendReply = async () => {
    if (!replyForm.subject.trim() || !replyForm.body.trim()) {
      setToast({ message: 'Subject and message are required', type: 'error' });
      return;
    }
    setReplying(true);
    try {
      const res = await fetch(`${API_BASE}/enquiries/${id}/reply`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(replyForm),
      });
      const data = await res.json();
      if (res.ok) {
        setReplyModal(false);
        setReplyForm({ subject: '', body: '' });
        setEnq(prev => prev ? { ...prev, status: 'replied' } : null);
        setToast({ message: 'Reply sent successfully', type: 'success' });
      } else {
        setToast({ message: data.error || 'Failed to send reply', type: 'error' });
      }
    } catch {
      setToast({ message: 'Error sending reply', type: 'error' });
    } finally {
      setReplying(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/enquiries/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        setDeleteModal(false);
        setToast({ message: 'Enquiry deleted', type: 'success' });
        setTimeout(() => navigate('/admin/enquiries'), 500);
      } else {
        setToast({ message: 'Failed to delete', type: 'error' });
      }
    } catch {
      setToast({ message: 'Error deleting', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  if (!enq) return (
    <div className="flex items-center justify-center h-40">
      <div className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );

  const card = `p-5 rounded-2xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`;

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/enquiries"
            className={`p-2 rounded-xl border transition-colors ${dark ? 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
          >
            <ArrowLeft size={15} />
          </Link>
          <div>
            <h1 className={`text-xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Enquiry #{enq.id}</h1>
            <p className={`text-xs mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              {new Date(enq.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          <StatusBadge status={enq.status} />
        </div>
        <button
          onClick={() => setDeleteModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="space-y-4">
          {/* Contact info */}
          <div className={card}>
            <h2 className={`text-xs font-bold uppercase tracking-widest mb-4 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Contact Details</h2>
            <div className="space-y-3">
              {[
                { icon: User,     label: 'Name',    value: enq.name },
                { icon: Building, label: 'Company', value: enq.company },
                { icon: Mail,     label: 'Email',   value: enq.email },
                { icon: Phone,    label: 'Phone',   value: enq.phone || 'Not provided' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className={`flex items-start gap-3 p-3 rounded-xl ${dark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={13} className="text-orange-500" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
                    <p className={`text-sm font-semibold mt-0.5 break-all ${dark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Received */}
          <div className={card}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={13} className="text-orange-500" />
              <p className={`text-xs font-bold uppercase tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Received</p>
            </div>
            <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>
              {new Date(enq.created_at).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-4">
          {/* Message */}
          <div className={card}>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={14} className="text-orange-500" />
              <h2 className={`text-xs font-bold uppercase tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Message</h2>
            </div>
            <div className={`p-4 rounded-xl ${dark ? 'bg-slate-800' : 'bg-slate-50'}`}>
              <p className={`text-sm leading-relaxed whitespace-pre-wrap ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{enq.message}</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className={card}>
            <h2 className={`text-xs font-bold uppercase tracking-widest mb-4 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={openReply}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
              >
                <Mail size={14} /> Reply via Email
              </button>
              {enq.phone && (
                <a
                  href={`tel:${enq.phone}`}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-colors"
                >
                  <Phone size={14} /> Call
                </a>
              )}
            </div>
          </div>

          {/* Status update */}
          <div className={card}>
            <h2 className={`text-xs font-bold uppercase tracking-widest mb-4 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Update Status</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['new', 'read', 'replied', 'archived'] as Enquiry['status'][]).map(s => {
                const cfg = STATUS_CFG[s];
                const isActive = enq.status === s;
                const isLoading = updatingStatus === s;
                return (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    disabled={isActive || isLoading}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                      isActive
                        ? cfg.color
                        : dark
                          ? 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900'
                    } ${isActive ? 'cursor-default' : ''}`}
                  >
                    {isLoading ? (
                      <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    ) : (
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? cfg.dot : dark ? 'bg-slate-600' : 'bg-slate-300'}`} />
                    )}
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <DeleteModal
        open={deleteModal}
        title="Delete Enquiry"
        message="Are you sure you want to delete this enquiry? This action cannot be undone."
        itemName={`Enquiry #${enq.id} from ${enq.name}`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal(false)}
        loading={deleting}
      />

      {/* Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-3xl border shadow-2xl ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center justify-between px-6 py-5 border-b ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div>
                <h2 className={`font-black text-lg ${dark ? 'text-white' : 'text-slate-900'}`}>Reply to Enquiry</h2>
                <p className={`text-xs mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Sending to {enq.name} &lt;{enq.email}&gt;</p>
              </div>
              <button
                onClick={() => setReplyModal(false)}
                className={`p-2 rounded-xl transition-colors ${dark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Subject</label>
                <input
                  type="text"
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all ${dark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  value={replyForm.subject}
                  onChange={e => setReplyForm({ ...replyForm, subject: e.target.value })}
                />
              </div>
              <div>
                <label className={`block text-xs font-bold mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Message</label>
                <textarea
                  rows={7}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all resize-none ${dark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  placeholder={`Dear ${enq.name},\n\nThank you for your enquiry...`}
                  value={replyForm.body}
                  onChange={e => setReplyForm({ ...replyForm, body: e.target.value })}
                />
              </div>
            </div>
            <div className={`flex gap-3 px-6 py-4 border-t ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
              <button
                onClick={() => setReplyModal(false)}
                disabled={replying}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-colors ${dark ? 'border-slate-700 text-slate-400 hover:bg-slate-800 disabled:opacity-50' : 'border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50'}`}
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                disabled={replying}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-colors"
              >
                {replying ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                ) : (
                  <><Send size={14} /> Send Reply</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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
    try {
      const res = await fetch(`${API_BASE}/enquiries/${deleteModal.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setDeleteModal({ open: false, id: null, name: '' });
      if (res.ok) { load(); setToast({ message: 'Enquiry deleted', type: 'success' }); }
      else { setToast({ message: 'Failed to delete', type: 'error' }); }
    } catch {
      setToast({ message: 'Error deleting', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const filters = [
    { value: '', label: 'All', count: total },
    { value: 'new', label: 'New' },
    { value: 'read', label: 'Read' },
    { value: 'replied', label: 'Replied' },
    { value: 'archived', label: 'Archived' },
  ];

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>Enquiries</h1>
          <p className={`text-sm mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{total} total enquiries</p>
        </div>
        <button
          onClick={load}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-colors ${dark ? 'border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className={`flex items-center gap-1 p-1 rounded-xl w-fit ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
        <Filter size={13} className={`ml-2 mr-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`} />
        {filters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === value
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                : dark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={`rounded-2xl border overflow-hidden ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
          </div>
        ) : enquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <MessageSquare size={32} className={dark ? 'text-slate-700' : 'text-slate-300'} />
            <p className={`text-sm mt-3 font-semibold ${dark ? 'text-slate-500' : 'text-slate-400'}`}>No enquiries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className={`border-b text-[11px] font-bold uppercase tracking-widest ${dark ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
                  <th className="text-left px-5 py-3.5">Contact</th>
                  <th className="text-left px-5 py-3.5 hidden md:table-cell">Company</th>
                  <th className="text-left px-5 py-3.5 hidden lg:table-cell">Email</th>
                  <th className="text-left px-5 py-3.5">Status</th>
                  <th className="text-left px-5 py-3.5 hidden sm:table-cell">Date</th>
                  <th className="px-5 py-3.5 w-28"></th>
                </tr>
              </thead>
              <tbody className={`divide-y ${dark ? 'divide-slate-800' : 'divide-slate-50'}`}>
                {enquiries.map(enq => (
                  <tr key={enq.id} className={`transition-colors ${dark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50'}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0 text-white text-xs font-black">
                          {enq.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{enq.name}</p>
                          <p className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>#{enq.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-5 py-3.5 text-sm hidden md:table-cell ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{enq.company}</td>
                    <td className={`px-5 py-3.5 text-sm hidden lg:table-cell ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{enq.email}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={enq.status} />
                    </td>
                    <td className={`px-5 py-3.5 text-xs hidden sm:table-cell ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {new Date(enq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/enquiries/${enq.id}`}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/20 transition-colors"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ open: true, id: enq.id, name: enq.name })}
                          className={`p-1.5 rounded-lg transition-colors ${dark ? 'text-slate-600 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteModal
        open={deleteModal.open}
        title="Delete Enquiry"
        message="This action cannot be undone."
        itemName={deleteModal.name}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, name: '' })}
        loading={deleting}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
