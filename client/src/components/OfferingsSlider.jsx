import { useState, useEffect, useRef } from 'react';

export default function OfferingsSlider({ offerings = null }) {
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

  const rawItems = (offerings?.items || [])
    .filter((item) => item.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // If fewer than 4 items, clone them so the carousel always has enough items to auto-rotate continuously on all screen sizes
  const items = rawItems.length > 0 && rawItems.length < 5 ? [...rawItems, ...rawItems] : rawItems;

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

  if (!items.length) return null;

  const cardWidthPercent = 100 / visibleCount;

  return (
    <section className="border-t border-line bg-white py-16 md:py-20 home-reveal-section">
      <div className="container-x">
        {/* Section Header with Left Content & Right Controls */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end home-reveal">
          <div>
            <p className="eyebrow text-gold">{offerings?.eyebrow || 'What we offer'}</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {offerings?.title || 'Comprehensive Export Solutions'}
            </h2>
            {offerings?.description && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
                {offerings.description}
              </p>
            )}
          </div>

          {/* Slider Arrow Controls */}
          {maxIndex > 0 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous offerings"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink transition hover:border-gold hover:bg-gold/10 hover:text-gold focus:outline-none shadow-sm"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next offerings"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink transition hover:border-gold hover:bg-gold/10 hover:text-gold focus:outline-none shadow-sm"
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
            {items.map((item, index) => (
              <div
                key={item._id || index}
                className="shrink-0 px-3 transition-all duration-300"
                style={{ width: `${cardWidthPercent}%` }}
              >
                <article className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-paper/60 p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-white hover:shadow-xl">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-bold text-gold">
                        {item.icon || String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="h-2 w-2 rounded-full bg-gold/40 transition-colors group-hover:bg-gold" />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold text-ink group-hover:text-forest transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-line/60 flex items-center gap-1.5 font-mono text-[11px] font-semibold text-moss">
                    <span>Export verified specification</span>
                  </div>
                </article>
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
