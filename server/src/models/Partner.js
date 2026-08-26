import mongoose from 'mongoose';
import slugify from 'slugify';

// A partner is a collaborating company whose products are listed for export.
const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    logo: { type: String, default: '' },
    country: { type: String, default: '' },
    description: { type: String, default: '' },
    website: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

partnerSchema.pre('validate', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export default mongoose.model('Partner', partnerSchema);
