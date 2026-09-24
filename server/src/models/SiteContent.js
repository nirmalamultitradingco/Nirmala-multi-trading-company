import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    video: { type: String, default: '' },
    icon: { type: String, default: '' },
    order: { type: Number, default: 0 },
    side: { type: String, enum: ['left', 'right'] },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const testimonialSchema = new mongoose.Schema(
  {
    logo: { type: String, default: '' },
    quote: { type: String, default: '' },
    name: { type: String, default: '' },
    role: { type: String, default: '' },
    avatar: { type: String, default: '' },
    order: { type: Number, default: 0 },
    side: { type: String, enum: ['left', 'right'] },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const mapRegionSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    code: { type: String, default: '' },
    x: { type: Number, default: 500 },
    y: { type: Number, default: 250 },
    ports: { type: [String], default: [] },
    transitTime: { type: String, default: '' },
    deliveryRate: { type: String, default: '99.4%' },
    volumeGrowth: { type: String, default: '+28%' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const mapPillarSchema = new mongoose.Schema(
  {
    number: { type: String, default: '01' },
    title: { type: String, default: '' },
    text: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const certificateSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    issuer: { type: String, default: '' },
    code: { type: String, default: 'fssai' },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    highlights: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const tradePillarSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    metric: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: '🚢' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, index: true, default: 'main' },
    homeHero: {
      eyebrow: { type: String, default: 'NMC' },
      title: { type: String, default: 'India’s Taste. The World’s Table' },
      description: { type: String, default: 'Connecting trusted Indian food products with buyers around the world.' },
      items: {
        type: [itemSchema],
        default: [
          { title: 'Quality Products', description: 'Sourcing quality products for global markets.', image: 'https://www.w3schools.com/w3images/coffee.jpg', order: 1, isActive: true },
          { title: 'Trusted Trading Partner', description: 'Reliable sourcing, documentation and export solutions.', image: 'https://www.w3schools.com/w3images/workbench.jpg', order: 2, isActive: true },
          { title: 'Global Connections', description: 'Connecting trusted suppliers with international buyers.', image: 'https://www.w3schools.com/w3images/sound.jpg', order: 3, isActive: true },
        ],
      },
    },
    aboutHero: {
      eyebrow: { type: String, default: 'About NMC' },
      title: { type: String, default: 'India’s Taste. The World’s Table' },
      description: { type: String, default: 'We connect trusted Indian food products with international buyers through a clear, organised export process.' },
    },
    inquiryHero: {
      eyebrow: { type: String, default: 'Get in touch' },
      title: { type: String, default: "We're ready to talk." },
      description: {
        type: String,
        default: 'Tell us what you are looking for and our export team will get back to you with product details, samples and pricing.',
      },
    },
    aboutApproach: {
      eyebrow: { type: String, default: 'Our approach' },
      title: { type: String, default: 'What sets us apart' },
      description: {
        type: String,
        default: 'A structured approach to sourcing, documentation and export coordination — designed to make international buying clearer and more dependable.',
      },
      items: {
        type: [itemSchema],
        default: [
          { title: 'The beginning', description: 'We started with a simple idea: make quality Indian food products easier for international buyers to source with confidence.', icon: '01', order: 1, side: 'left', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80' },
          { title: 'Built around quality', description: 'Every product opportunity is supported with clear specifications, packaging details, certifications and practical export documentation.', icon: '02', order: 2, side: 'right', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80' },
          { title: 'Ready for global buyers', description: 'From product selection and samples to pricing and shipment coordination, we keep the process organised around the buyer and destination market.', icon: '03', order: 3, side: 'left', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80' },
        ],
      },
    },
    homeOfferings: {
      eyebrow: { type: String, default: 'What we offer' },
      title: { type: String, default: 'Export support built around your market' },
      description: {
        type: String,
        default: 'From product sourcing to documentation and shipment coordination, we help international buyers move with confidence.',
      },
      items: {
        type: [itemSchema],
        default: [
          { title: 'Product sourcing', description: 'Curated Indian food products from trusted growers, manufacturers and processors.', icon: '01', order: 1 },
          { title: 'Private label support', description: 'Packaging, labelling, specifications and market-specific requirements coordinated with suppliers.', icon: '02', order: 2 },
          { title: 'Export coordination', description: 'Documentation, shipment planning and one point of contact from enquiry through dispatch.', icon: '03', order: 3 },
        ],
      },
    },
    homeHowWeWork: {
      eyebrow: { type: String, default: 'How we work' },
      title: { type: String, default: 'A single bridge to global buyers' },
      description: { type: String, default: "Three steps that turn a grower's harvest into a compliant, on-time export shipment." },
      items: {
        type: [itemSchema],
        default: [
          { title: 'We source & vet', description: 'We partner directly with growers and processors, verify certifications, and inspect quality before anything is listed.', icon: '01', order: 1 },
          { title: 'We ready for export', description: 'Grading, packing, documentation and HS classification handled so shipments clear customs without friction.', icon: '02', order: 2 },
          { title: 'We deliver to buyers', description: 'One point of contact for pricing, samples and logistics across multiple product segments and origins.', icon: '03', order: 3 },
        ],
      },
    },
    aboutWhyChooseUs: {
      eyebrow: { type: String, default: 'Why choose us' },
      title: { type: String, default: 'A practical partner for international food sourcing' },
      description: {
        type: String,
        default: 'We combine product knowledge, supplier coordination and export documentation to make buying from India clearer and easier.',
      },
      items: {
        type: [itemSchema],
        default: [
          { title: 'Reliable sourcing', description: 'We coordinate with established growers and food companies and match products to buyer requirements.', icon: '01', order: 1 },
          { title: 'Export-ready information', description: 'Clear specifications, packaging, certifications and documentation support before shipment.', icon: '02', order: 2 },
          { title: 'Buyer-focused coordination', description: 'One organised point of contact for samples, pricing, production updates and logistics.', icon: '03', order: 3 },
        ],
      },
    },
    testimonials: {
      eyebrow: { type: String, default: 'Client feedback' },
      title: { type: String, default: 'What our clients say about us' },
      description: {
        type: String,
        default: 'Feedback from buyers and partners who value clear communication, reliable information and a well-coordinated export process.',
      },
      items: {
        type: [testimonialSchema],
        default: [
          {
            logo: 'NMC',
            quote: 'Clear communication, practical product information and a smooth process from inquiry to shipment.',
            name: 'Amanda Smith',
            role: 'Import Buyer',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=180&q=80',
            order: 1,
          },
          {
            logo: 'GLOBAL FOODS',
            quote: 'The team understood our market requirements and helped us coordinate samples, specifications and pricing efficiently.',
            name: 'Mark Wilson',
            role: 'Procurement Manager',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=180&q=80',
            order: 2,
          },
          {
            logo: 'TRADE PARTNERS',
            quote: 'A dependable point of contact for Indian food products, export documentation and shipment coordination.',
            name: 'Jessica Smith',
            role: 'Category Manager',
            avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=180&q=80',
            order: 3,
          },
        ],
      },
    },
    globalMap: {
      eyebrow: { type: String, default: 'Global Footprint' },
      title: { type: String, default: 'Export Corridors We Actively Serve' },
      description: {
        type: String,
        default: 'Reliable maritime & air freight routes delivering export-grade Indian agri commodities, spices, and processed foods worldwide.',
      },
      regions: {
        type: [mapRegionSchema],
        default: [
          { name: 'United States', code: 'USA', x: 230, y: 195, ports: ['New York / New Jersey', 'Long Beach (Los Angeles)', 'Houston / Savannah'], transitTime: '24 – 28 Days', deliveryRate: '99.4%', volumeGrowth: '+34%', order: 1, isActive: true },
          { name: 'United Kingdom', code: 'UK', x: 472, y: 145, ports: ['Felixstowe', 'Southampton', 'London Gateway'], transitTime: '18 – 22 Days', deliveryRate: '99.8%', volumeGrowth: '+28%', order: 2, isActive: true },
          { name: 'European Union', code: 'Europe', x: 510, y: 170, ports: ['Rotterdam (Netherlands)', 'Hamburg (Germany)', 'Antwerp (Belgium)'], transitTime: '20 – 24 Days', deliveryRate: '99.2%', volumeGrowth: '+41%', order: 3, isActive: true },
          { name: 'Norway & Scandinavia', code: 'Norway', x: 520, y: 110, ports: ['Oslo Port', 'Gothenburg', 'Bergen'], transitTime: '22 – 26 Days', deliveryRate: '99.5%', volumeGrowth: '+19%', order: 4, isActive: true },
          { name: 'GCC & Middle East', code: 'GCC', x: 615, y: 235, ports: ['Jebel Ali (Dubai)', 'Hamad Port (Qatar)', 'Jeddah Islamic Port (KSA)'], transitTime: '4 – 7 Days', deliveryRate: '99.9%', volumeGrowth: '+52%', order: 5, isActive: true },
          { name: 'Asian Markets', code: 'Asian', x: 790, y: 280, ports: ['Port of Singapore', 'Port Klang (Malaysia)', 'Tokyo / Yokohama (Japan)'], transitTime: '8 – 14 Days', deliveryRate: '99.6%', volumeGrowth: '+37%', order: 6, isActive: true },
        ],
      },
      pillars: {
        type: [mapPillarSchema],
        default: [
          { number: '01', title: '6 Global Corridors', text: 'Established logistics networks reaching USA, Europe, UK, Norway, Asia, and GCC ports.', order: 1, isActive: true },
          { number: '02', title: '100% HS & Lab Clearance', text: 'Pre-shipment phytosanitary, pesticide MRL, and fumigation certificates for zero-delay customs clearance.', order: 2, isActive: true },
          { number: '03', title: 'Direct Sea & Air Options', text: 'Full Container Load (FCL), Less than Container Load (LCL), and urgent temperature-controlled air freight.', order: 3, isActive: true },
          { number: '04', title: 'Flexible Incoterms', text: 'FOB, CIF, CFR, and DDP terms customized to buyer preference with transparent tracking.', order: 4, isActive: true },
        ],
      },
    },
    certificates: {
      eyebrow: { type: String, default: 'Accreditations & Compliance' },
      title: { type: String, default: 'Certified for Global Trade' },
      description: {
        type: String,
        default: 'Our export consignments strictly conform to international food safety, phytosanitary standards, and destination-country import regulations.',
      },
      items: {
        type: [certificateSchema],
        default: [
          { name: 'Food Safety and Standards Authority of India', issuer: 'Govt. of India Statutory Food License', code: 'fssai', description: 'Mandatory central certification verifying supreme hygiene, raw material testing, pesticide residue adherence, and ethical food packaging standards.', highlights: ['Zero adulteration mandate', 'Periodic batch laboratory assays', 'Full farm-to-dispatch traceability'], order: 1, isActive: true },
          { name: 'Agricultural & Processed Food Products Export Development Authority', issuer: 'Ministry of Commerce & Industry, India', code: 'apeda', description: 'Official export certification facilitating trade oversight, scheduled food grading, port-level phytosanitary documentation, and residue monitoring.', highlights: ['Global organic trace compliance', 'Govt accredited export verification', 'Scheduled agricultural standards'], order: 2, isActive: true },
          { name: 'Good Manufacturing Practice', issuer: 'Quality & Integrity Assured Manufacturing', code: 'gmp', description: 'Ensures products are consistently manufactured and controlled to quality standards appropriate to their intended use and international market requirements.', highlights: ['State-of-the-art grading & packing', 'Standard operating procedures (SOP)', 'Batch consistency guarantees'], order: 3, isActive: true },
          { name: 'Good Hygiene Practices', issuer: 'Sanitation & Clean Handling Protocol', code: 'ghp', description: 'Strict hygiene controls across raw material procurement, warehouse cleanliness, employee sanitation, and temperature-controlled storage.', highlights: ['Sanitized packing environments', 'Pest-free hermetic storage', 'Safe contact packaging'], order: 4, isActive: true },
          { name: 'Hazard Analysis Critical Control Point', issuer: 'Preventive Food Safety Protocol', code: 'haccp', description: 'Systematic preventive approach targeting biological, chemical, and physical food hazards in production processes rather than finished product inspection alone.', highlights: ['Critical control point monitoring', 'Contamination prevention', 'Continuous process validation'], order: 5, isActive: true },
          { name: 'ISO 22000:2018 Food Safety Management', issuer: 'International Organization for Standardization', code: 'iso22000', description: 'The premier global food safety management benchmark harmonizing interactive communication, system management, and prerequisite programs.', highlights: ['Comprehensive hazard screening', 'International supply-chain alignment', 'Rigorous third-party audits'], order: 6, isActive: true },
          { name: 'American Spice Trade Association', issuer: 'Premier International Spice Trade Body', code: 'asta', description: 'Adherence to ASTA cleanliness specifications, steam sterilization standards, volatile oil content guarantees, and moisture thresholds for North American and world markets.', highlights: ['Cleanliness & purity testing', 'ETO / Steam treated options', 'Strict volatile oil benchmarks'], order: 7, isActive: true },
        ],
      },
    },
    engineerTrade: {
      eyebrow: { type: String, default: 'Industrial & Large-Scale Operations' },
      title: { type: String, default: 'Engineering High-Volume Global Trade' },
      description: {
        type: String,
        default:
          'Scalable processing, precision container consolidation, and institutional supply chain reliability from farm gate to global port.',
      },
      badge: { type: String, default: 'FCL & Multi-Container Consignments' },
      items: {
        type: [tradePillarSchema],
        default: [
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
    },
    flashCard: {
      isActive: { type: Boolean, default: true },
      title: { type: String, default: 'India’s Taste. The World’s Table' },
      subtitle: { type: String, default: 'Direct sourcing of export-grade Indian spices, premium grains, and agro-commodities with certified global shipping.' },
      image: { type: String, default: '' },
      buttonText: { type: String, default: 'Explore Our Products' },
      buttonLink: { type: String, default: '/products' },
    },
    chatbot: {
      botName: { type: String, default: 'TradeMitra' },
      botSubtitle: { type: String, default: 'AI Export & Sourcing Assistant' },
      welcomeMessage: {
        type: String,
        default:
          'Hello! I am **TradeMitra**, your export & sourcing assistant at **Nirmala Multi Trading Co.** (NMC).\n\nHow can I assist your food import or procurement inquiry today?',
      },
      defaultSuggestions: {
        type: [String],
        default: [
          'What spices do you export?',
          'Shipping to USA, Europe & GCC',
          'Can I request sample kits?',
          'Certificates & Quality',
        ],
      },
      disclaimer: {
        type: String,
        default:
          'Responses are generated based on NMC product catalogues and export shipping specifications.',
      },
      isActive: { type: Boolean, default: true },
      knowledgeBase: {
        type: [
          new mongoose.Schema(
            {
              triggers: { type: [String], default: [] },
              reply: { type: String, default: '' },
              link: { type: String, default: '' },
              linkText: { type: String, default: '' },
              suggestions: { type: [String], default: [] },
              order: { type: Number, default: 0 },
              isActive: { type: Boolean, default: true },
            },
            { _id: true }
          ),
        ],
        default: [
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
    },
  },
  { timestamps: true }
);

export default mongoose.model('SiteContent', siteContentSchema);
