import { asyncHandler } from '../utils/sendEmail.js';

// POST /api/upload  (admin) — single image, returns a public URL to store on a record.
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file received.');
  }
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});
