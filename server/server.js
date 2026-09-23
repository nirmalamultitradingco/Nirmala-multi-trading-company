// import express from 'express';
// import cors from 'cors';
// import morgan from 'morgan';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';

// import { connectDB } from './src/config/db.js';
// import { notFound, errorHandler } from './src/middleware/error.js';

// import authRoutes from './src/routes/authRoutes.js';
// import segmentRoutes from './src/routes/segmentRoutes.js';
// import partnerRoutes from './src/routes/partnerRoutes.js';
// import productRoutes from './src/routes/productRoutes.js';
// import inquiryRoutes from './src/routes/inquiryRoutes.js';
// import brochureRoutes from './src/routes/brochureRoutes.js';
// import uploadRoutes from './src/routes/uploadRoutes.js';
// dotenv.config();
// await connectDB();

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const app = express();

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || '*',
//   })
// );
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// // Serve uploaded images / brochures
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// app.use('/api/auth', authRoutes);
// app.use('/api/segments', segmentRoutes);
// app.use('/api/partners', partnerRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/inquiries', inquiryRoutes);
// app.use('/api/brochures', brochureRoutes);
// app.use('/api/upload', uploadRoutes);

// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
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

/* CORS */
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
  })
);

/* Body parsers */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Development logging */
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* Uploaded files */
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

/* Health check */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
  });
});

/*
 * Connect MongoDB before API requests.
 */
let dbPromise;

app.use('/api', async (req, res, next) => {
  try {
    if (!dbPromise) {
      dbPromise = connectDB();
    }

    await dbPromise;
    next();
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    next(error);
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
 * Local development only.
 */
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

export default app;

