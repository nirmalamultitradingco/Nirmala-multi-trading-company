import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios.js';
import CategoryPillBar from '../components/products/CategoryPillBar.jsx';
import ProductShowcaseArc from '../components/products/ProductShowcaseArc.jsx';
import { SplitProductCard, BentoHighlightCard } from '../components/products/SplitProductCard.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Segments() {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const [segments, setSegments] = useState([]);
  const [productsData, setProductsData] = useState({ products: [], total: 0 });
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [siteContent, setSiteContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('search') || '');

  const activeSegmentSlug = params.get('segment') || '';

  // Load segments and site content on mount
  useEffect(() => {
    api.get('/segments').then((r) => setSegments(r.data || [])).catch(() => {});
    api.get('/products', { params: { limit: 10, featured: true } })
      .then((r) => setFeaturedProducts(r.data.products || []))
      .catch(() => {});
    api.get('/site-content')
      .then((r) => setSiteContent(r.data))
      .catch(() => {});
  }, []);

  // Fetch products whenever segment or search query changes
  useEffect(() => {
    setLoading(true);
    api.get('/products', {
      params: {
        segment: activeSegmentSlug || undefined,
        search: params.get('search') || undefined,
        limit: 24,
      },
    })
      .then((r) => setProductsData(r.data))
      .catch(() => setProductsData({ products: [], total: 0 }))
      .finally(() => setLoading(false));
  }, [activeSegmentSlug, params]);

  const activeSegmentObj = useMemo(() => {
    return segments.find((s) => s.slug === activeSegmentSlug);
  }, [segments, activeSegmentSlug]);

  const handleSelectSegment = (slug) => {
    const next = new URLSearchParams(params);
    if (slug) next.set('segment', slug);
    else next.delete('segment');
    setParams(next);
  };

  const handleSearchSubmit = (term) => {
    const query = typeof term === 'string' ? term : search;
    const next = new URLSearchParams(params);
    if (query && query.trim()) next.set('search', query.trim());
    else next.delete('search');
    setParams(next);
    setSearch('');
  };

  const handleClearSearch = () => {
    const next = new URLSearchParams(params);
    next.delete('search');
    setParams(next);
    setSearch('');
  };

  const productsPageCms = siteContent?.productsPage;

  // Determine showcase items: use current category products or featured products
  const showcaseProducts = productsData.products.length > 0
    ? productsData.products
    : featuredProducts;

  const keepCustomTitle = Boolean(productsPageCms?.showcase?.keepCustomTitle);
  const showcaseTitle = activeSegmentObj
    ? keepCustomTitle
      ? `${productsPageCms?.showcase?.title || 'Featured Export Products'} — ${activeSegmentObj.name}`
      : activeSegmentObj.name
    : productsPageCms?.showcase?.title || t('allExportFoodProducts') || 'Featured Export Products';

  const showcaseSubtitle = activeSegmentObj?.description && !keepCustomTitle
    ? activeSegmentObj.description
    : productsPageCms?.showcase?.subtitle ||
      'Discover our certified Sortex-cleaned harvest lots and premium packaged Indian food products ready for global ocean freight.';

  const showcaseWatermark = activeSegmentObj && !keepCustomTitle
    ? activeSegmentObj.name
    : productsPageCms?.showcase?.watermark || 'FOOD PRODUCTS';

  const showcaseDefaultMode = productsPageCms?.showcase?.defaultMode || 'wheel';
  const showcaseAutoRotate = productsPageCms?.showcase?.autoRotateSeconds || 3.5;
  const showcaseBadge = productsPageCms?.showcase?.showcaseBadge || 'FEATURED FOOD SHOWCASE';

  // Bento configuration from CMS
  const bentoConfig = productsPageCms?.bento;
  const bentoTitle = activeSegmentObj
    ? `${activeSegmentObj.name} Selection, Perfected`
    : bentoConfig?.headline || 'Global Food Products, Perfected';
  const bentoSubtitle = activeSegmentObj?.description || bentoConfig?.subtitle || 'Direct sourcing of export-grade Indian spices, premium grains, and food products with certified global shipping.';
  const bentoBullets = bentoConfig?.bullets && bentoConfig.bullets.length > 0
    ? bentoConfig.bullets
    : [
        'Direct Mundra Port (INMUN1) & JNPT Container Stuffing',
        'APEDA, Spice Board of India & FSSAI Registered Consignments',
        'European MRL & ASTA Purity Compliance with Full Batch Traceability',
        'Customized Retail Standup Pouches & Institutional Bulk Bags',
      ];

  // Trust bar & CTA Banner
  const trustBar = productsPageCms?.trustBar;
  const ctaBanner = productsPageCms?.ctaBanner;

  return (
    <div className="container-x py-10 md:py-16 space-y-12">
      {/* 1. TOP FLOATING CAPSULE FILTER PILL BAR & SEARCH */}
      <CategoryPillBar
        segments={segments}
        activeSegment={activeSegmentSlug}
        onSelectSegment={handleSelectSegment}
        search={search}
        activeSearch={params.get('search') || ''}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={handleClearSearch}
      />

      {/* 2. HERO SHOWCASE: CURVED FAN ARC OR 3D CELESTIAL SPIN WHEEL */}
      {productsPageCms?.showcase?.isActive !== false && (
        <ProductShowcaseArc
          title={showcaseTitle}
          subtitle={showcaseSubtitle}
          watermark={showcaseWatermark}
          products={showcaseProducts}
          defaultMode={showcaseDefaultMode}
          autoRotateSeconds={showcaseAutoRotate}
          showcaseBadge={showcaseBadge}
        />
      )}

      {/* 3. PRODUCT CARDS GRID PROPERLY ALIGNED WITH SEGMENT */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line/60 pb-4">
          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-gold">Export Segment</span>
            <h2 className="mt-0.5 font-display text-2xl sm:text-3xl font-bold text-ink">
              {activeSegmentObj ? activeSegmentObj.name : productsPageCms?.hero?.title || t('allProducts') || 'All Export Food Products'}
            </h2>
            <p className="text-xs sm:text-sm text-ink/65 mt-0.5 max-w-2xl">
              {activeSegmentObj?.description || productsPageCms?.hero?.subtitle || 'Browse our certified Sortex-cleaned export food products and farm cluster supplies.'}
            </p>
          </div>
          <span className="shrink-0 font-mono text-xs font-semibold text-moss bg-forest/5 px-3 py-1.5 rounded-full border border-forest/15">
            {productsData.total || productsData.products.length} Food Products Available
          </span>
        </div>

        {loading ? (
          <div className="py-20"><Loader /></div>
        ) : productsData.products.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title={t('noMatch') || 'No products match your selection'}
              hint={t('tryClear') || 'Try selecting a different category or clearing search.'}
            />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* First 3 products */}
            {productsData.products.slice(0, 3).map((p) => (
              <SplitProductCard key={p._id} product={p} />
            ))}

            {/* Bento Feature Banner (Dynamic from CMS) */}
            <BentoHighlightCard
              badge={bentoConfig?.badge}
              title={bentoTitle}
              subtitle={bentoSubtitle}
              bullets={bentoBullets}
              buttonText={bentoConfig?.buttonText}
              buttonLink={bentoConfig?.buttonLink}
            />

            {/* Remaining products */}
            {productsData.products.slice(3).map((p) => (
              <SplitProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* 4. DYNAMIC TRUST PILLARS BAR (CMS Customizable) */}
      {trustBar?.isActive !== false && (
        <section className="rounded-3xl border border-line/70 bg-gradient-to-br from-white/95 via-[#fcfbfa] to-[#f7f4ed] p-6 sm:p-10 shadow-sm">
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

      {/* 5. DYNAMIC CONTAINER EXPORT QUOTATION CTA BANNER (CMS Customizable) */}
      {ctaBanner?.isActive !== false && (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c241b] via-[#16382b] to-[#1f4e3c] p-8 sm:p-12 text-white shadow-xl border border-gold/40">
          {/* Subtle Ambient Radial Glow */}
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
