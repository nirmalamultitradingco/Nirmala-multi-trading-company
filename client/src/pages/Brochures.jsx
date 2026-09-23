import { useEffect, useState } from 'react';
import api, { asset } from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Brochures() {
  const [brochures, setBrochures] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    api.get('/brochures').then((r) => setBrochures(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="brochure-hero">
        <img src="/brochure-landscape.jpg" alt={t('cataloguePage')} className="brochure-hero-image" />
        <div className="brochure-hero-overlay" />
        <div className="container-x brochure-hero-content">
          <div className="brochure-hero-title-wrap">
            <span className="brochure-hero-line" />
            <h1>{t('cataloguePage')}</h1>
          </div>
          <p>{t('brochureHeroText')}</p>
        </div>
      </section>

      <section className="container-x py-14 md:py-20">
        <div className="mb-8">
          <p className="eyebrow">{t('downloads')}</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {t('cataloguesLineCards')}
          </h2>
        </div>

        {loading ? (
          <Loader />
        ) : brochures.length === 0 ? (
          <div className="mt-10">
            <EmptyState title={t('noBrochures')} hint={t('uploadPdfs')} />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {brochures.map((b) => (
              <a
                key={b._id}
                href={asset(b.file)}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:border-forest/40 hover:shadow-lg"
                aria-label={`${t('openBrochure')}: ${b.title}`}
              >
                <div className="brochure-card-image-wrap">
                  <img
                    src="/brochure-landscape.jpg"
                    alt={b.title || t('cataloguePage')}
                    className="brochure-card-image"
                  />
                </div>
                <div className="p-5">
                  {b.segment?.name && <p className="eyebrow">{b.segment.name}</p>}
                  <h3 className="mt-1 font-display text-xl font-bold text-ink">{b.title}</h3>
                  {b.description && <p className="mt-2 text-sm leading-relaxed text-ink/60">{b.description}</p>}
                  <span className="btn-primary mt-5 w-full brochure-open-btn"><span>{t('openBrochure')}</span><span className="brochure-open-btn__arrow" aria-hidden="true">↗</span></span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
