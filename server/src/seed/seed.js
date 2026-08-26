import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Segment from '../models/Segment.js';
import Partner from '../models/Partner.js';
import Product from '../models/Product.js';
import Brochure from '../models/Brochure.js';
import Inquiry from '../models/Inquiry.js';

dotenv.config();

// Remote demo images so the site looks populated without local uploads.
const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=70`;

const run = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany(),
    Segment.deleteMany(),
    Partner.deleteMany(),
    Product.deleteMany(),
    Brochure.deleteMany(),
    Inquiry.deleteMany(),
  ]);

  // ---- Admin user ----
  await User.create({
    name: process.env.ADMIN_NAME || 'Site Admin',
    email: process.env.ADMIN_EMAIL || 'admin@harvestbridge.com',
    password: process.env.ADMIN_PASSWORD || 'admin12345',
    role: 'admin',
  });
  console.log(`Admin created: ${process.env.ADMIN_EMAIL || 'admin@harvestbridge.com'}`);

  // ---- Segments ----
  const segments = await Segment.create([
    {
      name: 'Spices & Seasonings',
      description: 'Whole and ground spices sourced from certified farms, cleaned and graded for export.',
      image: img('photo-1596040033229-a9821ebd058d'),
      order: 1,
    },
    {
      name: 'Grains & Pulses',
      description: 'Rice, wheat, lentils and legumes in bulk and retail packing.',
      image: img('photo-1586201375761-83865001e31c'),
      order: 2,
    },
    {
      name: 'Tea & Coffee',
      description: 'Single-origin teas and green/roasted coffee for private label and bulk buyers.',
      image: img('photo-1597481499750-3e6b22637e12'),
      order: 3,
    },
    {
      name: 'Dried Fruits & Nuts',
      description: 'Sun-dried fruits, cashews, almonds and mixes, sorted and vacuum packed.',
      image: img('photo-1508747703725-719777637510'),
      order: 4,
    },
  ]);
  const [spices, grains, tea, nuts] = segments;
  console.log(`Segments created: ${segments.length}`);

  // ---- Partners ----
  const partners = await Partner.create([
    {
      name: 'Sunfield Agro',
      country: 'India',
      description: 'Third-generation spice growers and processors based in Kerala.',
      website: 'https://example.com',
      logo: img('photo-1618160702438-9b02ab6515c9'),
    },
    {
      name: 'Golden Valley Mills',
      country: 'India',
      description: 'Rice and pulse millers supplying retail and food-service channels.',
      website: 'https://example.com',
      logo: img('photo-1567306226416-28f0efdc88ce'),
    },
    {
      name: 'Highland Leaf Estates',
      country: 'Sri Lanka',
      description: 'Estate-grown teas with Rainforest Alliance certification.',
      website: 'https://example.com',
      logo: img('photo-1587049352846-4a222e784d38'),
    },
  ]);
  const [sunfield, goldenValley, highland] = partners;
  console.log(`Partners created: ${partners.length}`);

  // ---- Products ----
  const products = [
    {
      name: 'Whole Black Pepper',
      segment: spices._id,
      partner: sunfield._id,
      shortDescription: 'Bold, aromatic Malabar peppercorns, machine-cleaned to 550 g/l.',
      description:
        'Premium Malabar black peppercorns with high piperine content. Sun-dried and garbled to remove light berries and stalks. Available in bulk jute or vacuum packing for long-haul freight.',
      image: img('photo-1599909533144-f5f0e6f0f0e6'),
      origin: 'Kerala, India',
      hsCode: '0904.11',
      packaging: '25 kg PP bags / custom retail packs',
      moq: '5 MT',
      certifications: ['ISO 22000', 'FSSAI', 'Spices Board'],
      featured: true,
    },
    {
      name: 'Ground Turmeric',
      segment: spices._id,
      partner: sunfield._id,
      shortDescription: 'High-curcumin turmeric powder, 3%+, deep golden colour.',
      description:
        'Steam-sterilised turmeric powder milled from Salem finger turmeric. Consistent curcumin levels and vivid colour make it ideal for both culinary and nutraceutical buyers.',
      image: img('photo-1615485500704-8e990f9900f7'),
      origin: 'Tamil Nadu, India',
      hsCode: '0910.30',
      packaging: '25 kg bags / 200 g–1 kg retail',
      moq: '3 MT',
      certifications: ['ISO 22000', 'FSSAI'],
      featured: true,
    },
    {
      name: 'Basmati Rice 1121',
      segment: grains._id,
      partner: goldenValley._id,
      shortDescription: 'Extra-long grain aged basmati with a delicate aroma.',
      description:
        'Aged 1121 basmati rice with an average grain length above 8.3 mm after cooking. Sortex-cleaned and available white or steamed. Ideal for premium retail and HORECA channels.',
      image: img('photo-1586201375761-83865001e31c'),
      origin: 'Punjab, India',
      hsCode: '1006.30',
      packaging: '5/10/25 kg bags, non-woven or jute',
      moq: '20 MT',
      certifications: ['APEDA', 'ISO 22000'],
      featured: true,
    },
    {
      name: 'Red Lentils (Masoor Dal)',
      segment: grains._id,
      partner: goldenValley._id,
      shortDescription: 'Split red lentils, machine-cleaned and colour-sorted.',
      description:
        'Football-quality split red lentils with uniform colour and low foreign matter. A staple pulse with strong year-round demand across the Middle East and Europe.',
      image: img('photo-1615485290382-441e4d049cb5'),
      origin: 'Madhya Pradesh, India',
      hsCode: '0713.40',
      packaging: '25/50 kg bags',
      moq: '15 MT',
      certifications: ['APEDA'],
    },
    {
      name: 'Ceylon Black Tea OP',
      segment: tea._id,
      partner: highland._id,
      shortDescription: 'High-grown orange pekoe with a bright, brisk cup.',
      description:
        'Estate-grown high-elevation Ceylon black tea, orange pekoe grade. Bright liquor and clean finish suited to premium loose-leaf and tea-bag blenders.',
      image: img('photo-1597481499750-3e6b22637e12'),
      origin: 'Nuwara Eliya, Sri Lanka',
      hsCode: '0902.30',
      packaging: 'Multi-wall paper sacks, 20–40 kg',
      moq: '2 MT',
      certifications: ['Rainforest Alliance', 'ISO 22000'],
      featured: true,
    },
    {
      name: 'Whole Cashew Kernels W320',
      segment: nuts._id,
      partner: sunfield._id,
      shortDescription: 'Grade W320 white wholes, vacuum packed for freshness.',
      description:
        'Machine-shelled W320 cashew kernels with a clean ivory colour and low breakage. Vacuum-packed in nitrogen-flushed tins to protect shelf life during ocean freight.',
      image: img('photo-1563412885-139e4045ec52'),
      origin: 'India',
      hsCode: '0801.32',
      packaging: '10 kg vacuum tins (2 x carton)',
      moq: '1 MT',
      certifications: ['ISO 22000', 'FSSAI', 'HACCP'],
    },
  ];
  await Product.create(products);
  console.log(`Products created: ${products.length}`);

  // ---- Brochures (metadata only; files are illustrative) ----
  await Brochure.create([
    {
      title: 'Company Export Catalogue 2026',
      description: 'Full product range with specifications, packing and certifications.',
      file: '/uploads/sample-catalogue.pdf',
    },
    {
      title: 'Spices Line Card',
      description: 'Quick-reference line card for our spices segment.',
      file: '/uploads/sample-spices.pdf',
      segment: spices._id,
    },
  ]);
  console.log('Brochures created (note: replace demo file paths by uploading real PDFs in admin).');

  console.log('\nSeed complete. Sign in to the admin panel with the credentials in your .env.');
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
