import express from 'express';
import { getNews, getNewsBySlug, createNews, updateNews, deleteNews } from '../controllers/newsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/', getNews);
router.post('/', protect, createNews);
router.get('/:slug', getNewsBySlug);
router.put('/:id', protect, updateNews);
router.delete('/:id', protect, deleteNews);
export default router;
