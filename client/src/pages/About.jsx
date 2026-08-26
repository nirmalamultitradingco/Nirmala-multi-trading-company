import { Link } from 'react-router-dom';
import { BRAND } from '../config.js';
import SectionHeading from '../components/SectionHeading.jsx';

export default function About() {
  return (
    <div>
      <section className="border-b border-line">
        <div className="container-x py-16 md:py-20">
          <p className="eyebrow">About us</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            A trading partner built around trust, quality and clean paperwork.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink/65">{BRAND.blurb}</p>
        </div>
      </section>

      <section className="container-x grid gap-12 py-16 md:grid-cols-2 md:py-20">
        <div>
          <SectionHeading eyebrow="Our approach" title="What sets us apart" />
          <ul className="mt-6 space-y-4">
            {[
              ['Verified sourcing', 'We work directly with growers and processors and check certifications before listing.'],
              ['Export compliance', 'HS codes, documentation and packing handled so shipments clear smoothly.'],
              ['One point of contact', 'Samples, pricing and logistics across every segment, coordinated by one team.'],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
                <div>
                  <p className="font-display font-bold text-ink">{t}</p>
                  <p className="text-sm text-ink/65">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden rounded-2xl border border-line shadow-card">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=70"
            alt="Market of food products"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="container-x pb-20">
        <div className="rounded-2xl border border-line bg-white p-8 text-center shadow-card md:p-12">
          <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
            Looking for a specific product?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-ink/65">
            Tell us the product, spec and destination — we'll come back with options and pricing.
          </p>
          <Link to="/inquiry" className="btn-primary mt-6">Get in touch</Link>
        </div>
      </section>
    </div>
  );
}
