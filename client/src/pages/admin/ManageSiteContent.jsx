import { useEffect, useState } from 'react';
import api, { asset } from '../../api/axios.js';
import ImageUpload from '../../components/admin/ImageUpload.jsx';
import VideoUpload from '../../components/admin/VideoUpload.jsx';

const defaults = {
  homeHero: { eyebrow: 'NMC', title: 'India’s Taste. The World’s Table', description: 'Connecting trusted Indian food products with buyers around the world.', items: [{ title: 'Quality Products', description: 'Sourcing quality products for global markets.', image: 'https://www.w3schools.com/w3images/coffee.jpg', order: 1, isActive: true }, { title: 'Trusted Trading Partner', description: 'Reliable sourcing, documentation and export solutions.', image: 'https://www.w3schools.com/w3images/workbench.jpg', order: 2, isActive: true }, { title: 'Global Connections', description: 'Connecting trusted suppliers with international buyers.', image: 'https://www.w3schools.com/w3images/sound.jpg', order: 3, isActive: true }] },
  aboutHero: { eyebrow: 'About NMC', title: 'India’s Taste. The World’s Table', description: 'We connect trusted Indian food products with international buyers through a clear, organised export process.' },
  inquiryHero: { eyebrow: 'Get in touch', title: "We're ready to talk.", description: 'Tell us what you are looking for and our export team will get back to you with product details, samples and pricing.' },
  homeOfferings: { eyebrow: 'What we offer', title: 'Export support built around your market', description: '', items: [] },
  homeHowWeWork: { eyebrow: 'How we work', title: 'A single bridge to global buyers', description: '', items: [] },
  aboutApproach: { eyebrow: 'Our approach', title: 'What sets us apart', description: '', items: [] },
  aboutWhyChooseUs: { eyebrow: 'Why choose us', title: 'A practical partner for international food sourcing', description: '', items: [] },
  testimonials: { eyebrow: 'Client feedback', title: 'What our clients say about us', description: '', items: [] },
  globalMap: {
    eyebrow: 'Global Footprint',
    title: 'Export Corridors We Actively Serve',
    description: 'Reliable maritime & air freight routes delivering export-grade Indian agri commodities, spices, and processed foods worldwide.',
    regions: [
      { name: 'United States', code: 'USA', x: 230, y: 195, ports: ['New York / New Jersey', 'Long Beach (Los Angeles)', 'Houston / Savannah'], transitTime: '24 – 28 Days', deliveryRate: '99.4%', volumeGrowth: '+34%', order: 1, isActive: true },
      { name: 'United Kingdom', code: 'UK', x: 472, y: 145, ports: ['Felixstowe', 'Southampton', 'London Gateway'], transitTime: '18 – 22 Days', deliveryRate: '99.8%', volumeGrowth: '+28%', order: 2, isActive: true },
      { name: 'European Union', code: 'Europe', x: 510, y: 170, ports: ['Rotterdam (Netherlands)', 'Hamburg (Germany)', 'Antwerp (Belgium)'], transitTime: '20 – 24 Days', deliveryRate: '99.2%', volumeGrowth: '+41%', order: 3, isActive: true },
      { name: 'Norway & Scandinavia', code: 'Norway', x: 520, y: 110, ports: ['Oslo Port', 'Gothenburg', 'Bergen'], transitTime: '22 – 26 Days', deliveryRate: '99.5%', volumeGrowth: '+19%', order: 4, isActive: true },
      { name: 'GCC & Middle East', code: 'GCC', x: 615, y: 235, ports: ['Jebel Ali (Dubai)', 'Hamad Port (Qatar)', 'Jeddah Islamic Port (KSA)'], transitTime: '4 – 7 Days', deliveryRate: '99.9%', volumeGrowth: '+52%', order: 5, isActive: true },
      { name: 'Asian Markets', code: 'Asian', x: 790, y: 280, ports: ['Port of Singapore', 'Port Klang (Malaysia)', 'Tokyo / Yokohama (Japan)'], transitTime: '8 – 14 Days', deliveryRate: '99.6%', volumeGrowth: '+37%', order: 6, isActive: true },
    ],
    pillars: [
      { number: '01', title: '6 Global Corridors', text: 'Established logistics networks reaching USA, Europe, UK, Norway, Asia, and GCC ports.', order: 1, isActive: true },
      { number: '02', title: '100% HS & Lab Clearance', text: 'Pre-shipment phytosanitary, pesticide MRL, and fumigation certificates for zero-delay customs clearance.', order: 2, isActive: true },
      { number: '03', title: 'Direct Sea & Air Options', text: 'Full Container Load (FCL), Less than Container Load (LCL), and urgent temperature-controlled air freight.', order: 3, isActive: true },
      { number: '04', title: 'Flexible Incoterms', text: 'FOB, CIF, CFR, and DDP terms customized to buyer preference with transparent tracking.', order: 4, isActive: true },
    ],
  },
  certificates: {
    eyebrow: 'Accreditations & Compliance',
    title: 'Certified for Global Trade',
    description: 'Our export consignments strictly conform to international food safety, phytosanitary standards, and destination-country import regulations.',
    items: [
      { name: 'Food Safety and Standards Authority of India', issuer: 'Govt. of India Statutory Food License', code: 'fssai', description: 'Mandatory central certification verifying supreme hygiene, raw material testing, pesticide residue adherence, and ethical food packaging standards.', highlights: ['Zero adulteration mandate', 'Periodic batch laboratory assays', 'Full farm-to-dispatch traceability'], order: 1, isActive: true },
      { name: 'Agricultural & Processed Food Products Export Development Authority', issuer: 'Ministry of Commerce & Industry, India', code: 'apeda', description: 'Official export certification facilitating trade oversight, scheduled food grading, port-level phytosanitary documentation, and residue monitoring.', highlights: ['Global organic trace compliance', 'Govt accredited export verification', 'Scheduled agricultural standards'], order: 2, isActive: true },
      { name: 'Good Manufacturing Practice', issuer: 'Quality & Integrity Assured Manufacturing', code: 'gmp', description: 'Ensures products are consistently manufactured and controlled to quality standards appropriate to their intended use and international market requirements.', highlights: ['State-of-the-art grading & packing', 'Standard operating procedures (SOP)', 'Batch consistency guarantees'], order: 3, isActive: true },
      { name: 'Good Hygiene Practices', issuer: 'Sanitation & Clean Handling Protocol', code: 'ghp', description: 'Strict hygiene controls across raw material procurement, warehouse cleanliness, employee sanitation, and temperature-controlled storage.', highlights: ['Sanitized packing environments', 'Pest-free hermetic storage', 'Safe contact packaging'], order: 4, isActive: true },
      { name: 'Hazard Analysis Critical Control Point', issuer: 'Preventive Food Safety Protocol', code: 'haccp', description: 'Systematic preventive approach targeting biological, chemical, and physical food hazards in production processes rather than finished product inspection alone.', highlights: ['Critical control point monitoring', 'Contamination prevention', 'Continuous process validation'], order: 5, isActive: true },
      { name: 'ISO 22000:2018 Food Safety Management', issuer: 'International Organization for Standardization', code: 'iso22000', description: 'The premier global food safety management benchmark harmonizing interactive communication, system management, and prerequisite programs.', highlights: ['Comprehensive hazard screening', 'International supply-chain alignment', 'Rigorous third-party audits'], order: 6, isActive: true },
      { name: 'American Spice Trade Association', issuer: 'Premier International Spice Trade Body', code: 'asta', description: 'Adherence to ASTA cleanliness specifications, steam sterilization standards, volatile oil content guarantees, and moisture thresholds for North American and world markets.', highlights: ['Cleanliness & purity testing', 'ETO / Steam treated options', 'Strict volatile oil benchmarks'], order: 7, isActive: true },
    ],
  },
  engineerTrade: {
    eyebrow: 'Industrial & Large-Scale Operations',
    title: 'Engineering High-Volume Global Trade',
    description:
      'Scalable processing, precision container consolidation, and institutional supply chain reliability from farm gate to global port.',
    badge: 'FCL & Multi-Container Consignments',
    items: [
      {
        title: 'Sortex Cleaning & Optical Grading',
        metric: '99.9% Purity',
        subtitle: 'Zero foreign matter tolerance',
        description:
          'Advanced optical Buhler color sorters and gravity separators ensuring clean, uniform export-grade spices and oil seeds.',
        icon: '🔍',
        order: 1,
        isActive: true,
      },
      {
        title: 'Multi-Commodity FCL Consolidation',
        metric: '500+ TEU / yr',
        subtitle: 'Mundra & JNPT Port hubs',
        description:
          'Stuffing multiple distinct agricultural products into single 20ft/40ft ocean containers to optimize buyer inventory turnover.',
        icon: '🚢',
        order: 2,
        isActive: true,
      },
      {
        title: 'MRL & Phytosanitary Lab Clearance',
        metric: 'Zero-Rejection',
        subtitle: 'Certified export compliance',
        description:
          'Comprehensive pre-shipment tests for pesticide residue, aflatoxin, heavy metals, and moisture clearance before sailing.',
        icon: '📋',
        order: 3,
        isActive: true,
      },
      {
        title: 'Institutional Bulk & Private Label',
        metric: 'Custom Pack',
        subtitle: 'Tailored for retail & food service',
        description:
          'From 25kg / 50kg multi-wall paper and PP bags to high-barrier nitrogen-flushed retail standup pouches with buyer branding.',
        icon: '📦',
        order: 4,
        isActive: true,
      },
    ],
  },
  newArrivals: {
    isActive: true,
    badge: 'Live Market Arrivals',
    eyebrow: 'Fresh Crop Season 2026',
    title: 'New product arrivals',
    description: 'Directly sourced from verified Indian farm clusters and modern Sortex milling hubs.',
    autoRotateSeconds: 4,
    items: [
      {
        name: 'Sortex-Cleaned Cumin Seeds (Jeera)',
        slug: 'sortex-cumin-seeds-jeera',
        categoryName: 'Spices & Seasonings',
        origin: 'Unjha, Gujarat',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=75',
        shortDescription: '99.5% European purity, Sortex machine graded with volatile oil content > 3.0% and low moisture.',
        hsCode: '090931',
        packageType: '25kg Multi-wall Paper',
        moq: '1 x 20ft FCL',
        order: 1,
        isActive: true,
      },
      {
        name: '1121 Steam Basmati Rice (8.35mm+)',
        slug: '1121-steam-basmati-rice',
        categoryName: 'Grains & Pulses',
        origin: 'Punjab & Haryana',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=75',
        shortDescription: 'Extra-long slender grain, rich aroma, and 2.5x elongation upon cooking. Aflatoxin tested.',
        hsCode: '100630',
        packageType: '10kg / 25kg Non-Woven',
        moq: '1 x 20ft FCL',
        order: 2,
        isActive: true,
      },
      {
        name: 'High Curcumin Turmeric Fingers',
        slug: 'high-curcumin-turmeric-fingers',
        categoryName: 'Spices & Seasonings',
        origin: 'Salem / Nizamabad',
        image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=75',
        shortDescription: 'Deep golden yellow fingers with 3.8%–5.2% natural curcumin. Free of Sudan dyes and lead chromate.',
        hsCode: '091030',
        packageType: '25kg / 50kg Jute & PP',
        moq: '1 x 20ft FCL',
        order: 3,
        isActive: true,
      },
      {
        name: 'Dehydrated White Onion Flakes / Kibbled',
        slug: 'dehydrated-white-onion-flakes',
        categoryName: 'Dehydrated Foods',
        origin: 'Mahuva, Gujarat',
        image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=800&q=75',
        shortDescription: 'Crisp, pungent dehydrated onion kibbled with moisture < 5.5%. Microbial assay for zero Salmonella.',
        hsCode: '071220',
        packageType: '14kg Carton with Poly Liner',
        moq: '1 x 20ft FCL',
        order: 4,
        isActive: true,
      },
      {
        name: 'Hulled White Sesame Seeds (99.98% Purity)',
        slug: 'hulled-white-sesame-seeds',
        categoryName: 'Oil Seeds & Commodities',
        origin: 'Saurashtra, Gujarat',
        image: 'https://images.unsplash.com/photo-1563412885-139e4045ec52?auto=format&fit=crop&w=800&q=75',
        shortDescription: 'Mechanically hulled white sesame seeds with min 51% oil content, Sortex laser sorted.',
        hsCode: '120740',
        packageType: '25kg 3-Ply Paper Bags',
        moq: '1 x 20ft FCL',
        order: 5,
        isActive: true,
      },
    ],
  },
  flashCard: {
    isActive: true,
    title: 'India’s Taste. The World’s Table',
    subtitle: 'Direct sourcing of export-grade Indian spices, premium grains, and agro-commodities with certified global shipping.',
    image: '',
    buttonText: 'Explore Our Products',
    buttonLink: '/products',
  },
  chatbot: {
    botName: 'TradeMitra',
    botSubtitle: 'AI Export & Sourcing Assistant',
    welcomeMessage:
      'Hello! I am **TradeMitra**, your export & sourcing assistant at **Nirmala Multi Trading Co.** (NMC).\n\nHow can I assist your food import or procurement inquiry today?',
    defaultSuggestions: [
      'What spices do you export?',
      'Shipping to USA, Europe & GCC',
      'Can I request sample kits?',
      'Certificates & Quality',
    ],
    disclaimer:
      'Responses are generated based on NMC product catalogues and export shipping specifications.',
    isActive: true,
    knowledgeBase: [
      {
        triggers: ['spice', 'spices', 'cumin', 'turmeric', 'chilli', 'coriander', 'fenugreek', 'fennel', 'mustard', 'pepper'],
        reply: 'We export 100% Sortex-cleaned, premium Indian spices directly from farm clusters in Gujarat and Rajasthan: Cumin Seeds (Singapore 99%, Europe 99.5% Sortex), Turmeric (High Curcumin 3-5%), Red Chilli (Teja, Sanman, Byadgi), and Coriander seeds. Steam-sterilized and pesticide compliant.',
        link: '/products',
        linkText: 'Browse All Products →',
        suggestions: ['What is your MOQ?', 'Request sample kit', 'Lab certifications'],
        order: 1,
        isActive: true,
      },
      {
        triggers: ['grain', 'grains', 'rice', 'basmati', 'wheat', 'pulse', 'pulses', 'dal', 'chickpea', 'lentil'],
        reply: 'We supply high-grade Indian agricultural grains and pulses in bulk and retail packs: Basmati Rice (1121 Steam, Sella & Golden Sella 8.35mm+), Non-Basmati (Sona Masoori, PR-11, IR-64), and Pulses (Kabuli Chickpeas 75/80, 58/60, Toor Dal, Moong).',
        link: '/products',
        linkText: 'Explore Grain & Rice Catalogue →',
        suggestions: ['What is your MOQ?', 'Shipping transit time', 'Request pricing'],
        order: 2,
        isActive: true,
      },
      {
        triggers: ['dehydrate', 'dehydrated', 'onion', 'garlic', 'flake', 'powder'],
        reply: 'NMC sources premium dehydrated vegetables from Mahuva, Gujarat: Dehydrated White & Red Onion (Flakes, Minced, Chopped, Powder) and Dehydrated Garlic (Cloves, Flakes, Minced, Pure Powder). Moisture < 6% with zero Salmonella/E. Coli.',
        link: '/products',
        linkText: 'View Dehydrated Products →',
        suggestions: ['Ask for quotation', 'Request sample kit'],
        order: 3,
        isActive: true,
      },
      {
        triggers: ['port', 'ports', 'shipping', 'transit', 'logistics', 'container', 'fcl', 'lcl', 'freight', 'mundra', 'jnpt'],
        reply: 'We handle smooth containerized logistics from Mundra Port (Gujarat) & Nhava Sheva (JNPT, Mumbai). Transit times: GCC 3-7 days, Asia 6-14 days, UK 20-25 days, Europe 18-24 days, USA 22-28 days. Available in FCL and LCL under FOB, CIF, CFR, or DDP terms.',
        link: '/inquiry',
        linkText: 'Get Container Freight Quote →',
        suggestions: ['How to request samples?', 'Pesticide & Lab compliance'],
        order: 4,
        isActive: true,
      },
      {
        triggers: ['certificate', 'certificates', 'certification', 'fssai', 'apeda', 'iso', 'haccp', 'gmp', 'asta', 'lab'],
        reply: 'Our export consignments strictly conform to international food safety regulations: FSSAI, APEDA, ISO 22000:2018, HACCP, GMP, and ASTA benchmarks. We supply Phytosanitary Certificate, Fumigation Certificate, Certificate of Origin, and SGS/Eurofins pesticide MRL lab reports.',
        link: '/brochures',
        linkText: 'Download Specification Sheets →',
        suggestions: ['Request sample kit', 'What spices do you export?'],
        order: 5,
        isActive: true,
      },
      {
        triggers: ['sample', 'samples', 'moq', 'minimum order', 'order quantity'],
        reply: 'Physical Sample Kits: We dispatch representative laboratory samples via international courier (DHL / FedEx) for your testing and sensory evaluation. Commercial MOQ: Typically 1 FCL (20ft container ≈ 18-25 MT). We also offer LCL consolidation for trial orders.',
        link: '/inquiry',
        linkText: 'Request Physical Sample Kit →',
        suggestions: ['Send an inquiry', 'Talk to sales team'],
        order: 6,
        isActive: true,
      },
      {
        triggers: ['partner', 'partners', 'supplier', 'become partner', 'registration', 'producer'],
        reply: 'Are you a food manufacturer, miller, or farmer group in India? NMC collaborates with verified Indian food processors and agricultural mills to export worldwide. You can register directly on our Partners page!',
        link: '/become-a-partner',
        linkText: 'Submit Partner Registration →',
        suggestions: ['Browse all products', 'Contact details'],
        order: 7,
        isActive: true,
      },
      {
        triggers: ['price', 'pricing', 'quote', 'quotation', 'rate', 'cost', 'cif', 'fob'],
        reply: 'Agricultural commodity prices fluctuate based on seasonal harvest arrivals and ocean freight rates. To receive an official FOB (Mundra/JNPT) or CIF quotation, please submit an inquiry with your desired quantity and destination port.',
        link: '/inquiry',
        linkText: 'Request CIF / FOB Quotation →',
        suggestions: ['Request sample kit', 'Port transit times'],
        order: 8,
        isActive: true,
      },
    ],
  },
  productsPage: {
    isActive: true,
    hero: {
      badge: 'Global Agro-Food Catalogue',
      eyebrow: 'CERTIFIED INDIAN EXPORTS',
      title: 'All Export Food Products',
      subtitle:
        '100% Sortex-cleaned Indian spices, premium grains, pulses, and value-added food products ready for containerized ocean shipping.',
    },
    showcase: {
      isActive: true,
      defaultMode: 'wheel',
      title: 'Featured Export Products',
      subtitle:
        'Discover our certified Sortex-cleaned harvest lots and premium packaged Indian food products ready for global ocean freight.',
      watermark: 'FOOD PRODUCTS',
      autoRotateSeconds: 3.5,
      showcaseBadge: 'FEATURED FOOD SHOWCASE',
      keepCustomTitle: false,
    },
    bento: {
      badge: 'DIRECT SOURCING GUARANTEE',
      headline: 'Global Food Products, Perfected',
      subtitle:
        'Direct sourcing of export-grade Indian spices, premium grains, and food products with certified global shipping.',
      bullets: [
        'Direct Mundra Port (INMUN1) & JNPT Container Stuffing',
        'APEDA, Spice Board of India & FSSAI Registered Consignments',
        'European MRL & ASTA Purity Compliance with Full Batch Traceability',
        'Customized Retail Standup Pouches & Institutional Bulk Bags',
      ],
      buttonText: 'Request Container Quotation',
      buttonLink: '/inquiry',
    },
    trustBar: {
      isActive: true,
      title: 'Why Global Buyers Trust NMC',
      items: [
        {
          icon: '🔍',
          title: '100% Sortex Optical Cleaning',
          text: 'Laser graded to 99.5% European purity with zero foreign contaminants.',
        },
        {
          icon: '🚢',
          title: 'Port-Direct Logistics',
          text: 'Express sailings from Mundra Port and JNPT Nhava Sheva to worldwide ports.',
        },
        {
          icon: '📜',
          title: 'Phyto & MRL Compliance',
          text: 'Pre-shipment phytosanitary and aflatoxin lab assays with every container.',
        },
        {
          icon: '📦',
          title: 'Custom Packaging & Branding',
          text: 'From 25kg multi-wall paper bags to buyer-branded retail standup pouches.',
        },
      ],
    },
    ctaBanner: {
      isActive: true,
      eyebrow: 'READY FOR EXPORT ORDERS',
      title: 'Need Container Freight Quotations or Custom Samples?',
      description:
        'Our international trade desk prepares formal FOB (Mundra/JNPT) or CIF proforma invoices within 12–24 business hours. Courier sample kits dispatched worldwide.',
      buttonPrimaryText: 'Request Official Quotation →',
      buttonPrimaryLink: '/inquiry',
      buttonSecondaryText: 'Download Product Brochures',
      buttonSecondaryLink: '/brochures',
    },
  },
};

