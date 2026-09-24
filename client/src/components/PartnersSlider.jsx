import { useState, useEffect, useRef } from 'react';
import PartnerCard from './PartnerCard.jsx';

export default function PartnersSlider({ partners = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const touchStartX = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) setVisibleCount(1);
      else if (w < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const rawPartners = partners || [];
  // If fewer than 4 partners, clone them so the carousel always has enough items to auto-rotate continuously on desktop
  const items = rawPartners.length > 0 && rawPartners.length < 5 ? [...rawPartners, ...rawPartners] : rawPartners;

  const total = items.length;
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

  if (!partners.length) return null;

  const cardWidthPercent = 100 / visibleCount;

  return (
    <section className="border-t border-line bg-paper py-16 md:py-20 home-reveal-section">
      <div className="container-x">
        {/* Section Header with Left Content & Right Controls */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end home-reveal">
          <div>
            <p className="eyebrow text-moss">Collaborations</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              Companies we work with
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
              We list and represent products from trusted growers, millers, and certified food processing clusters across India.
            </p>
          </div>

          {/* Slider Arrow Controls */}
          {maxIndex > 0 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous partners"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-gold hover:bg-gold/10 hover:text-gold focus:outline-none shadow-sm"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next partners"
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
            {items.map((partner, idx) => (
              <div
                key={`${partner._id || partner.name}-${idx}`}
                className="shrink-0 px-3 transition-all duration-300"
                style={{ width: `${cardWidthPercent}%` }}
              >
                <div className="h-full [&>div]:h-full [&>div]:justify-between">
                  <PartnerCard partner={partner} />
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
