import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Segment from '../models/Segment.js';
import Partner from '../models/Partner.js';
import Product from '../models/Product.js';
import Brochure from '../models/Brochure.js';
import News from '../models/News.js';

dotenv.config();

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=75`;

async function populate() {
  await connectDB();
  console.log('Connected to MongoDB. Synchronizing dynamic database data for MongoDB Compass...');

  // 1. Ensure Admin User with both nmc.com and harvestbridge.com emails
  const existingNmcAdmin = await User.findOne({ email: 'admin@nmc.com' });
  if (!existingNmcAdmin) {
    await User.create({
      name: 'NMC Super Admin',
      email: 'admin@nmc.com',
      password: process.env.ADMIN_PASSWORD || 'admin12345',
      role: 'admin',
    });
    console.log('✓ Created admin@nmc.com (Password: admin12345)');
  }

  // 2. Fetch existing Segments
  const spicesSeg = await Segment.findOne({ name: /spices/i });
  const grainsSeg = await Segment.findOne({ name: /grains/i });
  const teaSeg = await Segment.findOne({ name: /tea/i });
  const nutsSeg = await Segment.findOne({ name: /dried fruits|nuts/i });
  const snacksSeg = await Segment.findOne({ name: /snacks/i });
  const frozenSeg = await Segment.findOne({ name: /frozen/i });
  const bakerySeg = await Segment.findOne({ name: /biscuit|bakery/i });
  const beverageSeg = await Segment.findOne({ name: /beverage/i });

  // 3. Fetch existing Partners
  const sunfield = await Partner.findOne({ name: /sunfield/i }) || (await Partner.findOne({}));
  const goldenValley = await Partner.findOne({ name: /golden valley/i }) || sunfield;
  const highland = await Partner.findOne({ name: /highland/i }) || sunfield;

  // 4. Products to populate
  const exportProducts = [
    {
      name: 'Whole Cumin Seeds (Jeera)',
      segment: spicesSeg?._id,
      partner: sunfield?._id,
      shortDescription: 'Sortex-cleaned 99.5% purity cumin seeds with rich essential oil content.',
      description: 'Single-origin Gujarat cumin seeds machine-cleaned and Sortex-graded to 99.5% purity. Low moisture, free from aflatoxins and pesticide residues conforming to European and US standards.',
      image: img('photo-1596040033229-a9821ebd058d'),
      origin: 'Unjha, Gujarat, India',
      hsCode: '0909.31',
      packaging: '25kg / 50kg PP Bags & Jute Bags',
      boxSize: '50kg Master Sacks',
      packageType: 'Export Grade PP / Jute',
      flavour: 'Pungent & Warm Aromatic',
      moq: '1 FCL (18 MT)',
      featured: true,
      isActive: true,
    },
    {
      name: 'Salem Bold Turmeric Fingers',
      segment: spicesSeg?._id,
      partner: sunfield?._id,
      shortDescription: 'High-curcumin (3.5%+) bold polished turmeric fingers for export.',
      description: 'Double-polished Salem finger turmeric with vivid golden-yellow internal hue. Steam-sterilized and lab-tested for heavy metals and chemical residue compliance.',
      image: img('photo-1615485500704-8e990f9900f7'),
      origin: 'Erode & Salem, Tamil Nadu, India',
      hsCode: '0910.30',
      packaging: '25kg Multi-wall Paper / PP Bags',
      boxSize: '25kg Net Sacks',
      packageType: 'Multi-layer hermetic bags',
      flavour: 'Earthy, peppery & warm',
      moq: '5 MT',
      featured: true,
      isActive: true,
    },
    {
      name: '1121 XXL Basmati Rice (Steam & Sella)',
      segment: grainsSeg?._id,
      partner: goldenValley?._id,
      shortDescription: 'Aged 1121 Basmati rice with average grain length of 8.35mm+.',
      description: 'Extra-long slender grain basmati rice naturally aged for 18–24 months. Expands to over 20mm after cooking without sticking. Perfect for international dining and supermarkets.',
      image: img('photo-1586201375761-83865001e31c'),
      origin: 'Punjab & Haryana, India',
      hsCode: '1006.30',
      packaging: '5kg / 10kg / 20kg Non-Woven & BOPP Bags',
      boxSize: '4x5kg Cartons / 20kg Master Bags',
      packageType: 'BOPP / Jute / Non-woven Fabric',
      flavour: 'Nutty & naturally aromatic',
      moq: '1 FCL (24 MT)',
      featured: true,
      isActive: true,
    },
    {
      name: 'Red Chilli (Teja S17 Stemless)',
      segment: spicesSeg?._id,
      partner: sunfield?._id,
      shortDescription: 'Fiery hot Teja S17 dried red chillies, machine stem-cut.',
      description: 'High pungency (75,000–100,000 SHU) dried red chillies from Guntur. Sorted and graded with low moisture content and bright natural red color without artificial dyes.',
      image: img('photo-1599909533144-f5f0e6f0f0e6'),
      origin: 'Guntur, Andhra Pradesh, India',
      hsCode: '0904.21',
      packaging: '10kg / 25kg Gunny Bags or Carton Boxes',
      boxSize: '10kg Carton',
      packageType: 'Corrugated Export Carton',
      flavour: 'Intense spicy heat',
      moq: '5 MT',
      featured: true,
      isActive: true,
    },
    {
      name: 'Dehydrated White Onion Flakes & Minced',
      segment: snacksSeg?._id || spicesSeg?._id,
      partner: sunfield?._id,
      shortDescription: 'Crisp, aromatic dehydrated white onion flakes from Mahuva.',
      description: 'Processed from fresh white onions in Mahuva, Gujarat. Washed, sliced, air-dried, and Sortex-cleaned to remove dark particles. Moisture below 6%, free from salmonella.',
      image: img('photo-1508747703725-719777637510'),
      origin: 'Mahuva, Gujarat, India',
      hsCode: '0712.20',
      packaging: '14kg / 20kg Poly-lined Cartons',
      boxSize: '20kg Export Carton Box',
      packageType: 'Aluminium foil lined carton',
      flavour: 'Sweet & savory allium aroma',
      moq: '3 MT',
      featured: true,
      isActive: true,
    },
    {
      name: 'Natural White Sesame Seeds (99.9% Sortex)',
      segment: grainsSeg?._id || spicesSeg?._id,
      partner: goldenValley?._id,
      shortDescription: 'Premium Hulled & Natural White Sesame Seeds with 50%+ oil content.',
      description: 'Mechanically hulled and Sortex laser-cleaned natural white sesame seeds. Widely used for bakery buns, tahini, confectionery, and seasoning applications.',
      image: img('photo-1563412885-139e4045ec52'),
      origin: 'Saurashtra, Gujarat, India',
      hsCode: '1207.40',
      packaging: '25kg / 50kg Paper Bags or PP Bags',
      boxSize: '25kg Craft Paper Bag',
      packageType: '3-Ply Craft Paper Bag',
      flavour: 'Nutty & buttery',
      moq: '1 FCL (19 MT)',
      featured: true,
      isActive: true,
    },
    {
      name: 'Kabuli Chickpeas (Garbanzo 75/80 Count)',
      segment: grainsSeg?._id,
      partner: goldenValley?._id,
      shortDescription: 'Uniform jumbo graded chickpeas with high protein content.',
      description: 'Machine-graded Kabuli chickpeas sourced from Madhya Pradesh farm clusters. Uniform round grain, clean skin, quick cooking, and low defect percentage.',
      image: img('photo-1615485290382-441e4d049cb5'),
      origin: 'Madhya Pradesh, India',
      hsCode: '0713.20',
      packaging: '25kg / 50kg PP Bags with Inner Liner',
      boxSize: '50kg Master Bags',
      packageType: 'High tensile PP Bag',
      flavour: 'Creamy & nutty',
      moq: '1 FCL (24 MT)',
      featured: false,
      isActive: true,
    },
    {
      name: 'Malabar Black Pepper (Tellicherry Garbled)',
      segment: spicesSeg?._id,
      partner: sunfield?._id,
      shortDescription: 'Sun-dried bold black peppercorns with high piperine content.',
      description: 'Grade TGSEB (Tellicherry Garbled Special Extra Bold) black peppercorns from the Western Ghats. Intense aroma and high density (570g/L+).',
      image: img('photo-1596040033229-a9821ebd058d'),
      origin: 'Kerala, India',
      hsCode: '0904.11',
      packaging: '25kg Multi-wall Craft Bags',
      boxSize: '25kg Master Bag',
      packageType: 'Multi-wall Kraft Bag',
      flavour: 'Robust, sharp & woody',
      moq: '2 MT',
      featured: true,
      isActive: true,
    },
    {
      name: 'Premium Roasted Cashew Kernels (W320)',
      segment: nutsSeg?._id,
      partner: sunfield?._id,
      shortDescription: 'Whole white cashew kernels grade W320, vacuum sealed.',
      description: 'Carefully shelled, peeled, and graded W320 cashew nuts. Nitrogen-flushed vacuum packed in metal tins or poly pouches to preserve freshness.',
      image: img('photo-1508747703725-719777637510'),
      origin: 'Goa & Konkan, India',
      hsCode: '0801.32',
      packaging: '10kg Vacuum Tins (2 x 10kg per Master Carton)',
      boxSize: '20kg Carton Box',
      packageType: 'Vacuum Tin / Foil Pouch',
      flavour: 'Rich, buttery & crisp',
      moq: '1 MT',
      featured: true,
      isActive: true,
    },
    {
      name: 'Estate Ceylon Black Tea (Orange Pekoe)',
      segment: teaSeg?._id,
      partner: highland?._id,
      shortDescription: 'High-elevation whole leaf black tea with brisk golden liquor.',
      description: 'Hand-picked Orange Pekoe Ceylon black tea from high mountain estates. Packed at origin to preserve fresh aroma, suitable for specialty tea merchants and blending.',
      image: img('photo-1597481499750-3e6b22637e12'),
      origin: 'Nuwara Eliya, Sri Lanka',
      hsCode: '0902.30',
      packaging: '30kg Paper Sacks with Aluminium Foil Liner',
      boxSize: '30kg Multi-ply Sack',
      packageType: 'Aluminium Lined Tea Sack',
      flavour: 'Brisk, floral & bright',
      moq: '1 MT',
      featured: false,
      isActive: true,
    },
    {
      name: 'Whole Coriander Seeds (Eagle Sortex)',
      segment: spicesSeg?._id,
      partner: sunfield?._id,
      shortDescription: 'Uniform green-golden coriander seeds with high aromatic oils.',
      description: 'Eagle quality Sortex cleaned coriander seeds sourced from Rajasthan. Machine filtered to eliminate dust, split seeds, and weed seeds.',
      image: img('photo-1596040033229-a9821ebd058d'),
      origin: 'Ramganj Mandi, Rajasthan, India',
      hsCode: '0909.21',
      packaging: '25kg PP Bags / Custom Jute',
      boxSize: '25kg Bags',
      packageType: 'Export PP Bag',
      flavour: 'Citrusy & sweet aromatic',
      moq: '5 MT',
      featured: false,
      isActive: true,
    },
    {
      name: 'Sona Masoori Medium Grain Rice',
      segment: grainsSeg?._id,
      partner: goldenValley?._id,
      shortDescription: 'Lightweight, aromatic medium-grain South Indian rice.',
      description: 'Popular everyday aromatic rice variety cultivated along river belts in Andhra Pradesh and Karnataka. Low starch, non-sticky texture, popular across GCC and US markets.',
      image: img('photo-1586201375761-83865001e31c'),
      origin: 'Andhra Pradesh, India',
      hsCode: '1006.30',
      packaging: '10kg / 20kg / 50kg Bags',
      boxSize: '20kg Woven Poly Bag',
      packageType: 'Woven Poly Bag',
      flavour: 'Mild & subtle aroma',
      moq: '1 FCL (25 MT)',
      featured: false,
      isActive: true,
    },
  ];

  // Insert or update products
  for (const prodData of exportProducts) {
    if (!prodData.segment) continue;
    const existing = await Product.findOne({ name: prodData.name });
    if (!existing) {
      await Product.create(prodData);
      console.log(`+ Product created: ${prodData.name}`);
    } else {
      await Product.updateOne({ _id: existing._id }, { $set: prodData });
      console.log(`✓ Product updated: ${prodData.name}`);
    }
  }

  const finalCount = await Product.countDocuments();
  console.log(`\n🎉 Synchronized successfully! Total products in MongoDB: ${finalCount}`);
  process.exit(0);
}

populate().catch((e) => {
  console.error('Error populating MongoDB:', e);
  process.exit(1);
});
