import express from 'express';
import {
  getSegments,
  getSegmentBySlug,
  createSegment,
  updateSegment,
  deleteSegment,
} from '../controllers/segmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.route('/').get(getSegments).post(protect, createSegment);
router.get('/:slug', getSegmentBySlug);
router.route('/:id').put(protect, updateSegment).delete(protect, deleteSegment);
export default router;
