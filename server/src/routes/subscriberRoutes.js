import express from 'express';
import {
  subscribe,
  unsubscribe,
  getAllSubscribers,
  deleteSubscriber,
  broadcastMessage,
  getBroadcastLogs,
  testBroadcastEmail,
  getSmtpStatus,
} from '../controllers/subscriberController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public: Subscribe email
router.post('/', subscribe);

// Public: Unsubscribe (support both GET and POST)
router.post('/unsubscribe', unsubscribe);
router.get('/unsubscribe', unsubscribe);

// Admin protected endpoints
router.get('/smtp-status', protect, getSmtpStatus);
router.get('/', protect, getAllSubscribers);
router.delete('/:id', protect, deleteSubscriber);
router.post('/broadcast', protect, broadcastMessage);
router.post('/test-email', protect, testBroadcastEmail);
router.get('/broadcasts', protect, getBroadcastLogs);

export default router;

