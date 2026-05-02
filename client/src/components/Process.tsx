import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const steps = [
  {
    step: '01',
    title: 'Requirement Analysis',
    desc: 'Our engineers review your drawing or sample, analyze material specs, and provide a detailed feasibility report.',
  },
  {
    step: '02',
    title: 'Pattern & Tooling',
    desc: 'CAD-based pattern design and tooling fabrication, ensuring dimensional accuracy from the first pour.',
  },
  {
    step: '03',
    title: 'Melting & Pouring',
    desc: 'Induction furnace melting with real-time spectro analysis ensures the correct chemical composition before pour.',
  },
  {
    step: '04',
    title: 'Shakeout & Cleaning',
    desc: 'Shot blasting, fettling, and grinding remove all residual sand and ensure a clean surface finish.',
  },
  {
    step: '05',
    title: 'Heat Treatment',
    desc: 'Annealing, normalizing, or quench-and-temper processes applied to achieve specified mechanical properties.',
  },
  {
    step: '06',
    title: 'Quality & Dispatch',
    desc: 'Full dimensional inspection, NDT testing, and packing before dispatch with material test certificates.',
  },
];

export default function Process() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <section id="process" className={`py-20 lg:py-28 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-orange-500 text-sm font-bold tracking-[0.2em] uppercase mb-3 block">How We Work</span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
            Our Casting <span className="gradient-text">Process</span>
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            A proven, repeatable process — from concept to finished casting — with quality built in at every stage.
          </p>
        </motion.div>

        {/* Steps timeline */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className={`hidden lg:block absolute top-10 left-0 right-0 h-px ${dark ? 'bg-slate-800' : 'bg-slate-200'}`} />

          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-8">
            {steps.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                className="relative text-center lg:text-left"
              >
                {/* Step circle */}
                <div className="relative z-10 flex lg:block justify-center mb-5">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-orange-500 ${
                    dark ? 'bg-slate-900' : 'bg-white shadow-md'
                  }`}>
                    <span className="text-orange-500 font-black text-2xl">{step}</span>
                  </div>
                </div>
                <h4 className={`font-bold text-base mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
                <p className={`text-xs leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 rounded-3xl bg-gradient-to-r from-orange-600 to-orange-500 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="text-white font-black text-2xl md:text-3xl mb-2">Ready to start your project?</h3>
            <p className="text-orange-100 text-sm md:text-base">Send us your drawing and get a quote within 24 hours.</p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 px-8 py-4 bg-white text-orange-600 font-black rounded-2xl hover:bg-orange-50 transition-all duration-200 hover:scale-105 shadow-lg text-sm"
          >
            Get Free Quote →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
