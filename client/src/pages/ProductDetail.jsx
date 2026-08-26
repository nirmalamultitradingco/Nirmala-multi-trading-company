import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { asset } from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ProductCard from '../components/ProductCard.jsx';

const Spec = ({ label, value }) =>
  value ? (
    <div className="flex justify-between gap-4 border-b border-line py-2.5 text-sm">
      <dt className="font-mono text-xs uppercase tracking-wide text-ink/50">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  ) : null;

export default function ProductDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [active, setActive] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${slug}`)
      .then((r) => {
        setData(r.data);
        setActive(r.data.product.image || r.data.product.gallery?.[0] || '');
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (error) return <div className="container-x py-20"><EmptyState title="Product not found" hint={error} /></div>;

  const { product, related } = data;
  const gallery = [product.image, ...(product.gallery || [])].filter(Boolean);

  return (
    <div className="container-x py-10 md:py-14">
      <nav className="font-mono text-xs uppercase tracking-widest text-ink/50">
        <Link to="/products" className="hover:underline">Products</Link>
        {product.segment && (
          <>
            <span className="px-1.5">/</span>
            <Link to={`/segments/${product.segment.slug}`} className="hover:underline">
              {product.segment.name}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-card">
            {active ? (
              <img src={asset(active)} alt={product.name} className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="grid aspect-[4/3] place-items-center text-ink/30">No image</div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2">
              {gallery.map((g) => (
                <button
                  key={g}
                  onClick={() => setActive(g)}
                  className={`h-16 w-16 overflow-hidden rounded-lg border ${
                    active === g ? 'border-forest' : 'border-line'
                  }`}
                >
                  <img src={asset(g)} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.segment && <p className="eyebrow">{product.segment.name}</p>}
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>
          {product.shortDescription && (
            <p className="mt-3 text-lg text-ink/65">{product.shortDescription}</p>
          )}

          {product.partner && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-line bg-white p-3">
              <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-line">
                {product.partner.logo ? (
                  <img src={asset(product.partner.logo)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display font-bold text-forest">{product.partner.name[0]}</span>
                )}
              </div>
              <div className="text-sm">
                <p className="font-mono text-[11px] uppercase tracking-wide text-moss">Supplied by</p>
                <p className="font-display font-bold text-ink">{product.partner.name}</p>
              </div>
            </div>
          )}

          <dl className="mt-6">
            <Spec label="Origin" value={product.origin} />
            <Spec label="HS code" value={product.hsCode} />
            <Spec label="Packaging" value={product.packaging} />
            <Spec label="MOQ" value={product.moq} />
            <Spec label="Certifications" value={product.certifications?.join(', ')} />
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to={`/inquiry?product=${product._id}`} className="btn-primary">
              Inquire about this product
            </Link>
            <Link to="/products" className="btn-outline">Back to catalogue</Link>
          </div>
        </div>
      </div>

      {product.description && (
        <section className="mt-14 max-w-3xl">
          <h2 className="font-display text-xl font-bold text-ink">Product description</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-ink/75">{product.description}</p>
        </section>
      )}

      {related?.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-bold text-ink">Related products</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
