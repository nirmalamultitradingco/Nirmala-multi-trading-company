import Subscriber from '../models/Subscriber.js';
import BroadcastLog from '../models/BroadcastLog.js';
import { sendEmail } from '../utils/sendEmail.js';

// Helper: build luxury HTML email template
function buildEmailTemplate({ subject, message, link, clientUrl = 'http://localhost:5173' }) {
  const fullLink = link ? (link.startsWith('http') ? link : `${clientUrl}${link}`) : clientUrl;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
      <style>
        body { margin: 0; padding: 0; background-color: #f7f5f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .wrapper { width: 100%; max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e8e3d8; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .header { background: #0f2b20; padding: 32px 24px; text-align: center; }
        .header h1 { color: #fdfaf3; font-size: 22px; font-weight: 800; margin: 8px 0 0 0; letter-spacing: -0.5px; }
        .header p { color: #c89b3c; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0; font-weight: 700; }
        .content { padding: 36px 30px; color: #222523; line-height: 1.6; }
        .headline { font-size: 20px; font-weight: 800; color: #16382b; margin-top: 0; }
        .message-body { font-size: 15px; color: #4a544f; margin: 18px 0 28px 0; white-space: pre-line; line-height: 1.7; }
        .btn { display: inline-block; background-color: #c89b3c; color: #0d1e17 !important; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 10px; text-align: center; }
        .footer { background: #fbf9f4; padding: 24px; text-align: center; border-top: 1px solid #e8e3d8; font-size: 12px; color: #88928c; }
        .footer a { color: #16382b; text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <p>NIRMALA MULTI TRADING CO. • EXPORTER INTELLIGENCE</p>
          <h1>${subject}</h1>
        </div>
        <div class="content">
          <div class="message-body">${message || 'We are pleased to share our latest harvest update and export catalogue availability.'}</div>
          ${link ? `<div style="text-align: center; margin: 30px 0;"><a href="${fullLink}" class="btn">View On Website →</a></div>` : ''}
        </div>
        <div class="footer">
          <p>You received this export update because you subscribed at <a href="${clientUrl}">nirmalamultitrading.com</a>.</p>
          <p>© ${new Date().getFullYear()} Nirmala Multi Trading Co. Mundra & JNPT Ocean Logistics.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Public: Subscribe email
 * POST /api/subscribers
 */
export async function subscribe(req, res) {
  try {
    const { email, source = 'footer' } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    let subscriber = await Subscriber.findOne({ email: cleanEmail });
    if (subscriber) {
      if (subscriber.status === 'unsubscribed') {
        subscriber.status = 'active';
        subscriber.subscribedAt = new Date();
        await subscriber.save();
        return res.json({ message: 'Welcome back! Your subscription has been reactivated.', subscriber });
      }
      return res.json({ message: 'You are already subscribed to our export updates.', subscriber });
    }

    subscriber = await Subscriber.create({
      email: cleanEmail,
      source,
      status: 'active',
      subscribedAt: new Date(),
    });

    // Send a welcome confirmation email
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    sendEmail({
      to: cleanEmail,
      subject: 'Welcome to Nirmala Multi Trading Co. Market Updates',
      html: buildEmailTemplate({
        subject: 'Subscription Confirmed',
        message: 'Thank you for subscribing to Nirmala Multi Trading Co. export updates.\n\nYou will receive direct alerts on new crop harvests, Sortex purity clearance, and ocean container availability from Mundra & JNPT ports.',
        link: '/products',
        clientUrl,
      }),
    }).catch((err) => console.log('Welcome email log:', err.message));

    res.status(201).json({
      message: 'Thank you for subscribing! You will receive updates on new products and market reports.',
      subscriber,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ message: 'Failed to subscribe. Please try again later.' });
  }
}

/**
 * Admin: Get all subscribers
 * GET /api/subscribers
 */
export async function getAllSubscribers(req, res) {
  try {
    const { search = '', status = '' } = req.query;
    const query = {};

    if (search.trim()) {
      query.email = { $regex: search.trim(), $options: 'i' };
    }
    if (status) {
      query.status = status;
    }

    const subscribers = await Subscriber.find(query).sort({ subscribedAt: -1 });
    const totalCount = await Subscriber.countDocuments();
    const activeCount = await Subscriber.countDocuments({ status: 'active' });

    res.json({
      subscribers,
      totalCount,
      activeCount,
    });
  } catch (error) {
    console.error('Fetch subscribers error:', error);
    res.status(500).json({ message: 'Failed to retrieve subscribers.' });
  }
}

/**
 * Admin: Delete a subscriber
 * DELETE /api/subscribers/:id
 */
export async function deleteSubscriber(req, res) {
  try {
    const { id } = req.params;
    const subscriber = await Subscriber.findByIdAndDelete(id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found.' });
    }
    res.json({ message: 'Subscriber removed successfully.' });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({ message: 'Failed to delete subscriber.' });
  }
}

/**
 * Admin: Broadcast a message to all active subscribers
 * POST /api/subscribers/broadcast
 */
export async function broadcastMessage(req, res) {
  try {
    const { subject, message, link } = req.body;
    if (!subject || !subject.trim()) {
      return res.status(400).json({ message: 'Subject is required for broadcast.' });
    }

    const activeSubscribers = await Subscriber.find({ status: 'active' }).select('email');
    const recipientEmails = activeSubscribers.map((s) => s.email);
    const recipientCount = recipientEmails.length;
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    // HTML email content
    const html = buildEmailTemplate({
      subject: subject.trim(),
      message: message ? message.trim() : '',
      link: link ? link.trim() : '',
      clientUrl,
    });

    // Actually dispatch emails via nodemailer sendEmail utility
    const dispatchPromises = recipientEmails.map((email) =>
      sendEmail({
        to: email,
        subject: subject.trim(),
        html,
      }).catch((e) => ({ error: e.message, email }))
    );

    // Run in parallel
    Promise.allSettled(dispatchPromises).catch((e) => console.error('Dispatch error:', e));

    // Record the broadcast log in MongoDB with full recipient email array
    const log = await BroadcastLog.create({
      type: 'manual',
      subject: subject.trim(),
      message: message ? message.trim() : '',
      link: link ? link.trim() : '',
      recipientCount,
      recipientEmails,
      status: 'sent',
      sentAt: new Date(),
    });

    console.log(`[Broadcast] Dispatched email announcement "${subject}" to ${recipientCount} subscribers (${recipientEmails.join(', ')}).`);

    res.status(201).json({
      message: `Broadcast successfully sent to ${recipientCount} active subscriber(s).`,
      log,
      recipientCount,
      recipientEmails,
    });
  } catch (error) {
    console.error('Broadcast message error:', error);
    res.status(500).json({ message: 'Failed to send broadcast.' });
  }
}

/**
 * Admin: Send a single test email to verify delivery
 * POST /api/subscribers/test-email
 */
export async function testBroadcastEmail(req, res) {
  try {
    const rawEmail = req.body.email || req.body.targetEmail;
    const { subject = 'Test NMC Broadcast Email', message, link = '/products' } = req.body;
    if (!rawEmail || !rawEmail.trim()) {
      return res.status(400).json({ message: 'Target email is required.' });
    }
    const email = rawEmail.trim();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const html = buildEmailTemplate({
      subject: subject.trim(),
      message: message || 'This is a test broadcast email from the NMC Exporter admin panel.',
      link,
      clientUrl,
    });

    const result = await sendEmail({
      to: email.trim(),
      subject: `[TEST] ${subject.trim()}`,
      html,
    });

    res.json({
      message: `Test email dispatched to ${email}.`,
      result,
      preview: { to: email, subject, html },
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ message: 'Failed to send test email: ' + error.message });
  }
}

/**
 * Admin: Get broadcast history logs
 * GET /api/subscribers/broadcasts
 */
export async function getBroadcastLogs(req, res) {
  try {
    const logs = await BroadcastLog.find().sort({ sentAt: -1 }).limit(50);
    res.json(logs);
  } catch (error) {
    console.error('Fetch broadcast logs error:', error);
    res.status(500).json({ message: 'Failed to retrieve broadcast logs.' });
  }
}

/**
 * Automated helper: called whenever a new blog post or product is published
 */
export async function notifySubscribers({ type, title, slug, excerpt = '' }) {
  try {
    const activeSubscribers = await Subscriber.find({ status: 'active' }).select('email');
    const recipientEmails = activeSubscribers.map((s) => s.email);
    const count = recipientEmails.length;
    if (count === 0) return;

    const subject = type === 'blog'
      ? `📰 New Blog Post: ${title}`
      : `📦 New Product Arrival: ${title}`;

    const link = type === 'blog' ? `/blog/${slug}` : `/product-details/${slug}`;
    const message = excerpt || (type === 'blog'
      ? `We just published a new article: "${title}". Read it on our website.`
      : `We have added a new export commodity to our catalogue: "${title}". Check out specifications and request pricing.`);

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const html = buildEmailTemplate({
      subject,
      message,
      link,
      clientUrl,
    });

    // Actually dispatch emails to all subscribers
    recipientEmails.forEach((email) => {
      sendEmail({
        to: email,
        subject,
        html,
      }).catch((e) => console.log(`Auto notification email to ${email} status:`, e.message));
    });

    const log = await BroadcastLog.create({
      type,
      subject,
      message,
      link,
      recipientCount: count,
      recipientEmails,
      status: 'sent',
      sentAt: new Date(),
    });

    console.log(`[Auto Broadcast] Sent email notifications to ${count} subscribers (${recipientEmails.join(', ')}) about new ${type}: "${title}"`);
    return log;
  } catch (error) {
    console.error('Automatic broadcast notification failed:', error);
  }
}
