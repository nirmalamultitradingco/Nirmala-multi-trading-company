import mongoose from 'mongoose';
import slugify from 'slugify';

const newsSectionSchema = new mongoose.Schema(
  {
    subtitle: { type: String, default: '' },
    text: { type: String, default: '' },
    image: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Untitled Post', trim: true },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    image: { type: String, default: '' },
    images: { type: [String], default: [] },
    sections: { type: [newsSectionSchema], default: [] },
    publishedAt: { type: Date, default: Date.now },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

newsSchema.pre('validate', function (next) {
  if (!this.title || !this.title.trim()) {
    this.title = 'Untitled Post';
  }
  if (this.isModified('title') || !this.slug) {
    const raw = slugify(this.title || 'post', { lower: true, strict: true }) || 'post';
    this.slug = `${raw}-${Date.now().toString(36)}`;
  }
  next();
});

export default mongoose.model('News', newsSchema);
