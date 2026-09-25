import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios.js';
import CategoryPillBar from '../components/products/CategoryPillBar.jsx';
import { SplitProductCard } from '../components/products/SplitProductCard.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Products() {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const [segments, setSegments] = useState([]);
  const [siteContent, setSiteContent] = useState(null);
  const [data, setData] = useState({ products: [], pages: 1, page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('search') || '');

  const segment = params.get('segment') || '';
  const page = Number(params.get('page')) || 1;

  useEffect(() => {
    api.get('/segments').then((r) => setSegments(r.data || [])).catch(() => {});
    api.get('/site-content').then((r) => setSiteContent(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/products', {
        params: {
          segment: segment || undefined,
          search: params.get('search') || undefined,
          page,
          limit: 15,
        },
      })
      .then((r) => setData(r.data))
      .catch(() => setData({ products: [], pages: 1, page: 1, total: 0 }))
      .finally(() => setLoading(false));
  }, [segment, page, params]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setParams(next);
  };

  const handleSelectSegment = (slug) => {
    setParam('segment', slug);
  };

  const handleSearchSubmit = (term) => {
    const query = typeof term === 'string' ? term : search;
    setParam('search', query.trim());
    setSearch('');
  };

  const handleClearSearch = () => {
    setParam('search', '');
    setSearch('');
  };

  const gotoPage = (p) => {
    const next = new URLSearchParams(params);
    next.set('page', p);
    setParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentSegmentObj = segments.find((s) => s.slug === segment);
  const productsPageCms = siteContent?.productsPage;
  const trustBar = productsPageCms?.trustBar;
  const ctaBanner = productsPageCms?.ctaBanner;

  return (
    <div className="container-x py-10 md:py-16 space-y-12">
      {/* Page Header (Dynamic from CMS) */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 mb-1">
          <span className="h-1.5 w-5 rounded-full bg-gold" />
          <p className="eyebrow text-moss uppercase tracking-widest font-mono text-xs">
            {productsPageCms?.hero?.eyebrow || t('products') || 'CERTIFIED INDIAN EXPORTS'}
          </p>
          <span className="h-1.5 w-5 rounded-full bg-gold" />
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-ink">
          {productsPageCms?.hero?.title || t('productDetails') || 'Export Product Catalogue'}
        </h1>
        <p className="text-xs sm:text-sm text-ink/75 leading-relaxed max-w-xl mx-auto">
          {productsPageCms?.hero?.subtitle ||
            t('productDetailsDesc') ||
            'Explore Sortex-cleaned export specifications, packaging sizes, origins and HS codes.'}
        </p>
      </div>

      {/* Category Pill Bar & Search */}
      <CategoryPillBar
        segments={segments}
        activeSegment={segment}
        onSelectSegment={handleSelectSegment}
        search={search}
        activeSearch={params.get('search') || ''}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={handleClearSearch}
      />

      {/* Segment and Product Alignment Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line/60 pb-3">
        <div>
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-gold">Category</span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
            {currentSegmentObj ? currentSegmentObj.name : 'All Product Categories'}
          </h2>
          {currentSegmentObj?.description && (
            <p className="text-xs text-ink/65 mt-0.5 max-w-2xl">{currentSegmentObj.description}</p>
          )}
        </div>
        <span className="font-mono text-xs font-semibold text-moss bg-forest/5 px-3 py-1 rounded-full border border-forest/15">
          {data.total} Available Items
        </span>
      </div>

      {loading ? (
        <div className="py-20"><Loader /></div>
      ) : data.products.length === 0 ? (
        <div className="py-12">
          <EmptyState
            title={t('noMatch') || 'No products match your filters'}
            hint={t('tryClear') || 'Try clearing filters or a different search.'}
          />
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.products.map((p) => (
              <SplitProductCard key={p._id} product={p} />
            ))}
          </div>

          {data.pages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                className="btn-outline"
                disabled={page <= 1}
                onClick={() => gotoPage(page - 1)}
              >
                {t('prev') || 'Prev'}
              </button>
              <span className="px-4 font-mono text-sm text-ink/70">
                {page} / {data.pages}
              </span>
              <button
                className="btn-outline"
                disabled={page >= data.pages}
                onClick={() => gotoPage(page + 1)}
              >
                {t('next') || 'Next'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Trust Pillars Bar */}
      {trustBar?.isActive !== false && (
        <section className="rounded-3xl border border-line/70 bg-gradient-to-br from-white/95 via-[#fcfbfa] to-[#f7f4ed] p-6 sm:p-10 shadow-sm mt-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-gold">NMC ASSURANCE</span>
            <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold text-ink">
              {trustBar?.title || 'Why Global Buyers Trust Nirmala Multi Trading Co.'}
            </h3>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(trustBar?.items && trustBar.items.length > 0
              ? trustBar.items
              : [
                  {
                    icon: '🔍',
                    title: '100% Sortex Optical Cleaning',
                    text: 'Laser graded to 99.5% European purity with zero foreign contaminants.',
                  },
                  {
                    icon: '🚢',
                    title: 'Port-Direct Logistics',
                    text: 'Express sailings from Mundra Port and JNPT Nhava Sheva to worldwide ports.',
                  },
                  {
                    icon: '📜',
                    title: 'Phyto & MRL Compliance',
                    text: 'Pre-shipment phytosanitary and aflatoxin lab assays with every container.',
                  },
                  {
                    icon: '📦',
                    title: 'Custom Packaging & Branding',
                    text: 'From 25kg multi-wall paper bags to buyer-branded retail standup pouches.',
                  },
                ]
            ).map((pillar, idx) => (
              <div
                key={pillar._id || idx}
                className="group relative rounded-2xl border border-line/60 bg-white p-5 shadow-xs transition duration-300 hover:border-gold/60 hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-forest/5 text-xl transition-transform duration-300 group-hover:scale-110">
                  {pillar.icon || '✨'}
                </div>
                <h4 className="font-display text-sm font-bold text-ink">
                  {pillar.title}
                </h4>
                <p className="mt-1 text-xs text-ink/70 leading-relaxed">
                  {pillar.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Container Export Quotation CTA Banner */}
      {ctaBanner?.isActive !== false && (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c241b] via-[#16382b] to-[#1f4e3c] p-8 sm:p-12 text-white shadow-xl border border-gold/40 mt-8">
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-gold">
              {ctaBanner?.eyebrow || 'READY FOR EXPORT ORDERS'}
            </span>
            <h3 className="mt-2 font-display text-2xl sm:text-4xl font-black leading-tight text-paper">
              {ctaBanner?.title || 'Need Container Freight Quotations or Custom Samples?'}
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-paper/85 leading-relaxed">
              {ctaBanner?.description ||
                'Our international trade desk prepares formal FOB (Mundra/JNPT) or CIF proforma invoices within 12–24 business hours. Courier sample kits dispatched worldwide.'}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to={ctaBanner?.buttonPrimaryLink || '/inquiry'}
                className="rounded-full bg-gold px-6 py-3 text-xs font-bold text-ink shadow-md transition hover:bg-gold/90 hover:scale-105"
              >
                {ctaBanner?.buttonPrimaryText || 'Request Official Quotation →'}
              </Link>
              <Link
                to={ctaBanner?.buttonSecondaryLink || '/brochures'}
                className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                {ctaBanner?.buttonSecondaryText || 'Download Product Brochures'} 📄
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
