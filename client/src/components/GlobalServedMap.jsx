import { useState, useMemo, useEffect } from 'react';
import api from '../api/axios.js';

const DEFAULT_REGIONS = [
  {
    id: 'usa',
    name: 'USA',
    fullName: 'United States of America',
    flag: '🇺🇸',
    hub: { x: 235, y: 155 },
    ports: ['Port of New York / New Jersey', 'Port of Los Angeles / Long Beach', 'Houston', 'Chicago'],
    compliance: 'US FDA Registered • Prior Notice Filing • FSMA Compliant',
    transitTime: '22–28 Days Maritime • Express Air Freight Available',
    categories: ['Basmati & Non-Basmati Rice', 'Spices & Seasonings', 'Ready-to-Eat Ethnic Meals', 'Snacks & Confectionery'],
    description: 'Direct high-volume containerized shipments serving retail supermarket chains, ethnic food wholesale distributors, and food service partners across East and West coasts.',
    stats: { deliveryRate: '99.4%', volumeGrowth: '+32% YoY', containersServed: '350+ TEU' }
  },
  {
    id: 'europe',
    name: 'Europe',
    fullName: 'European Union Markets',
    flag: '🇪🇺',
    hub: { x: 535, y: 125 },
    ports: ['Rotterdam (Netherlands)', 'Hamburg (Germany)', 'Antwerp (Belgium)', 'Genoa (Italy)', 'Marseille (France)'],
    compliance: 'Strict EU MRL (Pesticide) Limits • Non-GMO Declarations • Euro-Pallet Stacking',
    transitTime: '18–24 Days Maritime (Direct Red Sea / Cape Routes)',
    categories: ['Organic Pulses & Lentils', 'Sesame Seeds & Tahini Grade', 'Dehydrated Onion & Garlic', 'Processed Fruit Pulps'],
    description: 'Comprehensive compliance with European Food Safety Authority (EFSA) regulations, laboratory heavy-metal testing, and certified temperature-controlled container logistics.',
    stats: { deliveryRate: '99.8%', volumeGrowth: '+28% YoY', containersServed: '280+ TEU' }
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    fullName: 'United Kingdom',
    flag: '🇬🇧',
    hub: { x: 495, y: 105 },
    ports: ['London Gateway', 'Port of Felixstowe', 'Southampton', 'Liverpool'],
    compliance: 'UK DEFRA Standards • BRCGS Sourced • Complete Traceability Documentation',
    transitTime: '20–25 Days Maritime • Express Freight',
    categories: ['Whole & Ground Spices', 'Pulses, Dals & Flours', 'Pickles & Condiments', 'Traditional Indian Groceries'],
    description: 'Dedicated trade bridge supplying cash & carry wholesalers, mainstream British supermarket brands, and specialized Asian grocers across London, Midlands, and Scotland.',
    stats: { deliveryRate: '99.6%', volumeGrowth: '+24% YoY', containersServed: '210+ TEU' }
  },
  {
    id: 'norway',
    name: 'Norway',
    fullName: 'Norway & Scandinavia',
    flag: '🇳🇴',
    hub: { x: 528, y: 78 },
    ports: ['Port of Oslo', 'Bergen', 'Drammen', 'Stavanger'],
    compliance: 'Mattilsynet (Norwegian Food Safety) Guidelines • Organic & Sustainable Verification',
    transitTime: '22–27 Days Maritime via Northern European Hubs',
    categories: ['Specialty Health Flours', 'Clean-Label Grains', 'Organic Spices & Herbs', 'Dehydrated Ingredients'],
    description: 'Exporting premium grade, clean-label agricultural goods meeting Norway’s stringent purity, microbiological, and sustainability parameters.',
    stats: { deliveryRate: '100%', volumeGrowth: '+40% YoY', containersServed: '85+ TEU' }
  },
  {
    id: 'gcc',
    name: 'GCC Countries',
    fullName: 'Gulf Cooperation Council (GCC)',
    flag: '🇦🇪',
    hub: { x: 635, y: 195 },
    ports: ['Jebel Ali (Dubai, UAE)', 'Jeddah Islamic Port (KSA)', 'King Abdulaziz Port (Dammam)', 'Hamad Port (Qatar)', 'Sohar (Oman)', 'Shuwaikh (Kuwait)'],
    compliance: '100% Halal Certified • GSO Standard Food Labeling (Arabic & English)',
    transitTime: '3–7 Days Fast Maritime (Direct Arabian Sea Route)',
    categories: ['Premium Basmati Rice', 'Pure Spices & Masalas', 'Edible Oils & Ghee', 'Snacks, Biscuits & Sweets'],
    description: 'High-frequency shipping corridor with lightning-fast transit times from Western India ports. Catering to Gulf supermarket hypermarkets, food distributors, and HORECA chains.',
    stats: { deliveryRate: '99.9%', volumeGrowth: '+45% YoY', containersServed: '600+ TEU' }
  },
  {
    id: 'asia',
    name: 'Asian Countries',
    fullName: 'Southeast & East Asian Markets',
    flag: '🌏',
    hub: { x: 805, y: 245 },
    ports: ['Singapore Port', 'Port Klang (Malaysia)', 'Bangkok (Thailand)', 'Manila (Philippines)', 'Tokyo / Yokohama (Japan)'],
    compliance: 'ASEAN Food Safety Harmonization • Regional Phytosanitary Clearance',
    transitTime: '6–14 Days Maritime Corridor',
    categories: ['Basmati & Specialty Rice', 'Whole Red Chillies & Turmeric', 'Dehydrated Agro-Products', 'Confectionery & Bakery Items'],
    description: 'Supplying dynamic Asian food processing facilities, restaurant distributor groups, and retail supermarket chains with rapid port-to-port connections.',
    stats: { deliveryRate: '99.5%', volumeGrowth: '+36% YoY', containersServed: '420+ TEU' }
  }
];

