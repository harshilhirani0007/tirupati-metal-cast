import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, Package, Star,
  Settings, LogOut, Cog, Menu, X, Sun, Moon, ChevronRight
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

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`p-5 border-b ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center glow-orange shrink-0">
            <Cog size={18} className="text-white" />
          </div>
          <div className="leading-none min-w-0">
            <p className={`font-black text-sm ${dark ? 'text-white' : 'text-slate-900'}`}>TMC Admin</p>
            <p className="text-orange-500 text-[10px] font-semibold tracking-wider">Control Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-orange-500 text-white shadow-lg glow-orange'
                  : dark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="opacity-60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className={`p-3 border-t space-y-1 ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
        {/* Admin info */}
        <div className={`px-3 py-2.5 rounded-xl ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <p className={`text-xs font-bold truncate ${dark ? 'text-white' : 'text-slate-900'}`}>{admin?.name}</p>
          <p className={`text-[10px] truncate ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{admin?.email}</p>
        </div>

        <button
          onClick={toggleTheme}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            dark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {dark ? <Sun size={17} /> : <Moon size={17} />}
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-red-400 hover:bg-red-500/10`}
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen overflow-hidden ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col w-60 shrink-0 border-r ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className={`relative w-64 flex flex-col border-r z-50 ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <button onClick={() => setSidebarOpen(false)} className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-200">
              <X size={18} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className={`lg:hidden flex items-center gap-3 px-4 h-14 border-b shrink-0 ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <button onClick={() => setSidebarOpen(true)} className={`p-1.5 rounded-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
              <Cog size={14} className="text-white" />
            </div>
            <span className={`font-black text-sm ${dark ? 'text-white' : 'text-slate-900'}`}>TMC Admin</span>
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
