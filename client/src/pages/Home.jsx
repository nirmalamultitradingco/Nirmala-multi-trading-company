import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { BRAND } from '../config.js';
import SectionHeading from '../components/SectionHeading.jsx';
import ProductCard from '../components/ProductCard.jsx';
import SegmentCard from '../components/SegmentCard.jsx';
import PartnerCard from '../components/PartnerCard.jsx';
import Loader from '../components/Loader.jsx';

const pillars = [
  {
    n: '01',
    title: 'We source & vet',
    body: 'We partner directly with growers and processors, verify certifications, and inspect quality before anything is listed.',
  },
  {
    n: '02',
    title: 'We ready for export',
    body: 'Grading, packing, documentation and HS classification handled so shipments clear customs without friction.',
  },
  {
    n: '03',
    title: 'We deliver to buyers',
    body: 'One point of contact for pricing, samples and logistics across multiple product segments and origins.',
  },
];

export default function Home() {
  const [data, setData] = useState({ segments: [], featured: [], partners: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/segments'),
      api.get('/products', { params: { featured: 'true', limit: 6 } }),
      api.get('/partners'),
    ])
      .then(([seg, prod, part]) =>
        setData({
          segments: seg.data.slice(0, 4),
          featured: prod.data.products,
          partners: part.data.slice(0, 6),
        })
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="container-x grid items-center gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <p className="eyebrow">{BRAND.tagline}</p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Export-ready food,
              <br />
              <span className="text-forest">from source to shelf.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/65">{BRAND.blurb}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary">Browse products</Link>
              <Link to="/inquiry" className="btn-outline">Request a quote</Link>
            </div>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-6">
              {[
                ['Segments', data.segments.length || '—'],
                ['Partners', data.partners.length || '—'],
                ['Certified', 'ISO · FSSAI'],
              ].map(([k, v]) => (
                <div key={k}>
                  <dd className="font-display text-2xl font-extrabold text-ink">{v}</dd>
                  <dt className="font-mono text-[11px] uppercase tracking-widest text-ink/50">{k}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-line shadow-card">
              <img
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1000&q=70"
                alt="Assorted export food products"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 hidden rounded-xl border border-line bg-paper px-4 py-3 shadow-card sm:block">
              <p className="font-mono text-[11px] uppercase tracking-widest text-moss">Ships from</p>
              <p className="font-display font-bold text-ink">{BRAND.address}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="container-x py-16 md:py-20">
        <SectionHeading eyebrow="How we work" title="A single bridge to global buyers">
          Three steps that turn a grower's harvest into a compliant, on-time export shipment.
        </SectionHeading>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.n} className="rounded-xl border border-line bg-white p-6 shadow-card">
              <span className="font-mono text-sm font-medium text-gold">{p.n}</span>
              <h3 className="mt-3 font-display text-xl font-bold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Featured products */}
          {data.featured.length > 0 && (
            <section className="container-x py-6 md:py-10">
              <div className="flex items-end justify-between gap-4">
                <SectionHeading eyebrow="The next shipment" title="Featured products" />
                <Link to="/products" className="hidden shrink-0 text-sm font-medium text-forest hover:underline sm:block">
                  View all →
                </Link>
              </div>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {data.featured.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          )}

          {/* Segments */}
          {data.segments.length > 0 && (
            <section className="container-x py-16 md:py-20">
              <div className="flex items-end justify-between gap-4">
                <SectionHeading eyebrow="Product segments" title="Explore by category" />
                <Link to="/segments" className="hidden shrink-0 text-sm font-medium text-forest hover:underline sm:block">
                  All segments →
                </Link>
              </div>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {data.segments.map((s) => (
                  <SegmentCard key={s._id} segment={s} />
                ))}
              </div>
            </section>
          )}

          {/* Partners */}
          {data.partners.length > 0 && (
            <section className="border-y border-line bg-white/60">
              <div className="container-x py-16 md:py-20">
                <SectionHeading eyebrow="Collaborations" title="Companies we work with" align="center">
                  We list and represent products from trusted growers and food companies.
                </SectionHeading>
                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {data.partners.map((p) => (
                    <PartnerCard key={p._id} partner={p} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* CTA */}
      <section className="container-x py-16 md:py-24">
        <div className="overflow-hidden rounded-2xl bg-forest px-8 py-14 text-center text-paper md:px-16">
          <p className="eyebrow text-gold">Ready to talk?</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Tell us what you're buying — we'll send samples and pricing.
          </h2>
          <Link to="/inquiry" className="btn-gold mt-8">Send an inquiry</Link>
        </div>
      </section>
    </div>
  );
}
