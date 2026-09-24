import { useLanguage } from '../../context/LanguageContext.jsx';
import { useRef } from 'react';

export default function CategoryPillBar({
  segments = [],
  activeSegment = '',
  onSelectSegment,
  search = '',
  activeSearch = '',
  onSearchChange,
  onSearchSubmit,
  onClearSearch,
}) {
  const { t } = useLanguage();
  const navRef = useRef(null);

  const scrollNav = (direction) => {
    if (navRef.current) {
      navRef.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth',
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(search);
    }
    // Requirement 1: Blank the search field when search button is clicked
    if (onSearchChange) {
      onSearchChange('');
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Bar - Cleanly aligned and auto-clears on submit */}
      <div className="mx-auto max-w-xl">
        <form
          onSubmit={handleFormSubmit}
          className="relative flex items-center shadow-sm"
        >
          <span className="pointer-events-none absolute left-4 text-ink/40 text-base" aria-hidden="true">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder={t('searchProducts') || 'Search products, spices, origins, HS codes…'}
            className="w-full rounded-full border border-line/80 bg-white/95 py-3 pl-11 pr-24 text-sm font-medium text-ink shadow-sm backdrop-blur outline-none transition focus:border-forest focus:bg-white focus:ring-4 focus:ring-forest/10"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange && onSearchChange('')}
              className="absolute right-20 text-xs text-ink/40 hover:text-ink p-1"
              aria-label={t('clear') || 'Clear input'}
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            className="absolute right-1.5 rounded-full bg-forest px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-forest/90 active:scale-95"
          >
            {t('search') || 'Search'}
          </button>
        </form>
      </div>

      {/* Active Search Indicator Chip */}
      {activeSearch && (
        <div className="mx-auto flex max-w-xl items-center justify-between rounded-full border border-gold/40 bg-[#faf8f3] px-4 py-1.5 text-xs text-ink shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-forest">Filtered by:</span>
            <span className="font-semibold text-gold">"{activeSearch}"</span>
          </div>
          {onClearSearch && (
            <button
              type="button"
              onClick={onClearSearch}
              className="text-xs font-bold text-clay hover:underline flex items-center gap-1"
            >
              <span>✕</span> Clear Search
            </button>
          )}
        </div>
      )}

      {/* Floating Capsule Pill Bar (Slide bar hidden with smooth controls) */}
      <div className="relative mx-auto flex max-w-5xl items-center justify-center px-1">
        <button
          type="button"
          onClick={() => scrollNav('left')}
          aria-label="Scroll categories left"
          className="hidden sm:flex shrink-0 -mr-3 z-10 h-7 w-7 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:border-gold hover:text-gold"
        >
          ‹
        </button>

        <nav
          ref={navRef}
          className="inline-flex max-w-full items-center gap-1.5 overflow-x-auto rounded-full border border-[#e8e2d5] bg-[#faf8f4]/95 p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-md no-scrollbar scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          aria-label={t('productSegments') || 'Category filter'}
        >
          {/* All Products Pill */}
          <button
            type="button"
            onClick={() => onSelectSegment('')}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-xs font-bold transition-all duration-300 ${
              !activeSegment
                ? 'bg-[#16382b] text-gold shadow-md scale-105 border border-gold/30'
                : 'text-ink/75 hover:bg-white/80 hover:text-ink'
            }`}
          >
            {t('allProducts') || 'All Products'}
          </button>

          {/* Dynamic Category / Segment Pills */}
          {segments.map((seg) => {
            const isActive = activeSegment === seg.slug;
            return (
              <button
                key={seg._id || seg.slug}
                type="button"
                onClick={() => onSelectSegment(seg.slug)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-[#16382b] text-gold shadow-md scale-105 border border-gold/30'
                    : 'text-ink/75 hover:bg-white/80 hover:text-ink'
                }`}
              >
                {seg.name}
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => scrollNav('right')}
          aria-label="Scroll categories right"
          className="hidden sm:flex shrink-0 -ml-3 z-10 h-7 w-7 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:border-gold hover:text-gold"
        >
          ›
        </button>
      </div>
    </div>
  );
}
