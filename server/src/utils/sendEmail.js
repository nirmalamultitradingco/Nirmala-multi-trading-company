import nodemailer from 'nodemailer';

let etherealTransporterPromise = null;

/**
 * Checks whether live SMTP credentials are configured in environment variables.
 */
export const isSmtpConfigured = () => {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_SERVICE } = process.env;
  if (SMTP_SERVICE && SMTP_USER && SMTP_PASS) return true;
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) return true;
  return false;
};

/**
 * Returns safe SMTP configuration metadata for admin status dashboards.
 */
export const getSmtpConfigInfo = () => {
  const configured = isSmtpConfigured();
  const host = process.env.SMTP_SERVICE
    ? `Service: ${process.env.SMTP_SERVICE}`
    : process.env.SMTP_HOST || 'Not configured';
  const rawUser = process.env.SMTP_USER || '';
  const maskedUser = rawUser
    ? rawUser.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + '*'.repeat(Math.min(b.length, 5)) + c)
    : 'None';

  return {
    isConfigured: configured,
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    user: maskedUser,
    from: process.env.MAIL_FROM || 'Nirmala Multi Trading Co. <no-reply@nmc.com>',
    mode: configured ? 'live_smtp' : 'test_preview',
  };
};

/**
 * Creates or retrieves the live SMTP transporter.
 */
const getLiveTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SERVICE, SMTP_SECURE } = process.env;

  if (SMTP_SERVICE) {
    return nodemailer.createTransport({
      service: SMTP_SERVICE,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      tls: { rejectUnauthorized: false },
    });
  }

  const port = Number(SMTP_PORT) || 587;
  const isSecure = SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: isSecure,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: false },
  });
};

/**
 * Creates a persistent test mailbox via Ethereal when SMTP credentials are not yet set.
 */
const getTestTransporter = async () => {
  if (!etherealTransporterPromise) {
    etherealTransporterPromise = (async () => {
      const account = await nodemailer.createTestAccount();
      console.log(`\n[SMTP Test Mode] Initialized Ethereal test inbox: ${account.user}`);
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: { user: account.user, pass: account.pass },
      });
      return { transporter, accountUser: account.user };
    })();
  }
  return etherealTransporterPromise;
};

/**
 * Sends mail via live SMTP if configured; otherwise uses Ethereal test inbox and
 * logs/returns a web preview URL so emails can be visually verified immediately.
 */
export const sendEmail = async ({ to, subject, html, text, replyTo, from }) => {
  const defaultFrom =
    process.env.MAIL_FROM ||
    (process.env.SMTP_USER ? `Nirmala Multi Trading Co. <${process.env.SMTP_USER}>` : 'Nirmala Multi Trading Co. <info@nirmalamultitrading.com>');
  const fromAddress = from || defaultFrom;

  // 1. Live SMTP Mode
  if (isSmtpConfigured()) {
    try {
      const transporter = getLiveTransporter();
      const info = await transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        html,
        text,
        replyTo,
      });
      console.log(`[Email Sent via SMTP] To: ${to} | Subject: "${subject}" | MessageId: ${info.messageId}`);
      return { sent: true, mode: 'live_smtp', messageId: info.messageId };
    } catch (smtpErr) {
      console.error(`[SMTP Error] Delivery failed to ${to}:`, smtpErr.message);
      throw smtpErr;
    }
  }

  // 2. Automated Test Preview Fallback (when SMTP credentials are blank/unconfigured)
  try {
    const { transporter, accountUser } = await getTestTransporter();
    const info = await transporter.sendMail({
      from: fromAddress.includes('@') ? fromAddress : `"NMC System" <${accountUser}>`,
      to,
      subject: `[TEST PREVIEW] ${subject}`,
      html,
      text,
      replyTo,
    });
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`\n================================================================`);
    console.log(`[EMAIL DISPATCHED — TEST PREVIEW MODE]`);
    console.log(`  To:          ${to}`);
    console.log(`  Subject:     ${subject}`);
    console.log(`  Preview URL: ${previewUrl}`);
    console.log(`================================================================\n`);
    return {
      sent: true,
      mode: 'test_preview',
      previewUrl,
      messageId: info.messageId,
      notice: 'Live SMTP credentials not configured in server/.env. Generated instant test preview link.',
    };
  } catch (err) {
    console.error('[Email Error in Test Fallback]:', err.message);
    return { sent: false, error: err.message, mode: 'test_preview' };
  }
};

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

