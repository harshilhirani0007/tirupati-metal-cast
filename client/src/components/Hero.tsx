import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Shield, Award, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const stats = [
  { value: '25+', label: 'Years Experience' },
  { value: '500+', label: 'Products Cast' },
  { value: '200+', label: 'Happy Clients' },
  { value: 'ISO', label: '9001:2015 Certified' },
];

const badges = [
  { icon: Shield, label: 'ISO Certified' },
  { icon: Award, label: 'Premium Quality' },
  { icon: Zap, label: 'Fast Delivery' },
];

export default function Hero() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <section
      id="home"
      className={`relative min-h-screen flex flex-col justify-center overflow-hidden ${
        dark ? 'bg-slate-950' : 'bg-slate-50'
      }`}
    >
      {/* Background geometric pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 ${dark ? 'bg-orange-500' : 'bg-orange-300'}`} />
        <div className={`absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 ${dark ? 'bg-blue-500' : 'bg-blue-200'}`} />
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500 text-sm font-medium mb-6"
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
              <span className="gradient-text">Metal Casting</span>
              <br />
              Built to Last
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-lg leading-relaxed mb-8 max-w-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}
            >
              Shri Tirupati Metal Cast delivers high-quality grey iron, ductile iron, and alloy steel castings for automotive, industrial, and agricultural sectors — engineered with precision, delivered on time.
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
            className="relative"
          >
            {/* Main visual card */}
            <div className={`relative rounded-3xl overflow-hidden border ${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white shadow-2xl'}`}>
              {/* Simulated foundry image with gradient overlay */}
              <div className="relative h-80 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* Decorative metal casting SVG illustration */}
                <svg viewBox="0 0 300 200" className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                  <rect x="50" y="80" width="200" height="80" rx="8" fill="#f97316" opacity="0.6"/>
                  <rect x="80" y="60" width="60" height="30" rx="4" fill="#fb923c" opacity="0.8"/>
                  <rect x="160" y="60" width="60" height="30" rx="4" fill="#fb923c" opacity="0.8"/>
                  <circle cx="110" cy="120" r="20" fill="#fed7aa" opacity="0.5"/>
                  <circle cx="190" cy="120" r="20" fill="#fed7aa" opacity="0.5"/>
                  <rect x="30" y="155" width="240" height="10" rx="5" fill="#64748b" opacity="0.8"/>
                  <path d="M100 80 L110 40 L120 80" fill="#f97316" opacity="0.7"/>
                  <path d="M180 80 L190 40 L200 80" fill="#f97316" opacity="0.7"/>
                </svg>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-lg">High-Precision Casting</p>
                  <p className="text-slate-300 text-sm">Grey Iron · Ductile Iron · Alloy Steel</p>
                </div>
              </div>

              {/* Stats row */}
              <div className={`grid grid-cols-2 sm:grid-cols-4 divide-x ${dark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                {stats.map(({ value, label }) => (
                  <div key={label} className="p-4 text-center">
                    <p className="text-orange-500 font-black text-xl">{value}</p>
                    <p className={`text-xs mt-0.5 ${dark ? 'text-slate-500' : 'text-slate-500'}`}>{label}</p>
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
              Since 1999
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500 hover:text-orange-500 transition-colors bg-none border-none cursor-pointer"
      >
        <span className="text-xs font-medium tracking-wider uppercase">Scroll</span>
        <ChevronDown size={20} />
      </motion.button>
    </section>
  );
}
