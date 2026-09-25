import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { asset } from '../../api/axios.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function ProductShowcaseArc({
  title = 'All Export Food Products',
  subtitle = '100% Sortex-cleaned Indian spices, premium grains, pulses, and value-added food products ready for containerized ocean shipping.',
  watermark,
  products = [],
}) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('arc'); // 'arc' | 'wheel'

  // Default high-quality food products if loading or empty
  const defaultItems = [
    {
      name: 'Whole Cumin Seeds (Jeera)',
      slug: 'whole-cumin-seeds-jeera',
      image: '/uploads/images-1788860796566.jpg',
      category: 'Spices & Seasonings',
    },
    {
      name: '1121 XXL Basmati Rice',
      slug: '1121-xxl-basmati-rice-steam-and-sella',
      image: '/uploads/images--1--1788860839550.jpg',
      category: 'Grains & Pulses',
    },
    {
      name: 'Salem Bold Turmeric Fingers',
      slug: 'salem-bold-turmeric-fingers',
      image: '/uploads/choco-chip-cookies-chocolate-biscuit-1kg-pack-of-2-each-500gram-original-imagefvyz9edncfa-1788860700219.webp',
      category: 'Spices & Seasonings',
    },
    {
      name: 'Estate Ceylon Black Tea',
      slug: 'estate-ceylon-black-tea-orange-pekoe',
      image: '/uploads/the-role-of-hygienic-homogenization-in-the-pharmaceutical-industry-1-1788860504478.png',
      category: 'Tea & Coffee',
    },
    {
      name: 'Dehydrated White Onion Flakes',
      slug: 'dehydrated-white-onion-flakes-and-minced',
      image: '/uploads/bombay-bhel-back-1790157247781.jpeg',
      category: 'Snacks',
    },
  ];

  const showcaseItems = products.length > 0 ? products : defaultItems;
  const totalItems = showcaseItems.length;

  // -------------------------------------------------------------
  // DYNAMIC WATERMARK: Changes according to active category
  // Replaces "COMMODITIES" with "FOOD PRODUCTS" on All Products
  // -------------------------------------------------------------
  const watermarkText = useMemo(() => {
    const raw = watermark || title || '';
    const lower = raw.toLowerCase();
    if (lower.includes('farali')) return 'FARALI';
    if (lower.includes('spice')) return 'SPICES';
    if (lower.includes('grain') || lower.includes('pulse') || lower.includes('rice')) return 'GRAINS';
    if (lower.includes('tea') || lower.includes('coffee')) return 'TEA & COFFEE';
    if (lower.includes('snack')) return 'SNACKS';
    if (lower.includes('dry') || lower.includes('nut') || lower.includes('fruit')) return 'DRY FRUITS';
    if (lower.includes('biscuit') || lower.includes('bakery')) return 'BAKERY';
    if (lower.includes('beverage')) return 'BEVERAGES';
    if (lower.includes('frozen')) return 'FROZEN';
    if (lower.includes('all') || lower.includes('food') || lower.includes('commodit') || lower.includes('agro')) return 'FOOD PRODUCTS';
    return raw.toUpperCase() || 'FOOD PRODUCTS';
  }, [watermark, title]);

  // =============================================================
  // 1. CURVED FAN ARC AUTO-ROTATION
  // =============================================================
  const [arcCenterIndex, setArcCenterIndex] = useState(0);
  const [isArcSpinning, setIsArcSpinning] = useState(true);
  const arcHoverRef = useRef(false);

  // Auto-rotate the curved fan arc smoothly every 3.5s
  useEffect(() => {
    if (viewMode !== 'arc' || !isArcSpinning || totalItems === 0) return;
    const interval = setInterval(() => {
      if (!arcHoverRef.current) {
        setArcCenterIndex((prev) => (prev + 1) % totalItems);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [viewMode, isArcSpinning, totalItems]);

  const rotateArc = (direction) => {
    setIsArcSpinning(false);
    setArcCenterIndex((prev) =>
      direction === 'next' ? (prev + 1) % totalItems : (prev - 1 + totalItems) % totalItems
    );
  };

  // 5 Curved Fan Arc Slots relative to center index
  const arcSlotConfigs = [
    { slotOffset: -2, rotate: -22, translateY: 30, scale: 0.84, zIndex: 5, opacity: 0.88 },
    { slotOffset: -1, rotate: -10, translateY: 10, scale: 0.95, zIndex: 15, opacity: 0.98 },
    { slotOffset: 0,  rotate: 0,   translateY: -8, scale: 1.08, zIndex: 30, opacity: 1, isCenter: true },
    { slotOffset: 1,  rotate: 10,  translateY: 10, scale: 0.95, zIndex: 15, opacity: 0.98 },
    { slotOffset: 2,  rotate: 22,  translateY: 30, scale: 0.84, zIndex: 5, opacity: 0.88 },
  ];

  // Responsive screen detection for 3D stage offsets
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // =============================================================
  // 2. 3D SPIN WHEEL: SHOW THREE PRODUCTS AT THAT TIME WITH AUTO-ROTATION
  // =============================================================
  const [wheelCenterIndex, setWheelCenterIndex] = useState(0);
  const [isWheelSpinning, setIsWheelSpinning] = useState(true);
  const wheelHoverRef = useRef(false);

  // Auto-rotate 3D wheel smoothly every 3.5s
  useEffect(() => {
    if (viewMode !== 'wheel' || !isWheelSpinning || totalItems === 0) return;
    const interval = setInterval(() => {
      if (!wheelHoverRef.current) {
        setWheelCenterIndex((prev) => (prev + 1) % totalItems);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [viewMode, isWheelSpinning, totalItems]);

  const rotateWheel = (direction) => {
    setIsWheelSpinning(false);
    setWheelCenterIndex((prev) =>
      direction === 'next' ? (prev + 1) % totalItems : (prev - 1 + totalItems) % totalItems
    );
  };

  // Reset indices when title/category changes
  useEffect(() => {
    setArcCenterIndex(0);
    setWheelCenterIndex(0);
  }, [title]);

  // Current center product index out of actual showcaseItems
  const currentWheelProductNumber = totalItems > 0 ? (wheelCenterIndex % totalItems) + 1 : 1;

  // 3 permanent visible slots: -1 (Left), 0 (Center), 1 (Right)
  const wheelSlots = [-1, 0, 1];

  const getWheelSlotStyle = (offset) => {
    const isCenter = offset === 0;
    const isLeft = offset === -1;
    const isRight = offset === 1;

    const xOffset = isMobile ? 135 : 255;

    if (isCenter) {
      return {
        transform: `translateX(0px) translateZ(${isMobile ? '40px' : '80px'}) rotateY(0deg) scale(${isMobile ? 1.02 : 1.08})`,
        zIndex: 30,
        opacity: 1,
        pointerEvents: 'auto',
      };
    }
    if (isLeft) {
      return {
        transform: `translateX(-${xOffset}px) translateZ(${isMobile ? '-25px' : '-45px'}) rotateY(20deg) scale(${isMobile ? 0.85 : 0.92})`,
        zIndex: 15,
        opacity: 0.9,
        pointerEvents: 'auto',
      };
    }
    if (isRight) {
      return {
        transform: `translateX(${xOffset}px) translateZ(${isMobile ? '-25px' : '-45px'}) rotateY(-20deg) scale(${isMobile ? 0.85 : 0.92})`,
        zIndex: 15,
        opacity: 0.9,
        pointerEvents: 'auto',
      };
    }
    return { opacity: 1, pointerEvents: 'auto' };
  };

  const getWheelProductForOffset = (offset) => {
    if (totalItems === 0) return null;
    const idx = (wheelCenterIndex + offset + totalItems * 100) % totalItems;
    return {
      ...showcaseItems[idx],
      originalIndex: idx,
    };
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#f8f6f0] via-[#faf8f4] to-[#f4eee2] py-12 sm:py-16 px-4 sm:px-8 border border-[#e8e2d5] shadow-[0_12px_45px_rgb(22,56,43,0.05)]">
      {/* Background Watermark Text - Changed accordingly to the active category (e.g. FOOD PRODUCTS, FARALI, SPICES, etc.) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display font-black text-transparent select-none uppercase tracking-wider transition-all duration-700"
        style={{
          fontSize: 'clamp(3.8rem, 12vw, 12rem)',
          WebkitTextStroke: '2px rgba(22, 56, 43, 0.04)',
          lineHeight: 1,
        }}
      >
        {watermarkText}
      </div>

      {/* Top Header & Mode Toggle Switch */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 mb-2.5">
          <span className="h-1.5 w-6 rounded-full bg-gold" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#16382b]">
            {t('featuredShowcase') || 'FEATURED FOOD SHOWCASE'}
          </span>
          <span className="h-1.5 w-6 rounded-full bg-gold" />
        </div>

        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#16382b] transition-all duration-500">
          {title}
        </h2>
        <p className="mt-2.5 text-xs sm:text-sm md:text-base text-ink/75 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* View Switcher: Fan Arc vs 3D Spin Wheel */}
        <div className="mt-5 inline-flex items-center rounded-full bg-white/95 p-1 border border-line/70 shadow-sm backdrop-blur">
          <button
            type="button"
            onClick={() => setViewMode('arc')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'arc'
                ? 'bg-[#16382b] text-gold shadow-sm'
                : 'text-ink/65 hover:text-ink'
            }`}
          >
            <span>🌸</span>
            <span>{t('curvedFanArc') || 'Curved Fan Arc'}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('wheel')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'wheel'
                ? 'bg-[#16382b] text-gold shadow-sm'
                : 'text-ink/65 hover:text-ink'
            }`}
          >
            <span>🎡</span>
            <span>{t('spinWheel') || '3D Spin Wheel (3 Products)'}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIEW 1: CURVED FAN ARC (AUTO-ROTATING PRODUCT CARDS)         */}
      {/* ============================================================ */}
      {viewMode === 'arc' && (
        <div
          className="relative z-10 mt-8 sm:mt-12 flex flex-col items-center select-none"
          onMouseEnter={() => {
            arcHoverRef.current = true;
          }}
          onMouseLeave={() => {
            arcHoverRef.current = false;
          }}
        >
          {/* Fan Arc Display Stage */}
          <div className="relative flex items-center justify-center min-h-[310px] sm:min-h-[380px] w-full max-w-5xl px-2">
            <div className="flex items-center justify-center gap-1 sm:gap-4 w-full">
              {arcSlotConfigs.map((cfg, index) => {
                const itemIndex = (arcCenterIndex + cfg.slotOffset + totalItems * 10) % totalItems;
                const item = showcaseItems[itemIndex];
                if (!item) return null;

                const isCenter = cfg.isCenter;

                return (
                  <div
                    key={`${item._id || item.slug || itemIndex}-${cfg.slotOffset}`}
                    onClick={() => {
                      if (!isCenter) {
                        setIsArcSpinning(false);
                        setArcCenterIndex(itemIndex);
                      } else {
                        navigate(`/product-details/${item.slug}`);
                      }
                    }}
                    style={{
                      transform: `translateY(${cfg.translateY}px) rotate(${cfg.rotate}deg) scale(${cfg.scale})`,
                      zIndex: cfg.zIndex,
                      opacity: cfg.opacity,
                    }}
                    className={`group relative flex flex-col items-center transition-all duration-700 cursor-pointer ${
                      isCenter
                        ? 'hover:!scale-115 hover:!translate-y-[-16px] hover:!z-40'
                        : 'hover:!opacity-100 hover:!scale-100'
                    }`}
                  >
                    {/* Standup Pouch Container with realistic shadow */}
                    <div
                      className={`relative h-44 w-32 sm:h-64 sm:w-44 rounded-3xl p-3 transition-all duration-300 ${
                        isCenter
                          ? 'bg-white/95 border-2 border-gold shadow-[0_20px_45px_rgba(22,56,43,0.22)]'
                          : 'bg-white/80 border border-line/60 shadow-md hover:bg-white'
                      }`}
                    >
                      {/* Center Highlight Pill */}
                      {isCenter && (
                        <div className="absolute -top-3 inset-x-0 flex justify-center">
                          <span className="rounded-full bg-forest px-3 py-0.5 font-mono text-[9px] font-bold text-gold uppercase tracking-wider shadow">
                            ⭐ ACTIVE
                          </span>
                        </div>
                      )}

                      <img
                        src={asset(item.image)}
                        alt={item.name}
                        className="h-full w-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.18)] transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = '/NMC logo.png';
                        }}
                      />
                    </div>

                    {/* Product Name Tag */}
                    <div
                      className={`mt-2.5 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold shadow-md border transition-all duration-300 ${
                        isCenter
                          ? 'bg-[#16382b] text-gold border-gold/40 opacity-100'
                          : 'bg-white/95 text-[#16382b] border-line/60 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {item.name} {isCenter && '→'}
                    </div>

                    {/* Click hint for side cards */}
                    {!isCenter && (
                      <span className="mt-1 text-[9px] font-mono text-ink/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Click to center ↻
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Curved Fan Arc Controls & Progress Indicator */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => rotateArc('prev')}
              className="h-9 w-9 rounded-full bg-white border border-line text-ink font-bold shadow-sm hover:bg-forest hover:text-gold transition flex items-center justify-center text-xs"
              title="Previous Food Product"
              aria-label="Rotate previous"
            >
              ◀
            </button>

            <button
              type="button"
              onClick={() => setIsArcSpinning(!isArcSpinning)}
              className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-ink border border-line shadow-sm hover:bg-line/20 transition flex items-center gap-1.5"
            >
              <span>{isArcSpinning ? '⏸' : '▶'}</span>
              <span>{isArcSpinning ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}</span>
            </button>

            <button
              type="button"
              onClick={() => rotateArc('next')}
              className="h-9 w-9 rounded-full bg-white border border-line text-ink font-bold shadow-sm hover:bg-forest hover:text-gold transition flex items-center justify-center text-xs"
              title="Next Food Product"
              aria-label="Rotate next"
            >
              ▶
            </button>

            {/* Position indicator */}
            <span className="font-mono text-xs text-ink/50 bg-white/70 px-2.5 py-1 rounded-full border border-line/50">
              {arcCenterIndex + 1} of {totalItems}
            </span>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 2: 3D SPIN WHEEL (SHOWS EXACTLY 3 PRODUCTS AT A TIME)   */}
      {/* ============================================================ */}
      {viewMode === 'wheel' && (
        <div
          className="relative z-10 mt-8 sm:mt-12 flex flex-col items-center select-none"
          onMouseEnter={() => {
            wheelHoverRef.current = true;
          }}
          onMouseLeave={() => {
            wheelHoverRef.current = false;
          }}
        >
          {/* 3D Amphitheater Stage (Shows 3 Forward-Facing Products in 3D Depth) */}
          <div
            className="relative h-[370px] sm:h-[430px] w-full max-w-4xl flex items-center justify-center overflow-visible"
            style={{ perspective: '1200px' }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {wheelSlots.map((offset) => {
                const item = getWheelProductForOffset(offset);
                if (!item) return null;

                const isCenter = offset === 0;
                const isLeft = offset === -1;
                const isRight = offset === 1;
                const slotStyle = getWheelSlotStyle(offset);

                return (
                  <div
                    key={`wheel-slot-${offset}`}
                    onClick={() => {
                      if (isLeft) rotateWheel('prev');
                      else if (isRight) rotateWheel('next');
                      else if (isCenter) navigate(`/product-details/${item.slug}`);
                    }}
                    style={slotStyle}
                    className={`absolute flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isCenter
                        ? 'cursor-pointer hover:!scale-110'
                        : 'cursor-pointer hover:!opacity-100 hover:!scale-95'
                    }`}
                  >
                    {/* Card Body */}
                    <div
                      className={`group relative flex flex-col items-center rounded-3xl p-3.5 sm:p-5 transition-all duration-300 w-52 sm:w-64 border select-none ${
                        isCenter
                          ? 'bg-white shadow-[0_25px_50px_rgba(22,56,43,0.25)] border-gold/80'
                          : 'bg-white/92 shadow-xl border-line/70 hover:bg-white hover:border-forest/40'
                      }`}
                    >
                      {/* Top Pill / Badge */}
                      <div className="w-full flex items-center justify-between mb-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                            isCenter
                              ? 'bg-gold/20 text-[#16382b] border border-gold/40'
                              : 'bg-line/40 text-ink/50'
                          }`}
                        >
                          {isCenter ? '⭐ ACTIVE PRODUCT' : isLeft ? '◀ PREVIOUS' : 'NEXT ▶'}
                        </span>

                        <span className="text-[10px] font-mono text-ink/40 font-semibold truncate max-w-[90px]">
                          {item.segment?.name || item.category || watermarkText}
                        </span>
                      </div>

                      {/* Food Product Image */}
                      <div className="relative h-32 sm:h-44 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-[#fbf9f4] p-2 transition-transform duration-300 group-hover:scale-105">
                        <img
                          src={asset(item.image)}
                          alt={item.name}
                          className="h-full w-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.18)]"
                          onError={(e) => {
                            e.target.src = '/NMC logo.png';
                          }}
                        />
                      </div>

                      {/* Product Name & Action Button */}
                      <div className="mt-3 text-center w-full">
                        <h4 className="font-display text-xs sm:text-sm font-bold text-ink truncate leading-tight">
                          {item.name}
                        </h4>

                        {isCenter ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/product-details/${item.slug}`);
                            }}
                            className="mt-2.5 inline-flex items-center justify-center gap-1.5 w-full rounded-xl py-2 text-xs font-bold transition shadow-sm bg-[#16382b] text-gold hover:bg-[#1a4334]"
                          >
                            <span>{t('inspectSpec') || 'Inspect Spec'}</span>
                            <span>→</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              rotateWheel(isLeft ? 'prev' : 'next');
                            }}
                            className="mt-2.5 inline-flex items-center justify-center gap-1.5 w-full rounded-xl py-2 text-[11px] font-bold transition shadow-sm bg-line/30 text-ink hover:bg-[#16382b] hover:text-white"
                          >
                            <span>{isLeft ? '◀ Bring to Center' : 'Bring to Center ▶'}</span>
                          </button>
                        )}
                      </div>

                      {/* Tooltip hint on side cards */}
                      {!isCenter && (
                        <div className="absolute -top-3 rounded-full bg-forest px-2.5 py-0.5 text-[9px] font-bold text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Click to bring front ↻
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3D Wheel Controls (3-Position Buttons) */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => rotateWheel('prev')}
              className="h-10 w-10 rounded-full bg-white border border-line text-ink font-bold shadow-sm hover:bg-forest hover:text-gold transition flex items-center justify-center text-sm"
              title="Rotate Left"
              aria-label="Spin previous"
            >
              ◀
            </button>

            <button
              type="button"
              onClick={() => setIsWheelSpinning(!isWheelSpinning)}
              className="rounded-full bg-white px-4 py-2 text-xs font-bold text-ink border border-line shadow-sm hover:bg-line/20 transition flex items-center gap-1.5"
            >
              <span>{isWheelSpinning ? '⏸' : '▶'}</span>
              <span>{isWheelSpinning ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}</span>
            </button>

            <button
              type="button"
              onClick={() => rotateWheel('next')}
              className="h-10 w-10 rounded-full bg-white border border-line text-ink font-bold shadow-sm hover:bg-forest hover:text-gold transition flex items-center justify-center text-sm"
              title="Rotate Right"
              aria-label="Spin next"
            >
              ▶
            </button>

            {/* Position indicator */}
            <span className="font-mono text-xs text-ink/50 bg-white/70 px-3 py-1.5 rounded-full border border-line/50">
              Product {currentWheelProductNumber} of {totalItems}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
