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
  const { notifySubscribers: shouldNotify, broadcastSubject, broadcastMessage, ...data } = req.body;
  const item = await News.create({ ...data, publishedAt: data.publishedAt || new Date() });

  // If user requested subscriber notification, broadcast the complete blog with photos and content
  if (shouldNotify) {
    notifySubscribers({
      type: 'blog',
      item,
      title: broadcastSubject || `📰 New Article: ${item.title}`,
      message: broadcastMessage || '',
    }).catch((err) => console.error('Subscriber alert error:', err));
  }

  res.status(201).json(item);
});

export const updateNews = asyncHandler(async (req, res) => {
  const item = await News.findById(req.params.id);
  if (!item) { res.status(404); throw new Error('News article not found.'); }
  
  const { notifySubscribers: shouldNotify, broadcastSubject, broadcastMessage, ...data } = req.body;
  Object.assign(item, data);
  await item.save();

  if (shouldNotify) {
    notifySubscribers({
      type: 'blog',
      item,
      title: broadcastSubject || `📰 New Article: ${item.title}`,
      message: broadcastMessage || '',
    }).catch((err) => console.error('Subscriber alert error:', err));
  }

  res.json(item);
});

export const broadcastNews = asyncHandler(async (req, res) => {
  const item = await News.findById(req.params.id);
  if (!item) { res.status(404); throw new Error('News article not found.'); }

  const { subject, message, testEmail: targetEmail } = req.body;
  const broadcastTitle = subject || `📰 New Article: ${item.title}`;

  const log = await notifySubscribers({
    type: 'blog',
    item,
    title: broadcastTitle,
    message: message || '',
    testEmail: targetEmail,
  });

  const responseMessage = targetEmail
    ? `Test blog email with full article content and photos dispatched to ${targetEmail}!`
    : `Blog article "${item.title}" with complete content and attached photos successfully broadcast to subscribers!`;

  res.json({
    message: responseMessage,
    log,
    deliveryMode: log?.deliveryMode || 'live_smtp',
    previewUrl: log?.previewUrl || null,
  });
});

export const deleteNews = asyncHandler(async (req, res) => {
  const item = await News.findByIdAndDelete(req.params.id);
  if (!item) { res.status(404); throw new Error('News article not found.'); }
  res.json({ message: 'News article deleted.' });
});
