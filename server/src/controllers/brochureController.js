import Brochure from '../models/Brochure.js';
import { asyncHandler } from '../utils/sendEmail.js';

// GET /api/brochures
export const getBrochures = asyncHandler(async (req, res) => {
  const brochures = await Brochure.find().populate('segment', 'name slug').sort({ createdAt: -1 });
  res.json(brochures);
});

// POST /api/brochures  (admin, multipart with `file`)
export const createBrochure = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please attach a PDF file.');
  }
  const brochure = await Brochure.create({
    title: req.body.title,
    description: req.body.description || '',
    segment: req.body.segment || undefined,
    file: `/uploads/${req.file.filename}`,
  });
  res.status(201).json(brochure);
});

// DELETE /api/brochures/:id  (admin)
export const deleteBrochure = asyncHandler(async (req, res) => {
  const brochure = await Brochure.findByIdAndDelete(req.params.id);
  if (!brochure) {
    res.status(404);
    throw new Error('Brochure not found.');
  }
  res.json({ message: 'Brochure deleted.' });
});
