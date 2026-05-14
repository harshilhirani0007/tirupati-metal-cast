import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const steps = [
  {
    step: '01',
    title: 'Furnace',
    desc: 'Medium frequency induction melting furnaces ensure optimal metal availability, power efficiency, and precise chemical composition before every pour.',
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778778951/tirupati/process/foundry-img2.jpg',
  },
  {
    step: '02',
    title: 'No-Bake Moulding',
    desc: 'Our primary moulding process (85% of capacity) delivers exceptional dimensional accuracy and superior surface finish for frames, end-shields, gearboxes, and pump castings.',
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778778953/tirupati/process/foundry-img3.jpg',
  },
  {
    step: '03',
    title: 'Moulding Line',
    desc: 'Omega Sinto (UK) automated fast-loop moulding line — one of its kind in India — handling castings from 80 kg to 600 kg with 50 moulds per hour capacity.',
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778778954/tirupati/process/foundry-img4.jpg',
  },
  {
    step: '04',
    title: 'Hand Moulding',
    desc: 'Single-piece castings from 30 kg to 3000 kg for electric motors, end shields, valve components, gearboxes, foundation plates, and machine tool castings.',
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778778955/tirupati/process/foundry-img5.jpg',
  },
  {
    step: '05',
    title: 'Green Sand Process',
    desc: 'ARPA 450 moulding line for lighter castings (10–80 kg). Ideal for endshields, alternator parts, valve castings, and bearing housing covers with cost-effective output.',
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778778956/tirupati/process/foundry-img6.jpg',
  },
  {
    step: '06',
    title: 'Core Shop',
    desc: 'Shell moulding, cold box, and furan no-bake processes produce precision cores in varied sizes and shapes, balancing economy and perfection for each product.',
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778778957/tirupati/process/foundry-img7.jpg',
  },
  {
    step: '07',
    title: 'Shot Blasting & Fettling',
    desc: 'Hanger-type and tumblast shot blasting machines combined with latest grinding technology ensure every casting has a clean, well-finished surface before inspection.',
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778778958/tirupati/process/foundry-img8.jpg',
  },
  {
    step: '08',
    title: 'Paint Shop',
    desc: 'Flow coating, spray coating, and dipping processes strictly adhering to C3 & C5 painting standards. Every painted casting undergoes DFT and cross-cut quality checks.',
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778778960/tirupati/process/foundry-img9.jpg',
  },
  {
    step: '09',
    title: 'Pattern Shop',
    desc: "Customer patterns are maintained and managed in-house. Pattern procurement is coordinated with India's best pattern manufacturers when new tooling is required.",
    image: 'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778778961/tirupati/process/foundry-img10.jpg',
  },
];

export default function Process() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <section id="process" className={`py-16 sm:py-20 lg:py-28 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          <span className="text-orange-500 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-3 block">How We Work</span>
          <h2 className={`text-2xl sm:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
            Our Casting <span className="gradient-text">Process</span>
          </h2>
          <p className={`max-w-xl mx-auto text-sm sm:text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            A proven, repeatable process — from pattern to finished casting — with quality built in at every stage.
          </p>
        </motion.div>

        {/* Mobile: vertical stack | Tablet: 2-col | Desktop: 3-col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {steps.map(({ step, title, desc, image }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className={`rounded-2xl overflow-hidden border group ${
                dark
                  ? 'bg-slate-900 border-slate-800 hover:border-orange-500/30'
                  : 'bg-white border-slate-200 hover:border-orange-300 shadow-sm hover:shadow-lg'
              } transition-all duration-300`}
            >
              {/* Image — taller on mobile for visual impact */}
              <div className="relative h-44 sm:h-48 lg:h-52 overflow-hidden">
                <img
                  src={image}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Dark overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Step badge — top left */}
                <div className="absolute top-3 left-3 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xs">{step}</span>
                </div>

                {/* Title overlaid at bottom on mobile for compact look */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 sm:hidden">
                  <h4 className="text-white font-bold text-sm leading-tight">{title}</h4>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                {/* Title hidden on mobile (shown in image overlay), visible sm+ */}
                <h4 className={`hidden sm:block font-bold text-sm sm:text-base mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
                  {title}
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 sm:mt-16 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-orange-600 to-orange-500 p-6 sm:p-8 md:p-12 flex flex-col sm:flex-row items-center justify-between gap-5"
        >
          <div className="text-center sm:text-left">
            <h3 className="text-white font-black text-xl sm:text-2xl md:text-3xl mb-1 sm:mb-2">
              Ready to start your project?
            </h3>
            <p className="text-orange-100 text-sm md:text-base">
              Send us your drawing and get a quote within 24 hours.
            </p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 w-full sm:w-auto text-center px-7 py-3 sm:py-4 bg-white text-orange-600 font-black rounded-xl sm:rounded-2xl hover:bg-orange-50 transition-all duration-200 hover:scale-105 shadow-lg text-sm"
          >
            Get Free Quote →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
