import { motion } from 'framer-motion';
import { CheckCircle2, Factory, Users, Globe, Flame, Cog, Hammer } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../hooks/useSettings';

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
  const { settings } = useSettings();
  const dark = theme === 'dark';

  const highlights = [
    'State-of-the-art induction furnace technology',
    'CNC machining & precision finishing',
    'In-house quality testing & metallurgical lab',
    'Export capability to 15+ countries',
    `Capacity: ${settings.capacity || '500 MT'}/month`,
    'Custom alloy formulations available',
  ];

  return (
    <section
      id="about"
      className={`py-20 lg:py-28 ${dark ? 'bg-slate-950' : 'bg-white'}`}
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
            {settings.company_name || 'Shri Tirupati Metal Cast'} has been a cornerstone of India's casting industry — delivering precision components that power machines, vehicles, and industries worldwide.
          </p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
          className={`mb-14 rounded-[2.5rem] p-8 border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
            <div>
              <span className="text-orange-500 text-sm font-semibold uppercase tracking-[0.28em]">Group of Companies</span>
              <h3 className={`mt-3 text-3xl lg:text-4xl font-black tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                Built on Trust, Quality & Precision
              </h3>
            </div>
            <p className={`max-w-lg text-sm leading-7 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
              Our group combines foundry expertise, technology-driven casting, and engineering services to deliver premium metal solutions.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Flame,
                name: 'TIRUPATI FERRO CAST',
                label: 'Foundry Specialists',
              },
              {
                icon: Cog,
                name: 'TIRUPATI TECHNO CAST',
                label: 'Advanced Casting Tech',
              },
              {
                icon: Hammer,
                name: 'TIRUPATI ENGINEERING',
                label: 'Engineering Excellence',
              },
            ].map(({ icon: Icon, name, label }) => (
              <div
                key={name}
                className={`rounded-[2rem] p-6 border shadow-lg transition-transform duration-200 hover:-translate-y-1 ${
                  dark
                    ? 'bg-slate-800 border-slate-700 shadow-slate-950/40'
                    : 'bg-white border-slate-200 shadow-slate-900/10'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-3xl flex items-center justify-center ${dark ? 'bg-orange-500/15 text-orange-400' : 'bg-orange-100 text-orange-500'}`}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-xs uppercase tracking-[0.28em] font-semibold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Core Unit
                  </span>
                </div>
                <h4 className={`text-lg font-bold mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>{name}</h4>
                <p className={`text-sm leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left — highlights */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
            <div className={`relative rounded-3xl p-8 border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
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
                    <span className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-700'}`}>{item}</span>
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
                  dark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
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
