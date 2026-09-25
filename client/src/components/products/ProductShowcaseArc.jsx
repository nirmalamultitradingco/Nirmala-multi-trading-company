import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { asset } from '../../api/axios.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function ProductShowcaseArc({
  title = 'All Export Food Products',
  subtitle = '100% Sortex-cleaned Indian spices, premium grains, pulses, and value-added food products ready for containerized ocean shipping.',
  watermark,
  products = [],
  defaultMode = 'wheel',
  autoRotateSeconds = 3.5,
  showcaseBadge = 'FEATURED FOOD SHOWCASE',
}) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Mode: 'wheel' (3D Orbital Spin Wheel) or 'arc' (Curved Fan Arc)
  const [viewMode, setViewMode] = useState(defaultMode || 'wheel');

  // Synchronize defaultMode if prop changes from CMS
  useEffect(() => {
    if (defaultMode && (defaultMode === 'wheel' || defaultMode === 'arc')) {
      setViewMode(defaultMode);
    }
  }, [defaultMode]);

  // Default high-quality food products if empty
  const defaultItems = useMemo(
    () => [
      {
        _id: 'default-1',
        name: 'Whole Cumin Seeds (Jeera)',
        slug: 'whole-cumin-seeds-jeera',
        image: '/uploads/images-1788860796566.jpg',
        category: 'Spices & Seasonings',
      },
      {
        _id: 'default-2',
        name: '1121 XXL Basmati Rice',
        slug: '1121-xxl-basmati-rice-steam-and-sella',
        image: '/uploads/images--1--1788860839550.jpg',
        category: 'Grains & Pulses',
      },
      {
        _id: 'default-3',
        name: 'Salem Bold Turmeric Fingers',
        slug: 'salem-bold-turmeric-fingers',
        image: '/uploads/choco-chip-cookies-chocolate-biscuit-1kg-pack-of-2-each-500gram-original-imagefvyz9edncfa-1788860700219.webp',
        category: 'Spices & Seasonings',
      },
      {
        _id: 'default-4',
        name: 'Estate Ceylon Black Tea',
        slug: 'estate-ceylon-black-tea-orange-pekoe',
        image: '/uploads/the-role-of-hygienic-homogenization-in-the-pharmaceutical-industry-1-1788860504478.png',
        category: 'Tea & Coffee',
      },
      {
        _id: 'default-5',
        name: 'Dehydrated White Onion Flakes',
        slug: 'dehydrated-white-onion-flakes-and-minced',
        image: '/uploads/bombay-bhel-back-1790157247781.jpeg',
        category: 'Snacks',
      },
    ],
    []
  );

  const showcaseItems = products.length > 0 ? products : defaultItems;
  const totalItems = showcaseItems.length;

  // Screen width detection for responsive orbital physics
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // -------------------------------------------------------------
  // DYNAMIC WATERMARK
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
    if (lower.includes('all') || lower.includes('food') || lower.includes('commodit') || lower.includes('agro'))
      return 'FOOD PRODUCTS';
    return raw.toUpperCase() || 'FOOD PRODUCTS';
  }, [watermark, title]);

  // =============================================================
  // 1. CURVED FAN ARC (MODE 1)
  // =============================================================
  const [arcCenterIndex, setArcCenterIndex] = useState(0);
  const [isArcSpinning, setIsArcSpinning] = useState(true);
  const arcHoverRef = useRef(false);

  useEffect(() => {
    if (viewMode !== 'arc' || !isArcSpinning || totalItems === 0) return;
    const intervalTime = Math.max(2000, Number(autoRotateSeconds || 3.5) * 1000);
    const interval = setInterval(() => {
      if (!arcHoverRef.current) {
        setArcCenterIndex((prev) => (prev + 1) % totalItems);
      }
    }, intervalTime);
    return () => clearInterval(interval);
  }, [viewMode, isArcSpinning, totalItems, autoRotateSeconds]);

  const rotateArc = (direction) => {
    setArcCenterIndex((prev) =>
      direction === 'next' ? (prev + 1) % totalItems : (prev - 1 + totalItems) % totalItems
    );
  };

  const arcSlotConfigs = [
    { slotOffset: -2, rotate: -22, translateY: 30, scale: 0.84, zIndex: 5, opacity: 0.88 },
    { slotOffset: -1, rotate: -10, translateY: 10, scale: 0.95, zIndex: 15, opacity: 0.98 },
    { slotOffset: 0, rotate: 0, translateY: -8, scale: 1.08, zIndex: 30, opacity: 1, isCenter: true },
    { slotOffset: 1, rotate: 10, translateY: 10, scale: 0.95, zIndex: 15, opacity: 0.98 },
    { slotOffset: 2, rotate: 22, translateY: 30, scale: 0.84, zIndex: 5, opacity: 0.88 },
  ];

  // =============================================================
  // 2. 3D CELESTIAL ORBITAL SPIN WHEEL (MODE 2 - REVAMPED & BUG-FREE)
  // =============================================================
  // Continuous rotation index: each step represents one item advance.
  const [activeIndex, setActiveIndex] = useState(0);
  const [isWheelAutoSpinning, setIsWheelAutoSpinning] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100% for HUD countdown ring

  // Drag physics state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragCurrentOffsetRef = useRef(0);
  const [dragOffset, setDragOffset] = useState(0); // in fractional index units

  const autoRotateMs = Math.max(2500, Number(autoRotateSeconds || 3.5) * 1000);

  // Reset indices when title/category changes
  useEffect(() => {
    setActiveIndex(0);
    setArcCenterIndex(0);
    setProgress(0);
  }, [title]);

  // Auto-rotation timer with smooth HUD progress bar
  useEffect(() => {
    if (viewMode !== 'wheel' || !isWheelAutoSpinning || isHovered || isDraggingRef.current || totalItems <= 1) {
      setProgress(0);
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / autoRotateMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((current) => current + 1);
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => clearInterval(timer);
  }, [viewMode, isWheelAutoSpinning, isHovered, autoRotateMs, totalItems]);

  // Current normalized center product index (0 to totalItems - 1)
  const normalizedIndex = useMemo(() => {
    if (totalItems === 0) return 0;
    return ((activeIndex % totalItems) + totalItems) % totalItems;
  }, [activeIndex, totalItems]);

  const currentCenterProduct = showcaseItems[normalizedIndex] || showcaseItems[0];

  // Manual rotation helpers
  const rotateWheelNext = useCallback(() => {
    setActiveIndex((prev) => prev + 1);
    setProgress(0);
  }, []);

  const rotateWheelPrev = useCallback(() => {
    setActiveIndex((prev) => prev - 1);
    setProgress(0);
  }, []);

  const jumpToIndex = useCallback((targetOriginalIndex) => {
    if (totalItems === 0) return;
    setActiveIndex((current) => {
      const currentNorm = ((current % totalItems) + totalItems) % totalItems;
      let diff = targetOriginalIndex - currentNorm;
      // Find shortest rotational path
      if (diff > totalItems / 2) diff -= totalItems;
      if (diff < -totalItems / 2) diff += totalItems;
      return current + diff;
    });
    setProgress(0);
  }, [totalItems]);

  // Interactive Drag & Touch Handlers
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragCurrentOffsetRef.current = 0;
    setDragOffset(0);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartXRef.current;
    // Sensitivity: 200px drag = 1 product transition
    const unitOffset = -deltaX / (isMobile ? 180 : 260);
    dragCurrentOffsetRef.current = unitOffset;
    setDragOffset(unitOffset);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const offset = dragCurrentOffsetRef.current;
    if (Math.abs(offset) > 0.25) {
      const stepChange = Math.round(offset);
      setActiveIndex((prev) => prev + (stepChange === 0 ? (offset > 0 ? 1 : -1) : stepChange));
    }
    setDragOffset(0);
    dragCurrentOffsetRef.current = 0;
    setProgress(0);
  };

  // -------------------------------------------------------------
  // True 3D Orbital Calculation for each item
  // -------------------------------------------------------------
  const visibleCards = useMemo(() => {
    if (totalItems === 0) return [];

    // Continuous virtual angle: (activeIndex + dragOffset)
    const currentVirtualPos = activeIndex + dragOffset;
    const radiusX = isMobile ? 180 : 330;
    const radiusZ = isMobile ? 140 : 220;

    return showcaseItems.map((item, index) => {
      // Calculate angular distance from current virtual position
      let dist = index - (currentVirtualPos % totalItems);
      // Wrap around modulo total items
      while (dist > totalItems / 2) dist -= totalItems;
      while (dist < -totalItems / 2) dist += totalItems;

      // When items are few (e.g. 3 to 6), distribute evenly in 360 degrees
      // Normalized angle in radians: 0 is center stage, -π/2 is left, +π/2 is right, ±π is behind
      const angleStep = Math.min((2 * Math.PI) / Math.max(totalItems, 4), Math.PI / 2.2);
      const angle = dist * angleStep;

      // Coordinate projections
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);

      const x = sin * radiusX;
      // z is highest (closest to camera) at angle = 0
      const z = (cos - 1) * radiusZ + (Math.abs(dist) < 0.3 ? (isMobile ? 30 : 60) : 0);

      // Rotate card slightly facing center camera
      const rotY = -angle * (180 / Math.PI) * 0.45;

      // Scale & Opacity based on depth (cos)
      // cos === 1 (front center), cos <= 0 (behind)
      const isFront = cos > -0.2;
      const depthFactor = Math.max(0, (cos + 0.2) / 1.2);
      const scale = isMobile
        ? 0.78 + depthFactor * 0.28
        : 0.8 + depthFactor * 0.32;
      const opacity = isFront ? Math.max(0.2, Math.pow(depthFactor, 1.2)) : 0;
      const zIndex = Math.round(100 + cos * 100);

      const isCenter = Math.abs(dist) < 0.45;
      const isLeft = dist < -0.45 && dist > -1.5;
      const isRight = dist > 0.45 && dist < 1.5;

      return {
        item,
        originalIndex: index,
        dist,
        x,
        z,
        rotY,
        scale,
        opacity,
        zIndex,
        isCenter,
        isLeft,
        isRight,
        isFront,
      };
    });
  }, [showcaseItems, totalItems, activeIndex, dragOffset, isMobile]);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#f8f6f0] via-[#faf8f4] to-[#f4eee2] py-12 sm:py-16 px-4 sm:px-8 border border-[#e8e2d5] shadow-[0_12px_45px_rgb(22,56,43,0.05)]">
      {/* Background Watermark Text */}
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
            {showcaseBadge || t('featuredShowcase') || 'FEATURED FOOD SHOWCASE'}
          </span>
          <span className="h-1.5 w-6 rounded-full bg-gold" />
        </div>

        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#16382b] transition-all duration-500">
          {title}
        </h2>
        <p className="mt-2.5 text-xs sm:text-sm md:text-base text-ink/75 max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* View Switcher: 3D Spin Wheel vs Curved Fan Arc */}
        <div className="mt-5 inline-flex items-center rounded-full bg-white/95 p-1 border border-line/70 shadow-sm backdrop-blur">
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
            <span>{t('spinWheel') || '3D Celestial Orbital Wheel'}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          </button>
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
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIEW 1: 3D CELESTIAL ORBITAL SPIN WHEEL (REVAMPED & UNIQUE)  */}
      {/* ============================================================ */}
      {viewMode === 'wheel' && (
        <div
          className="relative z-10 mt-8 sm:mt-12 flex flex-col items-center select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            if (isDraggingRef.current) handlePointerUp();
          }}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          {/* 3D Exhibition Stage */}
          <div
            className="relative h-[390px] sm:h-[460px] w-full max-w-5xl flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing"
            style={{
              perspective: '1300px',
              perspectiveOrigin: '50% 48%',
            }}
          >
            {/* Luxury Exhibition Pedestal (Floor Base) */}
            <div
              className="pointer-events-none absolute bottom-4 sm:bottom-6 w-72 sm:w-[480px] h-28 sm:h-36 rounded-full border border-gold/40 shadow-[0_0_60px_rgba(212,175,55,0.25)] flex items-center justify-center"
              style={{
                transform: 'rotateX(76deg)',
                background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.18) 0%, rgba(22,56,43,0.06) 55%, transparent 80%)',
              }}
            >
              {/* Concentric rotating orbital ring */}
              <div
                className="w-48 sm:w-80 h-48 sm:h-80 rounded-full border border-dashed border-gold/50 animate-[spin_40s_linear_infinite]"
              />
              <div
                className="absolute w-28 sm:w-44 h-28 sm:h-44 rounded-full border border-gold/30 animate-[spin_25s_linear_infinite_reverse]"
              />
            </div>

            {/* Orbiting Product Cards in 3D Space */}
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {visibleCards.map((slot) => {
                const { item, originalIndex, x, z, rotY, scale, opacity, zIndex, isCenter, isLeft, isRight, isFront } = slot;
                if (!isFront && opacity <= 0.05) return null;

                return (
                  <div
                    key={item._id || item.slug || `orbital-card-${originalIndex}`}
                    onClick={(e) => {
                      if (!isCenter) {
                        e.stopPropagation();
                        jumpToIndex(originalIndex);
                      } else {
                        navigate(`/product-details/${item.slug}`);
                      }
                    }}
                    style={{
                      transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${rotY}deg) scale(${scale})`,
                      zIndex,
                      opacity,
                      transition: isDraggingRef.current ? 'none' : 'transform 0.7s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.5s ease',
                      pointerEvents: opacity > 0.3 ? 'auto' : 'none',
                    }}
                    className={`absolute flex flex-col items-center justify-center select-none ${
                      isCenter ? 'cursor-pointer hover:!scale-105' : 'cursor-pointer hover:!opacity-100'
                    }`}
                  >
                    {/* Floating Product Card */}
                    <div
                      className={`group relative flex flex-col items-center rounded-3xl p-4 sm:p-5 w-52 sm:w-64 border transition-all duration-300 ${
                        isCenter
                          ? 'bg-white shadow-[0_25px_60px_rgba(22,56,43,0.24)] border-gold/90 ring-4 ring-gold/20'
                          : 'bg-white/90 shadow-lg border-line/70 hover:bg-white hover:border-gold/50'
                      }`}
                    >
                      {/* Top Pill / Active Indicator */}
                      <div className="w-full flex items-center justify-between mb-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                            isCenter
                              ? 'bg-gold/25 text-[#16382b] border border-gold/50'
                              : 'bg-line/40 text-ink/50'
                          }`}
                        >
                          {isCenter ? '⭐ SPOTLIGHT' : isLeft ? '◀ PREVIOUS' : isRight ? 'NEXT ▶' : 'ORBITING'}
                        </span>

                        <span className="text-[10px] font-mono text-ink/45 font-semibold truncate max-w-[90px]">
                          {item.segment?.name || item.category || watermarkText}
                        </span>
                      </div>

                      {/* Product Pouch / Canister Image */}
                      <div className="relative h-32 sm:h-44 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#fbf9f4] to-[#f4ede0] p-2 transition-transform duration-500 group-hover:scale-105">
                        <img
                          src={asset(item.image)}
                          alt={item.name}
                          className="h-full w-full object-contain filter drop-shadow-[0_12px_22px_rgba(0,0,0,0.18)]"
                          onError={(e) => {
                            e.target.src = '/NMC logo.png';
                          }}
                        />

                        {/* Center Card Halo Glow */}
                        {isCenter && (
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gold/15 to-transparent rounded-2xl" />
                        )}
                      </div>

                      {/* Name & Interactive Action */}
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
                              jumpToIndex(originalIndex);
                            }}
                            className="mt-2.5 inline-flex items-center justify-center gap-1.5 w-full rounded-xl py-2 text-[11px] font-bold transition shadow-sm bg-line/40 text-ink/80 hover:bg-[#16382b] hover:text-white"
                          >
                            <span>↻ Rotate to Spotlight</span>
                          </button>
                        )}
                      </div>

                      {/* Side Tooltip hint */}
                      {!isCenter && (
                        <div className="absolute -top-3 rounded-full bg-forest px-2.5 py-0.5 text-[9px] font-bold text-gold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Click to bring forward ↻
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Control HUD & Timer Ring */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            {/* Previous Button */}
            <button
              type="button"
              onClick={rotateWheelPrev}
              className="h-10 w-10 rounded-full bg-white border border-line text-ink font-bold shadow-sm hover:bg-forest hover:text-gold transition flex items-center justify-center text-sm"
              title="Rotate Left"
              aria-label="Spin previous"
            >
              ◀
            </button>

            {/* Auto-Spin Toggle with Circular SVG HUD Timer */}
            <button
              type="button"
              onClick={() => setIsWheelAutoSpinning(!isWheelAutoSpinning)}
              className="relative rounded-full bg-white pl-3.5 pr-4 py-2 text-xs font-bold text-ink border border-line shadow-sm hover:bg-line/20 transition flex items-center gap-2.5"
            >
              {/* Circular HUD countdown progress ring */}
              <div className="relative h-5 w-5 flex items-center justify-center">
                <svg className="h-5 w-5 -rotate-90" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    className="stroke-line/60"
                    strokeWidth="2.5"
                    fill="none"
                  />
                  {isWheelAutoSpinning && !isHovered && (
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      className="stroke-gold transition-all duration-100 ease-linear"
                      strokeWidth="2.5"
                      strokeDasharray="56.5"
                      strokeDashoffset={56.5 - (56.5 * progress) / 100}
                      fill="none"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
                <span className="absolute text-[9px]">{isWheelAutoSpinning ? (isHovered ? '⏸' : '↻') : '▶'}</span>
              </div>

              <span>
                {isWheelAutoSpinning
                  ? isHovered
                    ? 'Paused (Hovering)'
                    : 'Auto-Spin Active'
                  : 'Resume Auto-Spin'}
              </span>
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={rotateWheelNext}
              className="h-10 w-10 rounded-full bg-white border border-line text-ink font-bold shadow-sm hover:bg-forest hover:text-gold transition flex items-center justify-center text-sm"
              title="Rotate Right"
              aria-label="Spin next"
            >
              ▶
            </button>

            {/* Position Indicator Badge */}
            <span className="font-mono text-xs text-ink/60 bg-white/80 px-3 py-2 rounded-full border border-line/60 shadow-sm flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-gold" />
              <span>
                {normalizedIndex + 1} of {totalItems}
              </span>
            </span>

            {/* Interactive hint */}
            <span className="hidden sm:inline-block text-[11px] font-mono text-ink/40 ml-1">
              (Drag to spin or click any item)
            </span>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW 2: CURVED FAN ARC (AUTO-ROTATING PRODUCT CARDS)         */}
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
              {arcSlotConfigs.map((cfg) => {
                const itemIndex = (arcCenterIndex + cfg.slotOffset + totalItems * 10) % totalItems;
                const item = showcaseItems[itemIndex];
                if (!item) return null;

                const isCenter = cfg.isCenter;

                return (
                  <div
                    key={`${item._id || item.slug || itemIndex}-${cfg.slotOffset}`}
                    onClick={() => {
                      if (!isCenter) {
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
    </section>
  );
}
