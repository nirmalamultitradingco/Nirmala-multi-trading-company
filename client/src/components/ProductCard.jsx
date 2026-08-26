import { Link } from 'react-router-dom';
import { asset } from '../api/axios.js';

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-line">
        {product.image ? (
          <img
            src={asset(product.image)}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-ink/30">No image</div>
        )}
        {product.hsCode && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-paper">
            HS {product.hsCode}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {product.segment?.name && <p className="eyebrow">{product.segment.name}</p>}
        <h3 className="mt-1 font-display text-lg font-bold leading-snug text-ink">{product.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink/60">{product.shortDescription}</p>
        <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-xs text-ink/55">
          {product.origin && <span className="font-mono">◦ {product.origin}</span>}
        </div>
      </div>
    </Link>
  );
}
