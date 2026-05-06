import { motion } from 'framer-motion';
import { ShieldCheck, Clock, Microscope, BadgeCheck, Leaf, PhoneCall } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const reasons = [
  { icon: ShieldCheck, title: 'Zero-Defect Commitment', desc: 'Rigorous multi-stage quality gates eliminate defects before any component leaves our facility.' },
  { icon: Clock, title: '24-Hour Quotation', desc: 'Send us your drawing today — receive a detailed quote with delivery schedule within 24 hours.' },
  { icon: Microscope, title: 'In-House Lab', desc: 'Full metallurgical lab with spectrometer, tensile testing, and NDT capabilities for every batch.' },
  { icon: BadgeCheck, title: 'ISO 9001:2015', desc: 'Internationally certified quality management system ensuring consistent, documented processes.' },
  { icon: Leaf, title: 'Sustainable Practices', desc: 'Sand reclamation, energy-efficient furnaces, and waste reduction initiatives built into our process.' },
  { icon: PhoneCall, title: 'Dedicated Support', desc: 'Assigned account manager and technical engineer for every client — you\'re never left without help.' },
];

export default function WhyUs() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <section className={`py-20 lg:py-28 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-orange-500 text-sm font-bold tracking-[0.2em] uppercase mb-3 block">Our Edge</span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
            Why Choose <span className="gradient-text">Shri Tirupati</span>
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            We're not just a foundry — we're an engineering partner committed to your success.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              className={`p-6 rounded-2xl border group card-hover ${
                dark
                  ? 'bg-slate-900 border-slate-800 hover:border-orange-500/30'
                  : 'bg-white border-slate-200 hover:border-orange-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 group-hover:bg-orange-500/20 transition-colors">
                  <Icon size={20} className="text-orange-500" />
                </div>
                <div>
                  <h4 className={`font-bold mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
                  <p className={`text-sm leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
