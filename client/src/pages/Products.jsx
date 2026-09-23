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

  const handleSearchSubmit = () => {
    setParam('search', search.trim());
  };

  const gotoPage = (p) => {
    const next = new URLSearchParams(params);
    next.set('page', p);
    setParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container-x py-10 md:py-16 space-y-10">
      {/* Category Pill Bar & Search (Clean - No Secondary Bar Below It) */}
      <CategoryPillBar
        segments={segments}
        activeSegment={segment}
        onSelectSegment={handleSelectSegment}
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
      />

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
