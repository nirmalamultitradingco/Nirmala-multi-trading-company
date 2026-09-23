import { Link } from 'react-router-dom';
import { asset } from '../api/axios.js';

export default function SubSegmentCard({ subsegment, segmentSlug }) {
  return (
    <Link
      to={`/products/${segmentSlug}/${subsegment.slug}`}
      className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl border border-line bg-ink"
    >
      {subsegment.image ? (
        <img
          src={asset(subsegment.image)}
          alt={subsegment.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-forest" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
      <div className="relative p-5 text-paper">
        <p className="eyebrow text-gold text-[10px]">SUB PRODUCT</p>
        <h3 className="mt-1 font-display text-xl font-bold">{subsegment.name}</h3>
        {subsegment.description && (
          <p className="mt-1 line-clamp-2 text-sm text-paper/75">{subsegment.description}</p>
        )}
        <span className="mt-2 inline-block font-mono text-xs uppercase tracking-widest text-gold">
          View range →
        </span>
      </div>
    </Link>
  );
}
