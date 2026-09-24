import Partner from '../models/Partner.js';
import PartnerRegistration from '../models/PartnerRegistration.js';
import Product from '../models/Product.js';
import { asyncHandler, sendEmail } from '../utils/sendEmail.js';

// GET /api/partners
export const getPartners = asyncHandler(async (req, res) => {
  const query = req.query.all === 'true' ? {} : { isActive: true };
  const partners = await Partner.find(query).sort({ name: 1 });
  res.json(partners);
});

// GET /api/partners/:slug
export const getPartnerBySlug = asyncHandler(async (req, res) => {
  const partner = await Partner.findOne({ slug: req.params.slug });
  if (!partner) {
    res.status(404);
    throw new Error('Partner not found.');
  }
  const products = await Product.find({ partner: partner._id, isActive: true })
    .populate('segment', 'name slug')
    .sort({ name: 1 });
  res.json({ partner, products });
});

// POST /api/partners  (admin)
export const createPartner = asyncHandler(async (req, res) => {
  const partner = await Partner.create(req.body);
  res.status(201).json(partner);
});

// PUT /api/partners/:id  (admin)
export const updatePartner = asyncHandler(async (req, res) => {
  const partner = await Partner.findById(req.params.id);
  if (!partner) {
    res.status(404);
    throw new Error('Partner not found.');
  }
  Object.assign(partner, req.body);
  await partner.save();
  res.json(partner);
});

// DELETE /api/partners/:id  (admin)
export const deletePartner = asyncHandler(async (req, res) => {
  await Product.updateMany({ partner: req.params.id }, { $unset: { partner: '' } });
  const partner = await Partner.findByIdAndDelete(req.params.id);
  if (!partner) {
    res.status(404);
    throw new Error('Partner not found.');
  }
  res.json({ message: 'Partner deleted.' });
});

/* =========================================================
   PARTNER REGISTRATION CONTROLLERS (BECOME A PARTNER)
========================================================= */

// POST /api/partners/register (Public registration form)
export const registerPartner = asyncHandler(async (req, res) => {
  const {
    companyName,
    contactPerson,
    email,
    phone,
    country,
    city,
    website,
    businessType,
    categories,
    annualCapacity,
    message,
  } = req.body;

  if (!companyName || !contactPerson || !email || !message) {
    res.status(400);
    throw new Error('Company name, contact person, email and message are required.');
  }

  const registration = await PartnerRegistration.create({
    companyName,
    contactPerson,
    email,
    phone,
    country,
    city,
    website,
    businessType,
    categories: Array.isArray(categories) ? categories : [],
    annualCapacity,
    message,
  });

  // Notify team via email
  try {
    const html = `
      <h2>New Partner Registration Request</h2>
      <p>A new supplier/partner company has registered on Nirmala Multi Trading Co.</p>
      <table cellpadding="6" style="border-collapse:collapse; width: 100%; max-width: 600px;">
        <tr><td><strong>Company Name:</strong></td><td>${companyName}</td></tr>
        <tr><td><strong>Contact Person:</strong></td><td>${contactPerson}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
        <tr><td><strong>Phone:</strong></td><td>${phone || '—'}</td></tr>
        <tr><td><strong>Country / City:</strong></td><td>${country || '—'} ${city ? `(${city})` : ''}</td></tr>
        <tr><td><strong>Business Type:</strong></td><td>${businessType || '—'}</td></tr>
        <tr><td><strong>Website:</strong></td><td>${website || '—'}</td></tr>
        <tr><td><strong>Categories:</strong></td><td>${Array.isArray(categories) ? categories.join(', ') : '—'}</td></tr>
        <tr><td><strong>Annual Capacity:</strong></td><td>${annualCapacity || '—'}</td></tr>
      </table>
      <p><strong>Message / Proposal:</strong></p>
      <p>${message.replace(/\n/g, '<br/>')}</p>
    `;

    await sendEmail({
      to: process.env.INQUIRY_NOTIFY_TO || process.env.SMTP_USER,
      subject: `New Partner Application — ${companyName}`,
      html,
      replyTo: email,
    });
  } catch (err) {
    console.error('Partner registration notification failed:', err.message);
  }

  res.status(201).json({
    message: 'Thank you! Your partner registration has been submitted successfully. Our trade procurement team will review your details.',
    registration,
  });
});

// GET /api/partners/registrations/all (Admin view registrations)
export const getPartnerRegistrations = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [
      { companyName: regex },
      { contactPerson: regex },
      { email: regex },
      { country: regex },
      { businessType: regex },
    ];
  }
  const registrations = await PartnerRegistration.find(filter).sort({ createdAt: -1 });
  res.json(registrations);
});

// PATCH /api/partners/registrations/:id/status (Admin status update)
export const updatePartnerRegistrationStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const updateData = {};
  if (status) updateData.status = status;
  if (notes !== undefined) updateData.notes = notes;

  const registration = await PartnerRegistration.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  if (!registration) {
    res.status(404);
    throw new Error('Registration not found.');
  }

  res.json(registration);
});

// POST /api/partners/registrations/:id/approve (Admin convert to Active Partner)
export const approvePartnerRegistration = asyncHandler(async (req, res) => {
  const registration = await PartnerRegistration.findById(req.params.id);
  if (!registration) {
    res.status(404);
    throw new Error('Registration not found.');
  }

  // Check if partner already created with this name
  let partner = await Partner.findOne({ name: registration.companyName });
  if (!partner) {
    partner = await Partner.create({
      name: registration.companyName,
      country: registration.country || 'India',
      website: registration.website || '',
      description: registration.message || `Partner supplier of ${registration.categories?.join(', ')}`,
      isActive: true,
    });
  }

  registration.status = 'approved';
  await registration.save();

  res.json({
    message: `Partner "${registration.companyName}" successfully approved and added to active partners list!`,
    partner,
    registration,
  });
});

// DELETE /api/partners/registrations/:id (Admin delete registration)
export const deletePartnerRegistration = asyncHandler(async (req, res) => {
  const reg = await PartnerRegistration.findByIdAndDelete(req.params.id);
  if (!reg) {
    res.status(404);
    throw new Error('Registration record not found.');
  }
  res.json({ message: 'Partner registration application deleted.' });
});

