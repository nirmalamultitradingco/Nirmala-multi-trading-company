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

              {/* Continents Vector Landmass Paths */}
              <g fill="#1A3326" stroke="#254836" strokeWidth="0.75" className="transition-colors duration-500">
                {/* North America */}
                <path d="M 120 70 Q 180 50 250 65 Q 290 90 280 140 Q 260 170 240 210 Q 210 230 190 250 L 170 230 Q 150 180 130 150 Q 90 120 120 70 Z" />
                {/* Canada & Alaska Extension */}
                <path d="M 80 80 Q 130 40 220 40 Q 270 50 310 70 L 290 100 Q 220 80 160 90 Z" />
                {/* Greenland */}
                <path d="M 340 40 Q 380 30 410 45 Q 400 90 370 95 Q 340 80 340 40 Z" opacity="0.6" />
                {/* South America */}
                <path d="M 230 270 Q 270 270 300 310 Q 320 370 290 430 Q 260 470 240 440 Q 230 360 215 320 Z" />
                {/* Europe */}
                <path d="M 470 90 Q 520 85 570 105 Q 560 150 520 160 Q 480 160 465 140 Q 460 110 470 90 Z" />
                {/* Scandinavia & Norway */}
                <path d="M 505 50 Q 535 45 545 70 Q 540 105 520 110 Q 500 90 505 50 Z" />
                {/* United Kingdom & Ireland */}
                <path d="M 475 95 Q 492 90 495 112 Q 485 125 470 120 Z" />
                {/* Africa */}
                <path d="M 470 170 Q 540 165 570 210 Q 590 270 560 350 Q 530 400 500 390 Q 460 340 450 260 Q 440 200 470 170 Z" />
                {/* Asia Mainland */}
                <path d="M 570 95 Q 670 70 820 85 Q 920 110 930 180 Q 900 240 850 260 Q 820 220 780 230 Q 730 200 680 200 Q 640 180 580 160 Z" />
                {/* Indian Subcontinent (Highlighted as Export Source Gateway) */}
                <path
                  d="M 670 190 Q 720 190 735 220 Q 725 270 700 290 Q 675 260 665 220 Z"
                  fill="#234E37"
                  stroke="#C6912E"
                  strokeWidth="1.2"
                />
                {/* Arabian Peninsula / GCC */}
                <path
                  d="M 590 190 Q 645 180 660 210 Q 650 250 615 250 Q 580 240 590 190 Z"
                  fill={selectedId === 'gcc' || hoveredId === 'gcc' ? '#2A553E' : '#1A3326'}
                  stroke={selectedId === 'gcc' || hoveredId === 'gcc' ? '#C6912E' : '#254836'}
                  strokeWidth={selectedId === 'gcc' || hoveredId === 'gcc' ? '1.5' : '0.75'}
                />
                {/* Southeast Asia Islands & Peninsulas */}
                <path d="M 770 245 Q 820 245 840 280 Q 830 320 790 320 Q 760 280 770 245 Z" />
                {/* Japan Archipelago */}
                <path d="M 885 130 Q 910 145 905 175 Q 890 180 880 155 Z" />
                {/* Australia */}
                <path d="M 810 330 Q 890 320 910 365 Q 890 420 830 420 Q 780 390 810 330 Z" opacity="0.65" />
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
