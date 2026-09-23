import SubSegment from '../models/SubSegment.js';
import Segment from '../models/Segment.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/sendEmail.js';

// GET /api/subsegments?segment=<segment-slug>&all=true
export const getSubSegments = asyncHandler(async (req, res) => {
  const query = req.query.all === 'true' ? {} : { isActive: true };

  if (req.query.segment) {
    const segment = await Segment.findOne({ slug: req.query.segment }).select('_id');
    query.segment = segment ? segment._id : null;
  }

  const subsegments = await SubSegment.find(query)
    .populate('segment', 'name slug')
    .sort({ order: 1, name: 1 });

  res.json(subsegments);
});

// GET /api/subsegments/:slug
export const getSubSegmentBySlug = asyncHandler(async (req, res) => {
  const subsegment = await SubSegment.findOne({ slug: req.params.slug })
    .populate('segment', 'name slug');

  if (!subsegment) {
    res.status(404);
    throw new Error('Sub-segment not found.');
  }

  res.json(subsegment);
});

// POST /api/subsegments (admin)
export const createSubSegment = asyncHandler(async (req, res) => {
  const { segment } = req.body;
  if (!segment) {
    res.status(400);
    throw new Error('Parent segment is required.');
  }

  const parent = await Segment.findById(segment);
  if (!parent) {
    res.status(400);
    throw new Error('Parent segment not found.');
  }

  const subsegment = await SubSegment.create(req.body);
  await subsegment.populate('segment', 'name slug');
  res.status(201).json(subsegment);
});

// PUT /api/subsegments/:id (admin)
export const updateSubSegment = asyncHandler(async (req, res) => {
  const subsegment = await SubSegment.findById(req.params.id);
  if (!subsegment) {
    res.status(404);
    throw new Error('Sub-segment not found.');
  }

  if (req.body.segment) {
    const parent = await Segment.findById(req.body.segment);
    if (!parent) {
      res.status(400);
      throw new Error('Parent segment not found.');
    }
  }

  Object.assign(subsegment, req.body);
  await subsegment.save();
  await subsegment.populate('segment', 'name slug');
  res.json(subsegment);
});

// DELETE /api/subsegments/:id (admin)
export const deleteSubSegment = asyncHandler(async (req, res) => {
  const inUse = await Product.countDocuments({ subSegment: req.params.id });
  if (inUse > 0) {
    res.status(409);
    throw new Error(`Cannot delete: ${inUse} product(s) still use this sub-segment.`);
  }

  const subsegment = await SubSegment.findByIdAndDelete(req.params.id);
  if (!subsegment) {
    res.status(404);
    throw new Error('Sub-segment not found.');
  }

  res.json({ message: 'Sub-segment deleted.' });
});
