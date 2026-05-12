import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const testimonials = [
  {
    name: 'Rajesh Mehta',
    role: 'Purchase Manager',
    company: 'Bharat Engineering Works, Pune',
    text: 'Tirupati Metal Cast has been our casting partner for 8 years. Their quality consistency and on-time delivery is unmatched. Zero rejections in our last 3 orders.',
    rating: 5,
  },
  {
    name: 'Priya Krishnamurthy',
    role: 'Supply Chain Head',
    company: 'AgriTech Components, Coimbatore',
    text: 'We shifted to Tirupati after facing quality issues with our previous supplier. The difference is night and day — every batch comes with full test certificates and zero surprises.',
    rating: 5,
  },
  {
    name: 'Suresh Patel',
    role: 'Director',
    company: 'Patel Auto Parts, Rajkot',
    text: 'Their machined castings fit directly into our assembly line. No rework needed. Tirupati\'s technical team helped us optimize the design to reduce weight by 15%.',
    rating: 5,
  },
  {
    name: 'Anand Sharma',
    role: 'GM – Operations',
    company: 'Indo Pumps Ltd, Ahmedabad',
    text: 'Reliable, professional, and technically strong. Tirupati delivered our critical pump body castings with tight tolerances that we couldn\'t get elsewhere at this price point.',
    rating: 5,
  },
];

export default function Testimonials() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <section id="testimonials" className={`py-20 lg:py-28 ${dark ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-orange-500 text-sm font-bold tracking-[0.2em] uppercase mb-3 block">Testimonials</span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className={`max-w-xl mx-auto text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            Trusted by manufacturers across India and beyond.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {testimonials.map(({ name, role, company, text, rating }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              className={`p-7 rounded-2xl border relative ${
                dark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <Quote size={32} className="text-orange-500/20 absolute top-6 right-6" />
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: rating }).map((_, j) => (
                  <Star key={j} size={14} fill="#f97316" className="text-orange-500" />
                ))}
              </div>
              <p className={`text-sm leading-relaxed mb-6 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                "{text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                  {name.charAt(0)}
                </div>
                <div>
                  <p className={`font-bold text-sm ${dark ? 'text-white' : 'text-slate-900'}`}>{name}</p>
                  <p className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{role}, {company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
