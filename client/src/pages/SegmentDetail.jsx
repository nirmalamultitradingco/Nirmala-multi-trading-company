import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { asset } from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import SubSegmentCard from '../components/SubSegmentCard.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function SegmentDetail() {
  const { slug, subsegmentSlug } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const query = subsegmentSlug ? { subsegment: subsegmentSlug } : undefined;

    api
      .get(`/segments/${slug}`, { params: query })
      .then((r) => setData(r.data))
      .catch((e) => {
        setData(null);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [slug, subsegmentSlug]);

  const selected = data?.selectedSubsegment;
  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="container-x py-20">
        <EmptyState title={t('segmentNotFound')} hint={error} />
      </div>
    );
  }

  const { segment, subsegments, products } = data;
  const hasSubsegments = Boolean(subsegments?.length);

  return (
    <div>
      <section className="relative border-b border-line">
        {segment.image && (
          <div className="absolute inset-0">
            <img
              src={asset(segment.image)}
              alt=""
              className="h-full w-full object-cover opacity-15"
            />
          </div>
        )}
        <div className="container-x relative py-16 md:py-20">
          <Link
            to="/products"
            className="font-mono text-xs uppercase tracking-widest text-moss hover:underline"
          >
            ← {t('products') || 'All Products'}
          </Link>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            {segment.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink/65">{segment.description}</p>
        </div>
      </section>

      {hasSubsegments && !selected ? (
        <section className="container-x py-12 md:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-gold font-mono">PRODUCT: {segment.name}</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl">
                {t('subProducts') || 'Sub Products'}
              </h2>
              <p className="mt-2 max-w-2xl text-ink/60">
                {t('selectSubProduct') || 'Select a sub product to view product details in this category.'}
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {subsegments.map((subsegment) => (
              <SubSegmentCard
                key={subsegment._id}
                subsegment={subsegment}
                segmentSlug={slug}
              />
            ))}
          </div>
        </section>
      ) : selected ? (
        <section className="container-x py-10 md:py-14">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              to={`/products/${slug}`}
              className="font-mono text-xs uppercase tracking-widest text-moss hover:underline"
            >
              ← {t('backToSubProducts') || 'Back to sub products'}
            </Link>
          </div>

          <div className="rounded-xl border border-line bg-white px-6 py-7 shadow-card md:px-9 md:py-8">
            <p className="eyebrow text-gold font-mono">PRODUCT: {segment.name}</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {selected.name}
            </h2>
          </div>

          <div className="mt-10">
            <div className="mb-5">
              <p className="eyebrow text-gold font-mono">SUB PRODUCT: {selected.name}</p>
              <h3 className="mt-1 font-display text-2xl font-extrabold text-ink">
                {t('productDetails') || 'Product Details'}
              </h3>
            </div>

            {products.length === 0 ? (
              <EmptyState
                title={t('noProductDetails') || 'No product details in this category yet'}
                hint={t('addProducts')}
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="container-x py-14">
          {products.length === 0 ? (
            <EmptyState title={t('noSegmentProducts')} hint={t('checkBack')} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
