import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';

import User from '../models/User.js';
import Segment from '../models/Segment.js';
import SubSegment from '../models/SubSegment.js';
import Partner from '../models/Partner.js';
import Product from '../models/Product.js';
import Brochure from '../models/Brochure.js';
import News from '../models/News.js';
import Inquiry from '../models/Inquiry.js';
import Subscriber from '../models/Subscriber.js';
import PartnerRegistration from '../models/PartnerRegistration.js';
import SiteContent from '../models/SiteContent.js';

dotenv.config();

const unsplash = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=75`;

async function enrichAllData() {
  await connectDB();
  console.log('Connected to MongoDB. Starting full database enrichment...');

  // =========================================================================
  // 1. ADMIN USERS
  // =========================================================================
  console.log('--- 1. Ensuring Admin Users ---');
  const admins = [
    {
      name: 'NMC Super Admin',
      email: 'admin@nmc.com',
      password: process.env.ADMIN_PASSWORD || 'admin12345',
      role: 'admin',
    },
    {
      name: 'NMC Harvest Admin',
      email: 'admin@harvestbridge.com',
      password: process.env.ADMIN_PASSWORD || 'admin12345',
      role: 'admin',
    },
  ];

  for (const adm of admins) {
    const existing = await User.findOne({ email: adm.email });
    if (!existing) {
      await User.create(adm);
      console.log(`✓ Created admin: ${adm.email}`);
    } else {
      console.log(`• Admin exists: ${adm.email}`);
    }
  }

  // =========================================================================
  // 2. SEGMENTS (PRODUCT CATEGORIES)
  // =========================================================================
  console.log('--- 2. Ensuring All Product Segments ---');
  const segmentDefinitions = [
    {
      name: 'Spices & Seasonings',
      slug: 'spices-and-seasonings',
      description: '100% Sortex-cleaned Indian whole seeds, ground spices, and aromatic herbs with certified volatile oil benchmarks and low moisture.',
      image: unsplash('photo-1596040033229-a9821ebd058d'),
      order: 1,
      isActive: true,
    },
    {
      name: 'Grains & Pulses',
      slug: 'grains-and-pulses',
      description: 'Export-grade aged 1121 & 1509 Basmati rice, non-basmati varieties, and machine-cleaned pulses and lentils direct from farm clusters.',
      image: unsplash('photo-1586201375761-83865001e31c'),
      order: 2,
      isActive: true,
    },
    {
      name: 'Dehydrated Foods',
      slug: 'dehydrated-foods',
      description: 'Air-dried and dehydrated white & red onion flakes, chopped, minced, and garlic cloves and powder processed in Mahuva, Gujarat.',
      image: unsplash('photo-1580201092675-a0a6a6cafbb1'),
      order: 3,
      isActive: true,
    },
    {
      name: 'Dried Fruits & Nuts',
      slug: 'dried-fruits-and-nuts',
      description: 'Premium graded whole cashew nuts (W240, W320), golden raisins, California & Indian almonds, and walnut kernels in vacuum packs.',
      image: unsplash('photo-1508747703725-719777637510'),
      order: 4,
      isActive: true,
    },
    {
      name: 'Tea & Coffee',
      slug: 'tea-and-coffee',
      description: 'Single-estate orthodox Assam teas, Nilgiri green teas, and Robusta/Arabica coffee beans packaged for bulk buyers and private label.',
      image: unsplash('photo-1597481499750-3e6b22637e12'),
      order: 5,
      isActive: true,
    },
    {
      name: 'Snacks',
      slug: 'snacks',
      description: 'Authentic Indian savouries, vacuum-packed spiced khakhra, bhujia, and extruded crisps prepared with pure vegetable oils.',
      image: unsplash('photo-1599488615731-7e5c2823ff28'),
      order: 6,
      isActive: true,
    },
    {
      name: 'Farali Snacks',
      slug: 'farali-snacks',
      description: 'Traditional Indian fasting (Vrat / Upwas) snacks crafted with rock salt (Sendha Namak), water chestnut, and tapioca pearls.',
      image: unsplash('photo-1601050690597-df0568f70950'),
      order: 7,
      isActive: true,
    },
    {
      name: 'Biscuit & Bakery',
      slug: 'biscuit-and-bakery',
      description: 'Crispy cumin biscuits, premium glucose and cream cookies, and twice-baked wheat toast rusk with prolonged export shelf life.',
      image: unsplash('photo-1558961363-fa8fdf82db35'),
      order: 8,
      isActive: true,
    },
    {
      name: 'Frozen Foods',
      slug: 'frozen-foods',
      description: 'IQF (Individually Quick Frozen) Punjabi samosas, stuffed parathas, green peas, and ready meals under -18°C cold chain logistics.',
      image: unsplash('photo-1601050690117-94f5f6fa8bd7'),
      order: 9,
      isActive: true,
    },
    {
      name: 'Beverages',
      slug: 'beverages',
      description: 'Totapuri and Alphonso mango pulps in aseptic bags & OTS cans, herbal tea concentrates, and instant premix drinks.',
      image: unsplash('photo-1534353473418-4cfa6c56fd38'),
      order: 10,
      isActive: true,
    },
  ];

  const segMap = {};
  for (const sDef of segmentDefinitions) {
    let seg = await Segment.findOne({ slug: sDef.slug });
    if (!seg) {
      seg = await Segment.create(sDef);
      console.log(`✓ Created Segment: ${seg.name}`);
    } else {
      Object.assign(seg, sDef);
      await seg.save();
      console.log(`• Updated Segment: ${seg.name}`);
    }
    segMap[sDef.slug] = seg;
  }

  // =========================================================================
  // 3. SUB-SEGMENTS
  // =========================================================================
  console.log('--- 3. Ensuring Structured Sub-Segments ---');
  const subSegmentDefinitions = [
    // Spices
    { name: 'Whole Seed Spices', slug: 'whole-seed-spices', segmentSlug: 'spices-and-seasonings', order: 1 },
    { name: 'Ground & Powdered Spices', slug: 'ground-powdered-spices', segmentSlug: 'spices-and-seasonings', order: 2 },
    // Grains
    { name: 'Basmati Rice Varieties', slug: 'basmati-rice-varieties', segmentSlug: 'grains-and-pulses', order: 1 },
    { name: 'Pulses & Lentils', slug: 'pulses-and-lentils', segmentSlug: 'grains-and-pulses', order: 2 },
    // Dehydrated
    { name: 'Dehydrated White Onion', slug: 'dehydrated-white-onion', segmentSlug: 'dehydrated-foods', order: 1 },
    { name: 'Dehydrated Garlic Products', slug: 'dehydrated-garlic-products', segmentSlug: 'dehydrated-foods', order: 2 },
    // Bakery
    { name: 'Export Cookies & Biscuits', slug: 'export-cookies-and-biscuits', segmentSlug: 'biscuit-and-bakery', order: 1 },
    { name: 'Wheat Toast Rusk', slug: 'wheat-toast-rusk', segmentSlug: 'biscuit-and-bakery', order: 2 },
    // Frozen
    { name: 'Frozen Appetizers & Samosas', slug: 'frozen-appetizers-and-samosas', segmentSlug: 'frozen-foods', order: 1 },
    { name: 'Frozen Parathas & Breads', slug: 'frozen-parathas-and-breads', segmentSlug: 'frozen-foods', order: 2 },
    // Snacks
    { name: 'Roasted Spiced Khakhra', slug: 'roasted-spiced-khakhra', segmentSlug: 'snacks', order: 1 },
    { name: 'Traditional Namkeen & Bhujia', slug: 'traditional-namkeen-and-bhujia', segmentSlug: 'snacks', order: 2 },
    // Farali
    { name: 'Fasting / Vrat Namkeen', slug: 'fasting-vrat-namkeen', segmentSlug: 'farali-snacks', order: 1 },
    // Beverages
    { name: 'Aseptic Mango Pulps', slug: 'aseptic-mango-pulps', segmentSlug: 'beverages', order: 1 },
  ];

  const subSegMap = {};
  for (const subDef of subSegmentDefinitions) {
    const parentSeg = segMap[subDef.segmentSlug];
    if (!parentSeg) continue;

    let sub = await SubSegment.findOne({
      $or: [
        { slug: subDef.slug },
        { name: subDef.name },
      ],
    });
    if (!sub) {
      sub = await SubSegment.create({
        name: subDef.name,
        slug: subDef.slug,
        segment: parentSeg._id,
        order: subDef.order,
        isActive: true,
      });
      console.log(`✓ Created SubSegment: ${sub.name} under ${parentSeg.name}`);
    } else {
      sub.segment = parentSeg._id;
      sub.name = subDef.name;
      sub.order = subDef.order;
      await sub.save();
    }
    subSegMap[subDef.slug] = sub;
  }

  // =========================================================================
  // 4. PARTNERS (EXPORT MILLS & PROCESSORS)
  // =========================================================================
  console.log('--- 4. Ensuring Verified Export Partners ---');
  const partnerDefs = [
    {
      name: 'Sunfield Agro Organics',
      slug: 'sunfield-agro-organics',
      country: 'India',
      description: 'Third-generation spice growers and modern Sortex milling hubs based in Unjha, Gujarat and Kerala.',
      website: 'https://sunfieldagro.example.com',
      logo: unsplash('photo-1618160702438-9b02ab6515c9'),
      isActive: true,
    },
    {
      name: 'Golden Valley Rice Mills',
      slug: 'golden-valley-rice-mills',
      country: 'India',
      description: 'Advanced parboiling, steam and milling plants producing 1121 and 1509 Basmati rice in Punjab and Haryana.',
      website: 'https://goldenvalleymills.example.com',
      logo: unsplash('photo-1567306226416-28f0efdc88ce'),
      isActive: true,
    },
    {
      name: 'Mahuva Dehydration Hub',
      slug: 'mahuva-dehydration-hub',
      country: 'India',
      description: 'Pioneering continuous belt dehydration lines delivering EU-grade white and red onion flakes, minced, and powder.',
      website: 'https://mahuvafoods.example.com',
      logo: unsplash('photo-1587049352846-4a222e784d38'),
      isActive: true,
    },
    {
      name: 'Highland Leaf Estates',
      slug: 'highland-leaf-estates',
      country: 'India',
      description: 'Certified Rainforest Alliance single-origin tea gardens situated in Upper Assam and Nilgiris mountain ranges.',
      website: 'https://highlandleaf.example.com',
      logo: unsplash('photo-1597481499750-3e6b22637e12'),
      isActive: true,
    },
    {
      name: 'Saurashtra Sesame & Oilseed Processors',
      slug: 'saurashtra-sesame-processors',
      country: 'India',
      description: 'Laser-guided hulling and cleaning facility producing 99.98% purity natural and hulled white sesame seeds in Rajkot.',
      website: 'https://saurashtrasesame.example.com',
      logo: unsplash('photo-1563412885-139e4045ec52'),
      isActive: true,
    },
    {
      name: 'Royal Heritage Confectionery & Bakery',
      slug: 'royal-heritage-bakery',
      country: 'India',
      description: 'FSSC 22000 certified automated biscuit lines baking traditional cumin cookies and crispy export tea rusk in Ahmedabad.',
      website: 'https://royalheritagebakery.example.com',
      logo: unsplash('photo-1558961363-fa8fdf82db35'),
      isActive: true,
    },
    {
      name: 'FrostPeak IQF Foods',
      slug: 'frostpeak-iqf-foods',
      country: 'India',
      description: 'Modern blast freezing tunnel operations packing ready-to-fry Indian appetizers and flaky multi-layered parathas.',
      website: 'https://frostpeak.example.com',
      logo: unsplash('photo-1601050690117-94f5f6fa8bd7'),
      isActive: true,
    },
  ];

  const partnerMap = {};
  for (const pDef of partnerDefs) {
    let part = await Partner.findOne({
      $or: [{ slug: pDef.slug }, { name: pDef.name }],
    });
    if (!part) {
      part = await Partner.create(pDef);
      console.log(`✓ Created Partner: ${part.name}`);
    } else {
      Object.assign(part, pDef);
      await part.save();
    }
    partnerMap[pDef.slug] = part;
    if (part.slug && part.slug !== pDef.slug) {
      partnerMap[part.slug] = part;
    }
  }

  // =========================================================================
  // 5. PRODUCTS (COMPREHENSIVE EXPORT CATALOGUE ACROSS ALL SEGMENTS)
  // =========================================================================
  console.log('--- 5. Ensuring Rich Export Products in Every Segment ---');
  const pSunfield = partnerMap['sunfield-agro-organics'];
  const pGolden = partnerMap['golden-valley-rice-mills'];
  const pMahuva = partnerMap['mahuva-dehydration-hub'];
  const pHighland = partnerMap['highland-leaf-estates'];
  const pSesame = partnerMap['saurashtra-sesame-processors'];
  const pBakery = partnerMap['royal-heritage-bakery'];
  const pFrozen = partnerMap['frostpeak-iqf-foods'];

  const productList = [
    // ---------------- SPICES & SEASONINGS ----------------
    {
      name: 'Sortex-Cleaned Cumin Seeds (Jeera)',
      slug: 'sortex-cumin-seeds-jeera',
      segment: segMap['spices-and-seasonings']._id,
      subSegment: subSegMap['whole-seed-spices']?._id,
      partner: pSunfield?._id,
      shortDescription: '99.5% European purity, Sortex machine graded with volatile oil content > 3.0% and low moisture.',
      description: 'Single-origin Gujarat cumin seeds machine-cleaned and Sortex-graded to 99.5% purity. Low moisture, free from aflatoxins and pesticide residues conforming to European and US ASTA standards. Direct stuffing from Mundra Port.',
      image: unsplash('photo-1596040033229-a9821ebd058d'),
      gallery: [unsplash('photo-1615485500704-8e990f9900f7'), unsplash('photo-1599488615731-7e5c2823ff28')],
      origin: 'Unjha, Gujarat, India',
      hsCode: '0909.31',
      packageType: '25kg Multi-wall Paper / PP Bags',
      boxSize: '50kg Master Sacks',
      flavour: 'Pungent, Earthy & Warm Aromatic',
      moq: '1 x 20ft FCL (18 MT)',
      featured: true,
      isActive: true,
    },
    {
      name: 'Salem Bold Turmeric Fingers (High Curcumin)',
      slug: 'salem-bold-turmeric-fingers',
      segment: segMap['spices-and-seasonings']._id,
      subSegment: subSegMap['whole-seed-spices']?._id,
      partner: pSunfield?._id,
      shortDescription: 'High-curcumin (3.8%–5.2%) bold polished turmeric fingers free of Sudan dyes and lead chromate.',
      description: 'Double-polished Salem finger turmeric with vivid golden-yellow internal hue. Steam-sterilized and certified for heavy metals and chemical residue compliance. Exported across Europe, USA, and GCC.',
      image: unsplash('photo-1615485500704-8e990f9900f7'),
      gallery: [unsplash('photo-1596040033229-a9821ebd058d')],
      origin: 'Salem / Nizamabad, India',
      hsCode: '0910.30',
      packageType: '25kg / 50kg Jute & PP Sacks',
      boxSize: '25kg Net Sacks',
      flavour: 'Warm, peppery & intensely golden',
      moq: '1 x 20ft FCL (19 MT)',
      featured: true,
      isActive: true,
    },
    {
      name: 'Red Chilli Teja (S17 Stemless)',
      slug: 'red-chilli-teja-s17-stemless',
      segment: segMap['spices-and-seasonings']._id,
      subSegment: subSegMap['whole-seed-spices']?._id,
      partner: pSunfield?._id,
      shortDescription: 'Hot Teja S17 dried whole red chillies with 75,000–90,000 SHU heat rating and ASTA color 50–60.',
      description: 'Cleaned and stemless Teja red chillies directly procured from Guntur, Andhra Pradesh. Machine graded, aflatoxin tested, and free from Sudan dyes. Available stem-cut or stemless in pressed bales.',
      image: unsplash('photo-1588252303782-cb80119abd6d'),
      gallery: [unsplash('photo-1596040033229-a9821ebd058d')],
      origin: 'Guntur, Andhra Pradesh, India',
      hsCode: '0904.21',
      packageType: '10kg / 25kg Jute Bales & Cartons',
      boxSize: '25kg Compressed Bales',
      flavour: 'Pungent & Fiery Hot',
      moq: '1 x 40ft HC (14 MT)',
      featured: true,
      isActive: true,
    },
    {
      name: 'Pure Ground Turmeric Powder (Sortex Milled)',
      slug: 'pure-ground-turmeric-powder',
      segment: segMap['spices-and-seasonings']._id,
      subSegment: subSegMap['ground-powdered-spices']?._id,
      partner: pSunfield?._id,
      shortDescription: 'Micro-pulverized 80-mesh pure turmeric powder with min 3.5% curcumin and zero artificial color.',
      description: 'Ultra-fine ground turmeric produced in temperature-controlled hammer mills to preserve natural essential oils. Packed in food-grade foil barrier liners for retail distribution and spice blending.',
      image: unsplash('photo-1615485290382-441e4d049cb5'),
      gallery: [unsplash('photo-1615485500704-8e990f9900f7')],
      origin: 'Erode, Tamil Nadu, India',
      hsCode: '0910.30',
      packageType: '1kg Retail Pouches / 25kg Paper Bags',
      boxSize: '20 x 1kg Master Carton',
      flavour: 'Warm, Earthy & Pure',
      moq: '5 MT',
      featured: false,
      isActive: true,
    },
    {
      name: 'Whole Coriander Seeds (Eagle / Scooter Quality)',
      slug: 'whole-coriander-seeds-eagle',
      segment: segMap['spices-and-seasonings']._id,
      subSegment: subSegMap['whole-seed-spices']?._id,
      partner: pSunfield?._id,
      shortDescription: 'Greenish-yellow machine-cleaned coriander seeds with volatile oil > 0.40% and fresh citrus aroma.',
      description: 'Sourced from Kota and Ramganj Mandi in Rajasthan. Double-cleaned and machine-sifted for uniform seed size. Meets strict US ASTA and European moisture criteria.',
      image: unsplash('photo-1596040033283-7d2d0b5e8654'),
      gallery: [],
      origin: 'Kota, Rajasthan, India',
      hsCode: '0909.21',
      packageType: '25kg PP Woven Bags with Liner',
      boxSize: '25kg Bags',
      flavour: 'Citrusy, Floral & Sweet Aromatic',
      moq: '1 x 20ft FCL (11 MT)',
      featured: false,
      isActive: true,
    },

    // ---------------- GRAINS & PULSES ----------------
    {
      name: '1121 Steam Basmati Rice (8.35mm+)',
      slug: '1121-steam-basmati-rice',
      segment: segMap['grains-and-pulses']._id,
      subSegment: subSegMap['basmati-rice-varieties']?._id,
      partner: pGolden?._id,
      shortDescription: 'Extra-long slender grain, rich natural aroma, and 2.5x elongation upon cooking. Aflatoxin tested.',
      description: 'The benchmark of luxury dining. Aged 1121 Steam Basmati rice with average grain length of 8.35mm+. Completely non-sticky when cooked, delicate texture, and exquisite aroma. Packaged in customized multi-layer bags.',
      image: unsplash('photo-1586201375761-83865001e31c'),
      gallery: [unsplash('photo-1596040033229-a9821ebd058d')],
      origin: 'Punjab & Haryana, India',
      hsCode: '1006.30',
      packageType: '10kg / 25kg Non-Woven & BOPP Bags',
      boxSize: '4 x 10kg Master Bales',
      flavour: 'Subtle, Nutty & Naturally Fragrant',
      moq: '1 x 20ft FCL (25 MT)',
      featured: true,
      isActive: true,
    },
    {
      name: '1121 Golden Sella Basmati Rice',
      slug: '1121-golden-sella-basmati-rice',
      segment: segMap['grains-and-pulses']._id,
      subSegment: subSegMap['basmati-rice-varieties']?._id,
      partner: pGolden?._id,
      shortDescription: 'Nutrient-rich parboiled golden grain basmati rice, hard kernel with zero breakage in heavy cooking.',
      description: 'Parboiled in paddy stage to drive nutrients into the endosperm. Gives exceptional volume expansion, firm separation of cooked grains, and golden luster. Ideal for catering, biryanis, and institutional food service.',
      image: unsplash('photo-1536304993881-ff6e9eefa2a6'),
      gallery: [],
      origin: 'Taraori, Haryana, India',
      hsCode: '1006.30',
      packageType: '20kg / 40kg Non-Woven Bags',
      boxSize: '40kg Sacks',
      flavour: 'Rich, Earthy & Wholesome',
      moq: '1 x 20ft FCL (25 MT)',
      featured: false,
      isActive: true,
    },
    {
      name: 'Kabuli Chickpeas (Garbanzo 75/80 Count)',
      slug: 'kabuli-chickpeas-75-80',
      segment: segMap['grains-and-pulses']._id,
      subSegment: subSegMap['pulses-and-lentils']?._id,
      partner: pGolden?._id,
      shortDescription: 'Sortex optical graded large cream-colored Kabuli chickpeas with high protein and low moisture.',
      description: 'Procured from Madhya Pradesh and Maharashtra. Laser sorted for uniform caliber, zero weevil damage, and fast cooking time. Perfect for canning, hummus manufacturing, and retail packaging.',
      image: unsplash('photo-1515543237350-b3eea1ec8082'),
      gallery: [],
      origin: 'Indore, Madhya Pradesh, India',
      hsCode: '0713.20',
      packageType: '25kg / 50kg Multi-wall PP Bags',
      boxSize: '50kg Master Bags',
      flavour: 'Nutty, Creamy & Mild',
      moq: '1 x 20ft FCL (24 MT)',
      featured: true,
      isActive: true,
    },
    {
      name: 'Organic Toor Dal (Oily & Non-Oily Arhar)',
      slug: 'organic-toor-dal-arhar',
      segment: segMap['grains-and-pulses']._id,
      subSegment: subSegMap['pulses-and-lentils']?._id,
      partner: pGolden?._id,
      shortDescription: 'Split pigeon peas with unpolished natural texture, high dietary fiber and zero synthetic polish.',
      description: 'Dehusked split yellow pigeon peas milled without artificial water or chemical polish. Certified food safety compliant with pesticide residue analysis reports for European imports.',
      image: unsplash('photo-1546069901-ba9599a7e63c'),
      gallery: [],
      origin: 'Gulbarga, Karnataka, India',
      hsCode: '0713.60',
      packageType: '25kg Multi-wall Paper Bags',
      boxSize: '25kg Bags',
      flavour: 'Earthy, Sweet & Hearty',
      moq: '1 x 20ft FCL (22 MT)',
      featured: false,
      isActive: true,
    },

    // ---------------- DEHYDRATED FOODS ----------------
    {
      name: 'Dehydrated White Onion Flakes / Kibbled',
      slug: 'dehydrated-white-onion-flakes',
      segment: segMap['dehydrated-foods']._id,
      subSegment: subSegMap['dehydrated-white-onion']?._id,
      partner: pMahuva?._id,
      shortDescription: 'Crisp, pungent dehydrated onion kibbled with moisture < 5.5%. Microbial assay for zero Salmonella.',
      description: 'Manufactured from selected high-solid white onions in Mahuva, Gujarat. Washed, sliced, and hot-air dehydrated in stainless steel conveyor dryers. Retains sharp pungent aroma upon rehydration.',
      image: unsplash('photo-1580201092675-a0a6a6cafbb1'),
      gallery: [unsplash('photo-1596040033229-a9821ebd058d')],
      origin: 'Mahuva, Gujarat, India',
      hsCode: '0712.20',
      packageType: '14kg Carton with Heavy Poly Liner',
      boxSize: '14kg Cartons',
      flavour: 'Sharp, Pungent & Concentrated Onion',
      moq: '1 x 20ft FCL (7.5 MT)',
      featured: true,
      isActive: true,
    },
    {
      name: 'Dehydrated White Onion Powder (100 Mesh)',
      slug: 'dehydrated-white-onion-powder',
      segment: segMap['dehydrated-foods']._id,
      subSegment: subSegMap['dehydrated-white-onion']?._id,
      partner: pMahuva?._id,
      shortDescription: 'Ultra-fine free-flowing white onion powder for soup mixes, seasonings, sauces, and meat rubs.',
      description: 'Pulverized from dehydrated onion kibbled and passed through powerful neodymium magnetic traps. Packed with food-grade desiccant to prevent caking during maritime transport.',
      image: unsplash('photo-1615485290382-441e4d049cb5'),
      gallery: [],
      origin: 'Mahuva, Gujarat, India',
      hsCode: '0712.20',
      packageType: '20kg Cartons with Aluminum Foil Liner',
      boxSize: '20kg Cartons',
      flavour: 'Pungent & Savory',
      moq: '5 MT',
      featured: false,
      isActive: true,
    },
    {
      name: 'Dehydrated Garlic Flakes & Cloves',
      slug: 'dehydrated-garlic-flakes-cloves',
      segment: segMap['dehydrated-foods']._id,
      subSegment: subSegMap['dehydrated-garlic-products']?._id,
      partner: pMahuva?._id,
      shortDescription: 'Clean peeled dehydrated garlic cloves and chopped flakes with high allicin content and strong aroma.',
      description: 'Processed from pungent Indian garlic bulbs grown in Madhya Pradesh and Gujarat. Zero added preservatives, sulfur-dioxide compliant, and microbial certified for US FDA and EU entry.',
      image: unsplash('photo-1540148426945-6cf22a6b2383'),
      gallery: [],
      origin: 'Mandsaur / Mahuva, India',
      hsCode: '0712.90',
      packageType: '20kg Multi-wall Paper Bags with Poly Liner',
      boxSize: '20kg Sacks',
      flavour: 'Zesty, Warm & Intensely Pungent',
      moq: '1 x 20ft FCL (12 MT)',
      featured: true,
      isActive: true,
    },

    // ---------------- DRIED FRUITS & NUTS ----------------
    {
      name: 'Hulled White Sesame Seeds (99.98% Purity)',
      slug: 'hulled-white-sesame-seeds',
      segment: segMap['dried-fruits-and-nuts']._id,
      partner: pSesame?._id,
      shortDescription: 'Mechanically hulled white sesame seeds with min 51% oil content, Sortex laser sorted.',
      description: 'Processed using cold mechanical dry and wet hulling without chemical bleaching. Premium pearly white appearance, high oil yield, and sweet nutty crunch for bakeries, tahini makers, and confectionery.',
      image: unsplash('photo-1563412885-139e4045ec52'),
      gallery: [],
      origin: 'Saurashtra, Gujarat, India',
      hsCode: '1207.40',
      packageType: '25kg 3-Ply Paper Bags / 50lbs Bags',
      boxSize: '25kg Bags',
      flavour: 'Nutty, Mildly Sweet & Rich',
      moq: '1 x 20ft FCL (19 MT)',
      featured: true,
      isActive: true,
    },
    {
      name: 'Whole White Cashew Kernels (W240 / W320)',
      slug: 'whole-white-cashew-kernels',
      segment: segMap['dried-fruits-and-nuts']._id,
      partner: pSunfield?._id,
      shortDescription: 'First-quality export grade whole white cashew nuts, vacuum nitrogen packed to preserve freshness.',
      description: 'Peeled and graded into international sizes (W240 jumbo, W320 standard). Crisp texture, sweet creamy taste, and zero foreign matter. Vacuum-packed in 50lbs tins or flexible multi-layer pouches.',
      image: unsplash('photo-1508747703725-719777637510'),
      gallery: [],
      origin: 'Kollam, Kerala & Goa, India',
      hsCode: '0801.32',
      packageType: '2 x 25lbs Vacuum Tins in Master Carton',
      boxSize: '50lbs Master Carton',
      flavour: 'Buttery, Rich & Sweet',
      moq: '1 x 20ft FCL (16 MT)',
      featured: true,
      isActive: true,
    },

    // ---------------- TEA & COFFEE ----------------
    {
      name: 'Single Estate Orthodox Black Tea (TGFOP)',
      slug: 'single-estate-orthodox-black-tea',
      segment: segMap['tea-and-coffee']._id,
      partner: pHighland?._id,
      shortDescription: 'Tippy Golden Flowery Orange Pekoe from high-elevation Assam gardens with rich malt body.',
      description: 'Harvested during peak second flush season. Contains delicate golden tips producing a deep amber liquor, full-bodied malty flavor, and refreshing aroma. Exported to gourmet blenders across Europe and the UK.',
      image: unsplash('photo-1597481499750-3e6b22637e12'),
      gallery: [],
      origin: 'Upper Assam, India',
      hsCode: '0902.30',
      packageType: '40kg Aluminum-lined Multiwall Paper Sacks',
      boxSize: '40kg Master Sacks',
      flavour: 'Malty, Robust & Honeyed Amber',
      moq: '2 MT',
      featured: true,
      isActive: true,
    },
    {
      name: 'Plantation AA Washed Arabica Coffee Beans',
      slug: 'plantation-aa-washed-arabica',
      segment: segMap['tea-and-coffee']._id,
      partner: pHighland?._id,
      shortDescription: 'Shade-grown Mysore Arabica coffee beans with bright acidity, citrus notes, and clean finish.',
      description: 'Cultivated under the rainforest canopy of the Western Ghats at 1,200m elevation. Wet-processed and sun-dried on brick patios. Screen 19 sorted for supreme uniformity for specialty roasters worldwide.',
      image: unsplash('photo-1587049352846-4a222e784d38'),
      gallery: [],
      origin: 'Chikmagalur, Karnataka, India',
      hsCode: '0901.11',
      packageType: '60kg Jute Bags with GrainPro Hermetic Liner',
      boxSize: '60kg GrainPro Sacks',
      flavour: 'Citrus, Caramel & Dark Chocolate Finish',
      moq: '1 x 20ft FCL (18 MT)',
      featured: false,
      isActive: true,
    },

    // ---------------- BISCUIT & BAKERY (NOW FULLY POPULATED) ----------------
    {
      name: 'Export Cumin Jeera Biscuits (Crispy Crackers)',
      slug: 'export-cumin-jeera-biscuits',
      segment: segMap['biscuit-and-bakery']._id,
      subSegment: subSegMap['export-cookies-and-biscuits']?._id,
      partner: pBakery?._id,
      shortDescription: 'Crisp savory tea biscuits baked with whole roasted cumin seeds and farm butter. 12-month export shelf life.',
      description: 'Manufactured on high-capacity automated continuous tunnel ovens. Formulated with zero trans-fats and nitrogen-flushed packaging to withstand long ocean journeys. High-repeat consumer favorite in diaspora markets.',
      image: unsplash('photo-1558961363-fa8fdf82db35'),
      gallery: [unsplash('photo-1596040033229-a9821ebd058d')],
      origin: 'Ahmedabad, Gujarat, India',
      hsCode: '1905.31',
      packageType: '200g Retail Trays / 48 Packs per Master Carton',
      boxSize: '48 x 200g Master Carton',
      flavour: 'Savory, Buttery with Roasted Cumin Crunch',
      moq: '1 x 20ft FCL (1,400 Cartons)',
      featured: true,
      isActive: true,
    },
    {
      name: 'Double-Baked Cardamom Wheat Rusk (Toast)',
      slug: 'double-baked-cardamom-wheat-rusk',
      segment: segMap['biscuit-and-bakery']._id,
      subSegment: subSegMap['wheat-toast-rusk']?._id,
      partner: pBakery?._id,
      shortDescription: 'Extra crunchy twice-baked whole wheat toast infused with green cardamom and natural vanilla.',
      description: 'Traditional Indian tea accompaniment. Baked to golden perfection, slicing and re-toasted to reduce moisture below 3.0% for prolonged shelf stability without chemical preservatives.',
      image: unsplash('photo-1509440159596-0249088772ff'),
      gallery: [],
      origin: 'Rajkot, Gujarat, India',
      hsCode: '1905.40',
      packageType: '300g Standup Pouch / 24 Packs Master Case',
      boxSize: '24 x 300g Cases',
      flavour: 'Cardamom Infused, Crisp & Lightly Sweet',
      moq: '1 x 40ft HC (2,200 Cases)',
      featured: false,
      isActive: true,
    },

    // ---------------- FROZEN FOODS (NOW FULLY POPULATED) ----------------
    {
      name: 'IQF Punjabi Vegetable Samosa (Cocktail Size)',
      slug: 'iqf-punjabi-vegetable-samosa',
      segment: segMap['frozen-foods']._id,
      subSegment: subSegMap['frozen-appetizers-and-samosas']?._id,
      partner: pFrozen?._id,
      shortDescription: 'Crisp pastry triangles stuffed with spiced potatoes, green peas, and whole coriander seeds. Blast frozen at -35°C.',
      description: 'Manufactured in an automated temperature-controlled cleanroom. Individually Quick Frozen (IQF) to lock in moisture and flavor without clumping. Fry or air-bake directly from frozen in 4–5 minutes.',
      image: unsplash('photo-1601050690117-94f5f6fa8bd7'),
      gallery: [unsplash('photo-1599488615731-7e5c2823ff28')],
      origin: 'Pune, Maharashtra, India',
      hsCode: '1902.20',
      packageType: '1kg Poly Bag (approx 40 pcs) / 10 Bags Master Case',
      boxSize: '10 x 1kg Master Carton',
      flavour: 'Crispy Pastry, Spiced Potato & Cumin',
      moq: '1 x 40ft Reefer Container (22 MT)',
      featured: true,
      isActive: true,
    },
    {
      name: 'Flaky Multi-Layered Malabar Paratha',
      slug: 'flaky-malabar-paratha',
      segment: segMap['frozen-foods']._id,
      subSegment: subSegMap['frozen-parathas-and-breads']?._id,
      partner: pFrozen?._id,
      shortDescription: 'Hand-rolled, authentic spiral layered Kerala flatbread. Pre-cooked and flash frozen for global supermarkets.',
      description: 'Traditional layered Indian flatbread made with high-protein wheat flour and vegetable shortening. Heat on tawa or skillet for 2 minutes for golden, crispy layers. 18-month freezer shelf life.',
      image: unsplash('photo-1626074353765-517a681e40be'),
      gallery: [],
      origin: 'Cochin, Kerala, India',
      hsCode: '1905.90',
      packageType: '400g Pack (5 pcs) / 20 Packs per Carton',
      boxSize: '20 x 400g Cartons',
      flavour: 'Flaky, Buttery & Soft Center',
      moq: '1 x 20ft Reefer (10 MT)',
      featured: false,
      isActive: true,
    },

    // ---------------- SNACKS & FARALI ----------------
    {
      name: 'Vacuum-Packed Methi Khakhra (Roasted Wheat Crisps)',
      slug: 'methi-khakhra-roasted-wheat-crisps',
      segment: segMap['snacks']._id,
      subSegment: subSegMap['roasted-spiced-khakhra']?._id,
      partner: pBakery?._id,
      shortDescription: '100% roasted wafer-thin whole wheat crisps seasoned with fenugreek leaves (methi) and mild spices.',
      description: 'Guilt-free healthy Indian snack prepared with zero frying. Hand-roasted on iron griddles and vacuum packed with inert gas barrier. Approved for international supermarket distribution.',
      image: unsplash('photo-1599488615731-7e5c2823ff28'),
      gallery: [],
      origin: 'Surat, Gujarat, India',
      hsCode: '1905.90',
      packageType: '200g Vacuum Pouch / 30 Pouches Master Carton',
      boxSize: '30 x 200g Cartons',
      flavour: 'Nutty, Herby Methi & Crispy',
      moq: '500 Cartons',
      featured: true,
      isActive: true,
    },
    {
      name: 'Farali Roasted Sabudana & Peanut Mixture (Upwas)',
      slug: 'farali-roasted-sabudana-mixture',
      segment: segMap['farali-snacks']._id,
      subSegment: subSegMap['fasting-vrat-namkeen']?._id,
      partner: pBakery?._id,
      shortDescription: 'Crunchy fasting mix made with roasted sago pearls, peanuts, rock salt (Sendha Namak), and mild green chilli.',
      description: 'Manufactured strictly in a dedicated vegetarian, gluten-free facility adhering to traditional Indian fasting food codes. Lightly salted with Himalayan rock salt and seasoned with curry leaves.',
      image: unsplash('photo-1601050690597-df0568f70950'),
      gallery: [],
      origin: 'Rajkot, Gujarat, India',
      hsCode: '2008.19',
      packageType: '250g Nitrogen Flush Standup Pouch',
      boxSize: '40 x 250g Master Carton',
      flavour: 'Crunchy, Mildly Savory & Sweet Nutty',
      moq: '400 Cartons',
      featured: true,
      isActive: true,
    },

    // ---------------- BEVERAGES ----------------
    {
      name: 'Aseptic Alphonso Mango Pulp (Brix 16° min)',
      slug: 'aseptic-alphonso-mango-pulp',
      segment: segMap['beverages']._id,
      subSegment: subSegMap['aseptic-mango-pulps']?._id,
      partner: pSunfield?._id,
      shortDescription: '100% pure Ratnagiri Alphonso mango puree processed under sterile aseptic steam conditions. No added sugar.',
      description: 'Extracted from naturally ripened GI-tagged Ratnagiri Alphonso mangoes. De-aerated, sterilized, and filled into multi-barrier aseptic bags inside steel drums. Used by top ice cream, juice, and yogurt brands globally.',
      image: unsplash('photo-1534353473418-4cfa6c56fd38'),
      gallery: [],
      origin: 'Ratnagiri, Maharashtra, India',
      hsCode: '2007.99',
      packageType: '215kg Aseptic Bag in Steel Drums',
      boxSize: '4 Drums on Pallet (860kg net)',
      flavour: 'Intensely Sweet, Tropical & Floral Aromatic',
      moq: '1 x 20ft FCL (80 Drums ≈ 17.2 MT)',
      featured: true,
      isActive: true,
    },
  ];

  for (const prodData of productList) {
    let p = await Product.findOne({
      $or: [{ slug: prodData.slug }, { name: prodData.name }],
    });
    if (!p) {
      p = await Product.create(prodData);
      console.log(`✓ Created Product: ${p.name} [${prodData.origin}]`);
    } else {
      Object.assign(p, prodData);
      await p.save();
      console.log(`• Updated Product: ${p.name}`);
    }
  }

  // =========================================================================
  // 6. BLOG & EXPORT MARKET INTELLIGENCE ARTICLES
  // =========================================================================
  console.log('--- 6. Ensuring Comprehensive Export News & Articles ---');
  const newsArticles = [
    {
      title: "India's Agricultural Export Boom: Navigating 2026 Mandi Arrivals and Global Port Logistics",
      slug: 'indias-agricultural-export-boom-2026',
      excerpt: 'Comprehensive analysis of Saurashtra cumin harvest, Erode turmeric volumes, and modern container stuffing protocols from Mundra Port (INMUN1).',
      content: `India continues its ascendancy as the preferred global pantry for premium agro commodities, spices, and processed food products. With the opening of the 2026 harvest season across Western and Northern agricultural clusters, global buyers are witnessing record arrivals of Sortex-graded cumin seeds in Unjha, robust Basmati paddy arrivals in Haryana, and increased processing capacities in Gujarat's dehydrated vegetable corridor.

