import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { asset } from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import SubSegmentCard from '../components/SubSegmentCard.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function SegmentDetail() {
  const { slug, subsegmentSlug } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [siteContent, setSiteContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/site-content').then((r) => setSiteContent(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    const query = subsegmentSlug ? { subsegment: subsegmentSlug } : undefined;

    api
      .get(`/segments/${slug}`, { params: query })
      .then((r) => setData(r.data))
      .catch((e) => {
        setData(null);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [slug, subsegmentSlug]);

  const selected = data?.selectedSubsegment;
  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="container-x py-20">
        <EmptyState title={t('segmentNotFound')} hint={error} />
      </div>
    );
  }

  const { segment, subsegments, products } = data;
  const hasSubsegments = Boolean(subsegments?.length);

  return (
    <div>
      <section className="relative border-b border-line">
        {segment.image && (
          <div className="absolute inset-0">
            <img
              src={asset(segment.image)}
              alt=""
              className="h-full w-full object-cover opacity-15"
            />
          </div>
        )}
        <div className="container-x relative py-16 md:py-20 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Link
              to="/products"
              className="font-mono text-xs uppercase tracking-widest text-moss hover:underline"
            >
              ← {t('products') || 'All Products'}
            </Link>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              {segment.name}
            </h1>
            <p className="mt-4 text-lg text-ink/65">{segment.description}</p>
          </div>
          <Link
            to={`/inquiry?segment=${segment._id}`}
            className="btn-primary shrink-0 shadow-sm"
          >
            Inquire about {segment.name} →
          </Link>
        </div>
      </section>

      {hasSubsegments && !selected ? (
        <section className="container-x py-12 md:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-gold font-mono">PRODUCT: {segment.name}</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl">
                {t('subProducts') || 'Sub Products'}
              </h2>
              <p className="mt-2 max-w-2xl text-ink/60">
                {t('selectSubProduct') || 'Select a sub product to view product details in this category.'}
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {subsegments.map((subsegment) => (
              <SubSegmentCard
                key={subsegment._id}
                subsegment={subsegment}
                segmentSlug={slug}
              />
            ))}
          </div>
        </section>
      ) : selected ? (
        <section className="container-x py-10 md:py-14">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              to={`/products/${slug}`}
              className="font-mono text-xs uppercase tracking-widest text-moss hover:underline"
            >
              ← {t('backToSubProducts') || 'Back to sub products'}
            </Link>
          </div>

          <div className="rounded-xl border border-line bg-white px-6 py-7 shadow-card md:px-9 md:py-8">
            <p className="eyebrow text-gold font-mono">PRODUCT: {segment.name}</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {selected.name}
            </h2>
          </div>

          <div className="mt-10">
            <div className="mb-5">
              <p className="eyebrow text-gold font-mono">SUB PRODUCT: {selected.name}</p>
              <h3 className="mt-1 font-display text-2xl font-extrabold text-ink">
                {t('productDetails') || 'Product Details'}
              </h3>
            </div>

            {products.length === 0 ? (
              <EmptyState
                title={t('noProductDetails') || 'No product details in this category yet'}
                hint={t('addProducts')}
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="container-x py-14">
          {products.length === 0 ? (
            <EmptyState title={t('noSegmentProducts')} hint={t('checkBack')} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Trust Pillars Bar */}
      {siteContent?.productsPage?.trustBar?.isActive !== false && (
        <div className="container-x pb-12">
          <section className="rounded-3xl border border-line/70 bg-gradient-to-br from-white/95 via-[#fcfbfa] to-[#f7f4ed] p-6 sm:p-10 shadow-sm">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-gold">NMC ASSURANCE</span>
              <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold text-ink">
                {siteContent?.productsPage?.trustBar?.title || 'Why Global Buyers Trust Nirmala Multi Trading Co.'}
              </h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(siteContent?.productsPage?.trustBar?.items && siteContent.productsPage.trustBar.items.length > 0
                ? siteContent.productsPage.trustBar.items
                : [
                    {
                      icon: '🔍',
                      title: '100% Sortex Optical Cleaning',
                      text: 'Laser graded to 99.5% European purity with zero foreign contaminants.',
                    },
                    {
                      icon: '🚢',
                      title: 'Port-Direct Logistics',
                      text: 'Express sailings from Mundra Port and JNPT Nhava Sheva to worldwide ports.',
                    },
                    {
                      icon: '📜',
                      title: 'Phyto & MRL Compliance',
                      text: 'Pre-shipment phytosanitary and aflatoxin lab assays with every container.',
                    },
                    {
                      icon: '📦',
                      title: 'Custom Packaging & Branding',
                      text: 'From 25kg multi-wall paper bags to buyer-branded retail standup pouches.',
                    },
                  ]
              ).map((pillar, idx) => (
                <div
                  key={pillar._id || idx}
                  className="group relative rounded-2xl border border-line/60 bg-white p-5 shadow-xs transition duration-300 hover:border-gold/60 hover:shadow-md"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-forest/5 text-xl transition-transform duration-300 group-hover:scale-110">
                    {pillar.icon || '✨'}
                  </div>
                  <h4 className="font-display text-sm font-bold text-ink">
                    {pillar.title}
                  </h4>
                  <p className="mt-1 text-xs text-ink/70 leading-relaxed">
                    {pillar.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Container Export Quotation CTA Banner */}
      {siteContent?.productsPage?.ctaBanner?.isActive !== false && (
        <div className="container-x pb-16">
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c241b] via-[#16382b] to-[#1f4e3c] p-8 sm:p-12 text-white shadow-xl border border-gold/40">
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative z-10 max-w-2xl">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-gold">
                {siteContent?.productsPage?.ctaBanner?.eyebrow || 'READY FOR EXPORT ORDERS'}
              </span>
              <h3 className="mt-2 font-display text-2xl sm:text-4xl font-black leading-tight text-paper">
                {siteContent?.productsPage?.ctaBanner?.title || 'Need Container Freight Quotations or Custom Samples?'}
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-paper/85 leading-relaxed">
                {siteContent?.productsPage?.ctaBanner?.description ||
                  'Our international trade desk prepares formal FOB (Mundra/JNPT) or CIF proforma invoices within 12–24 business hours. Courier sample kits dispatched worldwide.'}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to={siteContent?.productsPage?.ctaBanner?.buttonPrimaryLink || '/inquiry'}
                  className="rounded-full bg-gold px-6 py-3 text-xs font-bold text-ink shadow-md transition hover:bg-gold/90 hover:scale-105"
                >
                  {siteContent?.productsPage?.ctaBanner?.buttonPrimaryText || 'Request Official Quotation →'}
                </Link>
                <Link
                  to={siteContent?.productsPage?.ctaBanner?.buttonSecondaryLink || '/brochures'}
                  className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-xs font-semibold text-white transition hover:bg-white/20"
                >
                  {siteContent?.productsPage?.ctaBanner?.buttonSecondaryText || 'Download Product Brochures'} 📄
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
