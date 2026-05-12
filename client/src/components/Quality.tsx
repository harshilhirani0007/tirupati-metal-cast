import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, Factory, Star, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../hooks/useSettings';

const qualityHighlights = [
  {
    icon: ShieldCheck,
    title: 'Certified Processes',
    description: 'ISO 9001:2015 certified manufacturing with documented inspections at every stage of casting.',
  },
  {
    icon: Factory,
    title: 'Advanced Foundry Controls',
    description: 'State-of-the-art molding, melting, and finishing systems deliver consistent, repeatable castings.',
  },
  {
    icon: Star,
    title: 'Material Traceability',
    description: 'Batch-level traceability ensures material source, heat treatment, and final inspection records are available.',
  },
];

const qualityPillars = [
  {
    title: 'Precision Inspection',
    details: 'Every casting goes through visual, dimensional, and non-destructive testing to meet customer specifications.',
  },
  {
    title: 'Process Stability',
    details: 'Strict process control minimizes variability so each part performs consistently in demanding applications.',
  },
  {
    title: 'Customer-Centric Audit',
    details: 'Quality is validated by internal audits, customer feedback loops, and continuous improvement programs.',
  },
];

export default function Quality() {
  const { theme } = useTheme();
  const { settings } = useSettings();
  const dark = theme === 'dark';

  return (
    <section
      id="quality"
      className={`relative min-h-screen py-24 ${dark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 text-sm font-semibold mb-6"
            >
              Quality First
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-black leading-tight tracking-tight mb-6"
            >
              <span className="gradient-text">Quality</span> Assurance Built into Every Casting
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className={`max-w-2xl text-lg leading-relaxed sm:text-xl sm:leading-9 mb-8 ${dark ? 'text-slate-400' : 'text-slate-500'}`}
            >
              At {settings.company_name || 'Shri Tirupati Metal Cast'}, quality is not a final checkpoint — it is the foundation of our entire manufacturing workflow. From incoming material inspection to final dispatch, every stage is governed by strict controls, certified standards, and customer-first transparency.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {qualityHighlights.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className={`rounded-3xl border p-6 shadow-sm transition-all duration-200 ${
                    dark
                      ? 'border-slate-800 bg-slate-900 hover:border-orange-500/40'
                      : 'border-slate-200 bg-white hover:border-orange-500/30'
                  }`}
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 mb-4">
                    <Icon size={22} />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{title}</h2>
                  <p className={`text-sm leading-6 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-white font-semibold shadow-lg hover:bg-orange-600 transition-all duration-200"
              >
                Discuss Quality Needs
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/about"
                className={`inline-flex items-center justify-center px-6 py-3 rounded-full border font-semibold transition-all duration-200 ${
                  dark
                    ? 'border-slate-700 text-slate-200 hover:border-orange-500 hover:text-orange-400'
                    : 'border-slate-200 text-slate-700 hover:border-orange-500 hover:text-orange-600'
                }`}
              >
                Learn More About Us
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`rounded-[2rem] overflow-hidden border shadow-2xl ${
              dark
                ? 'border-slate-800 bg-slate-900 shadow-slate-950/20'
                : 'border-slate-200 bg-white shadow-slate-900/10'
            }`}
          >
            <div className={`relative p-8 ${dark ? 'bg-slate-900' : 'bg-white'}`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,146,60,0.15),_transparent_40%)]" />
              <div className="relative space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-3xl bg-orange-500/10 text-orange-500 grid place-items-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-orange-500 font-semibold">Quality Standards</p>
                    <p className="text-lg font-bold">Rigorous checks, real results.</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className={`rounded-3xl border p-5 ${dark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-100 border-slate-200 text-slate-900'}`}>
                    <p className={`text-sm uppercase tracking-[0.18em] mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Inspection</p>
                    <p className="text-base leading-7">Visual, dimensional, and NDT inspections ensure every casting is compliant before shipping.</p>
                  </div>
                  <div className={`rounded-3xl border p-5 ${dark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-100 border-slate-200 text-slate-900'}`}>
                    <p className={`text-sm uppercase tracking-[0.18em] mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Documentation</p>
                    <p className="text-base leading-7">Complete material certificates, heat treatment reports, and test records available on request.</p>
                  </div>
                </div>

                <div className={`rounded-3xl border p-5 ${dark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-100 border-slate-200 text-slate-900'}`}>
                  <p className={`text-sm uppercase tracking-[0.18em] mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Continuous Improvement</p>
                  <p className="text-base leading-7">Our process reviews drive ongoing optimization of defect reduction, lead time, and product consistency.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {qualityPillars.map(({ title, details }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className={`rounded-3xl border p-6 ${dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} shadow-sm`}
            >
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className={`text-sm leading-7 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{details}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
