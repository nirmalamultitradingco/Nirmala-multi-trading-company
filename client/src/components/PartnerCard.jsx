import { asset } from '../api/axios.js';

export default function PartnerCard({ partner }) {
  return (
    <div className="flex cursor-pointer flex-col rounded-xl border border-line bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-line">
          {partner.logo ? (
            <img src={asset(partner.logo)} alt={partner.name} className="h-full w-full object-cover" />
          ) : (
            <span className="font-display font-bold text-forest">{partner.name?.[0]}</span>
          )}
        </div>
        <div>
          <h3 className="font-display text-base font-bold text-ink">{partner.name}</h3>
          {partner.country && <p className="font-mono text-xs uppercase tracking-wide text-moss">{partner.country}</p>}
        </div>
      </div>
      {partner.description && <p className="mt-3 text-sm leading-relaxed text-ink/65">{partner.description}</p>}
      {partner.website && (
        <a
          href={partner.website}
          target="_blank"
          rel="noreferrer"
          className="mt-3 text-sm font-medium text-forest hover:underline"
        >
          Visit website →
        </a>
      )}
    </div>
  );
}
