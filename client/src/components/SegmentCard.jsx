import { Link } from 'react-router-dom';
import { asset } from '../api/axios.js';

export default function SegmentCard({ segment }) {
  return (
    <Link
      to={`/segments/${segment.slug}`}
      className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl border border-line"
    >
      {segment.image ? (
        <img
          src={asset(segment.image)}
          alt={segment.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-forest" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" />
      <div className="relative p-5 text-paper">
        <h3 className="font-display text-xl font-bold">{segment.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-paper/75">{segment.description}</p>
        <span className="mt-2 inline-block font-mono text-xs uppercase tracking-widest text-gold">
          View range →
        </span>
      </div>
    </Link>
  );
}
