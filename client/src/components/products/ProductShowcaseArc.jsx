import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { asset } from '../../api/axios.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function ProductShowcaseArc({
  title = 'Farali & Agro Commodities',
  subtitle = 'A delightful crunch inspired by tradition, crafted with bold flavors for global export markets.',
  products = [],
}) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState('arc'); // 'arc' | 'wheel'
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);

  // Take up to 7 items for the arc/wheel showcase
  const showcaseItems = products.length > 0 ? products.slice(0, 7) : [
    { name: 'Farali Chiwda Tikha', slug: 'farali-chiwda-tikha', image: '/uploads/images-1788860796566.jpg' },
    { name: 'Farali Chiwda Mitha', slug: 'farali-chiwda-mitha', image: '/uploads/images--1--1788860839550.jpg' },
    { name: 'Farali Sabudana Chiwada', slug: 'farali-sabudana-chiwada', image: '/uploads/choco-chip-cookies-chocolate-biscuit-1kg-pack-of-2-each-500gram-original-imagefvyz9edncfa-1788860700219.webp' },
    { name: 'Farali Kela Wafers', slug: 'farali-kela-wafers', image: '/uploads/the-role-of-hygienic-homogenization-in-the-pharmaceutical-industry-1-1788860504478.png' },
    { name: 'Farali Roasted Makhana', slug: 'farali-roasted-makhana', image: '/uploads/bombay-bhel-back-1790157247781.jpeg' },
  ];

  // Auto-spin for wheel mode
  useEffect(() => {
    if (viewMode !== 'wheel' || !isSpinning) return;
    const interval = setInterval(() => {
      setWheelRotation((prev) => prev - (360 / Math.max(showcaseItems.length, 5)));
    }, 3500);
    return () => clearInterval(interval);
  }, [viewMode, isSpinning, showcaseItems.length]);

  const rotateWheel = (direction) => {
    setIsSpinning(false);
    const step = 360 / Math.max(showcaseItems.length, 5);
    setWheelRotation((prev) => (direction === 'next' ? prev - step : prev + step));
  };

  // 5 Arc configuration angles and translations matching the reference image layout
  const arcConfigs = [
    { rotate: -22, translateY: 30, scale: 0.85, zIndex: 1, opacity: 0.9 },
    { rotate: -10, translateY: 10, scale: 0.95, zIndex: 3, opacity: 1 },
    { rotate: 0, translateY: -8, scale: 1.08, zIndex: 5, opacity: 1 },
    { rotate: 10, translateY: 10, scale: 0.95, zIndex: 3, opacity: 1 },
    { rotate: 22, translateY: 30, scale: 0.85, zIndex: 1, opacity: 0.9 },
  ];

  const arcItems = showcaseItems.slice(0, 5);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#f8f6f0] via-[#faf8f4] to-[#f4eee2] py-14 px-4 sm:px-8 border border-[#e8e2d5] shadow-[0_12px_45px_rgb(22,56,43,0.05)]">
      {/* Background Watermark Text */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display font-black text-transparent select-none uppercase tracking-wider"
        style={{
          fontSize: 'clamp(5rem, 16vw, 15rem)',
          WebkitTextStroke: '2px rgba(22, 56, 43, 0.04)',
          lineHeight: 1,
        }}
      >
        {title.split(' ')[0] || 'NMC'}
      </div>

      {/* Top Header & Mode Toggle Switch */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="h-1.5 w-6 rounded-full bg-gold" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#16382b]">
            {t('featuredShowcase') || 'FEATURED SHOWCASE'}
          </span>
          <span className="h-1.5 w-6 rounded-full bg-gold" />
        </div>

        <h2 className="font-display text-4xl sm:text-6xl font-black tracking-tight text-[#16382b]">
          {title}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-ink/75 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* View Switcher: Fan Arc vs 3D Spin Wheel */}
        <div className="mt-5 inline-flex items-center rounded-full bg-white/90 p-1 border border-line/70 shadow-sm backdrop-blur">
          <button
            type="button"
            onClick={() => setViewMode('arc')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              viewMode === 'arc'
                ? 'bg-[#16382b] text-gold shadow-sm'
                : 'text-ink/65 hover:text-ink'
            }`}
          >
            🌸 {t('curvedFanArc') || 'Curved Fan Arc'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('wheel')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              viewMode === 'wheel'
                ? 'bg-[#16382b] text-gold shadow-sm'
                : 'text-ink/65 hover:text-ink'
            }`}
          >
            🎡 {t('spinWheel') || '3D Spin Wheel'}
          </button>
        </div>
      </div>

      {/* VIEW 1: CURVED FAN ARC (Exact Reference Image Style) */}
      {viewMode === 'arc' && (
        <div className="relative z-10 mt-10 sm:mt-14 flex items-center justify-center min-h-[300px] sm:min-h-[360px]">
          <div className="flex items-center justify-center gap-2 sm:gap-6 w-full max-w-5xl px-2">
            {arcItems.map((item, index) => {
              const cfg = arcConfigs[index] || arcConfigs[2];
              return (
                <Link
                  key={item._id || item.slug || index}
                  to={`/product-details/${item.slug}`}
                  style={{
                    transform: `translateY(${cfg.translateY}px) rotate(${cfg.rotate}deg) scale(${cfg.scale})`,
                    zIndex: cfg.zIndex,
                    opacity: cfg.opacity,
                  }}
                  className="group relative flex flex-col items-center transition-all duration-500 hover:!scale-115 hover:!translate-y-[-15px] hover:!rotate-0 hover:!z-30 hover:!opacity-100 cursor-pointer"
                >
                  {/* Standup Pouch Container with realistic shadow */}
                  <div className="relative h-44 w-32 sm:h-64 sm:w-44 rounded-2xl p-2 transition-transform duration-300">
                    <img
                      src={asset(item.image)}
                      alt={item.name}
                      className="h-full w-full object-contain filter drop-shadow-[0_15px_20px_rgba(0,0,0,0.18)] transition duration-300 group-hover:drop-shadow-[0_25px_30px_rgba(22,56,43,0.3)]"
                      onError={(e) => {
                        e.target.src = '/NMC logo.png';
                      }}
                    />
                  </div>

                  {/* Hover Tag */}
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#16382b] shadow-md border border-line/60">
                    {item.name} →
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: 3D CYLINDRICAL SPIN WHEEL */}
      {viewMode === 'wheel' && (
        <div className="relative z-10 mt-8 flex flex-col items-center">
          {/* 3D Wheel Stage */}
          <div
            className="relative h-[320px] w-full max-w-2xl flex items-center justify-center"
            style={{ perspective: '1100px' }}
          >
            <div
              className="relative h-56 w-44 transition-transform duration-700 ease-out"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateY(${wheelRotation}deg)`,
              }}
            >
              {showcaseItems.map((item, index) => {
                const total = showcaseItems.length;
                const angle = (360 / total) * index;
                const radius = 260; // distance from center

                return (
                  <div
                    key={item._id || item.slug || index}
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <Link
                      to={`/product-details/${item.slug}`}
                      className="group flex flex-col items-center rounded-2xl bg-white/95 p-3 shadow-xl border border-white/60 backdrop-blur transition hover:scale-105"
                    >
                      <div className="h-36 w-28 overflow-hidden rounded-xl bg-line/20 flex items-center justify-center">
                        <img
                          src={asset(item.image)}
                          alt={item.name}
                          className="h-full w-full object-contain filter drop-shadow-[0_8px_15px_rgba(0,0,0,0.15)]"
                          onError={(e) => {
                            e.target.src = '/NMC logo.png';
                          }}
                        />
                      </div>
                      <p className="mt-2 text-center text-xs font-bold text-ink truncate max-w-[120px]">
                        {item.name}
                      </p>
                      <span className="text-[10px] font-mono text-forest font-semibold mt-0.5">
                        {t('inspectSpec') || 'Inspect Spec'} →
                      </span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wheel Controls */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => rotateWheel('prev')}
              className="h-9 w-9 rounded-full bg-white border border-line text-ink font-bold shadow-sm hover:bg-forest hover:text-gold transition flex items-center justify-center"
              aria-label="Spin previous"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() => setIsSpinning(!isSpinning)}
              className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink border border-line shadow-sm hover:bg-line/20 transition"
            >
              {isSpinning ? `⏸ ${t('pauseSpin') || 'Pause Spin'}` : `▶ ${t('autoSpin') || 'Auto Spin'}`}
            </button>
            <button
              type="button"
              onClick={() => rotateWheel('next')}
              className="h-9 w-9 rounded-full bg-white border border-line text-ink font-bold shadow-sm hover:bg-forest hover:text-gold transition flex items-center justify-center"
              aria-label="Spin next"
            >
              ▶
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
