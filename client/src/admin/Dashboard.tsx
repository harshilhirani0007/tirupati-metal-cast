import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Package, Star, TrendingUp, Clock, CheckCircle, AlertCircle, ArrowRight, Activity } from 'lucide-react';
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

  const statCards = [
    {
      label: 'Total Enquiries',
      value: stats?.total ?? '—',
      icon: MessageSquare,
      gradient: 'from-blue-500 to-blue-600',
      shadow: 'shadow-blue-500/20',
      bg: dark ? 'bg-blue-500/10' : 'bg-blue-50',
      text: 'text-blue-500',
      link: '/admin/enquiries',
      change: 'All time',
    },
    {
      label: 'New Enquiries',
      value: stats?.new ?? '—',
      icon: AlertCircle,
      gradient: 'from-orange-500 to-orange-600',
      shadow: 'shadow-orange-500/20',
      bg: dark ? 'bg-orange-500/10' : 'bg-orange-50',
      text: 'text-orange-500',
      link: '/admin/enquiries',
      change: 'Needs attention',
    },
    {
      label: 'Products',
      value: productCount || '—',
      icon: Package,
      gradient: 'from-emerald-500 to-emerald-600',
      shadow: 'shadow-emerald-500/20',
      bg: dark ? 'bg-emerald-500/10' : 'bg-emerald-50',
      text: 'text-emerald-500',
      link: '/admin/products',
      change: 'Listed',
    },
    {
      label: 'Testimonials',
      value: testimonialCount || '—',
      icon: Star,
      gradient: 'from-violet-500 to-violet-600',
      shadow: 'shadow-violet-500/20',
      bg: dark ? 'bg-violet-500/10' : 'bg-violet-50',
      text: 'text-violet-500',
      link: '/admin/testimonials',
      change: 'Published',
    },
  ];

  const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
    new: { label: 'New', color: 'bg-orange-500/15 text-orange-400 border border-orange-500/20', dot: 'bg-orange-400' },
    read: { label: 'Read', color: 'bg-blue-500/15 text-blue-400 border border-blue-500/20', dot: 'bg-blue-400' },
    replied: { label: 'Replied', color: 'bg-green-500/15 text-green-400 border border-green-500/20', dot: 'bg-green-400' },
    archived: { label: 'Archived', color: 'bg-slate-500/15 text-slate-400 border border-slate-500/20', dot: 'bg-slate-400' },
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>
            {greeting}, {admin?.name?.split(' ')[0]} 👋
          </h1>
          <p className={`text-sm mt-1 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>
            Here's what's happening at Shri Tirupati Metal Cast today.
          </p>
        </div>
        <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${dark ? 'bg-slate-800 text-slate-400' : 'bg-white border border-slate-200 text-slate-500'}`}>
          <Activity size={12} className="text-green-400" />
          Live
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, gradient, shadow, bg, text, link, change }) => (
          <Link
            key={label}
            to={link}
            className={`group relative p-5 rounded-2xl border overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${shadow} ${dark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon size={18} className={text} />
              </div>
              <ArrowRight size={14} className={`${dark ? 'text-slate-600' : 'text-slate-300'} group-hover:text-orange-500 transition-colors`} />
            </div>
            <p className={`text-3xl font-black mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
            <p className={`text-xs font-semibold ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{label}</p>
            <p className={`text-[10px] mt-0.5 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>{change}</p>
            {/* accent line */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
          </Link>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Enquiry Status Breakdown */}
        <div className={`p-6 rounded-2xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className={`font-bold text-sm ${dark ? 'text-white' : 'text-slate-900'}`}>Enquiry Breakdown</h2>
            <TrendingUp size={15} className="text-orange-500" />
          </div>
          <div className="space-y-3">
            {[
              { label: 'New', value: stats?.new, icon: AlertCircle, color: 'text-orange-400', bar: 'bg-orange-500' },
              { label: 'Read', value: stats?.read, icon: Clock, color: 'text-blue-400', bar: 'bg-blue-500' },
              { label: 'Replied', value: stats?.replied, icon: CheckCircle, color: 'text-green-400', bar: 'bg-green-500' },
            ].map(({ label, value, icon: Icon, color, bar }) => {
              const pct = stats?.total ? Math.round(((value ?? 0) / stats.total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Icon size={13} className={color} />
                      <span className={`text-xs font-semibold ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{label}</span>
                    </div>
                    <span className={`text-xs font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{value ?? 0}</span>
                  </div>
                  <div className={`h-1.5 rounded-full ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div className={`h-full rounded-full ${bar} transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className={`mt-4 pt-4 border-t flex items-center justify-between ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
            <span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Total</span>
            <span className={`text-sm font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{stats?.total ?? 0}</span>
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className={`font-bold text-sm ${dark ? 'text-white' : 'text-slate-900'}`}>Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="flex items-center gap-1 text-orange-500 text-xs font-semibold hover:text-orange-400 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className={`flex flex-col items-center justify-center py-10 rounded-xl ${dark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
              <MessageSquare size={28} className={dark ? 'text-slate-600' : 'text-slate-300'} />
              <p className={`text-sm mt-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>No enquiries yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentEnquiries.map(enq => {
                const cfg = statusConfig[enq.status];
                return (
                  <Link
                    key={enq.id}
                    to={`/admin/enquiries/${enq.id}`}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors group ${dark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0 text-white text-xs font-black">
                      {enq.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold truncate ${dark ? 'text-white' : 'text-slate-900'}`}>{enq.name}</p>
                      </div>
                      <p className={`text-xs truncate ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{enq.company}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg?.color ?? ''}`}>
                        {enq.status}
                      </span>
                      <ArrowRight size={13} className={`${dark ? 'text-slate-600' : 'text-slate-300'} group-hover:text-orange-500 transition-colors`} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
