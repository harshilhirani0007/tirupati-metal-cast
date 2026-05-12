import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../hooks/useSettings';

const badges = [
  { icon: Shield, label: 'ISO Certified' },
  { icon: Award, label: 'Premium Quality' },
];

export default function Hero() {
  const { theme } = useTheme();
  const { settings } = useSettings();
  const dark = theme === 'dark';

  const yearsExp = settings.founded
    ? `${new Date().getFullYear() - parseInt(settings.founded)}+`
    : '25+';

  const stats = [
    { value: yearsExp,                          label: 'Years Experience' },
    { value: settings.capacity || '500 MT',     label: 'Monthly Capacity' },
    { value: settings.clients_served || '200+', label: 'Happy Clients' },
    { value: 'ISO',                             label: '9001:2015 Certified' },
  ];

  return (
    <section
      id="home"
      className={`relative min-h-screen flex flex-col justify-center overflow-hidden ${
        dark ? 'bg-slate-950' : 'bg-slate-50'
      }`}
    >
      {/* Background geometric pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-80"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${dark ? 'from-slate-950/90 via-slate-950/70 to-transparent' : 'from-slate-50/95 via-slate-100/70 to-transparent'}`} />
        <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 ${dark ? 'bg-orange-500' : 'bg-orange-300'}`} />
        <div className={`absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 ${dark ? 'bg-blue-500' : 'bg-blue-200'}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(248,113,66,0.18),_transparent_30%)]" />
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke={dark ? '#fff' : '#000'} strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 transition-colors ${
                dark
                  ? 'border border-slate-700 bg-slate-900/80 text-orange-300 shadow-sm backdrop-blur-sm ring-1 ring-slate-700/70'
                  : 'border border-orange-200 bg-white/95 text-orange-600 shadow-sm backdrop-blur-sm'
              }`}
            >
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              India's Trusted Metal Casting Partner
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight mb-6 ${dark ? 'text-white' : 'text-slate-900'}`}
            >
              Precision{' '}
              <span className="text-orange-500">Metal Casting</span>
              <br />
              Built to Last
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-lg leading-relaxed mb-8 max-w-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}
            >
              {settings.company_name || 'Shri Tirupati Metal Cast'} delivers high-quality grey iron and ductile iron castings for automotive, industrial, and agricultural sectors — engineered with precision, delivered on time.
            </motion.p>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              {badges.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                    dark
                      ? 'border-slate-700 bg-slate-800 text-slate-300'
                      : 'border-slate-200 bg-white text-slate-600 shadow-sm'
                  }`}
                >
                  <Icon size={14} className="text-orange-500" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-200 hover:scale-105 glow-orange text-sm"
              >
                Explore Products
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className={`inline-flex items-center gap-2 px-7 py-3.5 font-bold rounded-xl border-2 transition-all duration-200 hover:scale-105 text-sm ${
                  dark
                    ? 'border-slate-700 text-slate-300 hover:border-orange-500 hover:text-orange-400'
                    : 'border-slate-300 text-slate-700 hover:border-orange-500 hover:text-orange-600'
                }`}
              >
                Request Quote
              </Link>
            </motion.div>
          </div>

          {/* Right — Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-10 lg:mt-0"
          >
            {/* Main visual card */}
            <div className={`relative rounded-3xl overflow-hidden border ${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white shadow-2xl'}`}>
              <div
                className="relative h-56 sm:h-80 overflow-hidden bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80')",
                }}
              >
                <div className="absolute inset-0 bg-slate-950/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute left-4 right-4 bottom-4">
                  <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-4 shadow-2xl backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.24em] text-orange-300 font-semibold mb-2">Featured Process</p>
                    <h3 className="text-xl font-bold text-white mb-1">High-Precision Casting</h3>
                    <p className="text-sm text-slate-300">Grey Iron · Ductile Iron</p>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className={`grid grid-cols-4 divide-x ${dark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {stats.map(({ value, label }) => (
                  <div key={label} className="py-3 px-2 text-center">
                    <p className="text-orange-500 font-black text-base sm:text-xl">{value}</p>
                    <p className={`text-[10px] sm:text-xs mt-0.5 leading-tight ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -top-4 right-4 sm:-right-4 bg-orange-500 text-white px-4 py-2 rounded-2xl shadow-xl text-sm font-bold glow-orange"
            >
              Since {settings.founded || '1999'}
            </motion.div>
          </motion.div>
        </div>
      </div>

    </section>
  );
}
