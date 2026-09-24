import { useState, useEffect, useRef } from 'react';

const CAPABILITIES = [
  {
    id: 'container-consolidation',
    icon: '🚢',
    tag: 'FCL & LCL',
    tagClass: 'text-forest bg-forest/10',
    iconBoxClass: 'bg-amber-50 text-2xl border border-amber-200',
    title: 'Container Consolidation',
    description:
      '20ft GP (18-20 MT) and 40ft High Cube (26-28 MT) loadings. Multi-commodity consolidation in a single container for trial consignments.',
    footer: 'Max payload · Palletized / Loose',
  },
  {
    id: 'mundra-jnpt-ports',
    icon: '⚓',
    tag: 'INMUN1 & INNSA',
    tagClass: 'text-blue-700 bg-blue-50',
    iconBoxClass: 'bg-blue-50 text-2xl border border-blue-200',
    title: 'Mundra & JNPT Ports',
    description:
      'Strategic ocean corridor stuffing directly at Mundra Port (Gujarat) and JNPT Nhava Sheva (Mumbai) with fast 48h vessel customs clearance.',
    footer: 'FOB · CIF · CFR · Ex-Works',
  },
  {
    id: 'private-label-packaging',
    icon: '🏷️',
    tag: 'OEM / ODM',
    tagClass: 'text-emerald-700 bg-emerald-50',
    iconBoxClass: 'bg-emerald-50 text-2xl border border-emerald-200',
    title: 'Private Label Packaging',
    description:
      'Custom retail standup barrier pouches (100g to 1kg) with nitrogen flush, zipper locks, and master export cartons bearing your supermarket brand.',
    footer: 'Retail Pouches · 25/50kg PP Bags',
  },
  {
    id: 'audit-ready-compliance',
    icon: '🔬',
    tag: 'SGS / TUV',
    tagClass: 'text-rose-700 bg-rose-50',
    iconBoxClass: 'bg-rose-50 text-2xl border border-rose-200',
    title: 'Audit-Ready Compliance',
    description:
      'Phytosanitary certification, Certificate of Origin (COO), Sortex laser cleaning, and comprehensive MRL pesticide residue lab clearance.',
    footer: 'APEDA · Spices Board · US FDA',
  },
];

export default function CapabilitiesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const touchStartX = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) setVisibleCount(1);
      else if (w < 1024) setVisibleCount(2);
      else if (w < 1280) setVisibleCount(3);
      else setVisibleCount(3); // 3 visible on desktop so 4 items rotate cleanly!
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = CAPABILITIES.length;
  const maxIndex = Math.max(0, total - visibleCount);

  // Auto-play rotation every 4 seconds
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return undefined;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    if (maxIndex <= 0) return;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    if (maxIndex <= 0) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
    setIsPaused(false);
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) handleNext();
    else if (diff < -45) handlePrev();
    touchStartX.current = null;
  };

  const cardWidthPercent = 100 / visibleCount;

  return (
    <section className="border-t border-line bg-gradient-to-b from-[#fbf8f4] to-white py-16 md:py-20 home-reveal-section">
      <div className="container-x">
        {/* Section Header with Left Content & Right Controls */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end home-reveal">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-forest">
              <span>⚓</span> Global Merchant Food Exporter Capabilities
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
              Engineered for High-Volume International Trade
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
              We bridge global importers, distributors, and supermarket chains with certified Indian farm clusters, handling end-to-end container logistics, customs clearance, and private labeling.
            </p>
          </div>

          {/* Slider Arrow Controls */}
          {maxIndex > 0 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous capabilities"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-gold hover:bg-gold/10 hover:text-gold focus:outline-none shadow-sm"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next capabilities"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-gold hover:bg-gold/10 hover:text-gold focus:outline-none shadow-sm"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* Carousel Viewport */}
        <div
          className="mt-10 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * cardWidthPercent}%)`,
            }}
          >
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.id}
                className="shrink-0 px-3 transition-all duration-300"
                style={{ width: `${cardWidthPercent}%` }}
              >
                <div className="group flex h-full flex-col justify-between rounded-3xl border border-line/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-gold">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`grid h-12 w-12 place-items-center rounded-2xl ${cap.iconBoxClass}`}>
                        {cap.icon}
                      </span>
                      <span className={`font-mono text-[11px] font-bold rounded-full px-2.5 py-0.5 ${cap.tagClass}`}>
                        {cap.tag}
                      </span>
                    </div>

                    <h3 className="mt-5 font-display text-lg font-bold text-ink group-hover:text-forest transition-colors">
                      {cap.title}
                    </h3>
                    <p className="mt-2 text-xs text-ink/65 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-line/50 font-mono text-[11px] text-ink/50">
                    {cap.footer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {maxIndex > 0 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 transition-all rounded-full ${
                  currentIndex === idx ? 'w-8 bg-forest shadow-sm' : 'w-2 bg-line hover:bg-forest/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
