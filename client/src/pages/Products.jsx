import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import SectionHeading from '../components/SectionHeading.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [segments, setSegments] = useState([]);
  const [partners, setPartners] = useState([]);
  const [data, setData] = useState({ products: [], pages: 1, page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get('search') || '');

  const segment = params.get('segment') || '';
  const partner = params.get('partner') || '';
  const page = Number(params.get('page')) || 1;

  useEffect(() => {
    api.get('/segments').then((r) => setSegments(r.data));
    api.get('/partners').then((r) => setPartners(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get('/products', {
        params: {
          segment: segment || undefined,
          partner: partner || undefined,
          search: params.get('search') || undefined,
          page,
          limit: 12,
        },
      })
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, [segment, partner, page, params]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setParams(next);
  };

  const onSearch = (e) => {
    e.preventDefault();
    setParam('search', search.trim());
  };

  const gotoPage = (p) => {
    const next = new URLSearchParams(params);
    next.set('page', p);
    setParams(next);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container-x py-14 md:py-20">
      <SectionHeading eyebrow="Catalogue" title="All products">
        Filter by segment or partner company, or search by name and origin.
      </SectionHeading>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 rounded-xl border border-line bg-white p-4 shadow-card lg:flex-row lg:items-center">
        <form onSubmit={onSearch} className="flex flex-1 gap-2">
          <input
            className="field"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-primary shrink-0">Search</button>
        </form>
        <div className="flex flex-wrap gap-2">
          <select className="field max-w-[180px]" value={segment} onChange={(e) => setParam('segment', e.target.value)}>
            <option value="">All segments</option>
            {segments.map((s) => (
              <option key={s._id} value={s.slug}>{s.name}</option>
            ))}
          </select>
          <select className="field max-w-[180px]" value={partner} onChange={(e) => setParam('partner', e.target.value)}>
            <option value="">All partners</option>
            {partners.map((p) => (
              <option key={p._id} value={p.slug}>{p.name}</option>
            ))}
          </select>
          {(segment || partner || params.get('search')) && (
            <button
              className="btn-outline"
              onClick={() => {
                setParams(new URLSearchParams());
                setSearch('');
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : data.products.length === 0 ? (
        <div className="mt-10"><EmptyState title="No products match your filters" hint="Try clearing filters or a different search." /></div>
      ) : (
        <>
          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-ink/50">
            {data.total} product{data.total === 1 ? '' : 's'}
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {data.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button className="btn-outline" disabled={page <= 1} onClick={() => gotoPage(page - 1)}>
                Prev
              </button>
              <span className="px-3 font-mono text-sm text-ink/60">
                {page} / {data.pages}
              </span>
              <button className="btn-outline" disabled={page >= data.pages} onClick={() => gotoPage(page + 1)}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
