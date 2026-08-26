import Product from '../models/Product.js';
import Segment from '../models/Segment.js';
import Partner from '../models/Partner.js';
import { asyncHandler } from '../utils/sendEmail.js';

// GET /api/products?segment=slug&partner=slug&featured=true&search=&page=1&limit=12
export const getProducts = asyncHandler(async (req, res) => {
  const { segment, partner, featured, search, admin } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;

  const filter = {};
  if (admin !== 'true') filter.isActive = true;
  if (featured === 'true') filter.featured = true;

  if (segment) {
    const seg = await Segment.findOne({ slug: segment });
    filter.segment = seg ? seg._id : null;
  }
  if (partner) {
    const p = await Partner.findOne({ slug: partner });
    filter.partner = p ? p._id : null;
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
      { origin: { $regex: search, $options: 'i' } },
    ];
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('segment', 'name slug')
    .populate('partner', 'name slug logo')
    .sort({ featured: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ products, total, page, pages: Math.ceil(total / limit) });
});

// GET /api/products/:slug
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('segment', 'name slug')
    .populate('partner', 'name slug logo country website');
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }
  const related = await Product.find({
    segment: product.segment?._id,
    _id: { $ne: product._id },
    isActive: true,
  })
    .limit(4)
    .select('name slug image shortDescription origin');
  res.json({ product, related });
});

// POST /api/products  (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

// PUT /api/products/:id  (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }
  Object.assign(product, req.body);
  await product.save();
  res.json(product);
});

// DELETE /api/products/:id  (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }
  res.json({ message: 'Product deleted.' });
});
