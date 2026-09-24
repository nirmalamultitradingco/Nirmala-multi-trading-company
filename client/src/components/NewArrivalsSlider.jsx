import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { asset } from '../api/axios.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const DEFAULT_NEW_ARRIVALS = [
  {
    _id: 'na-1',
    name: 'Sortex-Cleaned Cumin Seeds (Jeera)',
    slug: 'sortex-cumin-seeds-jeera',
    segment: { name: 'Spices & Seasonings' },
    origin: 'Unjha, Gujarat',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=75',
    shortDescription: '99.5% European purity, Sortex machine graded with volatile oil content > 3.0% and low moisture.',
    hsCode: '090931',
    packageType: '25kg Multi-wall Paper',
    moq: '1 x 20ft FCL',
  },
  {
    _id: 'na-2',
    name: '1121 Steam Basmati Rice (8.35mm+)',
    slug: '1121-steam-basmati-rice',
    segment: { name: 'Grains & Pulses' },
    origin: 'Punjab & Haryana',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=75',
    shortDescription: 'Extra-long slender grain, rich aroma, and 2.5x elongation upon cooking. Aflatoxin tested.',
    hsCode: '100630',
    packageType: '10kg / 25kg Non-Woven',
    moq: '1 x 20ft FCL',
  },
  {
    _id: 'na-3',
    name: 'High Curcumin Turmeric Fingers',
    slug: 'high-curcumin-turmeric-fingers',
    segment: { name: 'Spices & Seasonings' },
    origin: 'Salem / Nizamabad',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=75',
    shortDescription: 'Deep golden yellow fingers with 3.8%–5.2% natural curcumin. Free of Sudan dyes and lead chromate.',
    hsCode: '091030',
    packageType: '25kg / 50kg Jute & PP',
    moq: '1 x 20ft FCL',
  },
  {
    _id: 'na-4',
    name: 'Dehydrated White Onion Flakes / Kibbled',
    slug: 'dehydrated-white-onion-flakes',
    segment: { name: 'Dehydrated Foods' },
    origin: 'Mahuva, Gujarat',
    image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=800&q=75',
    shortDescription: 'Crisp, pungent dehydrated onion kibbled with moisture < 5.5%. Microbial assay for zero Salmonella.',
    hsCode: '071220',
    packageType: '14kg Carton with Poly Liner',
    moq: '1 x 20ft FCL',
  },
  {
    _id: 'na-5',
    name: 'Hulled White Sesame Seeds (99.98% Purity)',
    slug: 'hulled-white-sesame-seeds',
    segment: { name: 'Oil Seeds & Commodities' },
    origin: 'Saurashtra, Gujarat',
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=75',
    shortDescription: 'Auto-sortex mechanical hulled white sesame for premium bakery, confectioneries, and tahini paste.',
    hsCode: '120740',
    packageType: '25kg Paper Bag / 50lb PP',
    moq: '1 x 20ft FCL',
  },
  {
    _id: 'na-6',
    name: 'Teja S17 Stemless Red Chilli',
    slug: 'teja-s17-stemless-red-chilli',
    segment: { name: 'Spices & Seasonings' },
    origin: 'Guntur, Andhra Pradesh',
    image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=75',
    shortDescription: 'Hot fiery grade with 75,000–100,000 SHU heat value, natural red ASTA color, and stemless sorting.',
    hsCode: '090421',
    packageType: '10kg / 25kg PP Bale Packing',
    moq: '1 x 20ft FCL',
  },
];

