import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('search') || '');

  const activeSegmentSlug = params.get('segment') || '';

  // Load segments once
  useEffect(() => {
    api.get('/segments').then((r) => setSegments(r.data || [])).catch(() => {});
    api.get('/products', { params: { limit: 10, featured: true } })
      .then((r) => setFeaturedProducts(r.data.products || []))
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
    setSearch(''); // Requirement 1: Blank the search field
  };

  const handleClearSearch = () => {
    const next = new URLSearchParams(params);
    next.delete('search');
    setParams(next);
    setSearch('');
  };

  // Determine showcase items: use current category products or featured products
  const showcaseProducts = productsData.products.length > 0
    ? productsData.products
    : featuredProducts;

  const showcaseTitle = activeSegmentObj
    ? activeSegmentObj.name
    : t('allExportFoodProducts') || 'All Export Food Products';

  const showcaseSubtitle = activeSegmentObj?.description
    ? activeSegmentObj.description
    : '100% Sortex-cleaned Indian spices, premium grains, pulses, and value-added food products ready for containerized ocean shipping.';

  const showcaseWatermark = activeSegmentObj ? activeSegmentObj.name : 'FOOD PRODUCTS';

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

      {/* 2. HERO SHOWCASE: CURVED FAN ARC OR 3D SPIN WHEEL */}
      <ProductShowcaseArc
        title={showcaseTitle}
        subtitle={showcaseSubtitle}
        watermark={showcaseWatermark}
        products={showcaseProducts}
      />

      {/* 3. PRODUCT CARDS GRID PROPERLY ALIGNED WITH SEGMENT */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-line/60 pb-4">
          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-gold">Export Segment</span>
            <h2 className="mt-0.5 font-display text-2xl sm:text-3xl font-bold text-ink">
              {activeSegmentObj ? activeSegmentObj.name : t('allProducts') || 'All Export Food Products'}
            </h2>
            <p className="text-xs sm:text-sm text-ink/65 mt-0.5 max-w-2xl">
              {activeSegmentObj?.description || 'Browse our certified Sortex-cleaned export food products and farm cluster supplies.'}
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

          {/* Bento Feature Banner */}
          <BentoHighlightCard
            title={activeSegmentObj ? `${activeSegmentObj.name} Selection, Perfected` : 'Global Food Products, Perfected'}
            subtitle={activeSegmentObj?.description || "Direct sourcing of export-grade Indian spices, premium grains, and food products with certified global shipping."}
            bullet="Direct Mundra Port Shipments · APEDA & FSSAI Cleared · Customized Retails Pouches"
          />

          {/* Remaining products */}
          {productsData.products.slice(3).map((p) => (
            <SplitProductCard key={p._id} product={p} />
          ))}
        </div>
        )}
      </div>
    </div>
  );
}
