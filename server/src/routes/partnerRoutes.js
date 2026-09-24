import express from 'express';
import {
  getPartners,
  getPartnerBySlug,
  createPartner,
  updatePartner,
  deletePartner,
  registerPartner,
  getPartnerRegistrations,
  updatePartnerRegistrationStatus,
  approvePartnerRegistration,
  deletePartnerRegistration,
} from '../controllers/partnerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public partner registration
router.post('/register', registerPartner);

// Admin partner registrations management
router.get('/registrations/all', protect, getPartnerRegistrations);
router.patch('/registrations/:id/status', protect, updatePartnerRegistrationStatus);
router.post('/registrations/:id/approve', protect, approvePartnerRegistration);
router.delete('/registrations/:id', protect, deletePartnerRegistration);

// Standard partner endpoints
router.route('/').get(getPartners).post(protect, createPartner);
router.get('/:slug', getPartnerBySlug);
router.route('/:id').put(protect, updatePartner).delete(protect, deletePartner);

export default router;

