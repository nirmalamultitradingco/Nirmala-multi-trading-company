import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api, { asset } from '../api/axios.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const defaultVideoSlides = [
  {
    eyebrow: '⚓ MUNDRA & JNPT PORTS • 40+ COUNTRIES',
    title: 'India’s Finest Agro Harvests. Delivered to the World.',
    description: 'Premier Indian merchant food exporter delivering Sortex-cleaned spices, grains, oil seeds, and snacks directly from certified farm clusters to international shelves.',
    chips: ['🚢 FCL & LCL Container Consolidation', '🔬 Lab MRL < 0.01 Tested', '🏷️ Custom Private Label (OEM)'],
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80',
    badge: 'SPICES & AGRO COMMODITIES AD',
    stat: '28+ MT',
    statLabel: 'Max 40ft HC Capacity',
    adTag: 'Ad 01: Spices',
  },
  {
    eyebrow: '🏷️ PRIVATE LABELING & PACKAGING',
    title: 'Authentic Roasted Namkeen & Savory Snack Foods.',
    description: 'Crispy Farali Chiwda, Roasted Makhana, Banana Wafers, and traditional Indian snacks packaged in multi-barrier nitrogen standup pouches.',
    chips: ['✨ Nitrogen Flush Freshness', '📦 Standup Barrier Pouches', '🌱 100% Non-GMO Purity'],
    video: 'https://www.w3schools.com/tags/movie.mp4',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281084?auto=format&fit=crop&w=1200&q=80',
    badge: 'FARALI & SNACK FOODS AD',
    stat: '100%',
    statLabel: 'Retail Pouch Customization',
    adTag: 'Ad 02: Savories',
  },
  {
    eyebrow: '🍃 ESTATE SOURCING & HARVESTS',
    title: 'Premium Estate Teas & Aromatic Coffee Beans.',
    description: 'Direct sourcing of single-origin Assam & Darjeeling teas, Arabica & Robusta coffee beans, and natural botanical infusions for global distributors.',
    chips: ['☕ Single-Origin Arabica', '🍃 Estate Grown CTC Tea', '📦 Vacuum Foil Barrier Packs'],
    video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    badge: 'TEA & BEVERAGES HARVEST AD',
    stat: '48h',
    statLabel: 'Direct Mill Packaging',
    adTag: 'Ad 03: Beverages',
  },
  {
    eyebrow: '🌐 GLOBAL CIF / FOB LOGISTICS',
    title: 'Precision Port Logistics with Zero Documentation Hassle.',
    description: 'Direct ocean container bookings with complete customs phytosanitary clearance, fumigation certifications, and audit-ready Certificate of Origin.',
    chips: ['⚓ Mundra Port (INMUN1) Direct', '📜 APEDA & Spice Board Reg.', '⚖️ Flexible FOB / CIF / CFR Terms'],
    video: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    badge: 'PORT LOGISTICS & SHIPPING AD',
    stat: '48h',
    statLabel: 'Port Turnaround Time',
    adTag: 'Ad 04: Port Logistics',
  },
];

