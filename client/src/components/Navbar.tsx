import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Cog } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../hooks/useSettings';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Process', href: '/process' },
  { label: 'Quality', href: '/quality' },
  { label: 'Why Us', href: '/why-us' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { settings } = useSettings();
  const dark = theme === 'dark';
  const companyName = settings.company_name || 'Shri Tirupati Metal Cast';
  const [companyTop, companyBottom] = companyName.includes(' ')
    ? [companyName.split(' ').slice(0, -2).join(' ') || companyName, companyName.split(' ').slice(-2).join(' ')]
    : [companyName, ''];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? dark
            ? 'bg-slate-900/95 backdrop-blur-md border-slate-800 shadow-2xl'
            : 'bg-white/95 backdrop-blur-md border-slate-200 shadow-lg'
          : dark
            ? 'bg-slate-900/95 backdrop-blur-md border-slate-800'
            : 'bg-white/95 backdrop-blur-md border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center glow-orange group-hover:scale-110 transition-transform">
              <Cog size={20} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className={`font-black text-base tracking-tight uppercase ${dark ? 'text-white' : 'text-slate-900'}`}>
                {companyTop}
              </span>
              {companyBottom && (
                <span className="text-orange-500 text-[10px] font-semibold tracking-[0.2em] uppercase">
                  {companyBottom}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Nav — visible at lg+ */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/'}
                className={({ isActive }) =>
                  `px-2.5 xl:px-4 py-2 rounded-lg text-xs xl:text-sm font-medium transition-all duration-200 whitespace-nowrap border ${
                    isActive
                      ? dark
                        ? 'bg-orange-500/15 text-orange-400 border-orange-500/30 shadow-sm'
                        : 'bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-sm'
                      : dark
                        ? 'text-slate-300 border-transparent hover:bg-slate-800 hover:border-slate-700'
                        : 'text-slate-600 border-transparent hover:bg-slate-100 hover:border-slate-200'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 ${
                dark
                  ? 'text-slate-400 hover:text-orange-400 hover:bg-slate-800'
                  : 'text-slate-600 hover:text-orange-500 hover:bg-slate-100'
              }`}
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              to="/contact"
              className="hidden lg:inline-flex items-center gap-2 px-4 xl:px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 glow-orange hover:scale-105 whitespace-nowrap"
            >
              Get Quote
            </Link>

            {/* Hamburger — visible below lg */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                dark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
              }`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className={`lg:hidden border-t overflow-hidden ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
          >
            <div className="px-4 py-4 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
              {navLinks.map(link => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  end={link.href === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-sm font-medium transition-colors border ${
                      isActive
                        ? dark
                          ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                          : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                        : dark
                          ? 'text-slate-300 border-transparent hover:text-orange-400 hover:bg-slate-800'
                          : 'text-slate-700 border-transparent hover:text-orange-500 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-2 flex flex-col gap-2 border-t mt-2 border-slate-800/50">
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg text-center text-sm transition-colors"
                >
                  Get Quote
                </Link>
                <Link
                  to="/admin/login"
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium text-center transition-colors ${
                    dark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Admin Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
