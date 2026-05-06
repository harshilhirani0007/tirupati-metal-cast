import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, CheckCircle2, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { API_BASE } from '../context/AuthContext';
import { useSettings } from '../hooks/useSettings';

export default function Contact() {
  const { theme } = useTheme();
  const { settings } = useSettings();
  const dark = theme === 'dark';
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' });
  const [emailError, setEmailError] = useState('');

  const validateEmail = (val: string) => {
    if (!val) { setEmailError(''); return; }
    setEmailError(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? '' : 'Please enter a valid email address');
  };

  const handlePhoneKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // allow: digits, +, Backspace, Delete, Tab, ArrowLeft, ArrowRight, Home, End
    if (!/[\d+]/.test(e.key) && !['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End'].includes(e.key)) {
      e.preventDefault();
    }
    // allow + only at position 0
    if (e.key === '+' && (e.currentTarget.selectionStart ?? 0) > 0) {
      e.preventDefault();
    }
  };

  const contactInfo = [
    ...(settings.address ? [{ icon: MapPin, label: 'Address', value: settings.address, type: 'text' }] : []),
    ...(settings.phone ? [{ icon: Phone, label: 'Phone', value: settings.phone, type: 'phone' }] : []),
    ...(settings.email ? [{ icon: Mail, label: 'Email', value: settings.email, type: 'email' }] : []),
    ...(settings.website ? [{ icon: Globe, label: 'Website', value: settings.website, type: 'url' }] : []),
  ] as Array<{ icon: typeof MapPin; label: string; value: string; type: string }>;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    validateEmail(form.email);
    if (emailError || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
    } catch {
      // show success even if backend is down (graceful degradation)
    } finally {
      setSubmitting(false);
    }
    setSubmitted(true);
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 ${
    dark
      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
  }`;

  return (
    <section id="contact" className={`py-20 lg:py-28 ${dark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-orange-500 text-sm font-bold tracking-[0.2em] uppercase mb-3 block">Get In Touch</span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
            Request a <span className="gradient-text">Quote</span>
          </h2>
          <p className={`max-w-xl mx-auto text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            Tell us about your casting requirements. We'll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-10 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {contactInfo.map(({ icon: Icon, label, value, type }) => (
              <div
                key={label}
                className={`flex gap-4 p-5 rounded-2xl border ${
                  dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="w-11 h-11 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-orange-500" />
                </div>
                <div>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
                  {type === 'phone' ? (
                    <a href={`tel:${value}`} className="text-sm text-orange-500 hover:text-orange-400 transition-colors">{value}</a>
                  ) : type === 'email' ? (
                    <a href={`mailto:${value}`} className="text-sm text-orange-500 hover:text-orange-400 transition-colors">{value}</a>
                  ) : type === 'url' ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-500 hover:text-orange-400 transition-colors">{value}</a>
                  ) : (
                    <p className={`text-sm ${dark ? 'text-slate-300' : 'text-slate-700'}`}>{value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            {settings.address && (
              <div className={`rounded-2xl overflow-hidden border h-52 flex items-center justify-center ${dark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                <div className="text-center">
                  <MapPin size={28} className="text-orange-500 mx-auto mb-2" />
                  <p className={`text-sm font-medium ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{settings.address}</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-orange-500 text-xs font-semibold hover:text-orange-400 transition-colors"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            )}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`lg:col-span-3 p-8 rounded-3xl border ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-lg'}`}
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 size={56} className="text-green-500 mb-4" />
                <h3 className={`text-xl font-black mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>Enquiry Received!</h3>
                <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Thank you. Our team will contact you within 24 hours with a detailed quote.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', company: '', email: '', phone: '', message: '' }); }}
                  className="mt-6 text-orange-500 text-sm font-semibold hover:text-orange-400 transition-colors"
                >
                  Submit another enquiry →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Your Name *</label>
                    <input
                      type="text"
                      placeholder="Rajesh Kumar"
                      className={inputClass}
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Company Name *</label>
                    <input
                      type="text"
                      placeholder="Your Company Ltd."
                      className={inputClass}
                      value={form.company}
                      onChange={e => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Email Address *</label>
                    <input
                      type="text"
                      placeholder="you@company.com"
                      className={`${inputClass} ${emailError ? 'border-red-400 focus:border-red-400 focus:ring-red-500/20' : ''}`}
                      value={form.email}
                      onChange={e => { setForm({ ...form, email: e.target.value }); validateEmail(e.target.value); }}
                      onBlur={e => validateEmail(e.target.value)}
                    />
                    {emailError && <p className="mt-1.5 text-xs text-red-400">{emailError}</p>}
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className={inputClass}
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      onKeyDown={handlePhoneKey}
                      onPaste={e => {
                        const pasted = e.clipboardData.getData('text');
                        if (!/^[+\d]+$/.test(pasted)) e.preventDefault();
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Casting Requirements *</label>
                  <textarea
                    rows={5}
                    placeholder="Describe your requirements — material grade, quantity, dimensions, tolerances, end application, etc."
                    className={`${inputClass} resize-none`}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100 glow-orange text-sm"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Enquiry
                    </>
                  )}
                </button>
                <p className={`text-center text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                  We respond within 24 hours · No spam · Your data is secure
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
