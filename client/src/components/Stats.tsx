import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../hooks/useSettings';

export default function Stats() {
  const { theme } = useTheme();
  const { settings } = useSettings();
  const dark = theme === 'dark';

  const yearsInBusiness = settings.founded
    ? `${new Date().getFullYear() - parseInt(settings.founded)}+`
    : '25+';

  const stats = [
    { value: yearsInBusiness,          label: 'Years in Business', desc: settings.founded ? `Founded ${settings.founded}` : 'Founded 1999' },
    { value: settings.capacity || '500 MT', label: 'Monthly Capacity',  desc: 'Per month output' },
    { value: settings.clients_served || '200+', label: 'Clients Served',   desc: 'Across 15 countries' },
    { value: settings.delivery_rate || '99%',  label: 'On-Time Delivery', desc: 'Consistent track record' },
  ];

  return (
    <section className={`py-16 ${dark ? 'bg-slate-950' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ value, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5, type: 'spring' }}
              className={`text-center p-6 rounded-2xl border ${
                dark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
              }`}
            >
              <p className="text-orange-500 font-black text-4xl md:text-5xl mb-1">{value}</p>
              <p className={`font-bold text-sm mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>{label}</p>
              <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
