import express from 'express';
import {
  getBrochures,
  createBrochure,
  deleteBrochure,
} from '../controllers/brochureController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();
router.route('/').get(getBrochures).post(protect, upload.single('file'), createBrochure);
router.delete('/:id', protect, deleteBrochure);
export default router;
