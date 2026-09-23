import { useState, useEffect, useRef } from 'react';
import api, { asset } from '../api/axios.js';

const DEFAULT_CERTIFICATES = {
  eyebrow: 'Accreditations & Compliance',
  title: 'Certified for Global Trade',
  description: 'Our export consignments strictly conform to international food safety, phytosanitary standards, and destination-country import regulations.',
  items: [
    {
      id: 'fssai',
      code: 'fssai',
      name: 'Food Safety and Standards Authority of India',
      issuer: 'Govt. of India Statutory Food License',
      tag: 'Statutory License',
      description: 'Mandatory central certification verifying supreme hygiene, raw material testing, pesticide residue adherence, and ethical food packaging standards.',
      highlights: ['Zero adulteration mandate', 'Periodic batch laboratory assays', 'Full farm-to-dispatch traceability'],
    },
    {
      id: 'apeda',
      code: 'apeda',
      name: 'Agricultural & Processed Food Products Export Development Authority',
      issuer: 'Ministry of Commerce & Industry, India',
      tag: 'Export Authority',
      description: 'Official export certification facilitating trade oversight, scheduled food grading, port-level phytosanitary documentation, and residue monitoring.',
      highlights: ['Global organic trace compliance', 'Govt accredited export verification', 'Scheduled agricultural standards'],
    },
    {
      id: 'gmp',
      code: 'gmp',
      name: 'Good Manufacturing Practice',
      issuer: 'Quality & Integrity Assured Manufacturing',
      tag: 'Processing Quality',
      description: 'Ensures products are consistently manufactured and controlled to quality standards appropriate to their intended use and international market requirements.',
      highlights: ['State-of-the-art grading & packing', 'Standard operating procedures (SOP)', 'Batch consistency guarantees'],
    },
    {
      id: 'ghp',
      code: 'ghp',
      name: 'Good Hygiene Practices',
      issuer: 'Sanitation & Clean Handling Protocol',
      tag: 'Sanitation Standard',
      description: 'Strict hygiene controls across raw material procurement, warehouse cleanliness, employee sanitation, and temperature-controlled storage.',
      highlights: ['Sanitized packing environments', 'Pest-free hermetic storage', 'Safe contact packaging'],
    },
    {
      id: 'haccp',
      code: 'haccp',
      name: 'Hazard Analysis Critical Control Point',
      issuer: 'Preventive Food Safety Protocol',
      tag: 'Risk Management',
      description: 'Systematic preventive approach targeting biological, chemical, and physical food hazards in production processes rather than finished product inspection alone.',
      highlights: ['Critical control point monitoring', 'Contamination prevention', 'Continuous process validation'],
    },
    {
      id: 'iso22000',
      code: 'iso22000',
      name: 'ISO 22000:2018 Food Safety Management',
      issuer: 'International Organization for Standardization',
      tag: 'International Benchmark',
      description: 'The premier global food safety management benchmark harmonizing interactive communication, system management, and prerequisite programs.',
      highlights: ['Comprehensive hazard screening', 'International supply-chain alignment', 'Rigorous third-party audits'],
    },
    {
      id: 'asta',
      code: 'asta',
      name: 'American Spice Trade Association',
      issuer: 'Premier International Spice Trade Body',
      tag: 'Spice Trade Standard',
      description: 'Adherence to ASTA cleanliness specifications, steam sterilization standards, volatile oil content guarantees, and moisture thresholds for North American and world markets.',
      highlights: ['Cleanliness & purity testing', 'ETO / Steam treated options', 'Strict volatile oil benchmarks'],
    },
  ],
};

export default function CertificateSlider() {
  const [data, setData] = useState(DEFAULT_CERTIFICATES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const sliderRef = useRef(null);

  // Fetch dynamic content from server
  useEffect(() => {
    let mounted = true;
    api
      .get('/site-content')
      .then((res) => {
        if (!mounted) return;
        if (res.data?.certificates?.items?.length) {
          setData(res.data.certificates);
        }
      })
      .catch((err) => {
        console.warn('Using default certificates data:', err.message);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const activeItems = (data.items || DEFAULT_CERTIFICATES.items)
    .filter((item) => item.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Responsive items-per-view tracking
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, activeItems.length - visibleCount);

  // Auto-play interval
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section
      className="relative border-t border-line bg-paper py-20 home-reveal-section"
      id="certifications"
      aria-label="Certifications & Accreditations"
    >
      <div className="container-x">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end home-reveal">
          <div>
            <p className="eyebrow text-gold">{data.eyebrow || DEFAULT_CERTIFICATES.eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {data.title || DEFAULT_CERTIFICATES.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/70">
              {data.description || DEFAULT_CERTIFICATES.description}
            </p>
          </div>

          {/* Slider Arrow Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous certificates"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-gold hover:bg-gold/10 hover:text-gold focus:outline-none"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next certificates"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-gold hover:bg-gold/10 hover:text-gold focus:outline-none"
            >
              ›
            </button>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div
          className="mt-10 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          ref={sliderRef}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
            }}
          >
            {activeItems.map((cert, index) => (
              <div
                key={cert._id || cert.id || index}
                className="w-full flex-shrink-0 px-3 sm:w-1/2 lg:w-1/3"
              >
                <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-forest/30 hover:shadow-xl">
                  {/* Top Bar: Authentic Original Logo Image & Tag */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-16 w-24 items-center justify-center rounded-xl border border-line/60 bg-paper/60 p-2 shadow-sm transition group-hover:scale-105 group-hover:shadow-md">
                        {cert.image ? (
                          <img
                            src={asset(cert.image)}
                            alt={cert.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <img
                            src={`/certificates/${cert.code || 'fssai'}.png`}
                            alt={cert.name}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/certificates/fssai.png';
                            }}
                          />
                        )}
                      </div>
                      <span className="rounded-full bg-paper px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-moss">
                        {cert.tag || (cert.code ? cert.code.toUpperCase() : 'CERTIFIED')}
                      </span>
                    </div>

                    {/* Badge & Title */}
                    <div className="mt-5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gold">
                          {cert.code ? cert.code.toUpperCase() : 'ISO/APEDA'}
                        </span>
                        <span className="text-xs text-ink/30">•</span>
                        <span className="font-mono text-[11px] text-ink/50">Verified Accreditation</span>
                      </div>
                      <h3 className="mt-1.5 font-display text-lg font-bold text-ink group-hover:text-forest">
                        {cert.name}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-moss">
                        {cert.issuer}
                      </p>
                    </div>

                    {/* Description */}
                    {cert.description && (
                      <p className="mt-3.5 text-xs leading-relaxed text-ink/65">
                        {cert.description}
                      </p>
                    )}
                  </div>

                  {/* Highlights Bullet List */}
                  {cert.highlights && cert.highlights.length > 0 && (
                    <div className="mt-6 border-t border-line/70 pt-4">
                      <ul className="space-y-1.5 text-[11px] text-ink/75">
                        {cert.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                  currentIndex === idx ? 'w-8 bg-forest' : 'w-2 bg-line hover:bg-forest/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
