import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const products = [
  {
    category: 'Grey Iron Castings',
    description: 'Versatile, cost-effective castings with excellent damping and machinability for general industrial use.',
    applications: ['Engine blocks', 'Brake drums', 'Pump housings', 'Machine beds'],
    color: 'from-slate-700 to-slate-800',
    accent: '#94a3b8',
    grade: 'IS 210 / ASTM A48',
  },
  {
    category: 'Ductile Iron Castings',
    description: 'High-strength, ductile iron components offering superior impact resistance and mechanical properties.',
    applications: ['Crankshafts', 'Gearboxes', 'Valve bodies', 'Agricultural parts'],
    color: 'from-orange-900 to-orange-800',
    accent: '#f97316',
    grade: 'IS 1865 / ASTM A536',
  },
  {
    category: 'Alloy Steel Castings',
    description: 'Premium alloy steel components engineered for extreme conditions and high-stress environments.',
    applications: ['Mining equipment', 'Railway parts', 'Heavy machinery', 'Pressure vessels'],
    color: 'from-blue-900 to-blue-800',
    accent: '#60a5fa',
    grade: 'IS 1030 / ASTM A148',
  },
  {
    category: 'SG Iron Castings',
    description: 'Spheroidal graphite iron for applications demanding both strength and ductility.',
    applications: ['Hydraulic cylinders', 'Wind turbine parts', 'Auto components', 'Pipes & fittings'],
    color: 'from-emerald-900 to-emerald-800',
    accent: '#34d399',
    grade: 'EN-GJS / ASTM A395',
  },
  {
    category: 'Stainless Steel Castings',
    description: 'Corrosion-resistant precision castings for food, chemical, and marine industries.',
    applications: ['Food processing', 'Chemical pumps', 'Marine fittings', 'Pharmaceutical'],
    color: 'from-violet-900 to-violet-800',
    accent: '#a78bfa',
    grade: 'CF8 / CF8M / CD4MCu',
  },
  {
    category: 'Machined Castings',
    description: 'Fully machined, ready-to-fit castings with tight tolerances to eliminate your in-house machining.',
    applications: ['Engine components', 'Bearing housings', 'Flanges', 'Brackets'],
    color: 'from-rose-900 to-rose-800',
    accent: '#fb7185',
    grade: 'Custom Tolerance',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.55 } }),
};

export default function Products() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

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
              key={product.category}
              initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
              className={`group rounded-2xl overflow-hidden border card-hover ${
                dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white shadow-sm hover:shadow-xl'
              }`}
            >
              {/* Card header */}
              <div className={`bg-gradient-to-br ${product.color} p-6 relative overflow-hidden`}>
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20" style={{ background: product.accent }} />
                <span className="text-xs font-bold tracking-widest uppercase text-white/60">Grade: {product.grade}</span>
                <h3 className="text-white font-black text-xl mt-2">{product.category}</h3>
              </div>

              {/* Card body */}
              <div className="p-6">
                <p className={`text-sm leading-relaxed mb-5 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {product.description}
                </p>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Applications
                  </p>
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
                <a
                  href="#contact"
                  className="text-orange-500 text-sm font-semibold hover:text-orange-400 transition-colors flex items-center gap-1 group-hover:gap-2"
                >
                  Request this casting →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
