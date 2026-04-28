import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Package, Star, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth, API_BASE } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { EnquiryStats, Enquiry, Product, Testimonial, PaginatedResponse } from '../types';

export default function Dashboard() {
  const { token, admin } = useAuth();
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [stats, setStats] = useState<EnquiryStats | null>(null);
  const [productCount, setProductCount] = useState(0);
  const [testimonialCount, setTestimonialCount] = useState(0);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);

  useEffect(() => {
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API_BASE}/enquiries/stats`, { headers: h }).then(r => r.json() as Promise<EnquiryStats>),
      fetch(`${API_BASE}/products/all`, { headers: h }).then(r => r.json() as Promise<Product[]>),
      fetch(`${API_BASE}/testimonials/all`, { headers: h }).then(r => r.json() as Promise<Testimonial[]>),
      fetch(`${API_BASE}/enquiries?limit=5`, { headers: h }).then(r => r.json() as Promise<PaginatedResponse<Enquiry>>),
    ]).then(([s, p, t, e]) => {
      setStats(s);
      setProductCount(p.length);
      setTestimonialCount(t.length);
      setRecentEnquiries(e.data || []);
    });
  }, [token]);

  const cards = [
    { label: 'Total Enquiries', value: stats?.total ?? '—', icon: MessageSquare, color: 'bg-blue-500', link: '/admin/enquiries' },
    { label: 'New Enquiries', value: stats?.new ?? '—', icon: AlertCircle, color: 'bg-orange-500', link: '/admin/enquiries' },
    { label: 'Products Listed', value: productCount || '—', icon: Package, color: 'bg-emerald-500', link: '/admin/products' },
    { label: 'Testimonials', value: testimonialCount || '—', icon: Star, color: 'bg-violet-500', link: '/admin/testimonials' },
  ];

  const statusColors: Record<string, string> = {
    new: 'bg-orange-500/20 text-orange-400',
    read: 'bg-blue-500/20 text-blue-400',
    replied: 'bg-green-500/20 text-green-400',
    archived: 'bg-slate-500/20 text-slate-400',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>
          Welcome back, {admin?.name} 👋
        </h1>
        <p className={`text-sm mt-1 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>
          Here's what's happening at Tirupati Metal Cast today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, link }) => (
          <Link
            key={label}
            to={link}
            className={`p-5 rounded-2xl border card-hover ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}
          >
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={18} className="text-white" />
            </div>
            <p className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
            <p className={`text-xs mt-1 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{label}</p>
          </Link>
        ))}
      </div>

      {/* Enquiry breakdown + recent */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Breakdown */}
        <div className={`p-6 rounded-2xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h2 className={`font-bold mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>Enquiry Status</h2>
          <div className="space-y-3">
            {[
              { label: 'New', value: stats?.new, icon: AlertCircle, color: 'text-orange-400' },
              { label: 'Read', value: stats?.read, icon: Clock, color: 'text-blue-400' },
              { label: 'Replied', value: stats?.replied, icon: CheckCircle, color: 'text-green-400' },
              { label: 'Total', value: stats?.total, icon: TrendingUp, color: 'text-slate-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon size={15} className={color} />
                  <span className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{label}</span>
                </div>
                <span className={`font-bold text-sm ${dark ? 'text-white' : 'text-slate-900'}`}>{value ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent enquiries */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="text-orange-500 text-xs font-semibold hover:text-orange-400">View all →</Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <p className={`text-sm ${dark ? 'text-slate-500' : 'text-slate-400'}`}>No enquiries yet.</p>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map(enq => (
                <Link
                  key={enq.id}
                  to={`/admin/enquiries/${enq.id}`}
                  className={`flex items-start justify-between p-3 rounded-xl transition-colors ${dark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                >
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${dark ? 'text-white' : 'text-slate-900'}`}>{enq.name}</p>
                    <p className={`text-xs truncate ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{enq.company} · {enq.email}</p>
                  </div>
                  <span className={`shrink-0 ml-3 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[enq.status] || ''}`}>
                    {enq.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