export default function HeroSlider() {
  const { t } = useLanguage();
  const [slides, setSlides] = useState(defaultVideoSlides);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  // Load custom homeHero items if defined in site content
  useEffect(() => {
    api
      .get('/site-content')
      .then((res) => {
        const incoming = res.data?.homeHero?.items;
        if (incoming && incoming.length > 0) {
          const activeIncoming = incoming
            .filter((item) => item.isActive !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((item, idx) => ({
              ...defaultVideoSlides[idx % defaultVideoSlides.length],
              title: item.title || defaultVideoSlides[idx % defaultVideoSlides.length].title,
              description: item.description || defaultVideoSlides[idx % defaultVideoSlides.length].description,
              image: item.image ? asset(item.image) : defaultVideoSlides[idx % defaultVideoSlides.length].image,
              video: item.video ? asset(item.video) : defaultVideoSlides[idx % defaultVideoSlides.length].video,
            }));
          if (activeIncoming.length) setSlides(activeIncoming);
        }
      })
      .catch(() => {});
  }, []);

  const total = slides.length;

  // Auto slide rotation timer
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const stepDuration = 50; // ms
    const totalDuration = 7000; // 7s per video ad slide

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveSlide((curr) => (curr + 1) % total);
          return 0;
        }
        return prev + (stepDuration / totalDuration) * 100;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [isPaused, total, activeSlide]);

  const changeSlide = (index) => {
    setActiveSlide(index);
    setProgress(0);
  };

  const nextSlide = () => changeSlide((activeSlide + 1) % total);
  const prevSlide = () => changeSlide((activeSlide - 1 + total) % total);

  const current = slides[activeSlide] || slides[0];

  // Sync video element playback when active slide changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [activeSlide]);

  return (
    <section
      className="relative overflow-hidden bg-[#0a1812] text-paper min-h-[600px] lg:min-h-[680px] flex flex-col justify-between select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Merchant Exporter Video Ad Hero"
    >
      {/* BACKGROUND VIDEO & POSTER LAYER */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {slides.map((s, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeSlide ? 'opacity-35 scale-105 transition-transform duration-[8000ms]' : 'opacity-0 scale-100'
            }`}
          >
            {s.video ? (
              <video
                src={s.video}
                poster={s.image}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url("${s.image}")` }}
              />
            )}
          </div>
        ))}
        {/* Luxury Exporter Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07130e] via-[#07130e]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07130e] via-transparent to-black/50" />
      </div>

      {/* TOP: Live Export Port Beacon Bar */}
      <div className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="container-x flex items-center justify-between py-2 text-[11px] font-mono tracking-wider text-paper/70">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-emerald-400 font-bold uppercase">{t('liveExportPort') || 'LIVE EXPORT PORT'}</span>
            <span className="hidden sm:inline text-paper/40">|</span>
            <span className="hidden sm:inline">{current.eyebrow}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-gold font-semibold">APEDA REG: 218903</span>
            <span className="hidden md:inline text-paper/40">|</span>
            <span className="hidden md:inline text-paper/60">SPICES BOARD OF INDIA</span>
          </div>
        </div>
      </div>

      {/* CENTER: Split 3D Stage (Text & Product Video Commercial Stage) */}
      <div className="container-x relative z-10 my-auto py-10 lg:py-16 grid gap-10 lg:grid-cols-12 items-center">
        {/* Left Column: Bold Typography & Exporter Chips (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-3.5 py-1 text-xs font-mono font-bold tracking-wider text-gold shadow-sm backdrop-blur">
            <span>🎬</span> {current.badge || 'PRODUCT AD COMMERCIAL'}
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
            {current.title}
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-paper/85 leading-relaxed font-light">
            {current.description}
          </p>

          {/* Exporter Chips */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            {current.chips.map((chip, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-paper/90 backdrop-blur shadow-sm hover:border-gold/50 transition"
              >
                {chip}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-sm font-extrabold text-ink shadow-lg shadow-gold/20 transition-all hover:bg-gold/90 hover:scale-105"
            >
              <span>{t('browseProducts') || 'Explore Agro Catalog'}</span>
              <span>→</span>
            </Link>
            <Link
              to="/inquiry"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white shadow-md backdrop-blur transition-all hover:bg-white/20 hover:border-white"
            >
              <span>{t('requestQuote') || 'Request Port CIF Quote'}</span>
              <span className="text-gold">↗</span>
            </Link>
          </div>
        </div>

        {/* Right Column: 3D Product Video Ad Portal Stage (5 Cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm sm:max-w-md">
            {/* Glowing Backdrop Aura */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-gold/20 via-emerald-500/20 to-transparent blur-2xl opacity-70" />

            {/* Glass Video Card Stage */}
            <div className="relative overflow-hidden rounded-3xl border border-white/25 bg-black/60 p-3 shadow-2xl backdrop-blur-xl">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-black">
                {current.video ? (
                  <video
                    ref={videoRef}
                    key={current.video}
                    src={current.video}
                    poster={current.image}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={current.image}
                    alt={current.title}
                    className="h-full w-full object-cover"
                  />
                )}

                {/* Video Commercial Badge & Sound Toggle Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="rounded-full bg-black/70 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-gold border border-gold/30 backdrop-blur">
                    ● PRODUCT AD VIDEO
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                    className="rounded-full bg-black/70 p-2 text-xs text-white hover:bg-gold hover:text-ink transition border border-white/20 backdrop-blur"
                    aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                  >
                    {isMuted ? '🔇' : '🔊'}
                  </button>
                </div>

                {/* Floating Metric Pill inside bottom of video */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl border border-white/20 bg-black/70 px-3.5 py-2 backdrop-blur">
                  <div>
                    <span className="block font-display text-lg font-black text-gold">{current.stat}</span>
                    <span className="text-[10px] font-mono text-paper/70 uppercase">{current.statLabel}</span>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                    FOB / CIF READY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: Luxury Glass Control Dock with 4 Video Ad Thumbnails & Timer */}
      <div className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-md">
        <div className="container-x py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Thumbnails of the 4 video ads */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {slides.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => changeSlide(idx)}
                className={`relative flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs transition-all whitespace-nowrap ${
                  idx === activeSlide
                    ? 'bg-forest/90 border border-gold text-white font-bold shadow-md'
                    : 'text-paper/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="font-mono text-[10px] text-gold">0{idx + 1}</span>
                <span>{s.adTag || `Ad 0${idx + 1}`}</span>
                {idx === activeSlide && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Controls: Prev / Pause / Next & Progress Bar */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Linear Progress Bar */}
            <div className="w-24 h-1.5 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full bg-gold transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            <button
              type="button"
              onClick={prevSlide}
              className="h-8 w-8 rounded-full border border-white/20 bg-white/5 text-paper hover:bg-gold hover:text-ink transition flex items-center justify-center text-xs font-bold"
              aria-label={t('previousSlide') || 'Previous slide'}
            >
              ❮
            </button>
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="px-2.5 py-1 rounded-full border border-white/20 bg-white/5 text-[11px] font-mono text-paper/80 hover:bg-gold hover:text-ink transition"
            >
              {isPaused ? '▶ Play' : '⏸ Pause'}
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="h-8 w-8 rounded-full border border-white/20 bg-white/5 text-paper hover:bg-gold hover:text-ink transition flex items-center justify-center text-xs font-bold"
              aria-label={t('nextSlide') || 'Next slide'}
            >
              ❯
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
