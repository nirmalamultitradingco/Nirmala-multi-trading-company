import { Link } from 'react-router-dom';
import { asset } from '../../api/axios.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

/**
 * Modern Split Card matching NMC Brand identity:
 * Left side: Bold, clean typography with Forest Green & Gold accents
 * Right side: Packshot standing tall with realistic drop shadow
 */
export function SplitProductCard({ product }) {
  const { t } = useLanguage();

  return (
    <Link
      to={`/product-details/${product.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e8e2d5] bg-[#faf8f4] p-6 sm:p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_35px_rgb(22,56,43,0.08)] hover:border-gold/60"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left Column: Bold Multi-Line Typography & Specs */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            {product.segment?.name && (
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-forest">
                {product.segment.name}
              </span>
            )}
            <h3 className="mt-2 font-display text-xl sm:text-2xl font-black leading-tight text-ink group-hover:text-forest transition-colors">
              {product.name}
            </h3>
            {product.shortDescription && (
              <p className="mt-2 line-clamp-2 text-xs text-ink/65 leading-relaxed">
                {product.shortDescription}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-mono text-ink/50">
            {product.hsCode && (
              <span className="rounded-md bg-white px-2 py-0.5 border border-line/70">
                HS {product.hsCode}
              </span>
            )}
            {product.origin && (
              <span className="rounded-md bg-white px-2 py-0.5 border border-line/70">
                📍 {product.origin}
              </span>
            )}
            <span className="inline-flex items-center text-forest font-bold mt-1 group-hover:text-gold group-hover:translate-x-1 transition-all">
              {t('viewProduct') || 'View Details'} →
            </span>
          </div>
        </div>

        {/* Right Column: Standup Packshot Image with Drop Shadow */}
        <div className="relative flex shrink-0 items-center justify-center w-28 sm:w-36 h-36 sm:h-44">
          {product.image ? (
            <img
              src={asset(product.image)}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-contain filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.12)] transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_18px_24px_rgba(22,56,43,0.2)]"
              onError={(e) => {
                e.target.src = '/NMC logo.png';
              }}
            />
          ) : (
            <div className="grid h-full w-full place-items-center rounded-2xl bg-line/20 font-mono text-xs text-ink/30">
              {t('noImage')}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

/**
 * Bento Highlight Feature Banner (NMC Brand Forest Green & Gold)
 */
export function BentoHighlightCard({
  badge,
  title = 'Export Purity, Perfected',
  subtitle = 'Light, crispy snack foods & pure farm harvests crafted with uncompromising international food standards.',
  bullet,
  bullets,
  buttonText,
  buttonLink = '/inquiry',
  secondaryButtonText,
  secondaryButtonLink = '/brochures',
}) {
  const { t } = useLanguage();

  const bulletList = Array.isArray(bullets) && bullets.length > 0
    ? bullets
    : bullet
      ? [bullet]
      : ['100% Sortex Cleaned · Phytosanitary Certified · Custom Buyer Labeling'];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2b20] to-[#16382b] p-7 sm:p-9 text-paper shadow-lg border border-gold/30 md:col-span-2">
      {/* Decorative Watermark */}
      <span className="pointer-events-none absolute -right-6 -bottom-6 font-display text-8xl font-black text-white/5 select-none uppercase">
        NMC
      </span>

      <div className="relative z-10 max-w-xl">
        <span className="inline-block rounded-full bg-gold/20 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-gold border border-gold/40">
          {badge || t('exporterCommitment') || 'EXPORTER COMMITMENT'}
        </span>
        <h3 className="mt-3 font-display text-2xl sm:text-3xl font-black leading-tight text-white">
          {title}
        </h3>
        <p className="mt-2 text-sm text-paper/80 leading-relaxed">
          {subtitle}
        </p>

        <div className="mt-3.5 space-y-1.5">
          {bulletList.map((item, idx) => (
            <p key={idx} className="font-mono text-xs text-gold/90 font-medium flex items-center gap-1.5">
              <span className="text-gold font-bold">✓</span>
              <span>{item}</span>
            </p>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={buttonLink || '/inquiry'}
            className="rounded-full bg-gold px-5 py-2.5 text-xs font-bold text-ink shadow-md transition hover:bg-gold/90 hover:scale-105"
          >
            {buttonText || t('requestContainerQuote') || 'Request Container CIF Quote'} →
          </Link>
          <Link
            to={secondaryButtonLink || '/brochures'}
            className="rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20"
          >
            {secondaryButtonText || t('downloadLineCard') || 'Download Line Card'} 📄
          </Link>
        </div>
      </div>
    </div>
  );
}
