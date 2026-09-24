import { useState, useEffect, useRef } from 'react';

export default function TestimonialsSlider({ testimonials = null }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(2);
  const touchStartX = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) setVisibleCount(1);
      else if (w < 1024) setVisibleCount(2);
      else setVisibleCount(2); // 2 cards per view provides optimal readability and ensures continuous auto-rotation
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const rawItems = (testimonials?.items || [])
    .filter((item) => item.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // If fewer than 4 items, clone them so the carousel always has enough items to auto-rotate continuously on all screen sizes
  const items = rawItems.length > 0 && rawItems.length < 5 ? [...rawItems, ...rawItems] : rawItems;

  const total = items.length;
  const maxIndex = Math.max(0, total - visibleCount);

  // Auto-play rotation every 4.5 seconds
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return undefined;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);
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
    <section className="border-t border-line bg-[#f8f7f3] py-16 md:py-20 home-reveal-section">
      <div className="container-x">
        {/* Section Header with Left Title & Right Controls */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-gold">{testimonials?.eyebrow || 'Client feedback'}</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {testimonials?.title || 'What our clients say about us'}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
              {testimonials?.description ||
                'Feedback from global buyers and partners who value clear communication, reliable specifications and a well-coordinated export process.'}
            </p>
          </div>

          {/* Slider Arrow Controls */}
          {maxIndex > 0 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous testimonials"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-gold hover:bg-gold/10 hover:text-gold focus:outline-none shadow-sm"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next testimonials"
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
            {items.map((item, idx) => (
              <div
                key={`${item._id || item.name}-${idx}`}
                className="shrink-0 px-3 transition-all duration-300"
                style={{ width: `${cardWidthPercent}%` }}
              >
                {/* Compact, elegant testimonial card */}
                <article className="group flex h-full flex-col justify-between rounded-2xl border border-line/80 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-xl">
                  <div>
                    {/* Top Row: Logo Badge & Five Gold Stars */}
                    <div className="flex items-center justify-between gap-2 border-b border-line/50 pb-4">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-moss">
                        {item.logo || 'NMC CLIENT'}
                      </span>
                      <div className="flex text-gold text-xs tracking-tight select-none" aria-label="5 stars rating">
                        ★★★★★
                      </div>
                    </div>

                    {/* Compact Quote Text */}
                    <blockquote className="mt-4 text-sm sm:text-base leading-relaxed text-ink/80 italic font-medium">
                      “{item.quote}”
                    </blockquote>
                  </div>

                  {/* Person Details */}
                  <div className="mt-6 flex items-center gap-3.5 border-t border-line/50 pt-4">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.name}
                        loading="lazy"
                        className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-gold/20"
                      />
                    ) : (
                      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest text-sm font-bold text-white shadow-sm">
                        {(item.name || 'C').charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-bold text-ink">
                        {item.name}
                      </p>
                      <p className="truncate text-xs text-ink/55">
                        {item.role}
                      </p>
                    </div>
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
