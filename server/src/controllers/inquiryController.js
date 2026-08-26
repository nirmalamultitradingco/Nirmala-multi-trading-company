import Inquiry from '../models/Inquiry.js';
import Product from '../models/Product.js';
import { asyncHandler, sendEmail } from '../utils/sendEmail.js';

// POST /api/inquiries  (public) — saves to DB AND emails a notification
export const createInquiry = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Name, email and message are required.');
  }

  const inquiry = await Inquiry.create(req.body);

  let productName = 'General inquiry';
  if (inquiry.product) {
    const p = await Product.findById(inquiry.product).select('name');
    if (p) productName = p.name;
  }

  const html = `
    <h2>New export inquiry</h2>
    <p><strong>Product:</strong> ${productName}</p>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><strong>Name</strong></td><td>${inquiry.name}</td></tr>
      <tr><td><strong>Email</strong></td><td>${inquiry.email}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${inquiry.phone || '—'}</td></tr>
      <tr><td><strong>Company</strong></td><td>${inquiry.company || '—'}</td></tr>
      <tr><td><strong>Country</strong></td><td>${inquiry.country || '—'}</td></tr>
    </table>
    <p><strong>Message</strong></p>
    <p>${inquiry.message.replace(/\n/g, '<br/>')}</p>
  `;

  // Don't fail the request if email delivery has a problem — the inquiry is saved.
  try {
    await sendEmail({
      to: process.env.INQUIRY_NOTIFY_TO || process.env.SMTP_USER,
      subject: `New inquiry — ${productName}`,
      html,
      replyTo: inquiry.email,
    });
  } catch (err) {
    console.error('Inquiry email failed:', err.message);
  }

  res.status(201).json({ message: 'Thanks — your inquiry has been received. We will be in touch shortly.' });
});

// GET /api/inquiries  (admin)
export const getInquiries = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const inquiries = await Inquiry.find(filter)
    .populate('product', 'name slug')
    .sort({ createdAt: -1 });
  res.json(inquiries);
});

// PATCH /api/inquiries/:id  (admin) — update status
export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!inquiry) {
    res.status(404);
    throw new Error('Inquiry not found.');
  }
  res.json(inquiry);
});

// DELETE /api/inquiries/:id  (admin)
export const deleteInquiry = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
  if (!inquiry) {
    res.status(404);
    throw new Error('Inquiry not found.');
  }
  res.json({ message: 'Inquiry deleted.' });
});
