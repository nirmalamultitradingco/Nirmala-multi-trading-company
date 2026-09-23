import News from '../models/News.js';
import { asyncHandler } from '../utils/sendEmail.js';
import { notifySubscribers } from './subscriberController.js';

export const getNews = asyncHandler(async (req, res) => {
  const query = req.query.all === 'true' ? {} : { isActive: true };
  const items = await News.find(query).sort({ featured: -1, publishedAt: -1, order: 1, createdAt: -1 });
  res.json(items);
});

export const getNewsBySlug = asyncHandler(async (req, res) => {
  const item = await News.findOne({ slug: req.params.slug, isActive: true });
  if (!item) { res.status(404); throw new Error('News article not found.'); }
  res.json(item);
});

export const createNews = asyncHandler(async (req, res) => {
  const item = await News.create({ ...req.body, publishedAt: req.body.publishedAt || new Date() });
  // Notify subscribers in background without blocking response
  notifySubscribers({
    type: 'blog',
    title: item.title || 'Untitled Update',
    slug: item.slug,
    excerpt: item.summary || (item.content ? item.content.slice(0, 150) + '...' : ''),
  }).catch((err) => console.error('Subscriber alert error:', err));

  res.status(201).json(item);
});

export const updateNews = asyncHandler(async (req, res) => {
  const item = await News.findById(req.params.id);
  if (!item) { res.status(404); throw new Error('News article not found.'); }
  Object.assign(item, req.body);
  await item.save();
  res.json(item);
});

export const deleteNews = asyncHandler(async (req, res) => {
  const item = await News.findByIdAndDelete(req.params.id);
  if (!item) { res.status(404); throw new Error('News article not found.'); }
  res.json({ message: 'News article deleted.' });
});
