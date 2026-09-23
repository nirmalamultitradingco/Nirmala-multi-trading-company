import { Link } from 'react-router-dom';
import { asset } from '../api/axios.js';

export default function SegmentCard({ segment }) {
  return (
    <Link
      to={`/products/${segment.slug}`}
      className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-ink shadow-lg transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_20px_45px_-12px_rgba(198,145,46,0.35)]"
    >
      {/* Background Image with Zoom & Easing */}
      {segment.image ? (
        <img
          src={asset(segment.image)}
          alt={segment.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-forest" />
      )}

      {/* Multi-layered cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07130e] via-[#07130e]/60 to-transparent/30 transition-opacity duration-300 group-hover:opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-80" />

      {/* Subtle Luxury Sheen Overlay on Hover */}
      <div className="pointer-events-none absolute -inset-full h-[300%] w-[300%] rotate-45 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 group-hover:translate-x-1/2" />

      {/* Top Floating Glass Badge */}
      <div className="relative z-10 p-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-ink/50 px-2.5 py-1 text-[11px] font-medium tracking-wide text-paper backdrop-blur-md shadow-sm transition-colors group-hover:border-gold/50 group-hover:text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          Export Grade
        </span>
      </div>

      {/* Bottom Content Area */}
      <div className="relative z-10 p-5 text-paper">
        {/* Accent expanding bar */}
        <div className="mb-2.5 h-0.5 w-8 rounded-full bg-gold transition-all duration-500 ease-out group-hover:w-full" />

        <h3 className="font-display text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-gold-light">
          {segment.name}
        </h3>

        {segment.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-paper/75">
            {segment.description}
          </p>
        )}

        <div className="mt-3 flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-gold">
          <span>Explore range</span>
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
