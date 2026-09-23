import Segment from '../models/Segment.js';
import Product from '../models/Product.js';
import SubSegment from '../models/SubSegment.js';
import { asyncHandler } from '../utils/sendEmail.js';

// Segment order is treated as a position, not an arbitrary database number.
// Saving an item at position N shifts the other items; deleting one closes the gap.
const normalizeSegmentOrder = async () => {
  const segments = await Segment.find({}).sort({ order: 1, name: 1 });
  if (!segments.length) return;
  const ops = segments.map((segment, index) => ({
    updateOne: { filter: { _id: segment._id }, update: { $set: { order: index + 1 } } },
  }));
  await Segment.bulkWrite(ops);
};

const insertAtPosition = async (position, excludeId = null) => {
  const count = await Segment.countDocuments(excludeId ? { _id: { $ne: excludeId } } : {});
  const target = Math.max(1, Math.min(Number(position) || count + 1, count + 1));
  await Segment.updateMany(
    excludeId ? { _id: { $ne: excludeId }, order: { $gte: target } } : { order: { $gte: target } },
    { $inc: { order: 1 } }
  );
  return target;
};

export const getSegments = asyncHandler(async (req, res) => {
  const query = req.query.all === 'true' ? {} : { isActive: true };
  const segments = await Segment.find(query).sort({ order: 1, name: 1 });
  res.json(segments);
});

export const getSegmentBySlug = asyncHandler(async (req, res) => {
  const segment = await Segment.findOne({ slug: req.params.slug });
  if (!segment) { res.status(404); throw new Error('Segment not found.'); }

  const subsegments = await SubSegment.find({ segment: segment._id, isActive: true }).sort({ order: 1, name: 1 });
  const selectedSlug = req.query.subsegment || '';
  let selectedSubsegment = null;
  if (selectedSlug) {
    selectedSubsegment = await SubSegment.findOne({ slug: selectedSlug, segment: segment._id, isActive: true });
    if (!selectedSubsegment) { res.status(404); throw new Error('Sub-segment not found for this segment.'); }
  }

  const productFilter = { segment: segment._id, isActive: true };
  if (selectedSubsegment) productFilter.subSegment = selectedSubsegment._id;

  const products = await Product.find(productFilter)
    .populate('segment', 'name slug')
    .populate('partner', 'name slug logo')
    .populate('subSegment', 'name slug')
    .sort({ featured: -1, name: 1 });

  res.json({ segment, subsegments, selectedSubsegment, products });
});

export const createSegment = asyncHandler(async (req, res) => {
  const desired = Number(req.body.order) > 0 ? Number(req.body.order) : undefined;
  const target = await insertAtPosition(desired);
  const segment = await Segment.create({ ...req.body, order: target });
  await normalizeSegmentOrder();
  const fresh = await Segment.findById(segment._id);
  res.status(201).json(fresh);
});

export const updateSegment = asyncHandler(async (req, res) => {
  const segment = await Segment.findById(req.params.id);
  if (!segment) { res.status(404); throw new Error('Segment not found.'); }

  const oldOrder = segment.order || 1;
  const requestedOrder = Number(req.body.order);
  const otherCount = await Segment.countDocuments({ _id: { $ne: segment._id } });
  const target = Number.isFinite(requestedOrder) && requestedOrder > 0
    ? Math.max(1, Math.min(requestedOrder, otherCount + 1))
    : oldOrder;

  if (target !== oldOrder) {
    if (target < oldOrder) {
      await Segment.updateMany({ _id: { $ne: segment._id }, order: { $gte: target, $lt: oldOrder } }, { $inc: { order: 1 } });
    } else {
      await Segment.updateMany({ _id: { $ne: segment._id }, order: { $gt: oldOrder, $lte: target } }, { $inc: { order: -1 } });
    }
  }

  Object.assign(segment, req.body);
  segment.order = target;
  await segment.save();
  await normalizeSegmentOrder();
  const fresh = await Segment.findById(segment._id);
  res.json(fresh);
});

export const deleteSegment = asyncHandler(async (req, res) => {
  const inUse = await Product.countDocuments({ segment: req.params.id });
  if (inUse > 0) { res.status(409); throw new Error(`Cannot delete: ${inUse} product(s) still use this segment.`); }
  const subSegmentCount = await SubSegment.countDocuments({ segment: req.params.id });
  if (subSegmentCount > 0) { res.status(409); throw new Error(`Cannot delete: ${subSegmentCount} sub-segment(s) still belong to this segment.`); }

  const segment = await Segment.findByIdAndDelete(req.params.id);
  if (!segment) { res.status(404); throw new Error('Segment not found.'); }
  await Segment.updateMany({ order: { $gt: segment.order } }, { $inc: { order: -1 } });
  await normalizeSegmentOrder();
  res.json({ message: 'Segment deleted and remaining order numbers normalized.' });
});
