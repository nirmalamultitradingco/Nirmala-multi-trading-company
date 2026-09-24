import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import SectionHeading from '../components/SectionHeading.jsx';
import PartnerCard from '../components/PartnerCard.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { BRAND } from '../config.js';

export default function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    api
      .get('/partners')
      .then((r) => setPartners(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-x py-14 md:py-20 space-y-16">
      {/* 1. SECTION HEADER WITH BECOME A PARTNER ACTION BUTTON */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <SectionHeading eyebrow={t('collaborations')} title={t('companiesWeWorkWith')}>
            {t('partnersIntro') ||
              'Trusted Indian agricultural growers, mills, and food manufacturing enterprises whose products we export globally.'}
          </SectionHeading>

          <Link
            to="/become-a-partner"
            className="btn-primary shrink-0 text-sm font-bold shadow-md hover:shadow-lg flex items-center gap-2 self-start sm:self-end"
          >
            <span>🤝</span>
            <span>Become a Partner →</span>
          </Link>
        </div>

        {/* Partners Grid */}
        {loading ? (
          <Loader />
        ) : partners.length === 0 ? (
          <div className="mt-10">
            <EmptyState title={t('noPartners')} hint={t('addPartners')} />
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p) => (
              <PartnerCard key={p._id} partner={p} />
            ))}
          </div>
        )}
      </section>

      {/* 2. HIGH-IMPACT "BECOME A PARTNER" HERO CTA BANNER */}
      <section className="relative overflow-hidden rounded-3xl bg-forest px-8 py-14 text-paper md:px-14 shadow-2xl">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-black/20 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="rounded-full bg-gold/20 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-gold border border-gold/30">
              Supplier & Producer Onboarding
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Expand Your Food Products Worldwide with {BRAND.name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-paper/80 sm:text-base">
              Are you an Indian food manufacturer, miller, farmer producer organization (FPO), or spice processor? Partner with Nirmala Multi Trading Co. for scheduled container consignments from Mundra and JNPT to 40+ destination countries.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-paper/90">
              <span className="flex items-center gap-1.5">
                <span className="text-gold">✓</span> Direct Overseas Supermarket Placement
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-gold">✓</span> Transparent Export Pricing & Assured Payments
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-gold">✓</span> Export Compliance & Lab Assay Support
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              to="/become-a-partner"
              className="btn-gold px-8 py-3.5 text-center text-sm font-bold shadow-lg hover:shadow-xl transition"
            >
              Become a Partner Form →
            </Link>
            <Link
              to="/inquiry"
              className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-center text-xs font-semibold text-paper transition hover:bg-white/20"
            >
              Contact Procurement Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
