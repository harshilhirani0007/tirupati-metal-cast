import { Link } from 'react-router-dom';
import { Cog, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../hooks/useSettings';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Quality', href: '/quality' },
  { label: 'Process', href: '/process' },
  { label: 'Why Us', href: '/why-us' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact', href: '/contact' },
];

const products = [
  'Grey Iron Castings',
  'Ductile Iron Castings',
  'Alloy Steel Castings',
  'SG Iron Castings',
  'Stainless Steel Castings',
  'Machined Castings',
];

export default function Footer() {
  const { theme } = useTheme();
  const { settings } = useSettings();
  const dark = theme === 'dark';

  return (
    <footer className={`${dark ? 'bg-slate-900 border-slate-800' : 'bg-slate-900'} border-t border-slate-800`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
                <Cog size={18} className="text-white" />
              </div>
              <div className="leading-none">
                <span className="text-white font-black block text-sm tracking-tight uppercase">{settings.company_name?.split(' ').slice(0, -2).join(' ') || 'SHRI TIRUPATI'}</span>
                <span className="text-orange-500 text-[10px] font-semibold tracking-[0.2em] uppercase">{settings.company_name?.split(' ').slice(-2).join(' ') || 'Metal Cast'}</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              {settings.tagline}
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              {settings.address && (
                <div className="flex items-start gap-2"><MapPin size={14} className="text-orange-500 mt-0.5 shrink-0" /><span>{settings.address}</span></div>
              )}
              {settings.phone && (
                <div className="flex items-start gap-2">
                  <Phone size={14} className="text-orange-500 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    {settings.phone.split('\n').filter(Boolean).map(num => (
                      <a key={num} href={`tel:${num.trim()}`} className="hover:text-orange-400 transition-colors">{num.trim()}</a>
                    ))}
                  </div>
                </div>
              )}
              {settings.email && (
                <div className="flex items-center gap-2"><Mail size={14} className="text-orange-500 shrink-0" /><a href={`mailto:${settings.email}`} className="hover:text-orange-400 transition-colors">{settings.email}</a></div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-slate-400 hover:text-orange-400 text-sm transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-500" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">Products</h4>
            <ul className="space-y-2.5">
              {products.map(p => (
                <li key={p}>
                  <Link to="/products" className="text-slate-400 hover:text-orange-400 text-sm transition-colors">
                    {p}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h4 className="text-white font-bold text-sm mb-5 uppercase tracking-wider">Get a Quote</h4>
            <p className="text-slate-400 text-sm mb-5">Send us your technical drawing and receive a detailed quote within 24 hours.</p>
            <Link
              to="/contact"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-all duration-200 glow-orange w-full sm:w-auto"
            >
              Contact Us
              <ArrowRight size={14} />
            </Link>

            <div className="mt-8">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 border border-slate-700">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-white font-black text-[9px] text-center leading-tight">ISO</span>
                </div>
                <div>
                  <p className="text-white text-xs font-bold">ISO 9001:2015</p>
                  <p className="text-slate-500 text-[10px]">Quality Certified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Tirupati Metal Cast. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Precision · Quality · Trust
          </p>
        </div>
      </div>
    </footer>
  );
}