Key factors driving international importer confidence include stringent pre-shipment lab assays, zero-delay customs clearance at Mundra Port and Nhava Sheva (JNPT), and end-to-end batch traceability from farm cluster to ocean container.

NMC's dedicated international desk coordinates container stuffing, multi-commodity consolidation, and phytosanitary verification, enabling overseas distributors to optimize inventory turnaround and reduce transit risk.`,
      image: unsplash('photo-1596040033229-a9821ebd058d'),
      images: [
        unsplash('photo-1586201375761-83865001e31c'),
        unsplash('photo-1615485500704-8e990f9900f7'),
        unsplash('photo-1580201092675-a0a6a6cafbb1'),
      ],
      sections: [
        {
          subtitle: '1. Unjha Mandi: Record Cumin & Fennel Influx',
          text: 'Unjha agricultural market in Gujarat has recorded heavy daily arrivals of European-grade cumin with volatile oil content exceeding 3.2%. Optical laser sorting facilities are operating at 24/7 capacity to meet Spring booking orders from Europe and North America.',
          image: unsplash('photo-1596040033283-7d2d0b5e8654'),
          order: 1,
        },
        {
          subtitle: '2. European Union MRL & Pesticide Compliance',
          text: 'New regulatory thresholds enforced by the European Food Safety Authority (EFSA) require pre-export testing for over 500 chemical residues. Consignments processed through NMC partner mills are verified via Eurofins and SGS accredited laboratory assays prior to ocean sailing.',
          image: unsplash('photo-1615485290382-441e4d049cb5'),
          order: 2,
        },
        {
          subtitle: '3. Direct Ocean Freight Corridors to GCC & Europe',
          text: 'Express feeder connections operating out of Mundra Port reach Jebel Ali in 4 to 6 days and major European hubs (Rotterdam, Hamburg, Antwerp) within 20 to 24 days, minimizing moisture build-up inside ocean containers.',
          image: unsplash('photo-1540148426945-6cf22a6b2383'),
          order: 3,
        },
      ],
      publishedAt: new Date(Date.now() - 3 * 86400000),
      order: 1,
      isActive: true,
      featured: true,
    },
    {
      title: 'Basmati Rice Global Demand: 1121 Steam & Sella Trends in GCC & European Markets',
      slug: 'basmati-rice-global-demand-1121-steam-sella',
      excerpt: 'How age-matured 1121 Basmati rice with average grain length exceeding 8.35mm is dominating institutional catering and retail supermarket shelves worldwide.',
      content: `Indian Basmati rice remains an irreplaceable pillar of international cuisine. In particular, the 1121 variety—celebrated for its dramatic 2.5x longitudinal elongation upon boiling and aromatic fragrance—accounts for over 70% of total Basmati exports to Saudi Arabia, UAE, UK, and the Americas.

This season's harvest in the fertile Indo-Gangetic plains of Punjab and Haryana has delivered pristine grain clarity with exceptional head rice recovery. State-of-the-art parboiling plants and optical color sorters ensure that damaged, chalky, or discolored grains are eliminated prior to packaging.`,
      image: unsplash('photo-1586201375761-83865001e31c'),
      images: [
        unsplash('photo-1536304993881-ff6e9eefa2a6'),
        unsplash('photo-1515543237350-b3eea1ec8082'),
      ],
      sections: [
        {
          subtitle: 'Parboiled vs. Steam Basmati: Buyer Preferences',
          text: 'While Middle Eastern commercial kitchens prefer Golden Sella for its robust kernel strength in large-scale biryani preparation, European supermarket buyers prioritize Steam Basmati for its snowy white appearance and delicate culinary mouthfeel.',
          image: unsplash('photo-1536304993881-ff6e9eefa2a6'),
          order: 1,
        },
        {
          subtitle: 'Aflatoxin & DNA Purity Guarantees',
          text: 'Each export container is tested for genetic authenticity (minimum 95% Basmati purity) alongside strict screening for tricyclazole and pesticide residues to guarantee zero customs delays at destination ports.',
          image: unsplash('photo-1586201375761-83865001e31c'),
          order: 2,
        },
      ],
      publishedAt: new Date(Date.now() - 7 * 86400000),
      order: 2,
      isActive: true,
      featured: true,
    },
    {
      title: 'Dehydrated White Onion & Garlic: Gujarat Hubs Fulfilling Global Food Processing Contracts',
      slug: 'dehydrated-onion-garlic-gujarat-hubs',
      excerpt: 'Mahuva processing plants expand high-barrier aseptic packaging to supply industrial soup manufacturers, spice blenders, and ready-meal producers.',
      content: `The Saurashtra region of Gujarat, centered around Mahuva and Bhavnagar, has cemented its position as the world second-largest producer and premier exporter of dehydrated white and red onions. Supported by dedicated white onion cultivation featuring high dry matter content, local processing plants employ multi-stage washing, optical color sorting, and metal detection.

Global food manufacturers in Germany, France, Japan, and the United States rely heavily on Indian dehydrated onion kibbled, chopped, minced, and powders for their consistency, intense natural aroma, and microbial safety.`,
      image: unsplash('photo-1580201092675-a0a6a6cafbb1'),
      images: [
        unsplash('photo-1540148426945-6cf22a6b2383'),
        unsplash('photo-1615485290382-441e4d049cb5'),
      ],
      sections: [
        {
          subtitle: 'Stringent Microbial Standards (Low Salmonella & E. Coli)',
          text: 'Modern dehydration tunnels maintain strict temperature and humidity parameters to achieve total plate counts below international food safety thresholds, backed by independent Eurofins certificates of analysis.',
          image: unsplash('photo-1580201092675-a0a6a6cafbb1'),
          order: 1,
        },
      ],
      publishedAt: new Date(Date.now() - 12 * 86400000),
      order: 3,
      isActive: true,
      featured: false,
    },
    {
      title: 'Container Consolidation Solutions: Maximizing Ocean Freight ROI for Importers',
      slug: 'container-consolidation-solutions-mundra-port',
      excerpt: 'How NMC multi-product FCL stuffing enables international distributors to import spices, rice, and snacks in a single shipping container.',
      content: `For specialty retailers, ethnic grocery chains, and regional food distributors overseas, purchasing full 20-foot or 40-foot containers of a single commodity can tie up significant working capital. To address this challenge, Nirmala Multi Trading Co. offers specialized multi-commodity consolidation at Mundra Port warehouse hubs.

Importers can combine Sortex cumin seeds, aged Basmati rice, dehydrated onions, and packaged snacks into a single consolidated ocean container under one bill of lading and simplified phytosanitary documentation.`,
      image: unsplash('photo-1540148426945-6cf22a6b2383'),
      images: [],
      sections: [],
      publishedAt: new Date(Date.now() - 18 * 86400000),
      order: 4,
      isActive: true,
      featured: false,
    },
  ];

  for (const nData of newsArticles) {
    let art = await News.findOne({
      $or: [{ slug: nData.slug }, { title: nData.title }],
    });
    if (!art) {
      art = await News.create(nData);
      console.log(`✓ Created News Article: ${art.title}`);
    } else {
      Object.assign(art, nData);
      await art.save();
      console.log(`• Updated News Article: ${art.title}`);
    }
  }

  // =========================================================================
  // 7. BROCHURES & SPECIFICATION SHEETS
  // =========================================================================
  console.log('--- 7. Ensuring Official Export Catalogues & Brochures ---');
  const brochureDefs = [
    {
      title: 'NMC Corporate Profile & Global Export Capabilities (2026)',
      description: 'Comprehensive overview of sourcing infrastructure, port-direct logistics, certifications, and international shipping corridors.',
      file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      segment: segMap['spices-and-seasonings']._id,
    },
    {
      title: 'Sortex Spices & Seasonings Technical Specification Sheet',
      description: 'Lab test parameters, volatile oil benchmarks, pesticide MRL compliance, and packaging standards for Indian whole and ground spices.',
      file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      segment: segMap['spices-and-seasonings']._id,
    },
    {
      title: 'Aged 1121 & 1509 Indian Basmati Rice Export Guide',
      description: 'Grain elongation specifications, cooking yield charts, moisture limits, and container loading diagrams for Basmati and Non-Basmati rice.',
      file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      segment: segMap['grains-and-pulses']._id,
    },
    {
      title: 'Dehydrated White Onion & Garlic Product Specifications',
      description: 'Cut sizes, moisture content, microbiological assays, and multi-layer carton packing configurations from Mahuva, Gujarat.',
      file: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      segment: segMap['dehydrated-foods']._id,
    },
  ];

  for (const bDef of brochureDefs) {
    const existing = await Brochure.findOne({ title: bDef.title });
    if (!existing) {
      await Brochure.create(bDef);
      console.log(`✓ Created Brochure: ${bDef.title}`);
    }
  }

  // =========================================================================
  // 8. REPRESENTATIVE EXPORT INQUIRIES
  // =========================================================================
  console.log('--- 8. Ensuring Representative Export Inquiries ---');
  const inquiryDefs = [
    {
      name: 'Henk van der Meer',
      email: 'henk.vandermeer@eurofoods.nl',
      phone: '+31 10 456 7890',
      company: 'EuroFoods Importers B.V.',
      country: 'Netherlands',
      productInterest: 'Sortex-Cleaned Cumin Seeds & High Curcumin Turmeric',
      interestType: 'product',
      message: 'Looking for 2 x 20ft FCL Sortex cumin seeds (99.5% purity) and 1 FCL Salem turmeric fingers under CIF Rotterdam terms. Please share current spot proforma quotation, pesticide MRL certificate, and shipment sailing dates from Mundra.',
      status: 'new',
    },
    {
      name: 'Tariq Al-Mansoor',
      email: 'tariq.mansoor@almadinatrading.ae',
      phone: '+971 4 234 5678',
      company: 'Al-Madina General Trading LLC',
      country: 'United Arab Emirates',
      productInterest: '1121 Steam Basmati Rice (8.35mm+)',
      interestType: 'product',
      message: 'We require monthly scheduled deliveries of 500 MT aged 1121 Steam Basmati Rice in customized 20kg non-woven buyer-branded bags under CIF Jebel Ali terms. Please arrange DHL sample courier to our Dubai trade office.',
      status: 'read',
    },
    {
      name: 'Marcus Sterling',
      email: 'm.sterling@pacific-commodities.com',
      phone: '+1 310 555 0192',
      company: 'Pacific Coast Commodities Inc.',
      country: 'United States',
      productInterest: 'Dehydrated White Onion Flakes & Powder',
      interestType: 'segment',
      message: 'Urgent requirement for 2 x 40ft HC containers of Mahuva dehydrated white onion flakes and 100-mesh powder for our food processing facilities in California. CIF Long Beach port.',
      status: 'responded',
    },
  ];

  for (const inq of inquiryDefs) {
    const existing = await Inquiry.findOne({ email: inq.email });
    if (!existing) {
      await Inquiry.create(inq);
      console.log(`✓ Created Export Inquiry from: ${inq.company} (${inq.country})`);
    }
  }

  // =========================================================================
  // 9. NEWSLETTER SUBSCRIBERS
  // =========================================================================
  console.log('--- 9. Ensuring International Trade Newsletter Subscribers ---');
  const subscriberEmails = [
    { email: 'procurement@gulfagrifoods.ae', source: 'footer' },
    { email: 'imports@nordicorganic.no', source: 'new_arrivals_modal' },
    { email: 'trade@londonspiceexchange.co.uk', source: 'footer' },
    { email: 'buying@globalagrotraders.com', source: 'inquiry_form' },
    { email: 'supplychain@singaporefoodhub.sg', source: 'footer' },
    { email: 'commodities@hamburgspice.de', source: 'products_page' },
  ];

  for (const s of subscriberEmails) {
    const existing = await Subscriber.findOne({ email: s.email });
    if (!existing) {
      await Subscriber.create({
        email: s.email,
        source: s.source,
        status: 'active',
        subscribedAt: new Date(),
      });
      console.log(`✓ Created Subscriber: ${s.email}`);
    }
  }

  // =========================================================================
  // 10. PARTNER REGISTRATIONS (SUPPLIER APPLICATIONS)
  // =========================================================================
  console.log('--- 10. Ensuring Supplier Partner Applications ---');
  const partnerRegDefs = [
    {
      companyName: 'Gir Organic Farmers Producer Co.',
      contactPerson: 'Ramesh Patel',
      email: 'ramesh.patel@girorganic.in',
      phone: '+91 98250 12345',
      country: 'India',
      city: 'Junagadh, Gujarat',
      website: 'https://girorganic.example.com',
      businessType: 'Farmer Producer Organization (FPO)',
      categories: ['Spices & Seasonings', 'Grains & Pulses'],
      annualCapacity: '2,500 Metric Tons',
      certifications: 'APEDA Organic, FSSAI',
      message: 'We are a consortium of 350 organic farmers in Junagadh cultivating certified organic cumin, coriander, and sesame seeds seeking international market linkage through NMC.',
      status: 'pending',
    },
    {
      companyName: 'Kaveri Modern Rice Mills',
      contactPerson: 'Senthil Nathan',
      email: 'senthil@kaveririce.in',
      phone: '+91 94432 98765',
      country: 'India',
      city: 'Thanjavur, Tamil Nadu',
      website: 'https://kaveririce.example.com',
      businessType: 'Manufacturer / Processor',
      categories: ['Grains & Pulses'],
      annualCapacity: '15,000 Metric Tons',
      certifications: 'FSSAI, ISO 22000, GMP',
      message: 'Modern parboiled and steam rice mill with Satake optical sorters interested in container export tie-ups for Ponni and Sona Masoori varieties.',
      status: 'reviewed',
    },
  ];

  for (const preg of partnerRegDefs) {
    const existing = await PartnerRegistration.findOne({ email: preg.email });
    if (!existing) {
      await PartnerRegistration.create(preg);
      console.log(`✓ Created Partner Registration: ${preg.companyName}`);
    }
  }

  // =========================================================================
  // 11. SYNCHRONIZE SITECONTENT (CMS DEFAULTS + PRODUCTS PAGE CMS)
  // =========================================================================
  console.log('--- 11. Synchronizing Dynamic SiteContent CMS in MongoDB ---');
  let siteContentDoc = await SiteContent.findOne({ key: 'main' });
  if (!siteContentDoc) {
    siteContentDoc = await SiteContent.findOne();
  }

  const completeNewArrivals = [
    {
      name: 'Sortex-Cleaned Cumin Seeds (Jeera)',
      slug: 'sortex-cumin-seeds-jeera',
      categoryName: 'Spices & Seasonings',
      origin: 'Unjha, Gujarat',
      image: unsplash('photo-1596040033229-a9821ebd058d'),
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
      image: unsplash('photo-1586201375761-83865001e31c'),
      shortDescription: 'Extra-long slender grain, rich aroma, and 2.5x elongation upon cooking. Aflatoxin tested.',
      hsCode: '100630',
      packageType: '10kg / 25kg Non-Woven',
      moq: '1 x 20ft FCL',
      order: 2,
      isActive: true,
    },
    {
      name: 'High Curcumin Turmeric Fingers',
      slug: 'salem-bold-turmeric-fingers',
      categoryName: 'Spices & Seasonings',
      origin: 'Salem / Nizamabad',
      image: unsplash('photo-1615485500704-8e990f9900f7'),
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
      image: unsplash('photo-1580201092675-a0a6a6cafbb1'),
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
      image: unsplash('photo-1563412885-139e4045ec52'),
      shortDescription: 'Mechanically hulled white sesame seeds with min 51% oil content, Sortex laser sorted.',
      hsCode: '120740',
      packageType: '25kg 3-Ply Paper Bags',
      moq: '1 x 20ft FCL',
      order: 5,
      isActive: true,
    },
  ];

  const completeProductsPage = {
    isActive: true,
    hero: {
      badge: 'Global Agro-Food Catalogue',
      eyebrow: 'CERTIFIED INDIAN EXPORTS',
      title: 'All Export Food Products',
      subtitle: '100% Sortex-cleaned Indian spices, premium grains, pulses, and value-added food products ready for containerized ocean shipping.',
    },
    showcase: {
      defaultMode: 'wheel',
      title: 'Featured Export Products',
      subtitle: 'Discover our certified Sortex-cleaned harvest lots and premium packaged Indian food products ready for global ocean freight.',
      watermark: 'FOOD PRODUCTS',
      autoRotateSeconds: 3.5,
      showcaseBadge: 'FEATURED FOOD SHOWCASE',
    },
    bento: {
      badge: 'DIRECT SOURCING GUARANTEE',
      headline: 'Global Food Products, Perfected',
      subtitle: 'Direct sourcing of export-grade Indian spices, premium grains, and food products with certified global shipping.',
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
      title: 'Why Global Buyers Trust Nirmala Multi Trading Co.',
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
      description: 'Our international trade desk prepares formal FOB (Mundra/JNPT) or CIF proforma invoices within 12–24 business hours. Courier sample kits dispatched worldwide.',
      buttonPrimaryText: 'Request Official Quotation →',
      buttonPrimaryLink: '/inquiry',
      buttonSecondaryText: 'Download Product Brochures',
      buttonSecondaryLink: '/brochures',
    },
  };

  if (!siteContentDoc) {
    siteContentDoc = await SiteContent.create({
      key: 'main',
      newArrivals: {
        isActive: true,
        badge: 'Live Market Arrivals',
        eyebrow: 'Fresh Crop Season 2026',
        title: 'New product arrivals',
        description: 'Directly sourced from verified Indian farm clusters and modern Sortex milling hubs.',
        autoRotateSeconds: 4,
        items: completeNewArrivals,
      },
      productsPage: completeProductsPage,
    });
    console.log('✓ Created SiteContent master document in MongoDB');
  } else {
    siteContentDoc.newArrivals = {
      isActive: true,
      badge: 'Live Market Arrivals',
      eyebrow: 'Fresh Crop Season 2026',
      title: 'New product arrivals',
      description: 'Directly sourced from verified Indian farm clusters and modern Sortex milling hubs.',
      autoRotateSeconds: 4,
      items: completeNewArrivals,
    };
    siteContentDoc.productsPage = completeProductsPage;
    await siteContentDoc.save();
    console.log('✓ Updated SiteContent with latest New Arrivals and Products Page CMS in MongoDB');
  }

  console.log('\n======================================================');
  console.log('🎉 ALL DATA SUCCESSFULLY POPULATED IN MONGODB!');
  console.log('======================================================\n');
  process.exit(0);
}

enrichAllData().catch((err) => {
  console.error('Data enrichment error:', err);
  process.exit(1);
});
