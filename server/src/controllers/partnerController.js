import Partner from '../models/Partner.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/sendEmail.js';

// GET /api/partners
export const getPartners = asyncHandler(async (req, res) => {
  const query = req.query.all === 'true' ? {} : { isActive: true };
  const partners = await Partner.find(query).sort({ name: 1 });
  res.json(partners);
});

// GET /api/partners/:slug
export const getPartnerBySlug = asyncHandler(async (req, res) => {
  const partner = await Partner.findOne({ slug: req.params.slug });
  if (!partner) {
    res.status(404);
    throw new Error('Partner not found.');
  }
  const products = await Product.find({ partner: partner._id, isActive: true })
    .populate('segment', 'name slug')
    .sort({ name: 1 });
  res.json({ partner, products });
});

// POST /api/partners  (admin)
export const createPartner = asyncHandler(async (req, res) => {
  const partner = await Partner.create(req.body);
  res.status(201).json(partner);
});

// PUT /api/partners/:id  (admin)
export const updatePartner = asyncHandler(async (req, res) => {
  const partner = await Partner.findById(req.params.id);
  if (!partner) {
    res.status(404);
    throw new Error('Partner not found.');
  }
  Object.assign(partner, req.body);
  await partner.save();
  res.json(partner);
});

// DELETE /api/partners/:id  (admin)
export const deletePartner = asyncHandler(async (req, res) => {
  await Product.updateMany({ partner: req.params.id }, { $unset: { partner: '' } });
  const partner = await Partner.findByIdAndDelete(req.params.id);
  if (!partner) {
    res.status(404);
    throw new Error('Partner not found.');
  }
  res.json({ message: 'Partner deleted.' });
});
