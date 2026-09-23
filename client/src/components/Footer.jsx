import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../config.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import api from '../api/axios.js';

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) return;

    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await api.post('/subscribers', { email: email.trim(), source: 'footer' });
      setStatus({ type: 'success', message: res.data?.message || 'Subscribed successfully!' });
      setEmail('');
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Subscription failed. Please check your email and try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="mt-24 border-t border-line bg-ink text-paper/80">
      {/* Newsletter Strip */}
      <div className="border-b border-white/10 bg-white/[0.02]">
        <div className="container-x py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-gold">
                <span>✉️</span> {t('newsletterTitle') || 'Exporter Market Intelligence'}
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">
                {t('stayUpdated') || 'Get Instant Agro Market & Harvest Updates'}
              </h3>
              <p className="mt-1.5 text-sm text-paper/70 leading-relaxed">
                {t('newsletterDesc') || 'Subscribe to receive immediate alerts when new agro commodities, spices, or market trade reports are published.'}
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full max-w-md">
              <div className="relative flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder={t('enterYourEmail') || 'Enter your business email…'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-paper/40 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-gold px-6 py-3 text-sm font-bold text-ink shadow-md transition hover:bg-gold/90 disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center gap-1.5">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
                      <span>{t('subscribing') || 'Joining…'}</span>
                    </span>
                  ) : (
                    <span>{t('subscribe') || 'Subscribe'} →</span>
                  )}
                </button>
              </div>

              {status.message && (
                <p
                  className={`mt-2.5 text-xs font-medium ${
                    status.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2.5">
            <img src="/NMC logo.png" alt={BRAND.name} className="h-12 w-auto object-contain" />
            <span className="flex flex-col font-display leading-tight">
              <strong className="text-lg font-extrabold text-paper">{BRAND.fullName}</strong>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/65">{BRAND.blurb}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-mono text-paper/50">
            <span className="rounded bg-white/5 px-2 py-0.5 border border-white/10">APEDA REG.</span>
            <span className="rounded bg-white/5 px-2 py-0.5 border border-white/10">SPICE BOARD INDIA</span>
            <span className="rounded bg-white/5 px-2 py-0.5 border border-white/10">FSSAI CERTIFIED</span>
            <span className="rounded bg-white/5 px-2 py-0.5 border border-white/10">MUNDRA PORT (INMUN1)</span>
          </div>
        </div>

        <div>
          <p className="eyebrow text-gold font-mono">{t('explore')}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-paper transition">{t('products') || 'Products'}</Link></li>
            <li><Link to="/partners" className="hover:text-paper transition">{t('partners')}</Link></li>
            <li><Link to="/brochures" className="hover:text-paper transition">{t('brochures')}</Link></li>
            <li><Link to="/blog" className="hover:text-paper transition">{t('blog') || 'Blog'}</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-gold font-mono">{t('contact')}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href={`mailto:${BRAND.email}`} className="hover:text-paper transition">{BRAND.email}</a></li>
            <li>{BRAND.phone}</li>
            <li>{BRAND.address}</li>
            <li className="pt-1">
              <Link to="/inquiry" className="text-gold font-semibold hover:underline inline-flex items-center gap-1">
                <span>{t('sendInquiryArrow') || 'Request FOB / CIF Quote'}</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-paper/50 sm:flex-row">
          <span>© {BRAND.year} {BRAND.fullName}. {t('allRightsReserved')}</span>
          <Link to="/admin/login" className="hover:text-paper/80 font-mono">{t('admin') || 'Admin Login'}</Link>
        </div>
      </div>
    </footer>
  );
}
