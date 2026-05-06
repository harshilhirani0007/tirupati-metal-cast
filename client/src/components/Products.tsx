import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { API_BASE } from '../context/AuthContext';
import { Product } from '../types';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.55 } }),
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
              className={`group rounded-2xl overflow-hidden border card-hover ${
                dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white shadow-sm hover:shadow-xl'
              }`}
            >
              {/* Card header — image or gradient */}
              <div className={`relative h-44 bg-gradient-to-br ${product.color} overflow-hidden`}>
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <>
                    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 bg-white" />
                    <div className="absolute inset-0 flex items-end p-6">
                      <div>
                        <span className="text-xs font-bold tracking-widest uppercase text-white/60 block mb-1">Grade: {product.grade}</span>
                        <h3 className="text-white font-black text-xl">{product.category}</h3>
                      </div>
                    </div>
                  </>
                )}
                {product.image_url && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                    <div>
                      <span className="text-xs font-bold tracking-widest uppercase text-white/60 block mb-1">Grade: {product.grade}</span>
                      <h3 className="text-white font-black text-lg leading-tight">{product.category}</h3>
                    </div>
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="p-6">
                {!product.image_url && (
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Grade: {product.grade}</p>
                )}
                <p className={`text-sm leading-relaxed mb-5 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {product.description}
                </p>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Applications</p>
                  <div className="flex flex-wrap gap-2">
                    {product.applications.map(app => (
                      <span
                        key={app}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                          dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card footer */}
              <div className={`px-6 py-4 border-t ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
                <Link
                  to="/contact"
                  className="text-orange-500 text-sm font-semibold hover:text-orange-400 transition-colors flex items-center gap-1 group-hover:gap-2"
                >
                  Request this casting →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
