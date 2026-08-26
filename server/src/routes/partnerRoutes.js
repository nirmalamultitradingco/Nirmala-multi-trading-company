import express from 'express';
import {
  getPartners,
  getPartnerBySlug,
  createPartner,
  updatePartner,
  deletePartner,
} from '../controllers/partnerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.route('/').get(getPartners).post(protect, createPartner);
router.get('/:slug', getPartnerBySlug);
router.route('/:id').put(protect, updatePartner).delete(protect, deletePartner);
export default router;
