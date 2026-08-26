import nodemailer from 'nodemailer';

// Sends mail via SMTP if configured; otherwise logs to console so the app
// still works out of the box during development.
export const sendEmail = async ({ to, subject, html, replyTo }) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_USER) {
    console.log('\n[email skipped — SMTP not configured]');
    console.log(`  to: ${to}`);
    console.log(`  subject: ${subject}\n`);
    return { skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: MAIL_FROM || SMTP_USER,
    to,
    subject,
    html,
    replyTo,
  });
  return { sent: true };
};

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
