import { useEffect, useState } from 'react';
import api, { asset } from '../api/axios.js';
import SectionHeading from '../components/SectionHeading.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Brochures() {
  const [brochures, setBrochures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/brochures').then((r) => setBrochures(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-x py-14 md:py-20">
      <SectionHeading eyebrow="Downloads" title="Catalogues & line cards">
        Download product catalogues and specification sheets. Need something specific? Send us an inquiry.
      </SectionHeading>
      {loading ? (
        <Loader />
      ) : brochures.length === 0 ? (
        <div className="mt-10"><EmptyState title="No brochures yet" hint="Upload PDFs from the admin panel." /></div>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {brochures.map((b) => (
            <a
              key={b._id}
              href={asset(b.file)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-4 rounded-xl border border-line bg-white p-5 shadow-card transition hover:border-forest/40"
            >
              <div>
                {b.segment?.name && <p className="eyebrow">{b.segment.name}</p>}
                <h3 className="mt-1 font-display text-lg font-bold text-ink">{b.title}</h3>
                {b.description && <p className="mt-1 text-sm text-ink/60">{b.description}</p>}
              </div>
              <span className="btn-outline shrink-0">PDF ↓</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
