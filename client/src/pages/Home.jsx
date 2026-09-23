
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import api from '../api/axios.js';
import { BRAND } from '../config.js';

import SectionHeading from '../components/SectionHeading.jsx';
import ProductCard from '../components/ProductCard.jsx';
import SegmentCard from '../components/SegmentCard.jsx';
import PartnerCard from '../components/PartnerCard.jsx';
import Loader from '../components/Loader.jsx';

import HeroSlider from '../components/HeroSlider.jsx';
import FeaturedProductsSlider from '../components/FeaturedProductsSlider.jsx';
import GlobalServedMap from '../components/GlobalServedMap.jsx';
import CertificateSlider from '../components/CertificateSlider.jsx';

export default function Home() {
  const [data, setData] = useState({
    segments: [],
    featured: [],
    partners: [],
    homeOfferings: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadHomeData = async () => {
      try {
        const [seg, prod, part, content] = await Promise.all([
          api.get('/segments'),

          api.get('/products', {
            params: {
              featured: 'true',
              limit: 12,
            },
          }),

          api.get('/partners'),
          api.get('/site-content'),
        ]);

        if (!mounted) return;

        const segments = Array.isArray(seg?.data)
          ? seg.data.slice(0, 4)
          : [];

        const featured = Array.isArray(prod?.data?.products)
          ? prod.data.products
          : [];

        const partners = Array.isArray(part?.data)
          ? part.data.slice(0, 6)
          : [];
        const homeOfferings = content?.data?.homeOfferings || null;

        setData({
          segments,
          featured,
          partners,
          homeOfferings,
        });

      } catch (error) {
        console.error('Home page API error:', error);

        if (!mounted) return;

        setData({
          segments: [],
          featured: [],
          partners: [],
          homeOfferings: null,
        });

      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadHomeData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll('.home-reveal, .home-reveal-item');
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [loading, data.featured.length, data.segments.length, data.partners.length, data.homeOfferings]);

  return (
    <div>

      {/* =====================================================
          HERO
          ===================================================== */}
      <HeroSlider />

      {/* =====================================================
          API CONTENT
          ===================================================== */}

      {loading ? (

        <Loader />

      ) : (

        <>

          {/* =================================================
              FEATURED PRODUCTS (AUTO-ROTATING CAROUSEL)
              ================================================= */}

          {data.featured.length > 0 && (

            <section className="container-x py-6 md:py-10 home-reveal-section">

              <div className="flex items-end justify-between gap-4">

                <SectionHeading
                  eyebrow="The next shipment"
                  title="Featured product details"
                  className="home-reveal"
                />

                <Link
                  to="/product-details"
                  className="hidden shrink-0 text-sm font-medium text-forest hover:underline sm:block"
                >
                  All product details →
                </Link>

              </div>

              <FeaturedProductsSlider products={data.featured} />

            </section>

          )}


          {/* =================================================
              PRODUCTS (CATEGORIES)
              ================================================= */}

          {data.segments.length > 0 && (

            <section className="container-x py-16 md:py-20 home-reveal-section">

              <div className="flex items-end justify-between gap-4">

                <SectionHeading
                  eyebrow="Products"
                  title="Explore our products"
                  className="home-reveal"
                />


                <Link
                  to="/products"
                  className="hidden shrink-0 text-sm font-medium text-forest hover:underline sm:block"
                >
                  All products →
                </Link>

              </div>


              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {data.segments.map((segment) => (

                  <div className="home-reveal-item">
                  <SegmentCard
                    key={segment._id}
                    segment={segment}
                  />
                </div>
                ))}

              </div>

            </section>

          )}


          {/* =================================================
              WHAT WE OFFER
              ================================================= */}

          {data.homeOfferings?.items?.filter((item) => item.isActive !== false).length > 0 && (
            <section className="border-y border-line bg-paper home-reveal-section">
              <div className="container-x py-16 md:py-20">
                <SectionHeading
                  eyebrow={data.homeOfferings.eyebrow}
                  title={data.homeOfferings.title}
                  className="home-reveal"
                  align="center"
                >
                  {data.homeOfferings.description}
                </SectionHeading>

                <div className="mt-10 grid gap-5 md:grid-cols-3">
                  {data.homeOfferings.items
                    .filter((item) => item.isActive !== false)
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((item, index) => (
                      <article
                        key={item._id || index}
                        className="home-reveal-item cursor-pointer rounded-2xl border border-line bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        <span className="font-mono text-sm font-semibold text-gold">
                          {item.icon || String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="mt-4 font-display text-xl font-bold text-ink">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink/65">
                          {item.description}
                        </p>
                      </article>
                    ))}
                </div>
              </div>
            </section>
          )}

          {/* =================================================
              MERCHANT FOOD EXPORTER LOGISTICS & PORT CAPABILITIES
              ================================================= */}
          <section className="border-b border-line bg-gradient-to-b from-[#fbf8f4] to-white home-reveal-section">
            <div className="container-x py-16 md:py-24">
              <div className="text-center max-w-3xl mx-auto home-reveal">
                <span className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-forest">
                  <span>⚓</span> Global Merchant Food Exporter Capabilities
                </span>
                <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
                  Engineered for High-Volume International Trade
                </h2>
                <p className="mt-3 text-base text-ink/70 leading-relaxed">
                  We bridge global importers, distributors, and supermarket chains with certified Indian farm clusters, handling end-to-end container logistics, customs clearance, and private labeling.
                </p>
              </div>

              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* 1. Container Loading */}
                <div className="home-reveal-item rounded-3xl border border-line/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gold">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-2xl border border-amber-200">
                      🚢
                    </span>
                    <span className="font-mono text-[11px] font-bold text-forest bg-forest/10 rounded-full px-2.5 py-0.5">
                      FCL & LCL
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-ink">Container Consolidation</h3>
                  <p className="mt-2 text-xs text-ink/65 leading-relaxed">
                    20ft GP (18-20 MT) and 40ft High Cube (26-28 MT) loadings. Multi-commodity consolidation in a single container for trial consignments.
                  </p>
                  <div className="mt-4 pt-4 border-t border-line/50 font-mono text-[11px] text-ink/50">
                    Max payload · Palletized / Loose
                  </div>
                </div>

                {/* 2. Direct Port Corridors */}
                <div className="home-reveal-item rounded-3xl border border-line/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gold">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-2xl border border-blue-200">
                      ⚓
                    </span>
                    <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 rounded-full px-2.5 py-0.5">
                      INMUN1 & INNSA
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-ink">Mundra & JNPT Ports</h3>
                  <p className="mt-2 text-xs text-ink/65 leading-relaxed">
                    Strategic ocean corridor stuffing directly at Mundra Port (Gujarat) and JNPT Nhava Sheva (Mumbai) with fast 48h vessel customs clearance.
                  </p>
                  <div className="mt-4 pt-4 border-t border-line/50 font-mono text-[11px] text-ink/50">
                    FOB · CIF · CFR · Ex-Works
                  </div>
                </div>

                {/* 3. Custom Private Labeling */}
                <div className="home-reveal-item rounded-3xl border border-line/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gold">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-2xl border border-emerald-200">
                      🏷️
                    </span>
                    <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-0.5">
                      OEM / ODM
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-ink">Private Label Packaging</h3>
                  <p className="mt-2 text-xs text-ink/65 leading-relaxed">
                    Custom retail standup barrier pouches (100g to 1kg) with nitrogen flush, zipper locks, and master export cartons bearing your supermarket brand.
                  </p>
                  <div className="mt-4 pt-4 border-t border-line/50 font-mono text-[11px] text-ink/50">
                    Retail Pouches · 25/50kg PP Bags
                  </div>
                </div>

                {/* 4. Inspection & Compliance */}
                <div className="home-reveal-item rounded-3xl border border-line/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gold">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-2xl border border-rose-200">
                      🔬
                    </span>
                    <span className="font-mono text-[11px] font-bold text-rose-700 bg-rose-50 rounded-full px-2.5 py-0.5">
                      SGS / TUV
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-ink">Audit-Ready Compliance</h3>
                  <p className="mt-2 text-xs text-ink/65 leading-relaxed">
                    Phytosanitary certification, Certificate of Origin (COO), Sortex laser cleaning, and comprehensive MRL pesticide residue lab clearance.
                  </p>
                  <div className="mt-4 pt-4 border-t border-line/50 font-mono text-[11px] text-ink/50">
                    APEDA · Spices Board · US FDA
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              PARTNERS
              ================================================= */}

          {data.partners.length > 0 && (

            <section className="border-y border-line bg-white/60 home-reveal-section">

              <div className="container-x py-16 md:py-20">

                <SectionHeading
                  eyebrow="Collaborations"
                  title="Companies we work with"
                  className="home-reveal"
                  align="center"
                >
                  We list and represent products from trusted growers
                  and food companies.
                </SectionHeading>


                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                  {data.partners.map((partner) => (

                    <div className="home-reveal-item">
                    <PartnerCard
                      key={partner._id}
                      partner={partner}
                    />
                  </div>
                  ))}

                </div>

              </div>

            </section>

          )}

        </>

      )}


      {/* =====================================================
          GLOBAL SERVED SEGMENTS MAP
          ===================================================== */}
      <GlobalServedMap />


      {/* =====================================================
          CERTIFICATES SLIDER
          ===================================================== */}
      <CertificateSlider />


      {/* =====================================================
          CTA
          ===================================================== */}

      <section className="container-x py-16 md:py-24 home-reveal-section">

        <div className="home-reveal overflow-hidden rounded-2xl bg-forest px-8 py-14 text-center text-paper md:px-16">

          <p className="eyebrow text-gold">
            Ready to talk?
          </p>


          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Tell us what you're buying — we'll send samples and pricing.
          </h2>


          <Link
            to="/inquiry"
            className="btn-gold mt-8 animated-cta"
          >
            Send an inquiry
          </Link>

        </div>

      </section>


    </div>
  );
}

