import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { asset } from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Brochures() {
  const [brochures, setBrochures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { t } = useLanguage();

  useEffect(() => {
    api
      .get('/brochures')
      .then((r) => setBrochures(r.data || []))
      .catch((err) => console.error('Brochures load error:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = brochures.filter((b) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.title?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.segment?.name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="overflow-x-hidden">
      {/* 1. Hero Section (Aligned to NMC Theme) */}
      <section className="relative overflow-hidden border-b border-line bg-[#0d1e17] py-16 md:py-24 text-paper">
        {/* Ambient subtle glow */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-forest/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />

        <div className="container-x relative">
          <div className="max-w-3xl">
            <span className="eyebrow text-gold">Official Catalogues & Line Cards</span>
            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t('cataloguesLineCards') || 'Export Product Catalogues & Line Cards'}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-paper/75 sm:text-lg">
              {t('brochureHeroText') ||
                'Download detailed export specifications, packing formats, HS codes, and container payload capacities in verified PDF format.'}
            </p>

            {/* Trust highlights */}
            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-mono text-paper/70">
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Verified Export Specs
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Direct PDF Downloads
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Container Payload Data
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Content Section */}
      <section className="container-x py-16 md:py-20">
        {/* Controls & Search Bar */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center border-b border-line pb-6">
          <div>
            <p className="eyebrow text-moss">{t('downloads') || 'Downloads'}</p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Available Catalogues ({filtered.length})
            </h2>
          </div>

          {/* Search filter */}
          {brochures.length > 0 && (
            <div className="w-full sm:w-72">
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-3.5 text-ink/40 text-sm">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search catalogue title…"
                  className="w-full rounded-full border border-line bg-white py-2 pl-9 pr-8 text-xs font-medium text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15 shadow-sm"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 text-xs text-ink/40 hover:text-ink"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Catalogues Grid */}
        {loading ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16">
            <EmptyState
              title={search ? 'No brochures match your search' : t('noBrochures') || 'No brochures published yet'}
              hint={search ? 'Try clearing your search term.' : t('uploadPdfs') || 'Upload PDFs from the admin panel.'}
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b) => (
              <div
                key={b._id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-gold hover:shadow-xl"
              >
                <div>
                  {/* Document Cover Thumbnail */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-[#0d1e17] to-[#1a382c] p-6 text-paper flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-gold backdrop-blur">
                        <span>📄</span> PDF CATALOGUE
                      </span>
                      {b.segment?.name && (
                        <span className="rounded-full bg-gold/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-gold">
                          {b.segment.name}
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="h-1 w-10 rounded-full bg-gold mb-2 transition-all duration-300 group-hover:w-16" />
                      <h4 className="font-display text-lg font-extrabold text-white line-clamp-2">
                        {b.title}
                      </h4>
                      <p className="mt-1 font-mono text-[11px] text-paper/60">
                        Nirmala Multi Trading Co.
                      </p>
                    </div>

                    <div className="text-[10px] font-mono text-paper/40 flex justify-between items-center border-t border-white/10 pt-2">
                      <span>Export Grade</span>
                      <span>Verified Document</span>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-ink group-hover:text-forest transition-colors">
                      {b.title}
                    </h3>
                    {b.description ? (
                      <p className="mt-2.5 text-xs leading-relaxed text-ink/65 line-clamp-3">
                        {b.description}
                      </p>
                    ) : (
                      <p className="mt-2.5 text-xs leading-relaxed text-ink/50 italic">
                        Official export product list and specification sheet with container load metrics.
                      </p>
                    )}

                    <div className="mt-5 flex items-center gap-2 border-t border-line/60 pt-3 text-[11px] font-mono text-moss">
                      <span>✓ Ready for download</span>
                      <span>•</span>
                      <span>PDF format</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-6 pt-0 flex gap-2.5">
                  <a
                    href={asset(b.file)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 btn-primary text-xs py-2.5 text-center flex items-center justify-center gap-1.5"
                    aria-label={`${t('openBrochure')}: ${b.title}`}
                  >
                    <span>{t('openBrochure') || 'Open PDF'}</span>
                    <span aria-hidden="true">↗</span>
                  </a>

                  <a
                    href={asset(b.file)}
                    download
                    className="btn-outline text-xs px-3.5 py-2.5 text-center flex items-center justify-center"
                    aria-label={`Download ${b.title}`}
                    title="Download PDF"
                  >
                    <span>⬇</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Custom Line Card Notice Banner */}
        <div className="mt-16 rounded-3xl border border-line bg-gradient-to-r from-[#fbf8f4] to-white p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow text-gold">Custom Trade Solutions</span>
            <h3 className="mt-2 font-display text-2xl font-bold text-ink">
              Need a Tailored Line Card or Specification Sheet?
            </h3>
            <p className="mt-2 text-sm text-ink/70 leading-relaxed">
              If your supermarket chain or import house requires specific packaging sizes, private labeling details, or custom container combinations, our export desk can generate custom line cards for you.
            </p>
          </div>

          <Link
            to="/inquiry?subject=CustomLineCard"
            className="btn-primary shrink-0 whitespace-nowrap"
          >
            Request custom line card →
          </Link>
        </div>
      </section>
    </div>
  );
}
