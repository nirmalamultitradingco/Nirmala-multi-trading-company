import mongoose from 'mongoose';

const broadcastLogSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['blog', 'product', 'manual'],
      default: 'manual',
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
    recipientCount: {
      type: Number,
      default: 0,
    },
    recipientEmails: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      default: 'sent',
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('BroadcastLog', broadcastLogSchema);
