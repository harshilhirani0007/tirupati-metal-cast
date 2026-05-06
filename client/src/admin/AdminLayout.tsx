import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Package, Star,
  Settings, LogOut, Menu, X, Sun, Moon, Bell, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/enquiries', icon: MessageSquare, label: 'Enquiries' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/testimonials', icon: Star, label: 'Testimonials' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const dark = theme === 'dark';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const initials = admin?.name
    ? admin.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className={`px-5 py-5 border-b ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
            <span className="text-white font-black text-sm">T</span>
          </div>
          <div className="min-w-0">
            <p className={`font-black text-sm leading-none ${dark ? 'text-white' : 'text-slate-900'}`}>TMC Admin</p>
            <p className="text-[10px] text-orange-500 font-semibold mt-0.5">Control Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className={`px-3 mb-2 text-[10px] font-bold uppercase tracking-widest ${dark ? 'text-slate-600' : 'text-slate-400'}`}>Navigation</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 group ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                  : dark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-white' : ''} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={13} className="opacity-50" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className={`p-3 border-t ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
        {/* User card */}
        <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 ${dark ? 'bg-slate-800' : 'bg-slate-50'}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-black">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-xs font-bold truncate ${dark ? 'text-white' : 'text-slate-900'}`}>{admin?.name}</p>
            <p className={`text-[10px] truncate ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{admin?.email}</p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
            dark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          {dark ? <Sun size={15} /> : <Moon size={15} />}
          <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen overflow-hidden ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col w-56 shrink-0 border-r ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className={`relative w-60 flex flex-col border-r z-50 ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <button onClick={() => setSidebarOpen(false)} className={`absolute top-4 right-3 p-1.5 rounded-lg ${dark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
              <X size={16} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className={`flex items-center justify-between gap-3 px-4 lg:px-6 h-14 border-b shrink-0 ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <button onClick={() => setSidebarOpen(true)} className={`lg:hidden p-1.5 rounded-lg ${dark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
            <Menu size={18} />
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${dark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className={`p-2 rounded-lg transition-colors ${dark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
              <Bell size={16} />
            </button>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <span className="text-white text-[10px] font-black">{initials}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`flex-1 overflow-y-auto p-4 lg:p-6 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
