import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { asset } from '../api/axios.js';
import Loader from '../components/Loader.jsx';

const formatDate = (date) => {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  } catch {
    return '';
  }
};

export default function NewsDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/news/${slug}`)
      .then((r) => setItem(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader />;
  if (error || !item)
    return (
      <div className="container-x py-20">
        <p className="text-clay">{error || 'Blog article not found.'}</p>
        <Link to="/blog" className="btn-outline mt-5">
          ← Back to Blog
        </Link>
      </div>
    );

  const galleryImages = (item.images || []).filter(Boolean);
  const sections = (item.sections || []).filter((s) => s.subtitle || s.text || s.image);

  return (
    <article className="container-x py-14 md:py-20">
      <Link to="/blog" className="text-sm font-medium text-forest hover:underline">
        ← Back to Blog
      </Link>
      <div className="mx-auto mt-8 max-w-4xl">
        {item.publishedAt && <p className="eyebrow">{formatDate(item.publishedAt)}</p>}
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          {item.title || 'Untitled Article'}
        </h1>
        {item.excerpt && <p className="mt-5 text-xl leading-relaxed text-ink/65">{item.excerpt}</p>}

        {/* Primary Cover Image */}
        {item.image && (
          <div className="mt-9 overflow-hidden rounded-2xl border border-line bg-line shadow-card">
            <img
              src={asset(item.image)}
              alt={item.title || ''}
              className="max-h-[620px] w-full object-cover"
            />
          </div>
        )}

        {/* Main Content */}
        {item.content && (
          <div className="mt-9 whitespace-pre-line text-base leading-8 text-ink/75">
            {item.content}
          </div>
        )}

        {/* Multiple Content Sections */}
        {sections.length > 0 && (
          <div className="mt-12 space-y-10 border-t border-line/70 pt-8">
            {sections.map((sec, idx) => (
              <div key={sec._id || idx} className="space-y-4">
                {sec.subtitle && (
                  <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                    {sec.subtitle}
                  </h2>
                )}
                {sec.image && (
                  <div className="overflow-hidden rounded-2xl border border-line bg-line shadow-sm">
                    <img
                      src={asset(sec.image)}
                      alt={sec.subtitle || `Section image ${idx + 1}`}
                      className="max-h-[480px] w-full object-cover"
                    />
                  </div>
                )}
                {sec.text && (
                  <div className="whitespace-pre-line text-base leading-8 text-ink/75">
                    {sec.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Gallery / Multiple Images */}
        {galleryImages.length > 0 && (
          <div className="mt-14 border-t border-line/70 pt-10">
            <h3 className="font-display text-2xl font-bold text-ink">Photo Gallery</h3>
            <p className="mt-1 text-sm text-ink/60">Additional imagery and field documentation.</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="group aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-line shadow-card"
                >
                  <img
                    src={asset(img)}
                    alt={`Gallery ${idx + 1}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
