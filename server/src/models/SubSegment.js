import mongoose from 'mongoose';
import slugify from 'slugify';

const subSegmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    segment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Segment',
      required: true,
      index: true,
    },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

subSegmentSchema.pre('validate', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

subSegmentSchema.index({ segment: 1, order: 1, name: 1 });

export default mongoose.model('SubSegment', subSegmentSchema);
