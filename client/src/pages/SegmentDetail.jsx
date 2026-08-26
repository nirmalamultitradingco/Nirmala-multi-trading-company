import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { asset } from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function SegmentDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get(`/segments/${slug}`)
      .then((r) => setData(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (error) return <div className="container-x py-20"><EmptyState title="Segment not found" hint={error} /></div>;

  const { segment, products } = data;
  return (
    <div>
      <section className="relative border-b border-line">
        {segment.image && (
          <div className="absolute inset-0">
            <img src={asset(segment.image)} alt="" className="h-full w-full object-cover opacity-15" />
          </div>
        )}
        <div className="container-x relative py-16 md:py-20">
          <Link to="/segments" className="font-mono text-xs uppercase tracking-widest text-moss hover:underline">
            ← All segments
          </Link>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            {segment.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink/65">{segment.description}</p>
        </div>
      </section>

      <section className="container-x py-14">
        {products.length === 0 ? (
          <EmptyState title="No products in this segment yet" hint="Check back soon." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
