import { motion } from 'framer-motion';
import { CheckCircle2, Factory, Users, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const highlights = [
  'State-of-the-art induction furnace technology',
  'CNC machining & precision finishing',
  'In-house quality testing & metallurgical lab',
  'Export capability to 15+ countries',
  'Capacity: 500 MT/month',
  'Custom alloy formulations available',
];

const pillars = [
  { icon: Factory, title: 'Modern Infrastructure', desc: 'Equipped with latest induction melting furnaces, sand testing equipment, and CNC machining centres.' },
  { icon: Users, title: 'Expert Team', desc: 'Over 150 skilled engineers, metallurgists, and quality specialists with decades of foundry experience.' },
  { icon: Globe, title: 'Global Reach', desc: 'Supplying precision castings to clients across India, Europe, USA, and South-East Asia.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6 } }),
};

export default function About() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <section
      id="about"
      className={`py-20 lg:py-28 ${dark ? 'bg-slate-900' : 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
          className="flex flex-col items-center text-center mb-16"
        >
          <span className="text-orange-500 text-sm font-bold tracking-[0.2em] uppercase mb-3">Who We Are</span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
            Crafting Metal with{' '}
            <span className="gradient-text">Purpose</span>
          </h2>
          <p className={`max-w-2xl text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            Shri Tirupati Metal Cast has been a cornerstone of India's casting industry — delivering precision components that power machines, vehicles, and industries worldwide.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left — highlights */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
            <div className={`relative rounded-3xl p-8 border ${dark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full" />
              <h3 className={`text-xl font-bold mb-6 ${dark ? 'text-white' : 'text-slate-900'}`}>
                Why Manufacturers Trust Us
              </h3>
              <ul className="space-y-3">
                {highlights.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 size={18} className="text-orange-500 mt-0.5 shrink-0" />
                    <span className={`text-sm ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{item}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Certification badge */}
              <div className={`mt-8 flex items-center gap-4 p-4 rounded-2xl border ${dark ? 'border-orange-500/20 bg-orange-500/5' : 'border-orange-100 bg-orange-50'}`}>
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-white font-black text-xs text-center leading-tight">ISO<br/>9001</span>
                </div>
                <div>
                  <p className={`font-bold text-sm ${dark ? 'text-white' : 'text-slate-900'}`}>ISO 9001:2015 Certified</p>
                  <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Quality Management System — Certified Since 2005</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — pillars */}
          <div className="space-y-6">
            {pillars.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i + 2} variants={fadeUp}
                className={`flex gap-5 p-6 rounded-2xl border card-hover ${
                  dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-orange-500" />
                </div>
                <div>
                  <h4 className={`font-bold mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
                  <p className={`text-sm leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
