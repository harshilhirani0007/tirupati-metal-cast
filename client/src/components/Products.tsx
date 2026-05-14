import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { API_BASE } from '../context/AuthContext';
import { Product } from '../types';

// 5 gallery images per product, matched by category name
const GALLERIES: Record<string, string[]> = {
  'CI Casting Counter Weight': [
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778782989/tirupati/gallery/ci-counter-weight/ci_casting_1.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778782990/tirupati/gallery/ci-counter-weight/ci_casting_2.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778782991/tirupati/gallery/ci-counter-weight/ci_casting_3.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778782992/tirupati/gallery/ci-counter-weight/ci_casting_4.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778782994/tirupati/gallery/ci-counter-weight/ci_casting_5.jpg',
  ],
  'Grey Iron Castings': [
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778783975/tirupati/gallery/grey-iron/pump_1.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778783976/tirupati/gallery/grey-iron/pump_2.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778783977/tirupati/gallery/grey-iron/pump_3.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778783978/tirupati/gallery/grey-iron/vibro_1.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778783980/tirupati/gallery/grey-iron/vibro_2.jpg',
  ],
  'Ductile Iron Castings': [
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778781386/tirupati/gallery/ductile-iron/elecmotor_1.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778781387/tirupati/gallery/ductile-iron/elecmotor_2.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778781388/tirupati/gallery/ductile-iron/elecmotor_3.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778781389/tirupati/gallery/ductile-iron/elecmotor_4.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778781390/tirupati/gallery/ductile-iron/elecmotor_5.jpg',
  ],
  'SG Iron Castings': [
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778781392/tirupati/gallery/sg-iron/gearbox_1.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778781393/tirupati/gallery/sg-iron/gearbox_2.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778781394/tirupati/gallery/sg-iron/gearbox_3.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778781395/tirupati/gallery/sg-iron/gearbox_4.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778781396/tirupati/gallery/sg-iron/gearbox_5.jpg',
  ],
  'Machined Castings': [
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778781397/tirupati/gallery/machined-castings/endshield_1.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778781399/tirupati/gallery/machined-castings/endshield_2.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778781401/tirupati/gallery/machined-castings/endshield_3.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778781402/tirupati/gallery/machined-castings/endshield_4.jpg',
    'https://res.cloudinary.com/dogc5wiy4/image/upload/v1778781404/tirupati/gallery/machined-castings/endshield_5.jpg',
  ],
};

function Lightbox({ images, index, onClose, onPrev, onNext }: {
  images: string[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
        <X size={20} />
      </button>
      <button onClick={e => { e.stopPropagation(); onPrev(); }} className="absolute left-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
        <ChevronLeft size={24} />
      </button>
      <motion.img
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        src={images[index]}
        alt=""
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
        onClick={e => e.stopPropagation()}
      />
      <button onClick={e => { e.stopPropagation(); onNext(); }} className="absolute right-4 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
        <ChevronRight size={24} />
      </button>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-orange-500 w-5' : 'bg-white/40'}`} />
        ))}
      </div>
    </motion.div>
  );
}

function ProductSection({ product, i, dark }: { product: Product; i: number; dark: boolean }) {
  const gallery = GALLERIES[product.category] ?? (product.image_url ? [product.image_url] : []);
  const [mainImg, setMainImg] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const isOdd = i % 2 !== 0;

  return (
    <>
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            images={gallery}
            index={lightbox}
            onClose={() => setLightbox(null)}
            onPrev={() => setLightbox(p => (p! - 1 + gallery.length) % gallery.length)}
            onNext={() => setLightbox(p => (p! + 1) % gallery.length)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
        className={`rounded-2xl sm:rounded-3xl overflow-hidden border ${
          dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-lg shadow-slate-100'
        }`}
      >
        <div className={`flex flex-col ${isOdd ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>

          {/* ── Image Gallery Side ── */}
          <div className="lg:w-[58%] flex flex-col gap-2 p-3 sm:p-4">
            {/* Main large image */}
            <div
              className={`relative w-full rounded-xl sm:rounded-2xl overflow-hidden cursor-zoom-in flex items-center justify-center ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}
              style={{ height: '260px', minHeight: '220px' }}
              onClick={() => setLightbox(mainImg)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={mainImg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  src={gallery[mainImg]}
                  alt={product.category}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 p-2"
                />
              </AnimatePresence>
              {/* Zoom hint */}
              <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/50 text-white text-[10px] font-medium backdrop-blur-sm opacity-0 group-hover:opacity-100">
                Click to zoom
              </div>
              {/* Image counter */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-bold backdrop-blur-sm">
                {mainImg + 1} / {gallery.length}
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="grid grid-cols-5 gap-2">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImg(idx)}
                  className={`relative rounded-lg sm:rounded-xl overflow-hidden aspect-square border-2 transition-all duration-200 ${
                    mainImg === idx
                      ? 'border-orange-500 scale-95 shadow-lg shadow-orange-500/30'
                      : dark
                        ? 'border-slate-700 hover:border-slate-500 opacity-60 hover:opacity-100'
                        : 'border-slate-200 hover:border-slate-400 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-1" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Info Side ── */}
          <div className={`lg:w-[42%] flex flex-col justify-center p-5 sm:p-7 lg:p-8 ${
            dark ? 'border-t lg:border-t-0 border-slate-800' : 'border-t lg:border-t-0 border-slate-100'
          } ${isOdd ? 'lg:border-r lg:border-l-0' : 'lg:border-l lg:border-r-0'} ${dark ? 'lg:border-slate-800' : 'lg:border-slate-100'}`}>

            {/* Step number */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
                <span className="text-white font-black text-sm">0{product.sort_order}</span>
              </div>
              <span className={`text-xs font-bold uppercase tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                {product.grade}
              </span>
            </div>

            {/* Title */}
            <h3 className={`text-2xl sm:text-3xl font-black leading-tight mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
              {product.category}
            </h3>
            <div className="w-10 h-1 rounded-full bg-orange-500 mb-4" />

            {/* Description */}
            <p className={`text-sm leading-relaxed mb-6 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
              {product.description}
            </p>

            {/* Applications */}
            {product.applications?.length > 0 && (
              <div className="mb-7">
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Key Applications
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.applications.map(app => (
                    <span
                      key={app}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        dark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Photo count note */}
            <p className={`text-xs mb-5 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
              📷 {gallery.length} product photos — click any thumbnail to browse
            </p>

            {/* CTA */}
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-all duration-200 hover:scale-105 shadow-lg shadow-orange-500/20 w-fit"
            >
              Request a Quote <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default function Products() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then(r => r.json() as Promise<Product[]>)
      .then(setProducts)
      .catch(() => {});
  }, []);

  return (
    <section id="products" className={`py-16 sm:py-20 lg:py-28 overflow-x-hidden ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-orange-500 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-3 block">What We Make</span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
            Our <span className="gradient-text">Product Range</span>
          </h2>
          <p className={`max-w-2xl mx-auto text-sm sm:text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            From grey iron to precision machined castings — click any photo to explore our work up close.
          </p>
        </motion.div>

        {/* Product sections */}
        <div className="space-y-5 sm:space-y-6 lg:space-y-8">
          {products.map((product, i) => (
            <ProductSection key={product.id} product={product} i={i} dark={dark} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`mt-10 sm:mt-14 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 border ${
            dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div>
            <p className={`font-bold text-lg mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>
              Need a custom casting specification?
            </p>
            <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
              We manufacture to your drawing, grade, and tolerance — no minimum order quantity.
            </p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-all duration-200 hover:scale-105 shadow-lg shadow-orange-500/20"
          >
            Request Custom Quote <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