const ORIGIN = {
  id: 'india',
  name: 'India (Origin)',
  hub: { x: 700, y: 220 },
  ports: ['Nhava Sheva (JNPT, Mumbai)', 'Mundra Port (Gujarat)', 'Hazira Port', 'Chennai Port']
};

const DEFAULT_PILLARS = [
  { number: '01', title: '6 Global Corridors', text: 'Established logistics networks reaching USA, Europe, UK, Norway, Asia, and GCC ports.', order: 1 },
  { number: '02', title: '100% HS & Lab Clearance', text: 'Pre-shipment phytosanitary, pesticide MRL, and fumigation certificates for zero-delay customs clearance.', order: 2 },
  { number: '03', title: 'Direct Sea & Air Options', text: 'Full Container Load (FCL), Less than Container Load (LCL), and urgent temperature-controlled air freight.', order: 3 },
  { number: '04', title: 'Flexible Incoterms', text: 'FOB, CIF, CFR, and DDP terms customized to buyer preference with transparent tracking.', order: 4 },
];

export default function GlobalServedMap() {
  const [selectedId, setSelectedId] = useState('all');
  const [hoveredId, setHoveredId] = useState(null);
  const [mapConfig, setMapConfig] = useState({
    eyebrow: 'Global Export Footprint',
    title: 'Markets We Already Serve',
    description: 'Exporting verified agricultural produce, spices, and packaged food products directly from India’s trusted growers to six major global trade corridors.',
    regions: DEFAULT_REGIONS,
    pillars: DEFAULT_PILLARS,
  });

  useEffect(() => {
    api.get('/site-content').then((res) => {
      const incoming = res.data?.globalMap;
      if (incoming) {
        setMapConfig((prev) => ({
          eyebrow: incoming.eyebrow || prev.eyebrow,
          title: incoming.title || prev.title,
          description: incoming.description || prev.description,
          pillars: incoming.pillars?.length
            ? incoming.pillars
                .filter((p) => p.isActive !== false)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
            : prev.pillars,
          regions: incoming.regions?.length
            ? incoming.regions
                .filter((r) => r.isActive !== false)
                .map((r) => ({
                  id: (r._id || r.id || r.code || '').toLowerCase(),
                  name: r.name,
                  fullName: r.fullName || r.name,
                  flag:
                    r.flag ||
                    (r.code === 'USA'
                      ? '🇺🇸'
                      : r.code === 'UK'
                      ? '🇬🇧'
                      : r.code === 'Europe'
                      ? '🇪🇺'
                      : r.code === 'Norway'
                      ? '🇳🇴'
                      : r.code === 'GCC'
                      ? '🇦🇪'
                      : '🌏'),
                  hub: { x: r.x ?? (r.hub?.x || 500), y: r.y ?? (r.hub?.y || 250) },
                  ports: Array.isArray(r.ports) ? r.ports : [],
                  transitTime: r.transitTime || 'Direct Corridors',
                  description:
                    r.description ||
                    `Active trade bridge serving ${r.name} with certified export consignments and scheduled container sailings.`,
                  stats: {
                    deliveryRate: r.deliveryRate || r.stats?.deliveryRate || '99.4%',
                    volumeGrowth: r.volumeGrowth || r.stats?.volumeGrowth || '+28%',
                  },
                }))
            : prev.regions,
        }));
      }
    }).catch(() => {});
  }, []);

  const regions = mapConfig.regions || DEFAULT_REGIONS;

  const activeRegion = useMemo(() => {
    const idToFind = hoveredId || (selectedId !== 'all' ? selectedId : null);
    if (!idToFind) return null;
    return regions.find((r) => r.id === idToFind) || null;
  }, [selectedId, hoveredId, regions]);

  return (
    <section className="relative overflow-hidden border-t border-line bg-[#0E1A14] py-20 text-paper home-reveal-section" id="global-presence">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-forest/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />

      <div className="container-x relative">
        {/* Section Header */}
        <div className="text-center home-reveal">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">{mapConfig.eyebrow}</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-tight text-paper sm:text-4xl lg:text-5xl">
            {mapConfig.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-paper/70">
            {mapConfig.description}
          </p>
        </div>

        {/* Region Filter Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 home-reveal">
          <button
            type="button"
            onClick={() => setSelectedId('all')}
            className={`rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all ${
              selectedId === 'all'
                ? 'bg-gold font-semibold text-ink shadow-lg shadow-gold/20 ring-2 ring-gold/50'
                : 'border border-white/10 bg-white/5 text-paper/80 hover:bg-white/10 hover:text-paper'
            }`}
          >
            🌐 All Destinations ({regions.length})
          </button>
          {regions.map((region) => {
            const isSelected = selectedId === region.id;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => setSelectedId(region.id)}
                onMouseEnter={() => setHoveredId(region.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all ${
                  isSelected
                    ? 'bg-gold font-semibold text-ink shadow-lg shadow-gold/20 ring-2 ring-gold/50'
                    : 'border border-white/10 bg-white/5 text-paper/80 hover:bg-white/10 hover:text-paper'
                }`}
              >
                <span>{region.flag}</span>
                <span>{region.name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Map Visual Area */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-[#13221B]/90 shadow-2xl backdrop-blur-xl">
          <div className="relative aspect-[16/9] w-full min-h-[380px] max-h-[580px]">
            <svg
              viewBox="0 0 1000 500"
              className="h-full w-full select-none"
              preserveAspectRatio="xMidYMid meet"
              aria-label="Interactive Global Export Map"
            >
              <defs>
                {/* Linear Gradients for Arcs */}
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C6912E" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#80E0A7" stopOpacity="0.9" />
                </linearGradient>

                <linearGradient id="goldPulse" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C6912E" />
                  <stop offset="100%" stopColor="#F5D061" />
                </linearGradient>

                {/* Glow Filter */}
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="brightGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Map Coordinate Latitude / Longitude Subtle Grid */}
              <g stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" strokeDasharray="3 5">
                <line x1="0" y1="125" x2="1000" y2="125" />
                <line x1="0" y1="250" x2="1000" y2="250" />
                <line x1="0" y1="375" x2="1000" y2="375" />
                <line x1="250" y1="0" x2="250" y2="500" />
                <line x1="500" y1="0" x2="500" y2="500" />
                <line x1="750" y1="0" x2="750" y2="500" />
              </g>

              {/* Continents & Countries Vector Landmass Paths */}
              <g className="transition-colors duration-500">
                {/* Global World Landmass Background Outline */}
                <g fill="#152b20" stroke="#224231" strokeWidth="0.65" opacity="0.6">
                  {/* Canada & Alaska Northern Terr */}
                  <path d="M 80 75 Q 120 40 180 35 Q 230 35 285 50 Q 320 65 310 95 L 285 105 Q 240 90 190 95 Q 140 100 110 85 Z" />
                  {/* Greenland */}
                  <path d="M 335 35 Q 375 25 405 40 Q 395 85 365 90 Q 335 75 335 35 Z" opacity="0.4" />
                  {/* South America */}
                  <path d="M 230 265 Q 275 260 305 300 Q 325 360 295 425 Q 265 465 245 435 Q 225 355 210 315 Q 205 285 230 265 Z" />
                  {/* Africa */}
                  <path d="M 465 170 Q 535 165 565 205 Q 585 265 555 345 Q 525 395 495 385 Q 455 335 445 255 Q 435 195 465 170 Z" />
                  {/* Australia */}
                  <path d="M 810 330 Q 885 320 905 360 Q 885 415 825 415 Q 775 385 810 330 Z" opacity="0.5" />
                </g>

                {/* 1. UNITED STATES OF AMERICA (Proper 48 States, Florida, Texas Gulf, East & West Coasts) */}
                <g
                  onClick={() => setSelectedId('usa')}
                  onMouseEnter={() => setHoveredId('usa')}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Continental US 48 States */}
                  <path
                    d="M 136 122 L 170 122 L 205 122 Q 214 128 224 124 Q 232 130 242 124 L 252 116 L 254 126 L 246 134 L 242 144 L 238 156 L 234 170 L 230 182 L 233 196 L 234 214 Q 230 220 226 216 L 224 198 L 214 198 L 204 204 L 194 208 L 186 212 L 174 196 L 158 196 L 150 190 L 146 178 L 142 160 L 138 140 Z"
                    fill={selectedId === 'usa' || hoveredId === 'usa' ? '#2e6345' : '#1b3829'}
                    stroke={selectedId === 'usa' || hoveredId === 'usa' ? '#C6912E' : '#2d5c41'}
                    strokeWidth={selectedId === 'usa' || hoveredId === 'usa' ? '1.6' : '0.9'}
                  />
                  {/* Alaska & Hawaii */}
                  <path
                    d="M 85 70 Q 110 65 118 80 Q 105 92 88 88 Z"
                    fill={selectedId === 'usa' || hoveredId === 'usa' ? '#2e6345' : '#1b3829'}
                    stroke={selectedId === 'usa' || hoveredId === 'usa' ? '#C6912E' : '#2d5c41'}
                    strokeWidth="0.6"
                  />
                  <circle cx="118" cy="225" r="2.5" fill="#C6912E" opacity="0.8" />
                  <circle cx="123" cy="227" r="2" fill="#C6912E" opacity="0.8" />
                  {/* Country Name Tag */}
                  <text x="185" y="165" fill="#F7F4EC" fontSize="9" fontWeight="700" opacity="0.85" textAnchor="middle" pointerEvents="none">
                    USA
                  </text>
                </g>

                {/* 2. UNITED KINGDOM & IRELAND (Authentic British Isles Contours) */}
                <g
                  onClick={() => setSelectedId('uk')}
                  onMouseEnter={() => setHoveredId('uk')}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Great Britain (Scotland, England, Wales) */}
                  <path
                    d="M 484 82 Q 492 78 496 86 L 493 96 L 498 104 L 502 114 L 498 124 L 488 128 L 476 130 L 474 122 L 478 114 L 482 108 L 480 96 Z"
                    fill={selectedId === 'uk' || hoveredId === 'uk' ? '#2e6345' : '#1b3829'}
                    stroke={selectedId === 'uk' || hoveredId === 'uk' ? '#C6912E' : '#2d5c41'}
                    strokeWidth={selectedId === 'uk' || hoveredId === 'uk' ? '1.6' : '0.9'}
                  />
                  {/* Ireland Island */}
                  <path
                    d="M 464 104 Q 472 102 473 112 Q 470 124 464 122 Q 460 114 464 104 Z"
                    fill={selectedId === 'uk' || hoveredId === 'uk' ? '#2e6345' : '#1b3829'}
                    stroke={selectedId === 'uk' || hoveredId === 'uk' ? '#C6912E' : '#2d5c41'}
                    strokeWidth="0.7"
                  />
                  <text x="490" y="140" fill="#F7F4EC" fontSize="8" fontWeight="700" opacity="0.85" textAnchor="middle" pointerEvents="none">
                    UK
                  </text>
                </g>

                {/* 3. SCANDINAVIA & NORWAY (Norwegian Fjords & Scandinavian Peninsula) */}
                <g
                  onClick={() => setSelectedId('norway')}
                  onMouseEnter={() => setHoveredId('norway')}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer transition-all duration-300"
                >
                  <path
                    d="M 518 48 Q 532 38 546 40 Q 552 54 544 74 Q 538 92 528 98 L 520 86 Q 514 70 518 48 Z"
                    fill={selectedId === 'norway' || hoveredId === 'norway' ? '#2e6345' : '#1b3829'}
                    stroke={selectedId === 'norway' || hoveredId === 'norway' ? '#C6912E' : '#2d5c41'}
                    strokeWidth={selectedId === 'norway' || hoveredId === 'norway' ? '1.6' : '0.9'}
                  />
                  <text x="532" y="68" fill="#F7F4EC" fontSize="8" fontWeight="700" opacity="0.85" textAnchor="middle" pointerEvents="none">
                    Norway
                  </text>
                </g>

                {/* 4. EUROPEAN UNION (Iberia, France, Germany, Italian Boot & Low Countries) */}
                <g
                  onClick={() => setSelectedId('europe')}
                  onMouseEnter={() => setHoveredId('europe')}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Western, Southern & Central Europe */}
                  <path
                    d="M 454 168 L 468 176 L 484 168 L 486 150 L 472 148 L 476 138 L 492 128 L 504 120 L 518 116 L 536 116 L 556 122 L 552 140 L 538 144 L 544 162 L 534 178 L 526 186 L 522 170 L 514 156 L 498 146 L 486 150 Z"
                    fill={selectedId === 'europe' || hoveredId === 'europe' ? '#2e6345' : '#1b3829'}
                    stroke={selectedId === 'europe' || hoveredId === 'europe' ? '#C6912E' : '#2d5c41'}
                    strokeWidth={selectedId === 'europe' || hoveredId === 'europe' ? '1.6' : '0.9'}
                  />
                  {/* Sicily */}
                  <path
                    d="M 528 192 Q 534 190 534 196 Q 528 198 528 192 Z"
                    fill={selectedId === 'europe' || hoveredId === 'europe' ? '#2e6345' : '#1b3829'}
                    stroke={selectedId === 'europe' || hoveredId === 'europe' ? '#C6912E' : '#2d5c41'}
                    strokeWidth="0.6"
                  />
                  <text x="518" y="145" fill="#F7F4EC" fontSize="8.5" fontWeight="700" opacity="0.85" textAnchor="middle" pointerEvents="none">
                    Europe
                  </text>
                </g>

                {/* 5. GCC & ARABIAN PENINSULA (Saudi Arabia, UAE/Dubai, Qatar, Oman) */}
                <g
                  onClick={() => setSelectedId('gcc')}
                  onMouseEnter={() => setHoveredId('gcc')}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer transition-all duration-300"
                >
                  <path
                    d="M 596 188 L 602 214 L 608 238 L 614 250 L 630 242 L 642 232 L 648 218 L 638 212 L 634 204 L 626 195 L 616 188 Z"
                    fill={selectedId === 'gcc' || hoveredId === 'gcc' ? '#2e6345' : '#1b3829'}
                    stroke={selectedId === 'gcc' || hoveredId === 'gcc' ? '#C6912E' : '#2d5c41'}
                    strokeWidth={selectedId === 'gcc' || hoveredId === 'gcc' ? '1.6' : '0.9'}
                  />
                  <text x="622" y="222" fill="#F7F4EC" fontSize="8.5" fontWeight="700" opacity="0.85" textAnchor="middle" pointerEvents="none">
                    GCC
                  </text>
                </g>

                {/* 6. INDIAN SUBCONTINENT (ORIGIN: Proper Kashmir Crown, Gujarat Peninsula/Mundra, South Cape, Bengal Delta) */}
                <g className="cursor-pointer">
                  <path
                    d="M 698 152 Q 706 148 712 155 Q 716 166 714 176 L 722 186 L 738 189 L 742 184 L 745 190 L 758 186 L 772 184 L 774 195 L 766 200 L 755 198 L 748 208 L 744 218 L 734 228 L 726 242 L 716 262 L 706 282 L 698 302 L 692 288 L 688 272 L 684 256 L 680 242 L 678 232 L 676 226 L 666 226 L 658 222 L 660 214 L 668 210 L 662 202 L 672 192 L 680 180 L 688 170 Z"
                    fill="#234E37"
                    stroke="#C6912E"
                    strokeWidth="2.2"
                    filter="url(#glow)"
                  />
                  {/* Sri Lanka */}
                  <path d="M 703 306 Q 708 304 708 312 Q 705 316 701 313 Z" fill="#234E37" stroke="#C6912E" strokeWidth="0.8" />
                  {/* Mundra & JNPT Origin Port Pins */}
                  <circle cx="664" cy="216" r="3" fill="#F5D061" stroke="#234E37" strokeWidth="1" />
                  <circle cx="678" cy="236" r="3" fill="#F5D061" stroke="#234E37" strokeWidth="1" />
                  <text x="704" y="235" fill="#F5D061" fontSize="10" fontWeight="800" textAnchor="middle" pointerEvents="none" filter="url(#glow)">
                    INDIA (Origin)
                  </text>
                </g>

                {/* 7. ASIAN MARKETS (Southeast Asia, Malay Peninsula, Singapore, East Asia & Japan Archipelago) */}
                <g
                  onClick={() => setSelectedId('asia')}
                  onMouseEnter={() => setHoveredId('asia')}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer transition-all duration-300"
                >
                  {/* Mainland China & East Asia Coast */}
                  <path
                    d="M 748 136 Q 815 125 842 152 Q 852 180 832 202 Q 815 220 788 234 L 778 218 Q 755 178 748 136 Z"
                    fill={selectedId === 'asia' || hoveredId === 'asia' ? '#2e6345' : '#1b3829'}
                    stroke={selectedId === 'asia' || hoveredId === 'asia' ? '#C6912E' : '#2d5c41'}
                    strokeWidth={selectedId === 'asia' || hoveredId === 'asia' ? '1.5' : '0.8'}
                  />
                  {/* Southeast Asia & Malay Peninsula down to Singapore */}
                  <path
                    d="M 784 238 L 794 252 L 793 274 L 787 272 L 780 256 L 782 242 Z"
                    fill={selectedId === 'asia' || hoveredId === 'asia' ? '#2e6345' : '#1b3829'}
                    stroke={selectedId === 'asia' || hoveredId === 'asia' ? '#C6912E' : '#2d5c41'}
                    strokeWidth="1.2"
                  />
                  {/* Japan Archipelago (Honshu, Hokkaido, Kyushu) */}
                  <path
                    d="M 880 134 Q 896 140 894 162 Q 884 175 874 160 Z"
                    fill={selectedId === 'asia' || hoveredId === 'asia' ? '#2e6345' : '#1b3829'}
                    stroke={selectedId === 'asia' || hoveredId === 'asia' ? '#C6912E' : '#2d5c41'}
                    strokeWidth="0.9"
                  />
                  {/* Indonesian & Philippines Islands */}
                  <path
                    d="M 798 288 Q 838 288 854 314 Q 828 320 794 304 Z"
                    fill={selectedId === 'asia' || hoveredId === 'asia' ? '#2e6345' : '#1b3829'}
                    stroke={selectedId === 'asia' || hoveredId === 'asia' ? '#C6912E' : '#2d5c41'}
                    strokeWidth="0.7"
                  />
                  <text x="815" y="195" fill="#F7F4EC" fontSize="8.5" fontWeight="700" opacity="0.85" textAnchor="middle" pointerEvents="none">
                    Asia
                  </text>
                </g>
              </g>

              {/* Trade Route Arc Connections from India to Destinations */}
              <g>
                {regions.map((region) => {
                  const isHighlighted = selectedId === 'all' || selectedId === region.id || hoveredId === region.id;
                  const isSoleFocus = selectedId === region.id || hoveredId === region.id;

                  // Quadratic Bézier curve calculation with arched control point
                  const midX = (ORIGIN.hub.x + region.hub.x) / 2;
                  const midY = Math.min(ORIGIN.hub.y, region.hub.y) - 45 - Math.abs(ORIGIN.hub.x - region.hub.x) * 0.08;
                  const pathData = `M ${ORIGIN.hub.x} ${ORIGIN.hub.y} Q ${midX} ${midY} ${region.hub.x} ${region.hub.y}`;

                  return (
                    <g key={`arc-${region.id}`} className="transition-all duration-300">
                      {/* Glow Background Line when highlighted */}
                      {isHighlighted && (
                        <path
                          d={pathData}
                          fill="none"
                          stroke={isSoleFocus ? '#C6912E' : '#57A376'}
                          strokeWidth={isSoleFocus ? 3.5 : 2}
                          strokeOpacity={isSoleFocus ? 0.8 : 0.4}
                          strokeDasharray={isSoleFocus ? 'none' : '4 4'}
                          filter="url(#glow)"
                        />
                      )}

                      {/* Main Arc Path */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={isSoleFocus ? '#FFD56B' : isHighlighted ? '#A3D9B5' : '#2D4E3C'}
                        strokeWidth={isSoleFocus ? 2.5 : isHighlighted ? 1.5 : 0.8}
                        strokeOpacity={isHighlighted ? 0.95 : 0.25}
                        strokeDasharray={isHighlighted ? '6 4' : '3 6'}
                        className={isHighlighted ? 'animate-pulse' : ''}
                      />

                      {/* Moving Particle along the Arc (Simulated by animated dot) */}
                      {isHighlighted && (
                        <circle
                          r={isSoleFocus ? 3.5 : 2.5}
                          fill="#FFF"
                          filter="url(#brightGlow)"
                        >
                          <animateMotion
                            path={pathData}
                            dur={isSoleFocus ? '3s' : '5s'}
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* Origin Hub Marker: INDIA */}
              <g className="cursor-pointer">
                {/* Expanding Pulse Ring */}
                <circle cx={ORIGIN.hub.x} cy={ORIGIN.hub.y} r="18" fill="none" stroke="#C6912E" strokeWidth="1" opacity="0.6">
                  <animate attributeName="r" values="8;24" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx={ORIGIN.hub.x} cy={ORIGIN.hub.y} r="8" fill="#C6912E" filter="url(#brightGlow)" />
                <circle cx={ORIGIN.hub.x} cy={ORIGIN.hub.y} r="4" fill="#FFFFFF" />

                {/* Origin Label Tag */}
                <g transform={`translate(${ORIGIN.hub.x - 48}, ${ORIGIN.hub.y + 14})`}>
                  <rect width="96" height="20" rx="10" fill="#16241C" stroke="#C6912E" strokeWidth="1" opacity="0.9" />
                  <text x="48" y="14" textAnchor="middle" fill="#FFD56B" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                    ★ ORIGIN: INDIA
                  </text>
                </g>
              </g>

              {/* Destination Nodes */}
              {regions.map((region) => {
                const isSelected = selectedId === region.id;
                const isHovered = hoveredId === region.id;
                const isMatch = selectedId === 'all' || isSelected || isHovered;

                return (
                  <g
                    key={`pin-${region.id}`}
                    className="cursor-pointer transition-transform duration-200"
                    onClick={() => setSelectedId(region.id)}
                    onMouseEnter={() => setHoveredId(region.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Active Pulse Ring */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={region.hub.x}
                        cy={region.hub.y}
                        r="16"
                        fill="none"
                        stroke="#C6912E"
                        strokeWidth="1.5"
                      >
                        <animate attributeName="r" values="6;20" dur="1.8s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0" dur="1.8s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Outer Pin Halo */}
                    <circle
                      cx={region.hub.x}
                      cy={region.hub.y}
                      r={isSelected || isHovered ? 8 : 6}
                      fill={isMatch ? '#C6912E' : '#2D4E3C'}
                      filter={isMatch ? 'url(#glow)' : undefined}
                      opacity={isMatch ? 0.9 : 0.6}
                    />

                    {/* Core Pin Dot */}
                    <circle
                      cx={region.hub.x}
                      cy={region.hub.y}
                      r={isSelected || isHovered ? 4 : 3}
                      fill={isMatch ? '#FFFFFF' : '#88A392'}
                    />

                    {/* Pin Label */}
                    <g transform={`translate(${region.hub.x}, ${region.hub.y - 12})`}>
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        fill={isMatch ? '#FFFFFF' : '#88A392'}
                        fontSize={isSelected || isHovered ? '11' : '9.5'}
                        fontWeight={isMatch ? '700' : '500'}
                        fontFamily="sans-serif"
                        className="drop-shadow-md select-none"
                      >
                        {region.name}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* In-Map Active Tooltip / Spotlight Pill (Desktop Overlay) */}
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-ink/80 px-4 py-2.5 backdrop-blur-md sm:left-6 sm:right-6">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 animate-ping rounded-full bg-gold" />
                <span className="font-mono text-xs font-semibold uppercase text-gold">Direct Export Corridors Active</span>
              </div>
              <p className="text-xs text-paper/70">
                Click any region marker or button to inspect compliance, entry ports & product lines.
              </p>
            </div>
          </div>

          {/* Detailed Region Dossier / Drawer Card */}
          {activeRegion && (
            <div className="border-t border-white/10 bg-[#0F1D15] p-6 transition-all duration-300 sm:p-8">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{activeRegion.flag}</span>
                    <h3 className="font-display text-2xl font-bold text-paper">{activeRegion.fullName}</h3>
                    <span className="rounded-full bg-gold/15 px-3 py-0.5 font-mono text-[11px] font-semibold text-gold">
                      ACTIVE ROUTE
                    </span>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-paper/75">
                    {activeRegion.description}
                  </p>
                </div>

                <div className="flex flex-shrink-0 items-center gap-4">
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center">
                    <p className="font-mono text-[10px] uppercase text-paper/50">On-Time Transit</p>
                    <p className="font-display text-lg font-bold text-gold">{activeRegion.stats.deliveryRate}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center">
                    <p className="font-mono text-[10px] uppercase text-paper/50">Growth</p>
                    <p className="font-display text-lg font-bold text-emerald-400">{activeRegion.stats.volumeGrowth}</p>
                  </div>
                </div>
              </div>

              {/* Grid of Key Ports & Transit Duration */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-gold">Primary Entry Ports</p>
                  <ul className="mt-2 space-y-1.5 text-xs text-paper/80">
                    {activeRegion.ports.slice(0, 5).map((port, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                        <span>{port}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-gold">Transit Duration</p>
                  <p className="mt-2 text-sm font-semibold text-emerald-300">
                    {activeRegion.transitTime}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-paper/50">Direct ocean & air corridors from Mundra / Nhava Sheva (JNPT)</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Capabilities 4-Pillar Bar (Dynamic from Admin) */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 home-reveal">
          {(mapConfig.pillars || DEFAULT_PILLARS).map((pillar, idx) => (
            <div
              key={pillar._id || idx}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:border-gold/40 hover:bg-white/10"
            >
              <span className="font-mono text-xl text-gold">{pillar.number || String(idx + 1).padStart(2, '0')}</span>
              <h4 className="mt-2 font-display text-base font-bold text-paper">{pillar.title}</h4>
              <p className="mt-1 text-xs text-paper/60 leading-relaxed">
                {pillar.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
