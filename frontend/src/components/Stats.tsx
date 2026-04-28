import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const stats = [
  { value: 25, suffix: '+', label: 'Years in Business', desc: 'Founded 1999' },
  { value: 500, suffix: ' MT', label: 'Monthly Capacity', desc: 'Per month output' },
  { value: 200, suffix: '+', label: 'Clients Served', desc: 'Across 15 countries' },
  { value: 99, suffix: '%', label: 'On-Time Delivery', desc: 'Consistent track record' },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [started, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Stats() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  return (
    <section className={`py-16 ${dark ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ value, suffix, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5, type: 'spring' }}
              className={`text-center p-6 rounded-2xl border ${
                dark ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-slate-50'
              }`}
            >
              <p className="text-orange-500 font-black text-4xl md:text-5xl mb-1">
                <Counter value={value} suffix={suffix} />
              </p>
              <p className={`font-bold text-sm mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>{label}</p>
              <p className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
