import Inquiry from '../models/Inquiry.js';
import Product from '../models/Product.js';
import Segment from '../models/Segment.js';
import { asyncHandler, sendEmail } from '../utils/sendEmail.js';

// POST /api/inquiries  (public) — saves to DB AND emails a notification
export const createInquiry = asyncHandler(async (req, res) => {
  const { name, email, message, product, segment, productInterest, interestType } = req.body;
  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Name, email and message are required.');
  }

  let interestLabel = productInterest || 'General inquiry';
  let resolvedType = interestType || 'general';

  if (product) {
    const p = await Product.findById(product).select('name');
    if (p) {
      interestLabel = p.name;
      resolvedType = 'product';
    }
  } else if (segment) {
    const s = await Segment.findById(segment).select('name');
    if (s) {
      interestLabel = s.name;
      resolvedType = 'segment';
    }
  }

  const inquiry = await Inquiry.create({
    ...req.body,
    product: product || undefined,
    segment: segment || undefined,
    productInterest: interestLabel,
    interestType: resolvedType,
  });

  const html = `
    <h2>New export inquiry</h2>
    <p><strong>Interest:</strong> ${interestLabel} (${resolvedType === 'segment' ? 'Product Segment' : resolvedType === 'product' ? 'Specific Product' : 'General Inquiry'})</p>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><strong>Name</strong></td><td>${inquiry.name}</td></tr>
      <tr><td><strong>Email</strong></td><td>${inquiry.email}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${inquiry.phone || '—'}</td></tr>
      <tr><td><strong>Company</strong></td><td>${inquiry.company || '—'}</td></tr>
      <tr><td><strong>Country</strong></td><td>${inquiry.country || '—'}</td></tr>
      <tr><td><strong>Interest</strong></td><td>${interestLabel}</td></tr>
    </table>
    <p><strong>Message</strong></p>
    <p>${inquiry.message.replace(/\n/g, '<br/>')}</p>
  `;

  // Don't fail the request if email delivery has a problem — the inquiry is saved.
  try {
    await sendEmail({
      to: process.env.INQUIRY_NOTIFY_TO || process.env.SMTP_USER,
      subject: `New inquiry — ${interestLabel}`,
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
  const { status, segment, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (segment) filter.segment = segment;
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [
      { name: regex },
      { email: regex },
      { company: regex },
      { country: regex },
      { productInterest: regex },
      { message: regex },
    ];
  }
  const inquiries = await Inquiry.find(filter)
    .populate('product', 'name slug')
    .populate('segment', 'name slug')
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
