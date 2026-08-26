import mongoose from 'mongoose';

const brochureSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    file: { type: String, required: true }, // stored path served from /uploads
    segment: { type: mongoose.Schema.Types.ObjectId, ref: 'Segment' },
  },
  { timestamps: true }
);

export default mongoose.model('Brochure', brochureSchema);
