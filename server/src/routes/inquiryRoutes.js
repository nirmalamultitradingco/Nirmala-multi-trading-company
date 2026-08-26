import express from 'express';
import {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/inquiryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.route('/').post(createInquiry).get(protect, getInquiries);
router.route('/:id').patch(protect, updateInquiryStatus).delete(protect, deleteInquiry);
export default router;
