import { motion } from 'framer-motion';
import { Wrench, FlaskConical, Truck, Headphones, Cpu, ClipboardCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const services = [
  {
    icon: Cpu,
    title: 'Pattern Design & Development',
    desc: 'In-house CAD/CAM pattern design for new product development, rapid tooling, and prototype castings.',
  },
  {
    icon: FlaskConical,
    title: 'Metallurgical Testing',
    desc: 'Spectro analysis, tensile testing, hardness testing, and microstructure examination to ensure alloy compliance.',
  },
  {
    icon: Wrench,
    title: 'CNC Machining',
    desc: 'Complete machining services — turning, milling, drilling, boring — to deliver ready-to-use components.',
  },
  {
    icon: ClipboardCheck,
    title: 'Quality Inspection',
    desc: '100% dimensional inspection, UT/RT/MT NDT testing, and full material certifications with every batch.',
  },
  {
    icon: Truck,
    title: 'Logistics & Packaging',
    desc: 'Export-grade packaging, on-time delivery across India, and FOB/CIF shipments for international clients.',
  },
  {
    icon: Headphones,
    title: 'Technical Support',
    desc: 'Dedicated account managers and metallurgical engineers available to assist at every stage of your project.',
  },
];

export default function Services() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <section id="services" className={`py-20 lg:py-28 ${dark ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-orange-500 text-sm font-bold tracking-[0.2em] uppercase mb-3 block">What We Offer</span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
            End-to-End <span className="gradient-text">Services</span>
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            From raw design to finished part — our integrated services give you a single reliable partner throughout.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              className={`group p-7 rounded-2xl border card-hover relative overflow-hidden ${
                dark
                  ? 'bg-slate-800 border-slate-700 hover:border-orange-500/40'
                  : 'bg-slate-50 border-slate-200 hover:border-orange-300 hover:shadow-lg'
              }`}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors ${
                dark ? 'bg-slate-700 group-hover:bg-orange-500/20' : 'bg-white group-hover:bg-orange-50 shadow-sm'
              }`}>
                <Icon size={22} className="text-orange-500" />
              </div>
              <h3 className={`font-bold text-lg mb-3 ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
              <p className={`text-sm leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>

              {/* Number */}
              <span className={`absolute top-5 right-6 text-5xl font-black opacity-5 ${dark ? 'text-white' : 'text-slate-900'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
