
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import api from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import SectionHeading from '../components/SectionHeading.jsx';

import HeroSlider from '../components/HeroSlider.jsx';
import FeaturedProductsSlider from '../components/FeaturedProductsSlider.jsx';
import NewArrivalsSlider from '../components/NewArrivalsSlider.jsx';
import ExploreProductsSlider from '../components/ExploreProductsSlider.jsx';
import EngineerTradeSection from '../components/EngineerTradeSection.jsx';
import PartnersSlider from '../components/PartnersSlider.jsx';
import GlobalServedMap from '../components/GlobalServedMap.jsx';
import CertificateSlider from '../components/CertificateSlider.jsx';

export default function Home() {
  const [data, setData] = useState({
    segments: [],
    featured: [],
    newArrivals: [],
    partners: [],
    engineerTrade: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadHomeData = async () => {
      try {
        const [seg, prodFeatured, prodLatest, part, content] = await Promise.all([
          api.get('/segments'),
          api.get('/products', {
            params: {
              featured: 'true',
              limit: 12,
            },
          }),
          api.get('/products', {
            params: {
              limit: 12,
            },
          }),
          api.get('/partners'),
          api.get('/site-content'),
        ]);

        if (!mounted) return;

        const segments = Array.isArray(seg?.data) ? seg.data : [];
        const featured = Array.isArray(prodFeatured?.data?.products) ? prodFeatured.data.products : [];
        const newArrivals = Array.isArray(prodLatest?.data?.products) ? prodLatest.data.products : [];
        const partners = Array.isArray(part?.data) ? part.data : [];
        const engineerTrade = content?.data?.engineerTrade || null;

        setData({
          segments,
          featured,
          newArrivals,
          partners,
          engineerTrade,
        });
      } catch (error) {
        console.error('Home page API error:', error);

        if (!mounted) return;

        setData({
          segments: [],
          featured: [],
          newArrivals: [],
          partners: [],
          engineerTrade: null,
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [loading, data.featured.length, data.newArrivals.length, data.segments.length, data.partners.length, data.engineerTrade]);

  return (
    <div className="overflow-x-hidden">
      {/* 1. HERO BANNER */}
      <HeroSlider />

      {/* API CONTENT */}
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* 2. FEATURED PRODUCTS (AUTO-ROTATING CAROUSEL) */}
          {data.featured.length > 0 && (
            <section className="container-x py-16 md:py-20 home-reveal-section">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end home-reveal">
                <SectionHeading
                  eyebrow="The next shipment"
                  title="Featured product details"
                />
                <Link
                  to="/product-details"
                  className="text-sm font-semibold text-forest hover:text-ink transition hover:underline"
                >
                  All product details →
                </Link>
              </div>

              <FeaturedProductsSlider products={data.featured} />
            </section>
          )}

          {/* 3. NEW PRODUCT ARRIVALS (AUTO-ROTATING CAROUSEL SLIDE) */}
          <section className="container-x py-12 md:py-16 home-reveal-section border-t border-line/60">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end home-reveal">
              <SectionHeading
                eyebrow="Fresh Season Harvest"
                title="New product arrivals"
              />
              <Link
                to="/products"
                className="text-sm font-semibold text-forest hover:text-ink transition hover:underline"
              >
                Browse all categories →
              </Link>
            </div>

            <NewArrivalsSlider products={data.newArrivals} />
          </section>

          {/* 4. EXPLORE OUR PRODUCTS (AUTO-ROTATING CAROUSEL) */}
          {data.segments.length > 0 && (
            <ExploreProductsSlider segments={data.segments} />
          )}

          {/* 5. ENGINEER HIGH-VOLUME TRADE (ADMIN-MANAGED WITH GREEN BACKGROUND) */}
          <EngineerTradeSection content={data.engineerTrade} />

          {/* 6. COMPANIES WE WORK WITH (AUTO-ROTATING CAROUSEL) */}
          {data.partners.length > 0 && (
            <PartnersSlider partners={data.partners} />
          )}
        </>
      )}

      {/* 7. GLOBAL EXPORT DESTINATIONS MAP */}
      <GlobalServedMap />

      {/* 8. CERTIFICATES & ACCREDITATIONS (AUTO-ROTATING CAROUSEL) */}
      <CertificateSlider />

      {/* 9. CALL TO ACTION */}
      <section className="container-x py-16 md:py-24 home-reveal-section">
        <div className="home-reveal overflow-hidden rounded-3xl bg-forest px-8 py-16 text-center text-paper md:px-16 shadow-2xl">
          <p className="eyebrow text-gold">Ready to talk?</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Tell us what you're buying — we'll send samples and pricing.
          </h2>
          <Link to="/inquiry" className="btn-gold mt-8 animated-cta">
            Send an inquiry
          </Link>
        </div>
      </section>
    </div>
  );
}