export default function NewArrivalsSlider({ products = [], config = null }) {
  const { t } = useLanguage();

  // If admin provided arrival items, use them; otherwise fallback to dynamic products or defaults
  const customItems = Array.isArray(config?.items)
    ? config.items.filter((item) => item.isActive !== false)
    : [];

  const displayProducts = customItems.length > 0
    ? customItems
    : (products.length > 0 ? products : DEFAULT_NEW_ARRIVALS);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);
  const touchStartX = useRef(null);

  // Dynamically calculate visible cards based on screen width
  useEffect(() => {
    const updateVisible = () => {
      const w = window.innerWidth;
      if (w < 640) setVisibleCount(1);
      else if (w < 1024) setVisibleCount(2);
      else if (w < 1280) setVisibleCount(3);
      else setVisibleCount(4);
    };

    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  const total = displayProducts.length;
  const maxIndex = Math.max(0, total - visibleCount);

  // Auto-rotating slider effect with admin-defined or default duration
  useEffect(() => {
    if (total <= visibleCount || isHovered) return undefined;

    const intervalSeconds = Number(config?.autoRotateSeconds);
    const intervalMs = !isNaN(intervalSeconds) && intervalSeconds > 0
      ? intervalSeconds * 1000
      : 3800;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [total, visibleCount, maxIndex, isHovered, config?.autoRotateSeconds]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
    touchStartX.current = null;
  };

  if (!displayProducts.length) return null;

  const cardWidthPercent = 100 / visibleCount;

  return (
    <div
      className="relative mt-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="New Product Arrivals"
    >
      {/* Slider Window */}
      <div className="overflow-hidden rounded-2xl py-3 px-1">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform: `translateX(-${currentIndex * cardWidthPercent}%)`,
          }}
        >
          {displayProducts.map((product) => {
            const detailUrl = product.slug ? `/product-details/${product.slug}` : '/products';
            const segmentName = product.categoryName || product.segment?.name || 'Agro Commodity';
            const badgeText = product.badge || config?.badge || t('newArrival') || '✨ New Arrival';
            const imgSrc = product.image
              ? product.image.startsWith('http')
                ? product.image
                : asset(product.image)
              : '';

            return (
              <div
                key={product._id || product.slug || product.name}
                className="shrink-0 px-3 transition-all duration-300"
                style={{ width: `${cardWidthPercent}%` }}
              >
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line/90 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-xl">
                  {/* Top Image Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#faf8f4]">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-mono text-xs text-ink/30">
                        {t('noImage') || 'No image'}
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* "New Arrival" Gold Badge */}
                    <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-forest/90 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-gold shadow-md backdrop-blur border border-gold/40">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold animate-ping" />
                      <span>{badgeText}</span>
                    </div>

                    {/* Origin Tag */}
                    {product.origin && (
                      <div className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-ink shadow-sm backdrop-blur">
                        📍 {product.origin}
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col p-5">
                    {/* Segment Eyebrow */}
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-moss">
                      {segmentName}
                    </p>

                    {/* Product Title */}
                    <h3 className="mt-1 line-clamp-1 font-display text-lg font-extrabold text-ink transition-colors group-hover:text-forest">
                      <Link to={detailUrl}>{product.name}</Link>
                    </h3>

                    {/* Short Description */}
                    {product.shortDescription && (
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink/70">
                        {product.shortDescription}
                      </p>
                    )}

                    {/* Technical Specifications Pills */}
                    <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line/60 pt-3 text-[11px]">
                      {product.hsCode && (
                        <span className="rounded-md bg-paper px-2 py-0.5 font-mono font-medium text-ink/75">
                          HS: {product.hsCode}
                        </span>
                      )}
                      {product.packageType && (
                        <span className="rounded-md bg-paper px-2 py-0.5 font-medium text-ink/75">
                          📦 {product.packageType}
                        </span>
                      )}
                      {product.moq && (
                        <span className="rounded-md bg-forest/10 px-2 py-0.5 font-mono font-semibold text-forest">
                          MOQ: {product.moq}
                        </span>
                      )}
                    </div>

                    {/* Actions Footer */}
                    <div className="mt-5 flex items-center justify-between gap-2 pt-2">
                      <Link
                        to={`/inquiry?product=${product._id}`}
                        className="rounded-xl bg-forest px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-forest/90 hover:shadow"
                      >
                        {t('getQuote') || 'Inquire Now'} →
                      </Link>

                      <Link
                        to={detailUrl}
                        className="rounded-xl border border-line bg-white px-3 py-2 text-xs font-semibold text-ink/80 transition hover:border-gold hover:text-ink"
                      >
                        {t('specs') || 'Specs'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrow Controls */}
      {total > visibleCount && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous arrival"
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper/95 text-ink shadow-lg backdrop-blur transition hover:border-gold hover:bg-forest hover:text-paper"
          >
            <span className="text-xl leading-none select-none">‹</span>
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next arrival"
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper/95 text-ink shadow-lg backdrop-blur transition hover:border-gold hover:bg-forest hover:text-paper"
          >
            <span className="text-xl leading-none select-none">›</span>
          </button>
        </>
      )}

      {/* Slide Dots Indicator */}
      {maxIndex > 0 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? 'w-8 bg-gold shadow-sm'
                  : 'w-2 bg-ink/20 hover:bg-ink/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
