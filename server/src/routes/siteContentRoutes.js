import express from 'express';
import { getSiteContent, updateSiteContent } from '../controllers/siteContentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSiteContent);
router.put('/', protect, updateSiteContent);

export default router;
