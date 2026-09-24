import express from 'express';
import { login, getMe, refreshToken } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/refresh', protect, refreshToken);
export default router;
