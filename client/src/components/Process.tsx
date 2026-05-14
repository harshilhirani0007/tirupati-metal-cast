import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const steps = [
  {
    step: '01',
    title: 'Furnace',
    desc: 'Medium frequency induction melting furnaces ensure optimal metal availability, power efficiency, and precise chemical composition before every pour.',
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778778951/tirupati/process/foundry-img2.jpg',
    tag: 'Melting',
  },
  {
    step: '02',
    title: 'No-Bake Moulding',
    desc: 'Our primary moulding process (85% of capacity) delivers exceptional dimensional accuracy and superior surface finish for frames, end-shields, gearboxes, and pump castings.',
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778778953/tirupati/process/foundry-img3.jpg',
    tag: 'Moulding',
  },
  {
    step: '03',
    title: 'Moulding Line',
    desc: 'Omega Sinto (UK) automated fast-loop moulding line — one of its kind in India — handling castings from 80 kg to 600 kg with 50 moulds per hour capacity.',
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778778954/tirupati/process/foundry-img4.jpg',
    tag: 'Automation',
  },
  {
    step: '04',
    title: 'Hand Moulding',
    desc: 'Single-piece castings from 30 kg to 3000 kg for electric motors, end shields, valve components, gearboxes, foundation plates, and machine tool castings.',
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778780279/tirupati/process/foundry-img1.jpg',
    tag: 'Precision',
  },
  {
    step: '05',
    title: 'Green Sand Process',
    desc: 'ARPA 450 moulding line for lighter castings (10–80 kg). Ideal for endshields, alternator parts, valve castings, and bearing housing covers with cost-effective output.',
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778778956/tirupati/process/foundry-img6.jpg',
    tag: 'Sand Casting',
  },
  {
    step: '06',
    title: 'Core Shop',
    desc: 'Shell moulding, cold box, and furan no-bake processes produce precision cores in varied sizes and shapes, balancing economy and perfection for each product.',
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778778957/tirupati/process/foundry-img7.jpg',
    tag: 'Core Making',
  },
  {
    step: '07',
    title: 'Shot Blasting & Fettling',
    desc: 'Hanger-type and tumblast shot blasting machines combined with latest grinding technology ensure every casting has a clean, well-finished surface before inspection.',
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778778958/tirupati/process/foundry-img8.jpg',
    tag: 'Finishing',
  },
  {
    step: '08',
    title: 'Paint Shop',
    desc: 'Flow coating, spray coating, and dipping processes strictly adhering to C3 & C5 painting standards. Every painted casting undergoes DFT and cross-cut quality checks.',
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778778960/tirupati/process/foundry-img9.jpg',
    tag: 'Coating',
  },
  {
    step: '09',
    title: 'Pattern Shop',
    desc: "Customer patterns are maintained and managed in-house. Pattern procurement is coordinated with India's best pattern manufacturers when new tooling is required.",
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778778961/tirupati/process/foundry-img10.jpg',
    tag: 'Tooling',
  },
];

export default function Process() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <section id="process" className={`py-16 sm:py-24 lg:py-32 overflow-hidden ${dark ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20 lg:mb-24"
        >
          <span className="text-orange-500 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase mb-4 block">How We Work</span>
          <h2 className={`text-3xl sm:text-5xl lg:text-6xl font-black mb-5 leading-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
            Our Casting <span className="gradient-text">Process</span>
          </h2>
          <p className={`max-w-2xl mx-auto text-sm sm:text-lg ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Nine precision-engineered stages that take raw metal to a finished, certified casting — every time, without compromise.
          </p>
          {/* Step indicators strip */}
          <div className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
            {steps.map(({ step }) => (
              <div key={step} className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                  <span className="text-orange-500 font-bold text-[10px]">{step}</span>
                </div>
                {parseInt(step) < 9 && (
                  <div className={`w-4 h-px ${dark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Steps — editorial alternating layout */}
        <div className="space-y-0">
          {steps.map(({ step, title, desc, image, tag }, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65 }}
                className={`relative flex flex-col lg:flex-row lg:min-h-[420px] ${!isEven ? 'lg:flex-row-reverse' : ''} mb-4 lg:mb-6 rounded-3xl overflow-hidden border ${
                  dark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50'
                }`}
              >
                {/* Image — 55% width on desktop */}
                <div className="relative w-full lg:w-[55%] h-64 sm:h-80 lg:h-auto overflow-hidden shrink-0">
                  <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 ${
                    isEven
                      ? 'bg-gradient-to-r from-transparent via-transparent to-black/30 lg:to-black/50'
                      : 'bg-gradient-to-l from-transparent via-transparent to-black/30 lg:to-black/50'
                  }`} />
                  {/* Tag badge */}
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                      {tag}
                    </span>
                  </div>
                </div>

                {/* Content — 45% width on desktop */}
                <div className={`relative flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 lg:w-[45%] ${
                  dark ? 'bg-slate-900' : 'bg-slate-50'
                }`}>
                  {/* Large step number watermark */}
                  <div
                    className={`absolute select-none pointer-events-none font-black text-[7rem] sm:text-[9rem] lg:text-[11rem] leading-none ${
                      isEven ? 'right-4 lg:right-6' : 'left-4 lg:left-6'
                    } top-1/2 -translate-y-1/2 ${dark ? 'text-slate-800' : 'text-slate-100'}`}
                  >
                    {step}
                  </div>

                  <div className="relative z-10">
                    {/* Step label */}
                    <p className="text-orange-500 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-3">
                      Step {step} / 09
                    </p>

                    {/* Title */}
                    <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
                      {title}
                    </h3>

                    {/* Divider */}
                    <div className="w-12 h-1 rounded-full bg-orange-500 mb-5" />

                    {/* Description */}
                    <p className={`text-sm sm:text-base leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {desc}
                    </p>

                    {/* Progress dots */}
                    <div className="flex gap-2 mt-8">
                      {steps.map((_, di) => (
                        <div
                          key={di}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            di === i
                              ? 'w-6 bg-orange-500'
                              : di < i
                              ? `w-3 ${dark ? 'bg-slate-600' : 'bg-slate-300'}`
                              : `w-3 ${dark ? 'bg-slate-800' : 'bg-slate-200'}`
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 sm:mt-16 rounded-3xl bg-gradient-to-r from-orange-600 to-orange-500 p-8 md:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative"
        >
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

          <div className="text-center sm:text-left relative">
            <h3 className="text-white font-black text-2xl sm:text-3xl md:text-4xl mb-2">
              Ready to start your project?
            </h3>
            <p className="text-orange-100 text-sm sm:text-base">
              Send us your drawing and receive a detailed quote within 24 hours.
            </p>
          </div>
          <Link
            to="/contact"
            className="relative shrink-0 w-full sm:w-auto text-center px-8 py-4 bg-white text-orange-600 font-black rounded-2xl hover:bg-orange-50 transition-all duration-200 hover:scale-105 shadow-xl text-sm"
          >
            Get Free Quote →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
