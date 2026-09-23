import express from 'express';
import {
  getSubSegments,
  getSubSegmentBySlug,
  createSubSegment,
  updateSubSegment,
  deleteSubSegment,
} from '../controllers/subSegmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getSubSegments).post(protect, createSubSegment);
router.get('/:slug', getSubSegmentBySlug);
router.route('/:id').put(protect, updateSubSegment).delete(protect, deleteSubSegment);

export default router;
