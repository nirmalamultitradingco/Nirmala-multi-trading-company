import Segment from '../models/Segment.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/sendEmail.js';

// GET /api/segments  (public — active only)
export const getSegments = asyncHandler(async (req, res) => {
  const query = req.query.all === 'true' ? {} : { isActive: true };
  const segments = await Segment.find(query).sort({ order: 1, name: 1 });
  res.json(segments);
});

// GET /api/segments/:slug
export const getSegmentBySlug = asyncHandler(async (req, res) => {
  const segment = await Segment.findOne({ slug: req.params.slug });
  if (!segment) {
    res.status(404);
    throw new Error('Segment not found.');
  }
  const products = await Product.find({ segment: segment._id, isActive: true })
    .populate('partner', 'name slug logo')
    .sort({ featured: -1, name: 1 });
  res.json({ segment, products });
});

// POST /api/segments  (admin)
export const createSegment = asyncHandler(async (req, res) => {
  const segment = await Segment.create(req.body);
  res.status(201).json(segment);
});

// PUT /api/segments/:id  (admin)
export const updateSegment = asyncHandler(async (req, res) => {
  const segment = await Segment.findById(req.params.id);
  if (!segment) {
    res.status(404);
    throw new Error('Segment not found.');
  }
  Object.assign(segment, req.body);
  await segment.save();
  res.json(segment);
});

// DELETE /api/segments/:id  (admin)
export const deleteSegment = asyncHandler(async (req, res) => {
  const inUse = await Product.countDocuments({ segment: req.params.id });
  if (inUse > 0) {
    res.status(409);
    throw new Error(`Cannot delete: ${inUse} product(s) still use this segment.`);
  }
  const segment = await Segment.findByIdAndDelete(req.params.id);
  if (!segment) {
    res.status(404);
    throw new Error('Segment not found.');
  }
  res.json({ message: 'Segment deleted.' });
});
