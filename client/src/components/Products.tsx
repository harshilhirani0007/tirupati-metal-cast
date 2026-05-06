import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { API_BASE } from '../context/AuthContext';
import { Product } from '../types';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.55 } }),
};

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
    <section id="products" className={`py-20 lg:py-28 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-orange-500 text-sm font-bold tracking-[0.2em] uppercase mb-3 block">What We Make</span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
            Our <span className="gradient-text">Product Range</span>
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            From grey iron to exotic alloys — we cast the components that keep industry moving.
          </p>
        </motion.div>

        {/* Product grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className={`group flex flex-col rounded-3xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                dark
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:shadow-black/40'
                  : 'bg-white border-slate-200 hover:border-orange-200 hover:shadow-orange-500/10'
              }`}
            >
              {/* ── Image / Gradient header ── */}
              <div className={`relative overflow-hidden bg-gradient-to-br ${product.color}`} style={{ height: '220px' }}>
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.category}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                ) : (
                  /* No image — decorative gradient placeholder */
                  <>
                    <div className="absolute inset-0 opacity-30"
                      style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.25) 0%, transparent 60%)' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Layers size={52} className="text-white/15" />
                    </div>
                  </>
                )}

                {/* Always-visible gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Category + grade pinned to bottom of image */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-1">
                    {product.grade}
                  </p>
                  <h3 className="text-white font-black text-xl leading-tight drop-shadow-sm">
                    {product.category}
                  </h3>
                </div>
              </div>

              {/* ── Card body ── */}
              <div className="flex flex-col flex-1 p-6">
                <p className={`text-sm leading-relaxed flex-1 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {product.description}
                </p>

                {/* Applications */}
                {product.applications.length > 0 && (
                  <div className="mt-5">
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-2.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                      Applications
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {product.applications.map(app => (
                        <span
                          key={app}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                            dark
                              ? 'bg-slate-800 text-slate-300 border border-slate-700'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className={`mt-6 pt-5 border-t ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <Link
                    to="/contact"
                    className="flex items-center gap-2 text-orange-500 text-sm font-bold hover:text-orange-400 transition-colors group/link"
                  >
                    Request this casting
                    <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
