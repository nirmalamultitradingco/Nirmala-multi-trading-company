import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { asset } from '../api/axios.js';
import SectionHeading from '../components/SectionHeading.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }).format(
    new Date(date)
  );

export default function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/news')
      .then((r) => setItems(r.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-x py-14 md:py-20">
      <SectionHeading eyebrow="Media & Articles" title="Blog">
        Latest insights, global commodity market updates, company announcements, and trade stories.
      </SectionHeading>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No blog posts published yet"
            hint="Blog posts added from the admin panel will appear here."
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item._id}
              className="group overflow-hidden rounded-2xl border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <Link to={`/blog/${item.slug}`}>
                <div className="aspect-[16/10] overflow-hidden bg-line">
                  {item.image ? (
                    <img
                      src={asset(item.image)}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-ink/30">NMC</div>
                  )}
                </div>
                <div className="p-5">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-moss">
                    {formatDate(item.publishedAt)}
                  </p>
                  <h2 className="mt-2 font-display text-xl font-bold leading-snug text-ink">
                    {item.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/60">
                    {item.excerpt || item.content}
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-forest">
                    Read Article →
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
