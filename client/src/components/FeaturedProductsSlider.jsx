import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard.jsx';

export default function FeaturedProductsSlider({ products = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const touchStartX = useRef(null);

  // Dynamically calculate visible cards based on viewport
  useEffect(() => {
    const updateVisible = () => {
      const w = window.innerWidth;
      if (w < 640) setVisibleCount(1);
      else if (w < 768) setVisibleCount(2);
      else if (w < 1024) setVisibleCount(3);
      else if (w < 1280) setVisibleCount(4);
      else setVisibleCount(5);
    };

    updateVisible();
    window.addEventListener('resize', updateVisible);
    return () => window.removeEventListener('resize', updateVisible);
  }, []);

  const total = products.length;
  const maxIndex = Math.max(0, total - visibleCount);

  // Auto rotation effect: changes slide every 3.5 seconds
  useEffect(() => {
    if (total <= visibleCount || isHovered) return undefined;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(timer);
  }, [total, visibleCount, maxIndex, isHovered]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch gesture support for mobile swiping
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

  if (!products.length) return null;

  const cardWidthPercent = 100 / visibleCount;

  return (
    <div
      className="relative mt-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider Carousel Window */}
      <div className="overflow-hidden rounded-2xl py-2">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            transform: `translateX(-${currentIndex * cardWidthPercent}%)`,
          }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="shrink-0 px-2.5 transition-all duration-300"
              style={{ width: `${cardWidthPercent}%` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows (visible if items exceed viewport) */}
      {total > visibleCount && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous product"
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper/95 text-ink shadow-md backdrop-blur transition hover:border-gold hover:bg-forest hover:text-paper"
          >
            <span className="text-lg leading-none select-none">‹</span>
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next product"
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper/95 text-ink shadow-md backdrop-blur transition hover:border-gold hover:bg-forest hover:text-paper"
          >
            <span className="text-lg leading-none select-none">›</span>
          </button>
        </>
      )}

      {/* Slide Indicator Dots */}
      {maxIndex > 0 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? 'w-8 bg-forest shadow-sm'
                  : 'w-2 bg-ink/20 hover:bg-ink/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
