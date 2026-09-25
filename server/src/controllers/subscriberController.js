import Subscriber from '../models/Subscriber.js';
import BroadcastLog from '../models/BroadcastLog.js';
import { sendEmail, getSmtpConfigInfo } from '../utils/sendEmail.js';

// Helper: build luxury HTML email template with responsive styling and unsubscribe link
function buildEmailTemplate({
  subject,
  message,
  link,
  recipientEmail,
  clientUrl = process.env.CLIENT_URL || 'http://localhost:5173',
  isWelcome = false,
}) {
  const fullLink = link ? (link.startsWith('http') ? link : `${clientUrl}${link}`) : clientUrl;
  const unsubscribeLink = recipientEmail
    ? `${clientUrl}/unsubscribe?email=${encodeURIComponent(recipientEmail)}`
    : `${clientUrl}/unsubscribe`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { margin: 0; padding: 0; background-color: #f6f3eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c221e; }
        .wrapper { width: 100%; max-width: 620px; margin: 32px auto; background: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #e5dfd3; box-shadow: 0 10px 30px rgba(15,43,32,0.08); }
        .header { background: #0f2b20; padding: 36px 28px; text-align: center; border-bottom: 3px solid #c89b3c; }
        .badge { display: inline-block; background: rgba(200, 155, 60, 0.2); border: 1px solid #c89b3c; color: #fdfaf3; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2.5px; padding: 4px 12px; border-radius: 50px; margin-bottom: 12px; }
        .header h1 { color: #fdfaf3; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.5px; line-height: 1.3; }
        .content { padding: 36px 32px; color: #2a332d; font-size: 15px; line-height: 1.7; }
        .headline { font-size: 18px; font-weight: 700; color: #0f2b20; margin-top: 0; margin-bottom: 16px; }
        .message-body { margin: 18px 0 28px 0; white-space: pre-line; color: #3b473f; font-size: 15px; }
        .card { background: #fbf9f4; border: 1px solid #ede8dc; border-radius: 12px; padding: 20px; margin: 24px 0; }
        .card-item { margin-bottom: 10px; font-size: 13px; color: #4a544f; }
        .card-item strong { color: #0f2b20; }
        .btn { display: inline-block; background-color: #c89b3c; color: #0b1a13 !important; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 32px; border-radius: 12px; letter-spacing: 0.3px; text-align: center; }
        .btn:hover { background-color: #d8aa49; }
        .footer { background: #0b1a13; padding: 28px 24px; text-align: center; font-size: 12px; color: #8f9b93; line-height: 1.6; }
        .footer p { margin: 6px 0; }
        .footer a { color: #c89b3c; text-decoration: underline; }
        .badges-row { margin: 14px 0; font-size: 11px; color: #c89b3c; font-family: monospace; letter-spacing: 1px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <span class="badge">NIRMALA MULTI TRADING CO. • EXPORTER INTELLIGENCE</span>
          <h1>${subject}</h1>
        </div>
        <div class="content">
          ${isWelcome ? `<h2 class="headline">Welcome to Verified Indian Agro Trade Updates</h2>` : ''}
          <div class="message-body">${message || 'We are pleased to share our latest harvest update and export catalogue availability.'}</div>
          
          <div class="card">
            <div class="card-item"><strong>Origin Hubs:</strong> Gujarat (Unjha, Saurashtra, Mahuva) & North India Clusters</div>
            <div class="card-item"><strong>Port Clearance:</strong> Mundra Port (INMUN1) & Nhava Sheva (JNPT, Mumbai)</div>
            <div class="card-item"><strong>Quality Guarantee:</strong> 100% Sortex Cleaned, ASTA & European MRL Compliance</div>
          </div>

          ${
            link
              ? `<div style="text-align: center; margin: 32px 0;">
                  <a href="${fullLink}" class="btn">View On Website →</a>
                </div>`
              : `<div style="text-align: center; margin: 32px 0;">
                  <a href="${clientUrl}/products" class="btn">Explore Product Catalog →</a>
                </div>`
          }
        </div>
        <div class="footer">
          <div class="badges-row">APEDA REG. • SPICE BOARD INDIA • FSSAI CERTIFIED</div>
          <p>© ${new Date().getFullYear()} Nirmala Multi Trading Co. All rights reserved.</p>
          <p>Mundra Port Ocean Freight & Global Containerized Logistics.</p>
          <p>Official Contact: <a href="mailto:nirmalamultitradingco@gmail.com">nirmalamultitradingco@gmail.com</a> | +91 7069826082</p>
          <p style="margin-top: 14px; font-size: 11px; color: #69786f;">
            You received this export intelligence update because you subscribed to market alerts at <a href="${clientUrl}">nirmalamultitrading.com</a>.
            <br>
            <a href="${unsubscribeLink}">Click here to unsubscribe</a> from these alerts.
          </p>
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
    let isReactivation = false;

    if (subscriber) {
      if (subscriber.status === 'unsubscribed') {
        subscriber.status = 'active';
        subscriber.subscribedAt = new Date();
        subscriber.unsubscribedAt = null;
        await subscriber.save();
        isReactivation = true;
      } else {
        return res.json({
          message: 'You are already subscribed to our export market updates.',
          subscriber,
        });
      }
    } else {
      subscriber = await Subscriber.create({
        email: cleanEmail,
        source,
        status: 'active',
        subscribedAt: new Date(),
      });
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    // 1. Send welcome confirmation email to subscriber
    const welcomeHtml = buildEmailTemplate({
      subject: isReactivation
        ? 'Subscription Reactivated: Nirmala Multi Trading Co. Market Updates'
        : 'Welcome to Nirmala Multi Trading Co. Exporter Intelligence',
      message: isReactivation
        ? `Welcome back!\n\nYour subscription to Nirmala Multi Trading Co. export updates has been successfully reactivated.\n\nYou will receive timely notifications on fresh crop arrivals, Sortex grading, and ocean freight vessel openings.`
        : `Thank you for subscribing to Nirmala Multi Trading Co. export market intelligence.\n\nYou will now receive direct notifications on fresh seasonal crop arrivals, Sortex laser grading reports, lab purity certifications, and container availability from Mundra & JNPT ports.`,
      link: '/products',
      recipientEmail: cleanEmail,
      clientUrl,
      isWelcome: true,
    });

    let emailResult = null;
    try {
      emailResult = await sendEmail({
        to: cleanEmail,
        subject: isReactivation
          ? 'Subscription Reactivated — Nirmala Multi Trading Co.'
          : 'Welcome to Nirmala Multi Trading Co. Export Market Updates',
        html: welcomeHtml,
      });
    } catch (mailErr) {
      console.error('[Welcome Email Error]:', mailErr.message);
    }

    // 2. Notify Admin about the new subscriber
    const adminNotifyEmail = process.env.INQUIRY_NOTIFY_TO || process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    if (adminNotifyEmail) {
      sendEmail({
        to: adminNotifyEmail,
        subject: `🔔 New Subscriber Joined: ${cleanEmail}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #1a2e22;">
            <h2 style="color: #0f2b20;">New Newsletter / Market Subscriber</h2>
            <p><strong>Subscriber Email:</strong> ${cleanEmail}</p>
            <p><strong>Channel Source:</strong> ${source}</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Status:</strong> Active</p>
          </div>
        `,
      }).catch((e) => console.log('[Admin Subscriber Notification Log]:', e.message));
    }

    res.status(201).json({
      message: isReactivation
        ? 'Welcome back! Your subscription has been reactivated and a confirmation email was dispatched.'
        : 'Thank you for subscribing! A confirmation email has been dispatched to your inbox.',
      subscriber,
      deliveryMode: emailResult?.mode || 'live_smtp',
      previewUrl: emailResult?.previewUrl || null,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ message: 'Failed to subscribe. Please try again later.' });
  }
}

/**
 * Public: Unsubscribe email
 * POST or GET /api/subscribers/unsubscribe
 */
export async function unsubscribe(req, res) {
  try {
    const rawEmail = req.body?.email || req.query?.email;
    if (!rawEmail || !rawEmail.trim()) {
      return res.status(400).json({ message: 'Email address is required to unsubscribe.' });
    }

    const cleanEmail = rawEmail.trim().toLowerCase();
    const subscriber = await Subscriber.findOne({ email: cleanEmail });

    if (!subscriber) {
      return res.status(404).json({ message: 'Email address not found in our subscriber directory.' });
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.json({
      message: `The email address "${cleanEmail}" has been successfully unsubscribed from NMC export notifications.`,
      subscriber,
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ message: 'Failed to process unsubscribe request.' });
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

    if (recipientCount === 0) {
      return res.status(400).json({
        message: 'No active subscribers found to broadcast to. You need at least one active subscriber.',
      });
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    let successfulCount = 0;
    let failedCount = 0;
    const failedEmails = [];
    let samplePreviewUrl = '';
    let deliveryMode = 'live_smtp';

    // Dispatch emails to each active subscriber with personal unsubscribe link
    const dispatchPromises = recipientEmails.map(async (email) => {
      const personalHtml = buildEmailTemplate({
        subject: subject.trim(),
        message: message ? message.trim() : '',
        link: link ? link.trim() : '',
        recipientEmail: email,
        clientUrl,
      });

      try {
        const sendResult = await sendEmail({
          to: email,
          subject: subject.trim(),
          html: personalHtml,
        });

        if (sendResult?.sent) {
          successfulCount++;
          if (sendResult.mode === 'test_preview') {
            deliveryMode = 'test_preview';
            if (!samplePreviewUrl && sendResult.previewUrl) {
              samplePreviewUrl = sendResult.previewUrl;
            }
          }
        } else {
          failedCount++;
          failedEmails.push(email);
        }
      } catch (err) {
        failedCount++;
        failedEmails.push(email);
        console.error(`[Broadcast Error] Failed dispatch to ${email}:`, err.message);
      }
    });

    await Promise.all(dispatchPromises);

    const overallStatus = failedCount === 0 ? 'sent' : successfulCount > 0 ? 'partial' : 'failed';

    // Record the broadcast log in MongoDB with delivery stats
    const log = await BroadcastLog.create({
      type: 'manual',
      subject: subject.trim(),
      message: message ? message.trim() : '',
      link: link ? link.trim() : '',
      recipientCount,
      recipientEmails,
      status: overallStatus,
      deliveryMode,
      previewUrl: samplePreviewUrl,
      failedCount,
      failedEmails,
      sentAt: new Date(),
    });

    console.log(
      `[Broadcast Dispatched] Subject: "${subject}" | Total: ${recipientCount} | Success: ${successfulCount} | Failed: ${failedCount} | Mode: ${deliveryMode}`
    );

    const statusMessage =
      deliveryMode === 'test_preview'
        ? `Broadcast processed for ${successfulCount} subscriber(s) in Test Preview Mode.`
        : `Broadcast announcement successfully dispatched to ${successfulCount} active subscriber(s).`;

    res.status(201).json({
      message: statusMessage,
      log,
      recipientCount,
      successfulCount,
      failedCount,
      failedEmails,
      deliveryMode,
      previewUrl: samplePreviewUrl,
    });
  } catch (error) {
    console.error('Broadcast message error:', error);
    res.status(500).json({ message: 'Failed to send broadcast: ' + error.message });
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
      recipientEmail: email,
      clientUrl,
    });

    const result = await sendEmail({
      to: email,
      subject: `[TEST] ${subject.trim()}`,
      html,
    });

    const messageText =
      result?.mode === 'test_preview'
        ? `Test email generated in Preview Mode! Live preview link is ready.`
        : `Test email successfully dispatched to ${email} via SMTP.`;

    res.json({
      message: messageText,
      result,
      deliveryMode: result?.mode || 'live_smtp',
      previewUrl: result?.previewUrl || null,
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
 * Admin: Get live SMTP configuration status
 * GET /api/subscribers/smtp-status
 */
export async function getSmtpStatus(req, res) {
  try {
    const status = getSmtpConfigInfo();
    res.json(status);
  } catch (error) {
    console.error('Fetch SMTP status error:', error);
    res.status(500).json({ message: 'Failed to retrieve SMTP status.' });
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

    const subject =
      type === 'blog' ? `📰 New Blog Post: ${title}` : `📦 New Product Arrival: ${title}`;

    const link = type === 'blog' ? `/blog/${slug}` : `/product-details/${slug}`;
    const message =
      excerpt ||
      (type === 'blog'
        ? `We just published a new export market article: "${title}". Read comprehensive insights on our website.`
        : `We have added a new export commodity to our catalogue: "${title}". Check out specifications and request container freight quotes.`);

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    let samplePreviewUrl = '';
    let deliveryMode = 'live_smtp';
    let successfulCount = 0;
    let failedCount = 0;

    const promises = recipientEmails.map(async (email) => {
      const html = buildEmailTemplate({
        subject,
        message,
        link,
        recipientEmail: email,
        clientUrl,
      });

      try {
        const sendResult = await sendEmail({
          to: email,
          subject,
          html,
        });
        if (sendResult?.sent) {
          successfulCount++;
          if (sendResult.mode === 'test_preview') {
            deliveryMode = 'test_preview';
            if (!samplePreviewUrl && sendResult.previewUrl) {
              samplePreviewUrl = sendResult.previewUrl;
            }
          }
        } else {
          failedCount++;
        }
      } catch (e) {
        failedCount++;
        console.log(`Auto notification email to ${email} error:`, e.message);
      }
    });

    await Promise.all(promises);

    const log = await BroadcastLog.create({
      type,
      subject,
      message,
      link,
      recipientCount: count,
      recipientEmails,
      status: failedCount === 0 ? 'sent' : successfulCount > 0 ? 'partial' : 'failed',
      deliveryMode,
      previewUrl: samplePreviewUrl,
      failedCount,
      sentAt: new Date(),
    });

    console.log(
      `[Auto Broadcast] Dispatched notifications to ${successfulCount}/${count} subscribers about new ${type}: "${title}"`
    );
    return log;
  } catch (error) {
    console.error('Automatic broadcast notification failed:', error);
  }
}
