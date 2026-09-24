import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

const DEFAULT_TRADE = {
  eyebrow: 'Industrial & Large-Scale Operations',
  title: 'Engineering High-Volume Global Trade',
  description:
    'Scalable processing, precision container consolidation, and institutional supply chain reliability from farm gate to global port.',
  badge: 'FCL & Multi-Container Consignments',
  items: [
    {
      title: 'Sortex Cleaning & Optical Grading',
      metric: '99.9% Purity',
      subtitle: 'Zero foreign matter tolerance',
      description:
        'Advanced optical Buhler color sorters and gravity separators ensuring clean, uniform export-grade spices and oil seeds.',
      icon: '🔍',
    },
    {
      title: 'Multi-Commodity FCL Consolidation',
      metric: '500+ TEU / yr',
      subtitle: 'Mundra & JNPT Port hubs',
      description:
        'Stuffing multiple distinct agricultural products into single 20ft/40ft ocean containers to optimize buyer inventory turnover.',
      icon: '🚢',
    },
    {
      title: 'MRL & Phytosanitary Lab Clearance',
      metric: 'Zero-Rejection',
      subtitle: 'Certified export compliance',
      description:
        'Comprehensive pre-shipment tests for pesticide residue, aflatoxin, heavy metals, and moisture clearance before sailing.',
      icon: '📋',
    },
    {
      title: 'Institutional Bulk & Private Label',
      metric: 'Custom Pack',
      subtitle: 'Tailored for retail & food service',
      description:
        'From 25kg / 50kg multi-wall paper and PP bags to high-barrier nitrogen-flushed retail standup pouches with buyer branding.',
      icon: '📦',
    },
  ],
};

export default function EngineerTradeSection({ content }) {
  const { t } = useLanguage();
  const trade = content || DEFAULT_TRADE;
  const rawItems = Array.isArray(trade.items) && trade.items.length > 0 ? trade.items : DEFAULT_TRADE.items;
  const items = rawItems.filter((i) => i.isActive !== false);
  const displayItems = items.length > 0 ? items : DEFAULT_TRADE.items;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#193b2a] via-[#214b35] to-[#163324] py-20 text-paper home-reveal-section border-t border-emerald-900/30">
      {/* Background glow accents */}
      <div className="pointer-events-none absolute left-1/4 -top-24 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute right-10 bottom-0 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />

      <div className="container-x relative">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center home-reveal">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold shadow-md backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            {trade.badge || 'Large-Scale Trade Engine'}
          </div>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {trade.title || 'Engineering High-Volume Global Trade'}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-paper/85 sm:text-lg">
            {trade.description ||
              'Scalable processing, precision container consolidation, and institutional supply chain reliability from farm gate to global port.'}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 home-reveal">
          {displayItems.map((item, idx) => (
            <div
              key={item._id || idx}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-[#12281d]/85 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-gold/60 hover:bg-[#173224] hover:shadow-2xl hover:shadow-black/40"
            >
              <div>
                {/* Metric Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="font-mono text-2xl font-extrabold text-gold group-hover:scale-105 transition-transform">
                    {item.metric || `0${idx + 1}`}
                  </span>
                  <span className="text-3xl" aria-hidden="true">
                    {item.icon || '🚢'}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="mt-4 font-display text-lg font-bold text-white group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="mt-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                    {item.subtitle}
                  </p>
                )}

                {/* Description */}
                <p className="mt-3 text-xs leading-relaxed text-paper/75">
                  {item.description}
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="mt-6 flex items-center gap-2 pt-3 border-t border-white/10 text-[11px] font-mono text-gold/90">
                <span>Verified Capability</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gold/30 bg-[#12271d]/90 p-6 shadow-xl backdrop-blur sm:flex-row sm:px-8">
          <div>
            <h4 className="font-display text-base font-bold text-white">
              Planning full container load (FCL) or multi-product shipments?
            </h4>
            <p className="text-xs text-paper/75 mt-0.5">
              Direct liaison with Mundra and JNPT port customs brokers for swift container dispatch.
            </p>
          </div>
          <Link
            to="/inquiry"
            className="shrink-0 rounded-full bg-gold px-6 py-2.5 text-xs font-extrabold text-ink transition-all hover:bg-gold/90 hover:scale-105 shadow-md"
          >
            {t('requestQuote') || 'Request Volume Quotation'} →
          </Link>
        </div>
      </div>
    </section>
  );
}
