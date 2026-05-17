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
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 ${dark ? 'bg-orange-500' : 'bg-orange-300'}`} />
        <div className={`absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 ${dark ? 'bg-blue-500' : 'bg-blue-200'}`} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">

          {/* Left — Text Content with video background */}
          <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 flex flex-col justify-center h-full">
            {/* Video playing behind text */}
            <video
              src="https://res.cloudinary.com/dogc5wiy4/video/upload/f_auto,q_auto:low,w_720/v1779014961/tirupati/hero/hero-bg.mp4"
              poster="https://res.cloudinary.com/dogc5wiy4/video/upload/so_0/v1779014961/tirupati/hero/hero-bg.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark overlay so text stays readable */}
            <div className={`absolute inset-0 ${dark ? 'bg-slate-950/80' : 'bg-slate-900/75'}`} />

            {/* All text content — relative so it sits above video */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-orange-400/40 bg-white/10 text-orange-300 backdrop-blur-sm"
              >
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                India's Trusted Metal Casting Partner
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight mb-6 text-white"
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
                className="text-base sm:text-lg leading-relaxed mb-8 max-w-lg text-slate-300"
              >
                {settings.company_name || 'Shri Tirupati Metal Cast'} delivers high-quality grey iron and ductile iron castings for automotive, industrial, and agricultural sectors — engineered with precision, delivered on time.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-3 mb-6"
              >
                {badges.map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border border-white/20 bg-white/10 text-slate-200 backdrop-blur-sm whitespace-nowrap">
                    <Icon size={14} className="text-orange-500" />
                    {label}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/products" className="inline-flex items-center gap-2 px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-200 hover:scale-105 glow-orange text-sm">
                  Explore Products <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 font-bold rounded-xl border-2 border-white/30 text-white hover:border-orange-500 hover:text-orange-400 transition-all duration-200 hover:scale-105 text-sm">
                  Request Quote
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right — Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-10 lg:mt-0 h-full"
          >
            <div className={`relative rounded-3xl overflow-hidden border ${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white shadow-2xl'}`}>
              <div className="relative overflow-hidden bg-black">
                <img
                  src="https://res.cloudinary.com/dogc5wiy4/image/upload/v1779008498/tirupati/hero/hero_chip.jpg"
                  alt="Metal casting process"
                  className="w-full h-auto block"
                />
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
