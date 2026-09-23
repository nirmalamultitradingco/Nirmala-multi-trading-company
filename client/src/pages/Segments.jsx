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

  const handleSearchSubmit = () => {
    const next = new URLSearchParams(params);
    if (search.trim()) next.set('search', search.trim());
    else next.delete('search');
    setParams(next);
  };

  // Determine showcase items: use current category products or featured products
  const showcaseProducts = productsData.products.length > 0
    ? productsData.products
    : featuredProducts;

  const showcaseTitle = activeSegmentObj ? activeSegmentObj.name : 'Farali & Agro Commodities';
  const showcaseSubtitle = activeSegmentObj?.description
    ? activeSegmentObj.description
    : 'A delightful crunch inspired by tradition, crafted with bold flavors for global export markets.';

  return (
    <div className="container-x py-10 md:py-16 space-y-12">
      {/* 1. TOP FLOATING CAPSULE FILTER PILL BAR & SEARCH */}
      <CategoryPillBar
        segments={segments}
        activeSegment={activeSegmentSlug}
        onSelectSegment={handleSelectSegment}
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* 2. HERO SHOWCASE: CURVED FAN ARC OR 3D SPIN WHEEL */}
      <ProductShowcaseArc
        title={showcaseTitle}
        subtitle={showcaseSubtitle}
        products={showcaseProducts}
      />

      {/* 3. PRODUCT CARDS GRID (NO SECONDARY BAR BELOW SEGMENTS) */}
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
            title={activeSegmentObj ? `${activeSegmentObj.name} Feast, Perfected` : 'Farali Feast, Perfected'}
            subtitle="Light, crispy savories crafted for festive occasions and everyday nourishment with pure ingredients."
            bullet="Direct Mundra Port Shipments · APEDA & FSSAI Cleared · Customized Retails Pouches"
          />

          {/* Remaining products */}
          {productsData.products.slice(3).map((p) => (
            <SplitProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
