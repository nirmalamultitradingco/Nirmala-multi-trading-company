import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    country: { type: String, default: '' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read', 'responded'], default: 'new' },
  },
  { timestamps: true }
);

export default mongoose.model('Inquiry', inquirySchema);
