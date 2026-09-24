import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [data, setData] = useState({ products: [], pages: 1, page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('search') || '');

  const segment = params.get('segment') || '';
  const page = Number(params.get('page')) || 1;

  useEffect(() => {
    api.get('/segments').then((r) => setSegments(r.data || [])).catch(() => {});
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
    setSearch(''); // Requirement 1: Blank the search field
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

  return (
    <div className="container-x py-10 md:py-16 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <p className="eyebrow text-moss">{t('products') || 'Product Catalogue'}</p>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
          {t('productDetails') || 'Export Product Catalogue'}
        </h1>
        <p className="text-sm text-ink/70 leading-relaxed">
          {t('productDetailsDesc') || 'Explore Sortex-cleaned export specifications, packaging sizes, origins and HS codes.'}
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
    </div>
  );
}
