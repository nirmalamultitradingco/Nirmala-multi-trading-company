import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

import { connectDB } from './src/config/db.js';

import { notFound, errorHandler } from './src/middleware/error.js';

import authRoutes from './src/routes/authRoutes.js';
import segmentRoutes from './src/routes/segmentRoutes.js';
import subSegmentRoutes from './src/routes/subSegmentRoutes.js';
import partnerRoutes from './src/routes/partnerRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import inquiryRoutes from './src/routes/inquiryRoutes.js';
import brochureRoutes from './src/routes/brochureRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import siteContentRoutes from './src/routes/siteContentRoutes.js';
import newsRoutes from './src/routes/newsRoutes.js';
import subscriberRoutes from './src/routes/subscriberRoutes.js';

const __dirname = path.dirname(
  fileURLToPath(import.meta.url)
);

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();

/* CORS - Allow development, production domains and vercel preview domains */
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((u) => u.trim())
  : ['*'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

/* Body parsers */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Development logging */
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* Uploaded files - support both local directory and serverless /tmp fallback */
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);
app.use(
  '/uploads',
  express.static(path.join(os.tmpdir(), 'uploads'))
);

/* Root & Health checks (available without requiring database connection) */
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'NMC API server is live',
    time: new Date().toISOString(),
  });
});

app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    message: 'NMC API server is live',
    time: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
  });
});

/*
 * Connect MongoDB before API requests.
 */
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('MongoDB connection error in API route:', error.message);
    res.status(500).json({
      message: 'Database connection failed. Please ensure MONGO_URI is set correctly in environment variables.',
      error: error.message,
    });
  }
});

/* API routes */
app.use('/api/auth', authRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/subsegments', subSegmentRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/brochures', brochureRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/site-content', siteContentRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/subscribers', subscriberRoutes);

/* Errors */
app.use(notFound);
app.use(errorHandler);

/*
 * Server listener (only starts HTTP server when run standalone, e.g. node server.js)
 */
const PORT = process.env.PORT || 5000;
const isDirectRun =
  process.argv[1] &&
  (process.argv[1].endsWith('server.js') || process.argv[1].endsWith('server'));

if (isDirectRun && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

export default app;


