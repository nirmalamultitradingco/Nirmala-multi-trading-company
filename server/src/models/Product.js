import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    segment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Segment',
      required: true,
    },

    subSegment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubSegment',
      default: null,
      index: true,
    },

    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Partner',
    },

    shortDescription: {
      type: String,
      default: '',
    },

    description: {
      type: String,
      default: '',
    },

    image: {
      type: String,
      default: '',
    },

    gallery: [
      {
        type: String,
      },
    ],

    origin: {
      type: String,
      default: '',
    },

    hsCode: {
      type: String,
      default: '',
    },

    /*
     * NEW PRODUCT DETAILS
     */
    boxSize: {
      type: String,
      default: '',
      trim: true,
    },

    packageType: {
      type: String,
      default: '',
      trim: true,
    },

    flavour: {
      type: String,
      default: '',
      trim: true,
    },

    moq: {
      type: String,
      default: '',
      trim: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('validate', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }

  next();
});

productSchema.index({
  name: 'text',
  shortDescription: 'text',
  description: 'text',
  origin: 'text',
});

export default mongoose.model('Product', productSchema);