const clone = (v) => JSON.parse(JSON.stringify(v));

function ItemEditor({ section, setSection, image = false, side = false, video = false }) {
  const updateItem = (i, key, value) => {
    const items = [...(section?.items || [])];
    items[i] = { ...items[i], [key]: value };
    setSection({ ...section, items });
  };
  const add = () =>
    setSection({
      ...section,
      items: [
        ...(section?.items || []),
        {
          title: '',
          description: '',
          icon: String((section?.items?.length || 0) + 1).padStart(2, '0'),
          order: (section?.items?.length || 0) + 1,
          isActive: true,
          image: '',
          video: '',
          side: 'left',
        },
      ],
    });
  const remove = (i) =>
    setSection({
      ...section,
      items: (section?.items || []).filter((_, index) => index !== i),
    });

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Eyebrow / small label</label>
          <input
            className="field"
            value={section?.eyebrow || ''}
            onChange={(e) => setSection({ ...section, eyebrow: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Main heading</label>
          <input
            className="field"
            value={section?.title || ''}
            onChange={(e) => setSection({ ...section, title: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          className="field"
          rows="3"
          value={section?.description || ''}
          onChange={(e) => setSection({ ...section, description: e.target.value })}
        />
      </div>
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold">Items</h3>
        <button type="button" className="btn-outline" onClick={add}>
          + Add item
        </button>
      </div>
      {(section?.items || []).map((item, i) => (
        <div key={item._id || i} className="rounded-xl border border-line bg-paper p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-widest text-moss">Item {i + 1}</span>
            <button
              type="button"
              className="text-sm text-clay hover:underline"
              onClick={() => remove(i)}
            >
              Remove
            </button>
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Title</label>
              <input
                className="field"
                value={item.title || ''}
                onChange={(e) => updateItem(i, 'title', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Number / icon</label>
              <input
                className="field"
                value={item.icon || ''}
                onChange={(e) => updateItem(i, 'icon', e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea
                className="field"
                rows="3"
                value={item.description || ''}
                onChange={(e) => updateItem(i, 'description', e.target.value)}
              />
            </div>
            {image && (
              <div className="sm:col-span-2">
                <ImageUpload
                  label="Poster / Fallback Image"
                  value={item.image || ''}
                  onChange={(url) => updateItem(i, 'image', url)}
                />
              </div>
            )}
            {video && (
              <div className="sm:col-span-2">
                <VideoUpload
                  label="Product Commercial Video (MP4 / WebM / Direct URL)"
                  value={item.video || ''}
                  onChange={(url) => updateItem(i, 'video', url)}
                />
              </div>
            )}
            {side && (
              <div>
                <label className="label">Timeline side</label>
                <select
                  className="field"
                  value={item.side || 'left'}
                  onChange={(e) => updateItem(i, 'side', e.target.value)}
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
            )}
            <div className="w-28">
              <label className="label">Order</label>
              <input
                type="number"
                className="field"
                value={item.order ?? i + 1}
                onChange={(e) => updateItem(i, 'order', Number(e.target.value))}
              />
            </div>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={item.isActive !== false}
              onChange={(e) => updateItem(i, 'isActive', e.target.checked)}
            />{' '}
            Visible on site
          </label>
        </div>
      ))}
    </div>
  );
}

function MapEditor({ section, setSection }) {
  const current = section || defaults.globalMap;
  const updateRegion = (i, key, value) => {
    const regions = [...(current.regions || [])];
    regions[i] = { ...regions[i], [key]: value };
    setSection({ ...current, regions });
  };

  const addRegion = () => {
    setSection({
      ...current,
      regions: [
        ...(current.regions || []),
        {
          name: 'New Destination',
          code: 'NEW',
          x: 500,
          y: 250,
          transitTime: '15 – 20 Days',
          ports: ['Primary Port A', 'Primary Port B'],
          deliveryRate: '99.5%',
          volumeGrowth: '+25%',
          order: (current.regions?.length || 0) + 1,
          isActive: true,
        },
      ],
    });
  };

  const removeRegion = (i) => {
    setSection({
      ...current,
      regions: (current.regions || []).filter((_, index) => index !== i),
    });
  };

  const updatePillar = (i, key, value) => {
    const pillars = [...(current.pillars || defaults.globalMap.pillars)];
    pillars[i] = { ...pillars[i], [key]: value };
    setSection({ ...current, pillars });
  };

  const addPillar = () => {
    const currentPillars = current.pillars || defaults.globalMap.pillars;
    setSection({
      ...current,
      pillars: [
        ...currentPillars,
        {
          number: String(currentPillars.length + 1).padStart(2, '0'),
          title: 'New Capability',
          text: 'Description of the global export capability or trade service.',
          order: currentPillars.length + 1,
          isActive: true,
        },
      ],
    });
  };

  const removePillar = (i) => {
    const currentPillars = current.pillars || defaults.globalMap.pillars;
    setSection({
      ...current,
      pillars: currentPillars.filter((_, index) => index !== i),
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Eyebrow</label>
          <input
            className="field"
            value={current.eyebrow || ''}
            onChange={(e) => setSection({ ...current, eyebrow: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Title</label>
          <input
            className="field"
            value={current.title || ''}
            onChange={(e) => setSection({ ...current, title: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          className="field"
          rows="2"
          value={current.description || ''}
          onChange={(e) => setSection({ ...current, description: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4">
        <div>
          <h3 className="font-display font-bold text-ink">Served Regions & Trade Corridors</h3>
          <p className="text-xs text-ink/60">Manage countries, coordinates, transit days, and entry ports shown on the map.</p>
        </div>
        <button type="button" className="btn-primary text-xs" onClick={addRegion}>
          + Add Region
        </button>
      </div>

      <div className="space-y-4">
        {(current.regions || []).map((region, i) => (
          <div key={region._id || i} className="rounded-xl border border-line bg-paper p-5">
            <div className="flex items-center justify-between border-b border-line/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded bg-forest/10 px-2 py-0.5 font-mono text-xs font-bold text-forest">
                  {region.code || `REG-${i + 1}`}
                </span>
                <span className="font-display font-bold text-ink">{region.name || 'Untitled Region'}</span>
              </div>
              <button
                type="button"
                className="text-sm text-clay hover:underline"
                onClick={() => removeRegion(i)}
              >
                Delete Region
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label">Region Name</label>
                <input
                  className="field"
                  value={region.name || ''}
                  onChange={(e) => updateRegion(i, 'name', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Short Code / Badge</label>
                <input
                  className="field"
                  value={region.code || ''}
                  onChange={(e) => updateRegion(i, 'code', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Transit Duration</label>
                <input
                  className="field"
                  value={region.transitTime || ''}
                  placeholder="e.g. 24 – 28 Days"
                  onChange={(e) => updateRegion(i, 'transitTime', e.target.value)}
                />
              </div>

              <div>
                <label className="label">Pin X Coordinate (0-1000)</label>
                <input
                  type="number"
                  className="field"
                  value={region.x ?? 500}
                  onChange={(e) => updateRegion(i, 'x', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label">Pin Y Coordinate (0-500)</label>
                <input
                  type="number"
                  className="field"
                  value={region.y ?? 250}
                  onChange={(e) => updateRegion(i, 'y', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="label">On-time Transit Rate</label>
                <input
                  className="field"
                  value={region.deliveryRate || '99.4%'}
                  onChange={(e) => updateRegion(i, 'deliveryRate', e.target.value)}
                />
              </div>

              <div className="sm:col-span-3">
                <label className="label">Primary Entry Ports (separated by comma)</label>
                <input
                  className="field"
                  value={Array.isArray(region.ports) ? region.ports.join(', ') : region.ports || ''}
                  placeholder="e.g. New York / New Jersey, Long Beach, Houston"
                  onChange={(e) =>
                    updateRegion(
                      i,
                      'ports',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={region.isActive !== false}
                  onChange={(e) => updateRegion(i, 'isActive', e.target.checked)}
                />{' '}
                Active corridor
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink/50">Order:</span>
                <input
                  type="number"
                  className="field w-20 py-1 text-xs"
                  value={region.order ?? i + 1}
                  onChange={(e) => updateRegion(i, 'order', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Global Capabilities 4-Pillar Bar Editor */}
      <div className="flex items-center justify-between border-t border-line pt-8">
        <div>
          <h3 className="font-display font-bold text-ink">Global Capabilities Cards (Beneath Map)</h3>
          <p className="text-xs text-ink/60">Edit the capability pillars displayed directly under the world trade map.</p>
        </div>
        <button type="button" className="btn-primary text-xs" onClick={addPillar}>
          + Add Capability Card
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {(current.pillars || defaults.globalMap.pillars).map((pillar, i) => (
          <div key={pillar._id || i} className="rounded-xl border border-line bg-paper p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-line/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-gold/15 px-2 py-0.5 font-mono text-xs font-bold text-gold">
                    {pillar.number || String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display font-bold text-ink">{pillar.title || 'Untitled Capability'}</span>
                </div>
                <button
                  type="button"
                  className="text-sm text-clay hover:underline"
                  onClick={() => removePillar(i)}
                >
                  Delete
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="grid grid-cols-[80px_1fr] gap-3">
                  <div>
                    <label className="label">Index #</label>
                    <input
                      className="field font-mono"
                      value={pillar.number || ''}
                      placeholder="01"
                      onChange={(e) => updatePillar(i, 'number', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label">Card Title</label>
                    <input
                      className="field"
                      value={pillar.title || ''}
                      placeholder="e.g. 6 Global Corridors"
                      onChange={(e) => updatePillar(i, 'title', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Description Text</label>
                  <textarea
                    className="field"
                    rows="3"
                    value={pillar.text || ''}
                    placeholder="Established logistics networks reaching USA, Europe..."
                    onChange={(e) => updatePillar(i, 'text', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-line/50 pt-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={pillar.isActive !== false}
                  onChange={(e) => updatePillar(i, 'isActive', e.target.checked)}
                />{' '}
                Visible on site
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink/50">Order:</span>
                <input
                  type="number"
                  className="field w-16 py-1 text-xs"
                  value={pillar.order ?? i + 1}
                  onChange={(e) => updatePillar(i, 'order', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificatesEditor({ section, setSection }) {
  const current = section || defaults.certificates;
  const updateCert = (i, key, value) => {
    const items = [...(current.items || [])];
    items[i] = { ...items[i], [key]: value };
    setSection({ ...current, items });
  };

  const addCert = () => {
    setSection({
      ...current,
      items: [
        ...(current.items || []),
        {
          name: 'New Certification',
          issuer: 'Authorized Regulatory Body',
          code: 'fssai',
          image: '',
          description: 'Official verified compliance license and benchmark.',
          highlights: ['Mandatory compliance', 'Quality assured'],
          order: (current.items?.length || 0) + 1,
          isActive: true,
        },
      ],
    });
  };

  const removeCert = (i) => {
    setSection({
      ...current,
      items: (current.items || []).filter((_, index) => index !== i),
    });
  };

  const presets = [
    { code: 'fssai', label: 'FSSAI (Food Safety and Standards Authority)' },
    { code: 'apeda', label: 'APEDA (Agricultural & Processed Food)' },
    { code: 'gmp', label: 'GMP (Good Manufacturing Practice)' },
    { code: 'ghp', label: 'GHP (Good Hygiene Practices)' },
    { code: 'haccp', label: 'HACCP (Hazard Analysis Critical Control Point)' },
    { code: 'iso22000', label: 'ISO 22000 (Food Safety Management)' },
    { code: 'asta', label: 'ASTA (American Spice Trade Association)' },
    { code: 'custom', label: 'Custom Uploaded Logo' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Eyebrow</label>
          <input
            className="field"
            value={current.eyebrow || ''}
            onChange={(e) => setSection({ ...current, eyebrow: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Title</label>
          <input
            className="field"
            value={current.title || ''}
            onChange={(e) => setSection({ ...current, title: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          className="field"
          rows="2"
          value={current.description || ''}
          onChange={(e) => setSection({ ...current, description: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between border-t border-line pt-4">
        <div>
          <h3 className="font-display font-bold text-ink">Certificates & Compliance Badges</h3>
          <p className="text-xs text-ink/60">Display official certification logos and accreditation standards.</p>
        </div>
        <button type="button" className="btn-primary text-xs" onClick={addCert}>
          + Add Certificate
        </button>
      </div>

      <div className="space-y-5">
        {(current.items || []).map((cert, i) => (
          <div key={cert._id || i} className="rounded-xl border border-line bg-paper p-5">
            <div className="flex items-center justify-between border-b border-line/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-16 place-items-center rounded-lg border border-line bg-white p-1">
                  {cert.image ? (
                    <img src={asset(cert.image)} alt="" className="h-full w-full object-contain" />
                  ) : (
                    <img
                      src={`/certificates/${cert.code || 'fssai'}.png`}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
                <div>
                  <span className="font-display font-bold text-ink">{cert.name || 'Untitled Certification'}</span>
                  <p className="text-xs text-ink/50">{cert.issuer || 'Regulatory authority'}</p>
                </div>
              </div>
              <button
                type="button"
                className="text-sm text-clay hover:underline"
                onClick={() => removeCert(i)}
              >
                Delete Certificate
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Certificate Name</label>
                <input
                  className="field"
                  value={cert.name || ''}
                  onChange={(e) => updateCert(i, 'name', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Issuing Authority / Subtitle</label>
                <input
                  className="field"
                  value={cert.issuer || ''}
                  onChange={(e) => updateCert(i, 'issuer', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Official Logo Preset</label>
                <select
                  className="field"
                  value={cert.code || 'fssai'}
                  onChange={(e) => updateCert(i, 'code', e.target.value)}
                >
                  {presets.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <ImageUpload
                  label="Or Upload Custom Logo Image (optional)"
                  value={cert.image || ''}
                  onChange={(url) => updateCert(i, 'image', url)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Description / Scope of Accreditation</label>
                <textarea
                  className="field"
                  rows="2"
                  value={cert.description || ''}
                  onChange={(e) => updateCert(i, 'description', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Highlights (comma separated)</label>
                <input
                  className="field"
                  value={Array.isArray(cert.highlights) ? cert.highlights.join(', ') : cert.highlights || ''}
                  placeholder="e.g. Zero adulteration mandate, Periodic lab assays, Full farm traceability"
                  onChange={(e) =>
                    updateCert(
                      i,
                      'highlights',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-line/50 pt-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={cert.isActive !== false}
                  onChange={(e) => updateCert(i, 'isActive', e.target.checked)}
                />{' '}
                Active & displayed in slider
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink/50">Order:</span>
                <input
                  type="number"
                  className="field w-20 py-1 text-xs"
                  value={cert.order ?? i + 1}
                  onChange={(e) => updateCert(i, 'order', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlashCardEditor({ section, setSection }) {
  const current = section || defaults.flashCard;
  const update = (key, value) => {
    setSection({ ...current, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-line bg-paper p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-line/60 pb-4">
          <div>
            <h3 className="font-display text-base font-bold text-ink">Flash Card Popup Settings</h3>
            <p className="text-xs text-ink/60">
              When enabled, visitors see this advertisement / announcement card right after the brand loader finishes on their initial visit.
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer font-medium text-sm text-ink">
            <input
              type="checkbox"
              checked={current.isActive !== false}
              onChange={(e) => update('isActive', e.target.checked)}
              className="h-4 w-4 rounded border-line text-forest focus:ring-forest"
            />
            <span>Active on Website</span>
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="label">Flash Card Title</label>
              <input
                className="field"
                value={current.title || ''}
                placeholder="e.g. India’s Taste. The World’s Table"
                onChange={(e) => update('title', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Subtitle / Advertisement Message</label>
              <textarea
                className="field"
                rows="3"
                value={current.subtitle || ''}
                placeholder="e.g. Direct sourcing of export-grade Indian spices, premium grains, and agro-commodities..."
                onChange={(e) => update('subtitle', e.target.value)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Button Text</label>
                <input
                  className="field"
                  value={current.buttonText || ''}
                  placeholder="e.g. Explore Products"
                  onChange={(e) => update('buttonText', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Button Destination URL</label>
                <input
                  className="field"
                  value={current.buttonLink || ''}
                  placeholder="e.g. /products or /inquiry"
                  onChange={(e) => update('buttonLink', e.target.value)}
                />
              </div>
            </div>

            <ImageUpload
              label="Flash Card Photo / Poster Image"
              value={current.image || ''}
              onChange={(url) => update('image', url)}
            />
          </div>

          {/* Live Preview Box */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-paper/60 p-5">
            <p className="text-xs font-mono uppercase tracking-wider text-ink/40 mb-3">Live Visual Preview</p>
            <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-gold/40 bg-ink text-paper shadow-2xl">
              {current.image ? (
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-forest/20">
                  <img src={asset(current.image)} alt="Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-80" />
                </div>
              ) : (
                <div className="flex aspect-[16/9] w-full items-center justify-center bg-forest/30 text-xs text-paper/40">
                  (No photo uploaded yet)
                </div>
              )}
              <div className="p-5 text-center">
                <span className="inline-block rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 font-mono text-[10px] text-gold uppercase tracking-widest mb-2">
                  Special Announcement
                </span>
                <h4 className="font-display text-lg font-bold text-white leading-snug">
                  {current.title || 'Your Flash Card Title'}
                </h4>
                {current.subtitle && (
                  <p className="mt-2 text-xs leading-relaxed text-paper/70">
                    {current.subtitle}
                  </p>
                )}
                <div className="mt-4">
                  <span className="inline-block rounded-lg bg-forest px-4 py-2 text-xs font-semibold text-paper shadow border border-gold/30">
                    {current.buttonText || 'Explore Products'} →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EngineerTradeEditor({ section, setSection }) {
  const current = section || defaults.engineerTrade;
  const updateField = (field, val) => setSection({ ...current, [field]: val });
  const updateItem = (i, key, val) => {
    const items = [...(current.items || [])];
    items[i] = { ...items[i], [key]: val };
    setSection({ ...current, items });
  };
  const addItem = () => {
    setSection({
      ...current,
      items: [
        ...(current.items || []),
        {
          title: 'New High-Volume Capability',
          metric: '100% Quality',
          subtitle: 'Port & Consignment Detail',
          description: 'Institutional logistics and processing capability.',
          icon: '🚢',
          order: (current.items?.length || 0) + 1,
          isActive: true,
        },
      ],
    });
  };
  const removeItem = (i) => {
    setSection({
      ...current,
      items: (current.items || []).filter((_, idx) => idx !== i),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Inputs */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <h3 className="font-display font-bold text-lg text-ink mb-1">Header & Overview</h3>
        <p className="text-xs text-ink/60 mb-4">Controls the main headline, category eyebrow, and background badge.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Eyebrow / Small Category Tag</label>
            <input
              className="field"
              value={current.eyebrow || ''}
              onChange={(e) => updateField('eyebrow', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Badge Pill Label</label>
            <input
              className="field"
              value={current.badge || ''}
              onChange={(e) => updateField('badge', e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="label">Main Section Heading</label>
          <input
            className="field"
            value={current.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="label">Description / Value Proposition</label>
          <textarea
            className="field"
            rows="3"
            value={current.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>
      </div>

      {/* Trade Pillars / Capabilities Editor */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-line pb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-ink">Industrial Capabilities & Pillars</h3>
            <p className="text-xs text-ink/60">Features displayed in the high-impact 4-column capabilities grid.</p>
          </div>
          <button type="button" className="btn-primary text-xs shrink-0" onClick={addItem}>
            + Add Capability
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(current.items || []).map((item, i) => (
            <div key={item._id || i} className="rounded-xl border border-line bg-[#fbf9f4] p-5 relative shadow-sm">
              <div className="flex items-center justify-between border-b border-line pb-2 mb-3">
                <span className="font-mono text-xs font-bold uppercase text-moss">Capability #{i + 1}</span>
                <button
                  type="button"
                  className="text-xs font-semibold text-clay hover:underline"
                  onClick={() => removeItem(i)}
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="label text-xs">Title</label>
                  <input
                    className="field text-sm"
                    value={item.title || ''}
                    onChange={(e) => updateItem(i, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label text-xs">Icon Emoji</label>
                  <input
                    className="field text-sm text-center"
                    value={item.icon || '🚢'}
                    onChange={(e) => updateItem(i, 'icon', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label text-xs">Highlight Metric / Stat</label>
                  <input
                    className="field text-sm font-mono"
                    placeholder="e.g. 99.9% Purity or 500+ TEU"
                    value={item.metric || ''}
                    onChange={(e) => updateItem(i, 'metric', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label text-xs">Subtitle</label>
                  <input
                    className="field text-sm"
                    placeholder="e.g. Mundra & JNPT Port hubs"
                    value={item.subtitle || ''}
                    onChange={(e) => updateItem(i, 'subtitle', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="label text-xs">Detailed Description</label>
                <textarea
                  className="field text-xs"
                  rows="2"
                  value={item.description || ''}
                  onChange={(e) => updateItem(i, 'description', e.target.value)}
                />
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-line/60">
                <label className="flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.isActive !== false}
                    onChange={(e) => updateItem(i, 'isActive', e.target.checked)}
                  />
                  Active on website
                </label>
                <div className="flex items-center gap-1.5 text-xs text-ink/60">
                  <span>Order:</span>
                  <input
                    type="number"
                    className="field w-14 py-1 text-xs text-center"
                    value={item.order ?? i + 1}
                    onChange={(e) => updateItem(i, 'order', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatbotEditor({ section, setSection }) {
  const current = section || defaults.chatbot;

  const updateField = (field, value) => {
    setSection({ ...current, [field]: value });
  };

  const updateSuggestion = (idx, val) => {
    const next = [...(current.defaultSuggestions || [])];
    next[idx] = val;
    updateField('defaultSuggestions', next);
  };

  const addSuggestion = () => {
    updateField('defaultSuggestions', [
      ...(current.defaultSuggestions || []),
      'New sample question?',
    ]);
  };

  const removeSuggestion = (idx) => {
    updateField(
      'defaultSuggestions',
      (current.defaultSuggestions || []).filter((_, i) => i !== idx)
    );
  };

  const addKnowledge = () => {
    const newItem = {
      triggers: ['new-keyword', 'sample-query'],
      reply: 'Enter informative response for this query…',
      link: '/products',
      linkText: 'Explore Products →',
      suggestions: ['Inquire Now', 'Contact Sales'],
      order: (current.knowledgeBase?.length || 0) + 1,
      isActive: true,
    };
    updateField('knowledgeBase', [...(current.knowledgeBase || []), newItem]);
  };

  const updateKnowledge = (idx, key, val) => {
    const list = [...(current.knowledgeBase || [])];
    list[idx] = { ...list[idx], [key]: val };
    updateField('knowledgeBase', list);
  };

  const removeKnowledge = (idx) => {
    if (!confirm('Are you sure you want to delete this chatbot knowledge topic?')) return;
    updateField(
      'knowledgeBase',
      (current.knowledgeBase || []).filter((_, i) => i !== idx)
    );
  };

  return (
    <div className="space-y-6">
      {/* Bot Profile & Settings Card */}
      <div className="rounded-xl border border-line bg-paper/60 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
          <div>
            <h3 className="font-display font-bold text-base text-ink">Bot Identity & Presence</h3>
            <p className="text-xs text-ink/60">Configure public bot appearance, greeting message, and availability.</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-line bg-white px-3 py-1.5 shadow-xs">
            <input
              type="checkbox"
              checked={current.isActive !== false}
              onChange={(e) => updateField('isActive', e.target.checked)}
              className="rounded text-forest focus:ring-forest"
            />
            <span className="text-xs font-semibold text-ink">
              {current.isActive !== false ? '✅ Chatbot Enabled' : '⏸️ Chatbot Disabled'}
            </span>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Bot Display Name</label>
            <input
              className="field text-sm font-semibold"
              value={current.botName || 'TradeMitra'}
              onChange={(e) => updateField('botName', e.target.value)}
              placeholder="e.g. TradeMitra"
            />
          </div>
          <div>
            <label className="label">Bot Role Subtitle / Tagline</label>
            <input
              className="field text-sm"
              value={current.botSubtitle || 'AI Export & Sourcing Assistant'}
              onChange={(e) => updateField('botSubtitle', e.target.value)}
              placeholder="e.g. AI Export & Sourcing Assistant"
            />
          </div>
        </div>

        <div>
          <label className="label">Welcome Greeting Message</label>
          <textarea
            className="field text-xs font-mono"
            rows="3"
            value={current.welcomeMessage || ''}
            onChange={(e) => updateField('welcomeMessage', e.target.value)}
            placeholder="Initial greeting displayed when visitor opens chatbot..."
          />
          <p className="mt-1 text-[11px] text-ink/50">Markdown supported (e.g. **bold**, bullet points).</p>
        </div>

        <div>
          <label className="label">Disclaimer / Footnote</label>
          <input
            className="field text-xs"
            value={current.disclaimer || ''}
            onChange={(e) => updateField('disclaimer', e.target.value)}
            placeholder="e.g. Responses based on NMC catalogue and export shipping data."
          />
        </div>
      </div>

      {/* Default Prompt Suggestions */}
      <div className="rounded-xl border border-line bg-white p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-ink">Initial Quick Prompt Chips</h3>
            <p className="text-xs text-ink/60">Suggested questions displayed to the user right under the welcome greeting.</p>
          </div>
          <button type="button" onClick={addSuggestion} className="btn-outline text-xs py-1.5 px-3">
            + Add Suggestion
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {(current.defaultSuggestions || []).map((sug, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 rounded-full border border-line bg-[#fbf9f4] pl-3 pr-1.5 py-1 text-xs"
            >
              <input
                type="text"
                value={sug}
                onChange={(e) => updateSuggestion(idx, e.target.value)}
                className="bg-transparent text-xs text-ink font-medium focus:outline-none w-48 sm:w-60"
              />
              <button
                type="button"
                onClick={() => removeSuggestion(idx)}
                className="h-5 w-5 rounded-full text-ink/40 hover:bg-clay/10 hover:text-clay text-xs flex items-center justify-center"
                title="Remove suggestion"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confidentiality & Security Shield Banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 flex items-start gap-3 text-xs text-amber-900">
        <span className="text-xl">🛡️</span>
        <div>
          <p className="font-bold">Automated Privacy & Anti-Leak Shield Active</p>
          <p className="mt-0.5 text-amber-800/90 leading-relaxed">
            The chatbot strictly ignores and refuses inquiries containing sensitive keywords (passwords, tokens, database connection strings, inquiry transcripts, or internal credentials). Only information explicitly configured below or in public catalogues will be communicated to visitors.
          </p>
        </div>
      </div>

      {/* Knowledge Base Q&A Manager */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
          <div>
            <h3 className="font-display font-bold text-lg text-ink">
              Chatbot Knowledge Base Topics ({(current.knowledgeBase || []).length})
            </h3>
            <p className="text-xs text-ink/60">
              When visitor mentions any of the triggers, the chatbot answers with the specified response and quick action link.
            </p>
          </div>
          <button type="button" className="btn-primary text-xs shrink-0" onClick={addKnowledge}>
            + Add Q&A Topic
          </button>
        </div>

        <div className="grid gap-4">
          {(current.knowledgeBase || []).map((item, idx) => (
            <div
              key={item._id || idx}
              className="rounded-xl border border-line bg-[#fbf9f4] p-5 relative shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase text-moss">
                    Topic #{idx + 1}
                  </span>
                  <span className="rounded bg-paper px-2 py-0.5 font-mono text-[10px] text-ink/60 border border-line">
                    {(item.triggers || []).length} keywords
                  </span>
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold text-clay hover:underline"
                  onClick={() => removeKnowledge(idx)}
                >
                  Remove Topic
                </button>
              </div>

              {/* Triggers Input */}
              <div>
                <label className="label text-xs">
                  Keyword Triggers (comma-separated, words matching user question)
                </label>
                <input
                  className="field text-xs font-mono"
                  value={Array.isArray(item.triggers) ? item.triggers.join(', ') : item.triggers || ''}
                  onChange={(e) =>
                    updateKnowledge(
                      idx,
                      'triggers',
                      e.target.value.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
                    )
                  }
                  placeholder="e.g. spice, spices, cumin, turmeric, chilli, coriander"
                />
              </div>

              {/* Response Text */}
              <div>
                <label className="label text-xs">Bot Reply / Answer</label>
                <textarea
                  className="field text-xs leading-relaxed"
                  rows="4"
                  value={item.reply || ''}
                  onChange={(e) => updateKnowledge(idx, 'reply', e.target.value)}
                  placeholder="Comprehensive, accurate export information provided by the bot…"
                />
              </div>

              {/* Optional Link & Link Text */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label text-xs">Action Link (Optional URL)</label>
                  <input
                    className="field text-xs font-mono"
                    value={item.link || ''}
                    onChange={(e) => updateKnowledge(idx, 'link', e.target.value)}
                    placeholder="e.g. /products, /inquiry, /brochures"
                  />
                </div>
                <div>
                  <label className="label text-xs">Link Button Text</label>
                  <input
                    className="field text-xs"
                    value={item.linkText || ''}
                    onChange={(e) => updateKnowledge(idx, 'linkText', e.target.value)}
                    placeholder="e.g. Browse Spices Catalogue →"
                  />
                </div>
              </div>

              {/* Follow-up suggestions */}
              <div>
                <label className="label text-xs">
                  Follow-up Suggestion Chips (comma-separated chips shown after this response)
                </label>
                <input
                  className="field text-xs"
                  value={Array.isArray(item.suggestions) ? item.suggestions.join(', ') : item.suggestions || ''}
                  onChange={(e) =>
                    updateKnowledge(
                      idx,
                      'suggestions',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  placeholder="e.g. What is MOQ?, Request sample kit, Lab compliance"
                />
              </div>

              {/* Status and Order */}
              <div className="flex items-center justify-between pt-3 border-t border-line/60">
                <label className="flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.isActive !== false}
                    onChange={(e) => updateKnowledge(idx, 'isActive', e.target.checked)}
                  />
                  Active Topic
                </label>
                <div className="flex items-center gap-1.5 text-xs text-ink/60">
                  <span>Order:</span>
                  <input
                    type="number"
                    className="field w-14 py-1 text-xs text-center"
                    value={item.order ?? idx + 1}
                    onChange={(e) => updateKnowledge(idx, 'order', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewArrivalsEditor({ section, setSection }) {
  const current = section || defaults.newArrivals;

  // Broadcast modal state for arrivals
  const [broadcastTarget, setBroadcastTarget] = useState(null); // null | 'all' | item object
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastHeading, setBroadcastHeading] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastLink, setBroadcastLink] = useState('/products');
  const [testEmailTarget, setTestEmailTarget] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const updateField = (field, value) => {
    setSection({ ...current, [field]: value });
  };

  const updateItem = (i, field, value) => {
    const items = [...(current.items || [])];
    items[i] = { ...items[i], [field]: value };
    setSection({ ...current, items });
  };

  const addItem = () => {
    setSection({
      ...current,
      items: [
        ...(current.items || []),
        {
          name: 'New Export Arrival Item',
          slug: 'new-export-arrival-item',
          categoryName: 'Spices & Seasonings',
          origin: 'Gujarat, India',
          image: '',
          shortDescription: 'Sortex cleaned export grade commodity with certified laboratory test reports.',
          hsCode: '',
          packageType: '25kg Bags',
          moq: '1 x 20ft FCL',
          order: (current.items?.length || 0) + 1,
          isActive: true,
        },
      ],
    });
  };

  const removeItem = (i) => {
    setSection({
      ...current,
      items: (current.items || []).filter((_, idx) => idx !== i),
    });
  };

  const openBroadcastAll = () => {
    const itemsList = (current.items || []).map((it) => `• ${it.name} (${it.categoryName || 'Agro Commodity'}) — Origin: ${it.origin || 'Gujarat'}`).join('\n');
    setBroadcastTarget('all');
    setBroadcastSubject(`🌟 Fresh Seasonal Crop Arrivals 2026: New Indian Export Commodities`);
    setBroadcastHeading('Fresh Seasonal Harvest Lots Now Ready for Ocean Container Loading');
    setBroadcastMessage(
      `We are pleased to introduce our latest agricultural export arrivals sourced directly from verified farm mandis across Gujarat and North India:\n\n${itemsList}\n\n100% Sortex laser graded with complete laboratory assay, phytosanitary clearance, and prompt container stuffing at Mundra Port (INMUN1) and Nhava Sheva (JNPT).`
    );
    setBroadcastLink('/products');
    setBroadcastResult(null);
    setTestResult(null);
  };

  const openBroadcastItem = (item) => {
    setBroadcastTarget(item);
    setBroadcastSubject(`🌟 Fresh Arrival Alert: ${item.name} (${item.categoryName || 'Export Commodity'})`);
    setBroadcastHeading(`${item.name} — Fresh Export Harvest Ready for Booking`);
    setBroadcastMessage(
      `We are pleased to announce direct container allocation for "${item.name}".\n\n${item.shortDescription || 'Sortex cleaned export grade commodity with certified laboratory test reports.'}\n\n• Origin Hub: ${item.origin || 'Gujarat, India'}\n• Export Packaging: ${item.packageType || '25kg Paper / PP Bags'}\n• Minimum Order (MOQ): ${item.moq || '1 x 20ft FCL'}\n• Quality Guarantee: 100% Optical Sortex Graded & Laboratory Assay Verified\n\nDirect ocean freight booking and stuffing available for Mundra Port and JNPT Nhava Sheva.`
    );
    setBroadcastLink('/products');
    setBroadcastResult(null);
    setTestResult(null);
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastSubject.trim()) return;

    try {
      setSendingBroadcast(true);
      setBroadcastResult(null);

      const isSingleItem = broadcastTarget && typeof broadcastTarget === 'object';
      const payload = {
        subject: broadcastSubject.trim(),
        message: broadcastMessage,
        product: isSingleItem ? broadcastTarget : undefined,
        products: !isSingleItem ? (current.items || []) : undefined,
      };

      const res = await api.post('/subscribers/broadcast-arrival', payload);
      setBroadcastResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to dispatch broadcast: ' + err.message);
    } finally {
      setSendingBroadcast(false);
    }
  };

  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    if (!testEmailTarget.trim()) return;

    try {
      setSendingTest(true);
      setTestResult(null);

      const isSingleItem = broadcastTarget && typeof broadcastTarget === 'object';
      const payload = {
        subject: broadcastSubject.trim(),
        message: broadcastMessage,
        product: isSingleItem ? broadcastTarget : undefined,
        products: !isSingleItem ? (current.items || []) : undefined,
        testEmail: testEmailTarget.trim(),
      };

      const res = await api.post('/subscribers/broadcast-arrival', payload);
      setTestResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send test email.');
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Section Metadata */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-ink">Section Headline & Rotation</h3>
            <p className="text-xs text-ink/60">Controls the title, small category tag, badge, and carousel timer on the homepage.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openBroadcastAll}
              className="inline-flex items-center gap-1.5 rounded-xl border border-forest/30 bg-forest/5 px-3 py-1.5 text-xs font-bold text-forest transition hover:bg-forest hover:text-white shadow-xs"
              title="Send an email announcement to all newsletter subscribers about all arrivals"
            >
              <span>📢</span> Broadcast All Arrivals to Subscribers
            </button>
            <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer bg-forest/5 px-3 py-1.5 rounded-full border border-forest/20">
              <input
                type="checkbox"
                checked={current.isActive !== false}
                onChange={(e) => updateField('isActive', e.target.checked)}
              />
              <span>Active on Homepage</span>
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label text-xs">Eyebrow (Small Tagline)</label>
            <input
              className="field"
              value={current.eyebrow || ''}
              onChange={(e) => updateField('eyebrow', e.target.value)}
              placeholder="e.g. Fresh Season Harvest"
            />
          </div>
          <div>
            <label className="label text-xs">Badge Pill Text</label>
            <input
              className="field"
              value={current.badge || ''}
              onChange={(e) => updateField('badge', e.target.value)}
              placeholder="e.g. Live Market Arrivals"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mt-4">
          <div className="sm:col-span-2">
            <label className="label text-xs">Main Section Heading</label>
            <input
              className="field"
              value={current.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. New product arrivals"
            />
          </div>
          <div>
            <label className="label text-xs">Auto-Rotation Timer (Seconds)</label>
            <input
              type="number"
              step="0.5"
              min="2"
              max="15"
              className="field"
              value={current.autoRotateSeconds || 4}
              onChange={(e) => updateField('autoRotateSeconds', Number(e.target.value))}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="label text-xs">Subtitle Description</label>
          <textarea
            className="field text-xs"
            rows="2"
            value={current.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Directly sourced from verified Indian farm clusters..."
          />
        </div>
      </div>

      {/* Arrival Products List */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-line pb-4">
          <div>
            <h3 className="font-display font-bold text-lg text-ink">
              Featured Arrival Items ({(current.items || []).length})
            </h3>
            <p className="text-xs text-ink/60">Configure products, images, packaging, and origins featured in the rotating carousel.</p>
          </div>
          <button type="button" className="btn-primary text-xs shrink-0" onClick={addItem}>
            + Add Arrival Product
          </button>
        </div>

        <div className="space-y-4">
          {(current.items || []).map((item, i) => (
            <div key={item._id || i} className="rounded-xl border border-line bg-[#fbf9f4] p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-line pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold uppercase text-moss">Arrival Item #{i + 1}</span>
                  <span className="font-display font-bold text-sm text-ink">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openBroadcastItem(item)}
                    className="inline-flex items-center gap-1 rounded-lg border border-forest/30 bg-forest/10 px-2.5 py-1 text-xs font-bold text-forest transition hover:bg-forest hover:text-white"
                    title="Send email broadcast to subscribers about this specific product"
                  >
                    <span>✉️</span> Mail Subscribers
                  </button>
                  <button
                    type="button"
                    className="text-xs font-semibold text-clay hover:underline ml-1"
                    onClick={() => removeItem(i)}
                  >
                    Delete Item
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="label text-xs">Product Name</label>
                  <input
                    className="field text-sm font-semibold"
                    value={item.name || ''}
                    onChange={(e) => updateItem(i, 'name', e.target.value)}
                    placeholder="e.g. Sortex-Cleaned Cumin Seeds"
                  />
                </div>
                <div>
                  <label className="label text-xs">Category Name</label>
                  <input
                    className="field text-sm"
                    value={item.categoryName || ''}
                    onChange={(e) => updateItem(i, 'categoryName', e.target.value)}
                    placeholder="e.g. Spices & Seasonings"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 mt-3">
                <div>
                  <label className="label text-xs">Origin Location</label>
                  <input
                    className="field text-xs"
                    value={item.origin || ''}
                    onChange={(e) => updateItem(i, 'origin', e.target.value)}
                    placeholder="e.g. Unjha, Gujarat"
                  />
                </div>
                <div>
                  <label className="label text-xs">Package Spec</label>
                  <input
                    className="field text-xs"
                    value={item.packageType || ''}
                    onChange={(e) => updateItem(i, 'packageType', e.target.value)}
                    placeholder="e.g. 25kg Multi-wall Paper"
                  />
                </div>
                <div>
                  <label className="label text-xs">Minimum Order (MOQ)</label>
                  <input
                    className="field text-xs"
                    value={item.moq || ''}
                    onChange={(e) => updateItem(i, 'moq', e.target.value)}
                    placeholder="e.g. 1 x 20ft FCL"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 mt-3">
                <div className="sm:col-span-2">
                  <label className="label text-xs">Image URL or Path</label>
                  <input
                    className="field text-xs font-mono"
                    value={item.image || ''}
                    onChange={(e) => updateItem(i, 'image', e.target.value)}
                    placeholder="https://... or /uploads/..."
                  />
                </div>
                <div>
                  <label className="label text-xs">HS Code</label>
                  <input
                    className="field text-xs font-mono"
                    value={item.hsCode || ''}
                    onChange={(e) => updateItem(i, 'hsCode', e.target.value)}
                    placeholder="e.g. 090931"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="label text-xs">Specifications / Short Description</label>
                <textarea
                  className="field text-xs"
                  rows="2"
                  value={item.shortDescription || ''}
                  onChange={(e) => updateItem(i, 'shortDescription', e.target.value)}
                  placeholder="99.5% European purity, Sortex machine graded..."
                />
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-line/60">
                <label className="flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.isActive !== false}
                    onChange={(e) => updateItem(i, 'isActive', e.target.checked)}
                  />
                  Active in Slider
                </label>
                <div className="flex items-center gap-1.5 text-xs text-ink/60">
                  <span>Order:</span>
                  <input
                    type="number"
                    className="field w-14 py-1 text-xs text-center"
                    value={item.order ?? i + 1}
                    onChange={(e) => updateItem(i, 'order', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Modal for New Product Arrivals */}
      {broadcastTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl my-6 space-y-4">
            {/* Product Photo & Specifications Preview Card */}
            {typeof broadcastTarget === 'object' ? (
              <div className="rounded-2xl border border-line bg-[#fbf9f4] p-4 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-white border border-line shadow-xs">
                    {broadcastTarget.image ? (
                      <img
                        src={asset(broadcastTarget.image)}
                        alt=""
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-[10px] text-ink/40">No photo</div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold-dark bg-gold/15 px-2 py-0.5 rounded">
                      {broadcastTarget.categoryName || 'FOOD COMMODITY'}
                    </span>
                    <h4 className="mt-1 font-display text-base font-bold text-ink">
                      {broadcastTarget.name}
                    </h4>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-ink/70">
                      <span><strong>Origin:</strong> {broadcastTarget.origin || 'India'}</span>
                      {broadcastTarget.packageType && <span><strong>Pack:</strong> {broadcastTarget.packageType}</span>}
                      {broadcastTarget.moq && <span><strong>MOQ:</strong> {broadcastTarget.moq}</span>}
                      {broadcastTarget.hsCode && <span><strong>HS:</strong> {broadcastTarget.hsCode}</span>}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs text-emerald-900 flex items-center gap-2">
                  <span className="text-base">✨</span>
                  <span>
                    <strong>Complete Product Delivery:</strong> Subscribers will receive this exact product with its photo, specifications, and full description.
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-line bg-[#fbf9f4] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase text-moss">
                    All Seasonal Consignments ({(current.items || []).length} Products)
                  </span>
                  <span className="text-[11px] text-ink/50">Each item includes photo & specifications</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {(current.items || []).slice(0, 4).map((it, idx) => (
                    <div key={idx} className="rounded-lg border border-line/60 bg-white p-2 text-center text-[11px]">
                      <div className="h-10 w-full mb-1 flex items-center justify-center">
                        {it.image ? (
                          <img src={asset(it.image)} alt="" className="h-full object-contain" />
                        ) : (
                          <span className="text-[9px] text-ink/40">No photo</span>
                        )}
                      </div>
                      <p className="font-bold text-ink truncate">{it.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="label text-xs">Email Subject Line *</label>
                <input
                  required
                  className="field text-sm"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="label text-xs">Main Email Headline</label>
                <input
                  className="field text-xs"
                  value={broadcastHeading}
                  onChange={(e) => setBroadcastHeading(e.target.value)}
                  placeholder="Defaults to Subject Line if blank"
                />
              </div>

              <div>
                <label className="label text-xs">Announcement Message / Description</label>
                <textarea
                  className="field text-xs"
                  rows="4"
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                />
              </div>

              <div>
                <label className="label text-xs">Website Action Link</label>
                <input
                  className="field text-xs font-mono"
                  value={broadcastLink}
                  onChange={(e) => setBroadcastLink(e.target.value)}
                  placeholder="/products or /inquiry"
                />
              </div>

              {/* Test Email */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs space-y-2">
                <span className="font-bold text-amber-900 block">
                  🧪 Send Test Email First (Verify Delivery):
                </span>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email to test (e.g. yourname@gmail.com)…"
                    value={testEmailTarget}
                    onChange={(e) => setTestEmailTarget(e.target.value)}
                    className="flex-1 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs text-ink outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendTestEmail}
                    disabled={sendingTest || !testEmailTarget}
                    className="rounded-lg bg-amber-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-800 disabled:opacity-50 whitespace-nowrap shadow-sm transition"
                  >
                    {sendingTest ? 'Sending…' : 'Send Test Mail'}
                  </button>
                </div>

                {testResult && (
                  <div className="rounded-lg bg-white p-2 border border-amber-200 text-xs space-y-1">
                    <p className="font-semibold text-emerald-800">✓ {testResult.message}</p>
                    {testResult.previewUrl && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-ink/60">Test preview link ready:</span>
                        <a
                          href={testResult.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded bg-amber-700 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-amber-800 transition"
                        >
                          Open Preview ↗
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {broadcastResult && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 space-y-1">
                  <p className="font-bold">✓ {broadcastResult.message}</p>
                  {broadcastResult.previewUrl && (
                    <a
                      href={broadcastResult.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-1 text-emerald-700 underline font-bold"
                    >
                      View Dispatched Email in Test Mailbox ↗
                    </a>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-line/60">
                <button
                  type="button"
                  className="btn-outline text-xs"
                  onClick={() => setBroadcastTarget(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingBroadcast || !broadcastSubject.trim()}
                  className="rounded-xl bg-forest px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-forest/90 disabled:opacity-50"
                >
                  {sendingBroadcast ? 'Dispatching Broadcast…' : '🚀 Send to All Subscribers'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductsPageEditor({ section, setSection, onSave, isSaving }) {
  // Deep merge to ensure every sub-document has all default properties
  const current = {
    ...defaults.productsPage,
    ...(section || {}),
    hero: { ...defaults.productsPage.hero, ...(section?.hero || {}) },
    showcase: { ...defaults.productsPage.showcase, ...(section?.showcase || {}) },
    bento: {
      ...defaults.productsPage.bento,
      ...(section?.bento || {}),
      bullets:
        section?.bento?.bullets && section.bento.bullets.length > 0
          ? section.bento.bullets
          : defaults.productsPage.bento.bullets,
    },
    trustBar: {
      ...defaults.productsPage.trustBar,
      ...(section?.trustBar || {}),
      items:
        section?.trustBar?.items && section.trustBar.items.length > 0
          ? section.trustBar.items
          : defaults.productsPage.trustBar.items,
    },
    ctaBanner: { ...defaults.productsPage.ctaBanner, ...(section?.ctaBanner || {}) },
  };

  const updateHero = (field, value) => {
    setSection({
      ...current,
      hero: { ...current.hero, [field]: value },
    });
  };

  const updateShowcase = (field, value) => {
    setSection({
      ...current,
      showcase: { ...current.showcase, [field]: value },
    });
  };

  const updateBento = (field, value) => {
    setSection({
      ...current,
      bento: { ...current.bento, [field]: value },
    });
  };

  const updateBentoBullet = (index, value) => {
    const nextBullets = [...(current.bento?.bullets || [])];
    nextBullets[index] = value;
    updateBento('bullets', nextBullets);
  };

  const addBentoBullet = () => {
    updateBento('bullets', [...(current.bento?.bullets || []), 'New export feature highlight']);
  };

  const removeBentoBullet = (index) => {
    updateBento('bullets', (current.bento?.bullets || []).filter((_, i) => i !== index));
  };

  const updateTrustPillar = (index, field, value) => {
    const nextItems = [...(current.trustBar?.items || [])];
    nextItems[index] = { ...nextItems[index], [field]: value };
    setSection({
      ...current,
      trustBar: { ...current.trustBar, items: nextItems },
    });
  };

  const updateCta = (field, value) => {
    setSection({
      ...current,
      ctaBanner: { ...current.ctaBanner, [field]: value },
    });
  };

  const handleResetDefaults = () => {
    if (confirm('Reset Products Page CMS back to factory recommended defaults?')) {
      setSection(JSON.parse(JSON.stringify(defaults.productsPage)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Live Website Linking Header */}
      <div className="rounded-2xl border border-line bg-gradient-to-r from-white via-[#fbf9f4] to-[#f7f3e8] p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line/70 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-forest bg-forest/10 px-2.5 py-0.5 rounded border border-forest/20">
                🛍️ LIVE PRODUCTS PAGE CMS
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-2 py-0.5 rounded">
                WEBSITE CONNECTED
              </span>
            </div>
            <h2 className="mt-1 font-display text-xl font-bold text-ink">
              Products Catalogue & 3D Exhibition CMS
            </h2>
            <p className="mt-0.5 text-xs text-ink/65">
              Live updates directly control the headlines, 3D Spin Wheel, Bento feature cards, trust assurance pillars, and quotation banners on the website.
            </p>
          </div>

          {/* Quick Direct Save Action */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="rounded-xl bg-forest px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-forest/90 disabled:opacity-50 flex items-center gap-1.5 transition"
            >
              <span>{isSaving ? '⏳ Saving…' : '💾 Save Products Page Changes'}</span>
            </button>
          </div>
        </div>

        {/* Website Preview Links & Navigation Shortcuts */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-ink/50 uppercase">Preview on Website:</span>
            <a
              href="/products"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-forest/30 bg-white px-3 py-1 font-bold text-forest hover:bg-forest hover:text-white transition shadow-xs"
            >
              <span>👁️ View Live /products Page</span>
              <span>↗</span>
            </a>
            <a
              href="/product-details"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-1 font-semibold text-ink/75 hover:bg-line/20 hover:text-ink transition"
            >
              <span>👁️ View /product-details</span>
              <span>↗</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/admin/products"
              className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1 text-[11px] font-semibold text-ink/70 hover:bg-[#fbf9f4] hover:text-ink transition"
            >
              <span>📦 Manage Product Items</span>
              <span>→</span>
            </a>
            <a
              href="/admin/segments"
              className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-2.5 py-1 text-[11px] font-semibold text-ink/70 hover:bg-[#fbf9f4] hover:text-ink transition"
            >
              <span>📂 Manage Categories</span>
              <span>→</span>
            </a>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-[11px] text-clay/80 hover:text-clay hover:underline px-1.5"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>

      {/* 1. FEATURED FOOD SHOWCASE HEADER (MATCHING EXACT USER SCREENSHOT) */}
      <section className="rounded-2xl border-2 border-emerald-600/30 bg-white p-6 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-forest bg-forest/10 px-2.5 py-0.5 rounded border border-forest/20">
                ⭐ HERO EXHIBITION HEADER
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold bg-gold/15 px-2 py-0.5 rounded">
                LIVE ON /products
              </span>
            </div>
            <h2 className="mt-1 font-display text-xl font-bold text-ink">
              1. "Featured Food Showcase" Section Header & 3D Exhibition
            </h2>
            <p className="text-xs text-ink/60">
              Customize the exact headline, pill badge, descriptive text, and 3D wheel/arc settings shown at the top of the products page.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="rounded-xl bg-forest px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-forest/90 disabled:opacity-50 transition flex items-center gap-1.5"
            >
              <span>{isSaving ? 'Saving…' : '💾 Save Showcase'}</span>
            </button>

            <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer bg-forest/5 px-3 py-1.5 rounded-full border border-forest/20">
              <input
                type="checkbox"
                checked={current.showcase?.isActive !== false}
                onChange={(e) => updateShowcase('isActive', e.target.checked)}
              />
              <span>Active</span>
            </label>
          </div>
        </div>

        {/* Live Visual Preview Box (Exact Website Look) */}
        <div className="rounded-2xl border border-line/80 bg-gradient-to-b from-[#fcfbfa] to-[#f7f4ed] p-6 text-center shadow-xs">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-ink/50 bg-white px-2.5 py-0.5 rounded-full border border-line mb-3">
            <span>👁️ Live Screen Preview:</span>
          </div>

          <div className="mx-auto max-w-2xl py-2 space-y-2">
            {/* Top Eyebrow Badge Pill */}
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="h-1.5 w-6 rounded-full bg-gold" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#16382b]">
                {current.showcase?.showcaseBadge || 'FEATURED FOOD SHOWCASE'}
              </span>
              <span className="h-1.5 w-6 rounded-full bg-gold" />
            </div>

            {/* Main Showcase Title */}
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#16382b] transition-all">
              {current.showcase?.title || 'Featured Export Products'}
            </h2>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-sm text-ink/75 max-w-xl mx-auto leading-relaxed">
              {current.showcase?.subtitle ||
                'Discover our certified Sortex-cleaned harvest lots and premium packaged Indian food products ready for global ocean freight.'}
            </p>

            {/* Mode & Watermark Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-ink/60">
              <span className="bg-white px-2.5 py-0.5 rounded-full border border-line">
                Mode: {current.showcase?.defaultMode === 'arc' ? '🌸 Curved Fan Arc' : '🎡 3D Spin Wheel'}
              </span>
              <span className="bg-white px-2.5 py-0.5 rounded-full border border-line">
                Speed: {current.showcase?.autoRotateSeconds || 3.5}s
              </span>
              <span className="bg-white px-2.5 py-0.5 rounded-full border border-line uppercase">
                Watermark: {current.showcase?.watermark || 'FOOD PRODUCTS'}
              </span>
            </div>
          </div>
        </div>

        {/* Form Inputs for this Section */}
        <div className="space-y-4 pt-1">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label text-xs font-bold text-ink">
                Showcase Top Badge Tag (Eyebrow Pill) *
              </label>
              <input
                className="field text-xs font-semibold"
                value={current.showcase?.showcaseBadge || ''}
                onChange={(e) => updateShowcase('showcaseBadge', e.target.value)}
                placeholder="e.g. FEATURED FOOD SHOWCASE"
              />
              <span className="text-[11px] text-ink/50 mt-1 block">
                Displays between the two gold bars above the main heading.
              </span>
            </div>

            <div>
              <label className="label text-xs font-bold text-ink">
                Showcase Main Headline / Title *
              </label>
              <input
                className="field text-sm font-bold text-ink"
                value={current.showcase?.title || ''}
                onChange={(e) => updateShowcase('title', e.target.value)}
                placeholder="e.g. Featured Export Products"
              />
              <span className="text-[11px] text-ink/50 mt-1 block">
                Primary large heading of the 3D exhibition on the products page.
              </span>
            </div>
          </div>

          <div>
            <label className="label text-xs font-bold text-ink">
              Showcase Subtitle / Introduction Description *
            </label>
            <textarea
              className="field text-xs leading-relaxed"
              rows="3"
              value={current.showcase?.subtitle || ''}
              onChange={(e) => updateShowcase('subtitle', e.target.value)}
              placeholder="Discover our certified Sortex-cleaned harvest lots and premium packaged Indian food products ready for global ocean freight."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <div>
              <label className="label text-xs">Default Display Mode</label>
              <select
                className="field text-xs font-semibold"
                value={current.showcase?.defaultMode || 'wheel'}
                onChange={(e) => updateShowcase('defaultMode', e.target.value)}
              >
                <option value="wheel">🎡 3D Spin Wheel (3 Products / Orbital)</option>
                <option value="arc">🌸 Curved Fan Arc</option>
              </select>
            </div>

            <div>
              <label className="label text-xs">Auto-Rotation Timer (Seconds)</label>
              <input
                type="number"
                step="0.5"
                min="2"
                max="15"
                className="field text-xs"
                value={current.showcase?.autoRotateSeconds || 3.5}
                onChange={(e) => updateShowcase('autoRotateSeconds', Number(e.target.value))}
              />
            </div>

            <div>
              <label className="label text-xs">Background Watermark Text</label>
              <input
                className="field font-mono text-xs uppercase"
                value={current.showcase?.watermark || ''}
                onChange={(e) => updateShowcase('watermark', e.target.value)}
                placeholder="e.g. FOOD PRODUCTS"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-line/60">
            <label className="flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(current.showcase?.keepCustomTitle)}
                onChange={(e) => updateShowcase('keepCustomTitle', e.target.checked)}
              />
              <span>
                <strong>Retain Custom Heading:</strong> Keep "{current.showcase?.title || 'Featured Export Products'}" even when buyer selects a category pill
              </span>
            </label>

            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="btn-primary text-xs shrink-0"
            >
              {isSaving ? 'Saving…' : '💾 Save Showcase Changes'}
            </button>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT CATALOGUE GRID HEADER (LOWER GRID & /product-details) */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">
              2. Product Catalogue Grid Header & Introduction
            </h2>
            <p className="text-xs text-ink/60">
              Controls the title, badge, and descriptive introduction displayed above the product cards grid on the website.
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer bg-forest/5 px-3 py-1.5 rounded-full border border-forest/20">
            <input
              type="checkbox"
              checked={current.isActive !== false}
              onChange={(e) => setSection({ ...current, isActive: e.target.checked })}
            />
            <span>Active</span>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label text-xs">Top Eyebrow Pill Tag</label>
            <input
              className="field"
              value={current.hero?.eyebrow || ''}
              onChange={(e) => updateHero('eyebrow', e.target.value)}
              placeholder="e.g. CERTIFIED INDIAN EXPORTS"
            />
          </div>
          <div>
            <label className="label text-xs">Category Tag Badge</label>
            <input
              className="field"
              value={current.hero?.badge || ''}
              onChange={(e) => updateHero('badge', e.target.value)}
              placeholder="e.g. Global Agro-Food Catalogue"
            />
          </div>
        </div>

        <div className="mt-2">
          <label className="label text-xs">Main Catalogue Title Heading</label>
          <input
            className="field text-base font-bold"
            value={current.hero?.title || ''}
            onChange={(e) => updateHero('title', e.target.value)}
            placeholder="e.g. All Export Food Products"
          />
        </div>

        <div className="mt-2">
          <label className="label text-xs">Catalogue Subtitle Description</label>
          <textarea
            className="field text-xs"
            rows="2"
            value={current.hero?.subtitle || ''}
            onChange={(e) => updateHero('subtitle', e.target.value)}
            placeholder="100% Sortex-cleaned Indian spices, premium grains, pulses..."
          />
        </div>
      </section>

      {/* 3. Bento Feature Card */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <div className="border-b border-line pb-4 mb-4">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gold-dark bg-gold/15 px-2 py-0.5 rounded">
            PROMOTIONAL GRID CARD
          </span>
          <h2 className="mt-1 font-display text-lg font-bold text-ink">
            3. Bento Highlight Card on Products Grid
          </h2>
          <p className="text-xs text-ink/60">
            Featured wide banner card rendered inside the product cards grid highlighting verified trade assurance.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label text-xs">Badge Tag</label>
            <input
              className="field text-xs"
              value={current.bento?.badge || ''}
              onChange={(e) => updateBento('badge', e.target.value)}
              placeholder="e.g. DIRECT SOURCING GUARANTEE"
            />
          </div>
          <div>
            <label className="label text-xs">Card Headline</label>
            <input
              className="field text-sm font-bold"
              value={current.bento?.headline || ''}
              onChange={(e) => updateBento('headline', e.target.value)}
              placeholder="e.g. Global Food Products, Perfected"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="label text-xs">Subtitle Description</label>
          <textarea
            className="field text-xs"
            rows="2"
            value={current.bento?.subtitle || ''}
            onChange={(e) => updateBento('subtitle', e.target.value)}
            placeholder="Direct sourcing of export-grade Indian spices..."
          />
        </div>

        {/* Bullets List */}
        <div className="mt-4 rounded-xl border border-line bg-[#fbf9f4] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase text-ink">
              Bullet Highlights ({(current.bento?.bullets || []).length})
            </span>
            <button
              type="button"
              onClick={addBentoBullet}
              className="rounded-lg bg-white border border-line px-2.5 py-1 text-xs font-bold text-forest hover:bg-forest hover:text-white transition"
            >
              + Add Bullet
            </button>
          </div>

          <div className="space-y-2">
            {(current.bento?.bullets || []).map((bullet, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  className="field text-xs flex-1"
                  value={bullet}
                  onChange={(e) => updateBentoBullet(idx, e.target.value)}
                  placeholder="e.g. Direct Mundra Port Container Stuffing"
                />
                <button
                  type="button"
                  onClick={() => removeBentoBullet(idx)}
                  className="text-xs text-clay hover:underline px-2"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <div>
            <label className="label text-xs">Call To Action Button Text</label>
            <input
              className="field text-xs"
              value={current.bento?.buttonText || ''}
              onChange={(e) => updateBento('buttonText', e.target.value)}
              placeholder="e.g. Request Container Quotation"
            />
          </div>
          <div>
            <label className="label text-xs">Call To Action Button Link</label>
            <input
              className="field text-xs font-mono"
              value={current.bento?.buttonLink || ''}
              onChange={(e) => updateBento('buttonLink', e.target.value)}
              placeholder="e.g. /inquiry"
            />
          </div>
        </div>
      </section>

      {/* 4. Export Assurance & Trust Bar */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">
              4. Export Assurance & Trust Highlights Bar
            </h2>
            <p className="text-xs text-ink/60">
              4 key value pillars demonstrating Sortex optical cleaning, direct port logistics, and lab certifications.
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer bg-forest/5 px-3 py-1.5 rounded-full border border-forest/20">
            <input
              type="checkbox"
              checked={current.trustBar?.isActive !== false}
              onChange={(e) =>
                setSection({
                  ...current,
                  trustBar: { ...current.trustBar, isActive: e.target.checked },
                })
              }
            />
            <span>Active</span>
          </label>
        </div>

        <div className="mb-4">
          <label className="label text-xs">Trust Bar Section Title</label>
          <input
            className="field"
            value={current.trustBar?.title || ''}
            onChange={(e) =>
              setSection({
                ...current,
                trustBar: { ...current.trustBar, title: e.target.value },
              })
            }
            placeholder="e.g. Why Global Buyers Trust NMC"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(current.trustBar?.items || []).map((pillar, i) => (
            <div key={pillar._id || i} className="rounded-xl border border-line bg-[#fbf9f4] p-4 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  className="w-12 text-center text-lg rounded border border-line bg-white py-1"
                  value={pillar.icon || '✨'}
                  onChange={(e) => updateTrustPillar(i, 'icon', e.target.value)}
                  placeholder="Icon"
                />
                <input
                  className="field text-xs font-bold flex-1"
                  value={pillar.title || ''}
                  onChange={(e) => updateTrustPillar(i, 'title', e.target.value)}
                  placeholder="Pillar Title (e.g. 100% Sortex Cleaned)"
                />
              </div>
              <textarea
                className="field text-xs"
                rows="2"
                value={pillar.text || ''}
                onChange={(e) => updateTrustPillar(i, 'text', e.target.value)}
                placeholder="Brief description of this export guarantee..."
              />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Bottom Quotation & Sample Banner */}
      <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">
              5. Bottom Export Quotation & Sample CTA Banner
            </h2>
            <p className="text-xs text-ink/60">
              High-converting call to action banner positioned at the bottom of the products page.
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer bg-forest/5 px-3 py-1.5 rounded-full border border-forest/20">
            <input
              type="checkbox"
              checked={current.ctaBanner?.isActive !== false}
              onChange={(e) => updateCta('isActive', e.target.checked)}
            />
            <span>Active</span>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label text-xs">Banner Eyebrow Tag</label>
            <input
              className="field text-xs"
              value={current.ctaBanner?.eyebrow || ''}
              onChange={(e) => updateCta('eyebrow', e.target.value)}
              placeholder="e.g. READY FOR EXPORT ORDERS"
            />
          </div>
          <div>
            <label className="label text-xs">Banner Main Title</label>
            <input
              className="field text-sm font-bold"
              value={current.ctaBanner?.title || ''}
              onChange={(e) => updateCta('title', e.target.value)}
              placeholder="e.g. Need Container Freight Quotations or Custom Samples?"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="label text-xs">Banner Description</label>
          <textarea
            className="field text-xs"
            rows="2"
            value={current.ctaBanner?.description || ''}
            onChange={(e) => updateCta('description', e.target.value)}
            placeholder="Our international trade desk prepares formal FOB..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <div>
            <label className="label text-xs">Primary Button Text</label>
            <input
              className="field text-xs"
              value={current.ctaBanner?.buttonPrimaryText || ''}
              onChange={(e) => updateCta('buttonPrimaryText', e.target.value)}
              placeholder="Request Official Quotation →"
            />
          </div>
          <div>
            <label className="label text-xs">Primary Button Link</label>
            <input
              className="field text-xs font-mono"
              value={current.ctaBanner?.buttonPrimaryLink || ''}
              onChange={(e) => updateCta('buttonPrimaryLink', e.target.value)}
              placeholder="/inquiry"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-4">
          <div>
            <label className="label text-xs">Secondary Button Text</label>
            <input
              className="field text-xs"
              value={current.ctaBanner?.buttonSecondaryText || ''}
              onChange={(e) => updateCta('buttonSecondaryText', e.target.value)}
              placeholder="Download Product Brochures"
            />
          </div>
          <div>
            <label className="label text-xs">Secondary Button Link</label>
            <input
              className="field text-xs font-mono"
              value={current.ctaBanner?.buttonSecondaryLink || ''}
              onChange={(e) => updateCta('buttonSecondaryLink', e.target.value)}
              placeholder="/brochures"
            />
          </div>
        </div>
      </section>

      {/* Bottom Sticky-style Save Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-line bg-white p-5 shadow-card">
        <div>
          <h4 className="font-display font-bold text-sm text-ink">Ready to Publish Changes?</h4>
          <p className="text-xs text-ink/60">
            Saving here updates MongoDB and instantly connects changes to <span className="font-mono text-moss">/products</span> and <span className="font-mono text-moss">/product-details</span>.
          </p>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="rounded-xl bg-forest px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-forest/90 disabled:opacity-50 flex items-center gap-2 transition"
        >
          <span>{isSaving ? 'Saving Changes…' : '💾 Save All Products Page Changes'}</span>
        </button>
      </div>
    </div>
  );
}

export default function ManageSiteContent() {
  const [content, setContent] = useState(clone(defaults));
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('home_hero');

  useEffect(() => {
    api
      .get('/site-content')
      .then((r) => setContent({ ...clone(defaults), ...r.data }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const r = await api.put('/site-content', content);
      setContent(r.data);
      setMessage('✓ Data is successfully updated in MongoDB!');
      setTimeout(() => setMessage(''), 6000);
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Failed to save content in MongoDB.';
      setError('✗ Error: ' + msg);
      setTimeout(() => setError(''), 8000);
    } finally {
      setBusy(false);
    }
  };

  const setSection = (key, value) => setContent({ ...content, [key]: value });

  if (loading) return <p className="text-sm text-ink/60 p-8">Loading site content…</p>;

  // Sub-section sidebar grouping
  const navSections = [
    {
      group: 'Home Page',
      icon: '🏠',
      items: [
        { id: 'home_hero', label: 'Hero Video & Ad Slider', icon: '🎬' },
        { id: 'new_arrivals', label: 'New Product Arrivals', icon: '🌟', badge: 'Editable' },
        { id: 'engineer_trade', label: 'Engineer High Volume Trade', icon: '🚢', badge: 'New' },
        { id: 'home_offerings', label: 'What We Offer', icon: '📦' },
        { id: 'home_how_we_work', label: 'How We Work (3 Steps)', icon: '🔄' },
      ],
    },
    {
      group: 'Trade Corridors',
      icon: '🗺️',
      items: [
        { id: 'map', label: 'Global Export Map & Hubs', icon: '🌐' },
      ],
    },
    {
      group: 'Quality & Compliance',
      icon: '🏅',
      items: [
        { id: 'certificates', label: 'International Certifications', icon: '📜' },
      ],
    },
    {
      group: 'Marketing & Leads',
      icon: '📢',
      items: [
        { id: 'flashcard', label: 'Flash Card / Promo Popup', icon: '⚡' },
        { id: 'testimonials', label: 'Client Feedback & Reviews', icon: '💬' },
      ],
    },
    {
      group: 'Site Pages',
      icon: '📄',
      items: [
        { id: 'products_page', label: 'Products Page CMS', icon: '🛍️', badge: 'Editable' },
        { id: 'about', label: 'About Us Page Content', icon: '🏢' },
        { id: 'inquiry', label: 'Inquiry & Quote Header', icon: '✉️' },
      ],
    },
    {
      group: 'AI Assistant',
      icon: '🤖',
      items: [
        { id: 'chatbot', label: 'TradeMitra Chatbot & Q&A', icon: '💬', badge: 'Editable' },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Site Content CMS</h1>
          <p className="mt-1 text-sm text-ink/60">
            Configure dynamic homepage sections, high-volume trade capabilities, global map, certificates, and popups.
          </p>
        </div>
        <button className="btn-primary" onClick={save} disabled={busy}>
          {busy ? 'Saving Changes…' : 'Save all changes'}
        </button>
      </div>

      {message && <p className="rounded-xl bg-forest/10 p-3.5 text-sm font-semibold text-forest border border-forest/20">{message}</p>}
      {error && <p className="rounded-xl bg-clay/10 p-3.5 text-sm font-semibold text-clay border border-clay/20">{error}</p>}

      {/* Two Column Layout: Sticky Sub-section Sidebar + Content Editor Canvas */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sub-Section Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 lg:sticky lg:top-4 bg-white rounded-2xl border border-line p-4 shadow-card space-y-5">
          <p className="px-2 text-[10px] font-mono uppercase tracking-widest text-ink/40 font-bold">
            Content Sub-Sections
          </p>

          <div className="space-y-4">
            {navSections.map((sec) => (
              <div key={sec.group} className="space-y-1">
                <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-moss uppercase tracking-wider">
                  <span>{sec.icon}</span>
                  <span>{sec.group}</span>
                </div>

                <div className="space-y-0.5">
                  {sec.items.map((item) => {
                    const isActive = tab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTab(item.id)}
                        className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-forest text-white shadow-sm font-bold border-l-4 border-gold'
                            : 'text-ink/75 hover:bg-[#fbf9f4] hover:text-ink'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-sm leading-none">{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="rounded bg-gold/90 px-1.5 py-0.2 text-[9px] font-bold text-ink uppercase">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right Main Editor Canvas */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {/* 1. HOME HERO */}
          {tab === 'home_hero' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <h2 className="font-display text-xl font-bold text-ink">Home — Hero Video & Ad Slider</h2>
                <p className="mt-1 text-xs text-ink/60">
                  Change the first screen of the Home page. Add/remove commercial slides, upload product ad videos (MP4/WebM) and fallback images.
                </p>
              </div>
              <ItemEditor section={content.homeHero} setSection={(v) => setSection('homeHero', v)} image video />
            </section>
          )}

          {/* NEW PRODUCT ARRIVALS (EDITABLE) */}
          {tab === 'new_arrivals' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Seasonal Trade Arrivals
                </span>
                <h2 className="mt-2 font-display text-xl font-bold text-ink">
                  New Product Arrivals Section
                </h2>
                <p className="mt-1 text-xs text-ink/60">
                  Manage the auto-rotating homepage carousel, headlines, harvest year badge, timer, and featured export consignment cards.
                </p>
              </div>
              <NewArrivalsEditor
                section={content.newArrivals}
                setSection={(v) => setSection('newArrivals', v)}
              />
            </section>
          )}

          {/* 2. ENGINEER HIGH VOLUME TRADE (NEW REQUIREMENT) */}
          {tab === 'engineer_trade' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                  Wholesale & Industrial Operations
                </span>
                <h2 className="mt-2 font-display text-xl font-bold text-ink">
                  Engineer High-Volume Trade Section
                </h2>
                <p className="mt-1 text-xs text-ink/60">
                  Configure large-scale container consolidation, Sortex cleaning, optical grading, and international laboratory compliance features.
                </p>
              </div>
              <EngineerTradeEditor
                section={content.engineerTrade}
                setSection={(v) => setSection('engineerTrade', v)}
              />
            </section>
          )}

          {/* 3. WHAT WE OFFER */}
          {tab === 'home_offerings' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <h2 className="font-display text-xl font-bold text-ink">Home — What We Offer</h2>
                <p className="mt-1 text-xs text-ink/60">Manage market-specific packaging, private labeling, and export coordination points.</p>
              </div>
              <ItemEditor section={content.homeOfferings} setSection={(v) => setSection('homeOfferings', v)} />
            </section>
          )}

          {/* 4. HOW WE WORK */}
          {tab === 'home_how_we_work' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <h2 className="font-display text-xl font-bold text-ink">Home — How We Work (3-Step Export Bridge)</h2>
                <p className="mt-1 text-xs text-ink/60">Manage the three steps connecting Indian growers to global buyers.</p>
              </div>
              <ItemEditor section={content.homeHowWeWork} setSection={(v) => setSection('homeHowWeWork', v)} />
            </section>
          )}

          {/* 5. GLOBAL EXPORT MAP */}
          {tab === 'map' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <h2 className="font-display text-xl font-bold text-ink">Global Export Map & Ports</h2>
                <p className="mt-1 text-xs text-ink/60">Customize active export corridors (USA, UK, Europe, Norway, GCC, Asia), ports, and transit duration.</p>
              </div>
              <MapEditor section={content.globalMap} setSection={(v) => setSection('globalMap', v)} />
            </section>
          )}

          {/* 6. CERTIFICATES */}
          {tab === 'certificates' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <h2 className="font-display text-xl font-bold text-ink">Certificates & Accreditations</h2>
                <p className="mt-1 text-xs text-ink/60">Manage FSSAI, APEDA, ISO 22000, HACCP, GMP, GHP, ASTA, and custom regulatory seals.</p>
              </div>
              <CertificatesEditor section={content.certificates} setSection={(v) => setSection('certificates', v)} />
            </section>
          )}

          {/* 7. FLASH CARD MODAL */}
          {tab === 'flashcard' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <h2 className="font-display text-xl font-bold text-ink">First-Visit Flash Card / Promo Popup</h2>
                <p className="mt-1 text-xs text-ink/60">Customize the promotional announcement card shown to visitors right after the brand loader finishes.</p>
              </div>
              <FlashCardEditor
                section={content.flashCard}
                setSection={(v) => setSection('flashCard', v)}
              />
            </section>
          )}

          {/* 8. TESTIMONIALS */}
          {tab === 'testimonials' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <h2 className="font-display text-xl font-bold text-ink">Client Feedback & Testimonials</h2>
                <p className="mt-1 text-xs text-ink/60">Manage verified international buyer reviews and import testimonials.</p>
              </div>
              <ItemEditor section={content.testimonials} setSection={(v) => setSection('testimonials', v)} image />
            </section>
          )}

          {/* PRODUCTS PAGE CMS */}
          {tab === 'products_page' && (
            <ProductsPageEditor
              section={content.productsPage}
              setSection={(v) => setSection('productsPage', v)}
              onSave={save}
              isSaving={busy}
            />
          )}

          {/* 9. ABOUT PAGE */}
          {tab === 'about' && (
            <div className="space-y-6">
              <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <h2 className="font-display text-lg font-bold text-ink">About Page — Hero Header</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label">Eyebrow</label>
                    <input
                      className="field"
                      value={content.aboutHero?.eyebrow || ''}
                      onChange={(e) => setSection('aboutHero', { ...content.aboutHero, eyebrow: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Heading</label>
                    <input
                      className="field"
                      value={content.aboutHero?.title || ''}
                      onChange={(e) => setSection('aboutHero', { ...content.aboutHero, title: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="label">Description</label>
                  <textarea
                    className="field"
                    rows="3"
                    value={content.aboutHero?.description || ''}
                    onChange={(e) => setSection('aboutHero', { ...content.aboutHero, description: e.target.value })}
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <h2 className="font-display text-lg font-bold text-ink">About — Our Approach</h2>
                <div className="mt-4">
                  <ItemEditor section={content.aboutApproach} setSection={(v) => setSection('aboutApproach', v)} image side />
                </div>
              </section>

              <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <h2 className="font-display text-lg font-bold text-ink">About — Why Choose Us</h2>
                <div className="mt-4">
                  <ItemEditor section={content.aboutWhyChooseUs} setSection={(v) => setSection('aboutWhyChooseUs', v)} />
                </div>
              </section>
            </div>
          )}

          {/* 10. INQUIRY PAGE */}
          {tab === 'inquiry' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-4">
                <h2 className="font-display text-lg font-bold text-ink">Inquiry & Quotation Page Header</h2>
                <p className="text-xs text-ink/60">Customize the contact and quotation request header text.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="label">Eyebrow</label>
                  <input
                    className="field"
                    value={content.inquiryHero?.eyebrow || ''}
                    onChange={(e) => setSection('inquiryHero', { ...content.inquiryHero, eyebrow: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Heading</label>
                  <input
                    className="field"
                    value={content.inquiryHero?.title || ''}
                    onChange={(e) => setSection('inquiryHero', { ...content.inquiryHero, title: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="label">Description</label>
                <textarea
                  className="field"
                  rows="3"
                  value={content.inquiryHero?.description || ''}
                  onChange={(e) => setSection('inquiryHero', { ...content.inquiryHero, description: e.target.value })}
                />
              </div>
            </section>
          )}

          {/* 11. CHATBOT KNOWLEDGE & PROFILE */}
          {tab === 'chatbot' && (
            <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="border-b border-line pb-4 mb-5">
                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink">
                  AI Website Assistant
                </span>
                <h2 className="mt-2 font-display text-xl font-bold text-ink">
                  TradeMitra Chatbot & Knowledge Base
                </h2>
                <p className="mt-1 text-xs text-ink/60">
                  Manage bot display identity, welcome greeting, suggested chips, and export Q&A topics. Confidential internal data is strictly shielded.
                </p>
              </div>
              <ChatbotEditor
                section={content.chatbot}
                setSection={(v) => setSection('chatbot', v)}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

