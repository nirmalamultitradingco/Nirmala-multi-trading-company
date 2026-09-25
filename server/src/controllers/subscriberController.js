import Subscriber from '../models/Subscriber.js';
import BroadcastLog from '../models/BroadcastLog.js';
import { sendEmail, getSmtpConfigInfo } from '../utils/sendEmail.js';

// Resolve asset URL to a complete, absolute URL for email clients
export function resolveEmailAssetUrl(src, clientUrl = process.env.CLIENT_URL || 'http://localhost:5173') {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  const cleanSrc = src.startsWith('/') ? src : `/${src}`;
  const base = process.env.PUBLIC_URL || clientUrl || 'http://localhost:5173';
  return `${base.replace(/\/+$/, '')}${cleanSrc}`;
}

/**
 * Build rich HTML email for a Blog post with full article content, cover photo,
 * attached photos, and structured sections (as it is).
 */
export function buildBlogEmailTemplate({
  blog,
  subject,
  message,
  recipientEmail,
  clientUrl = process.env.CLIENT_URL || 'http://localhost:5173',
}) {
  const blogTitle = subject || blog?.title || 'Export Market Update';
  const blogSlug = blog?.slug || '';
  const fullLink = `${clientUrl.replace(/\/+$/, '')}/blog/${blogSlug}`;
  const unsubscribeLink = recipientEmail
    ? `${clientUrl.replace(/\/+$/, '')}/unsubscribe?email=${encodeURIComponent(recipientEmail)}`
    : `${clientUrl.replace(/\/+$/, '')}/unsubscribe`;

  const coverImageUrl = blog?.image ? resolveEmailAssetUrl(blog.image, clientUrl) : '';
  const galleryImages = (blog?.images || []).map((img) => resolveEmailAssetUrl(img, clientUrl)).filter(Boolean);
  const sections = blog?.sections || [];

  // Content formatting: if custom message is provided and differs from default, use message + blog.content
  const rawBody = message && message !== blog?.excerpt
    ? `${message}\n\n${blog?.content || ''}`
    : (blog?.content || blog?.excerpt || message || '');

  const paragraphs = rawBody
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin: 0 0 16px 0; color: #2d3731; font-size: 15px; line-height: 1.8;">${p.replace(/\n/g, '<br>')}</p>`)
    .join('');

  const formattedDate = blog?.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${blogTitle}</title>
      <style>
        body { margin: 0; padding: 0; background-color: #f5f2e9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .wrapper { width: 100%; max-width: 640px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2dcce; box-shadow: 0 12px 36px rgba(15,43,32,0.09); }
        .header { background: #0f2b20; padding: 36px 30px 30px; text-align: center; border-bottom: 3px solid #c89b3c; }
        .badge { display: inline-block; background: rgba(200, 155, 60, 0.2); border: 1px solid #c89b3c; color: #fdfaf3; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2.5px; padding: 5px 14px; border-radius: 50px; margin-bottom: 14px; }
        .title { color: #fdfaf3; font-size: 24px; font-weight: 800; line-height: 1.3; margin: 0 0 10px 0; }
        .meta { color: #c89b3c; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 32px 30px; color: #2d3731; }
        .cover-photo { width: 100%; max-height: 360px; object-fit: cover; border-radius: 12px; margin-bottom: 24px; border: 1px solid #eae5d8; display: block; }
        .excerpt-box { background: #fbf9f4; border-left: 4px solid #c89b3c; padding: 18px 20px; border-radius: 0 12px 12px 0; margin-bottom: 24px; font-style: italic; color: #16382b; font-size: 14px; line-height: 1.7; }
        .section-card { background: #faf8f2; border: 1px solid #e8e3d5; border-radius: 12px; padding: 20px; margin: 24px 0; }
        .section-title { font-size: 17px; font-weight: 800; color: #0f2b20; margin: 0 0 10px 0; }
        .section-img { width: 100%; max-height: 260px; object-fit: cover; border-radius: 10px; margin-top: 14px; border: 1px solid #ddd7ca; display: block; }
        .gallery-grid { margin: 24px 0; }
        .gallery-title { font-size: 13px; font-weight: 800; color: #0f2b20; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
        .gallery-item { width: 100%; max-height: 240px; object-fit: cover; border-radius: 10px; border: 1px solid #e5dfd3; margin-bottom: 12px; display: block; }
        .btn-wrapper { text-align: center; margin: 36px 0 20px; }
        .btn { display: inline-block; background-color: #c89b3c; color: #0b1a13 !important; text-decoration: none; font-weight: 800; font-size: 14px; padding: 15px 36px; border-radius: 12px; text-align: center; }
        .footer { background: #0b1a13; padding: 30px 24px; text-align: center; font-size: 12px; color: #8f9b93; line-height: 1.6; }
        .footer a { color: #c89b3c; text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <span class="badge">📰 EXPORT INTELLIGENCE & MARKET NEWS</span>
          <h1 class="title">${blogTitle}</h1>
          <div class="meta">Published ${formattedDate} • Nirmala Multi Trading Co.</div>
        </div>

        <div class="content">
          ${coverImageUrl ? `<img src="${coverImageUrl}" alt="${blogTitle}" class="cover-photo" />` : ''}

          ${blog?.excerpt ? `<div class="excerpt-box">"${blog.excerpt}"</div>` : ''}

          <div class="article-body">
            ${paragraphs || '<p>Read comprehensive market coverage and container freight specifications on our official portal.</p>'}
          </div>

          ${
            sections.length > 0
              ? sections
                  .map(
                    (s) => `
                <div class="section-card">
                  ${s.subtitle ? `<h3 class="section-title">${s.subtitle}</h3>` : ''}
                  ${s.text ? `<p style="margin: 0; color: #3b473f; font-size: 14px; line-height: 1.7;">${s.text.replace(/\n/g, '<br>')}</p>` : ''}
                  ${s.image ? `<img src="${resolveEmailAssetUrl(s.image, clientUrl)}" alt="${s.subtitle || 'Article section'}" class="section-img" />` : ''}
                </div>
              `
                  )
                  .join('')
              : ''
          }

          ${
            galleryImages.length > 0
              ? `
              <div class="gallery-grid">
                <div class="gallery-title">📷 Attached Photos & Harvest Documentation</div>
                ${galleryImages
                  .map(
                    (imgUrl) => `
                  <img src="${imgUrl}" alt="Attached Documentation" class="gallery-item" />
                `
                  )
                  .join('')}
              </div>
            `
              : ''
          }

          <div class="btn-wrapper">
            <a href="${fullLink}" class="btn">Read Full Article & Share Online →</a>
          </div>
        </div>

        <div class="footer">
          <div style="margin-bottom: 12px; font-size: 11px; color: #c89b3c; font-family: monospace; letter-spacing: 1.5px;">APEDA REG. • SPICE BOARD INDIA • FSSAI CERTIFIED</div>
          <p style="margin: 4px 0;">© ${new Date().getFullYear()} Nirmala Multi Trading Co. All rights reserved.</p>
          <p style="margin: 4px 0;">Direct Mundra Port (INMUN1) Shipments & Global Ocean Freight Logistics.</p>
          <p style="margin: 14px 0 0; font-size: 11px; color: #69786f;">
            You received this newsletter because you subscribed at <a href="${clientUrl}">nirmalamultitrading.com</a>.
            <br>
            <a href="${unsubscribeLink}">Click here to unsubscribe</a>.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Build rich HTML email for New Product Arrivals with product photos,
 * complete specifications, packaging, MOQ, and origin (as it is).
 */
export function buildProductArrivalEmailTemplate({
  product,
  products,
  subject,
  message,
  recipientEmail,
  clientUrl = process.env.CLIENT_URL || 'http://localhost:5173',
}) {
  const isSingle = Boolean(product);
  const emailTitle = subject || (isSingle ? `🌟 New Product Arrival: ${product.name}` : '🌟 New Seasonal Export Product Arrivals');
  const unsubscribeLink = recipientEmail
    ? `${clientUrl.replace(/\/+$/, '')}/unsubscribe?email=${encodeURIComponent(recipientEmail)}`
    : `${clientUrl.replace(/\/+$/, '')}/unsubscribe`;

  const renderSingleProduct = (p) => {
    const photoUrl = p.image ? resolveEmailAssetUrl(p.image, clientUrl) : '';
    const productLink = p.slug ? `${clientUrl.replace(/\/+$/, '')}/product-details/${p.slug}` : `${clientUrl}/products`;

    return `
      ${photoUrl ? `<div style="text-align: center; margin: 20px 0;"><img src="${photoUrl}" alt="${p.name}" style="width: 100%; max-height: 360px; object-fit: contain; background: #fbf9f4; border-radius: 14px; padding: 14px; border: 1px solid #e5dfd3; display: block;" /></div>` : ''}

      <div style="background: #fbf9f4; border: 1px solid #ede8dc; border-radius: 14px; padding: 22px; margin: 24px 0;">
        <div style="font-size: 12px; font-weight: 800; color: #c89b3c; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">Export Commodity Specifications</div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #69786f; width: 40%;"><strong>Commodity Name:</strong></td>
            <td style="padding: 8px 0; color: #0f2b20; font-weight: 700;">${p.name}</td>
          </tr>
          ${p.categoryName ? `<tr><td style="padding: 8px 0; color: #69786f;"><strong>Category:</strong></td><td style="padding: 8px 0; color: #0f2b20;">${p.categoryName}</td></tr>` : ''}
          ${p.origin ? `<tr><td style="padding: 8px 0; color: #69786f;"><strong>Origin Mandi / Cluster:</strong></td><td style="padding: 8px 0; color: #0f2b20; font-weight: 600;">${p.origin}</td></tr>` : ''}
          ${p.hsCode ? `<tr><td style="padding: 8px 0; color: #69786f;"><strong>HS Code:</strong></td><td style="padding: 8px 0; color: #0f2b20; font-family: monospace;">${p.hsCode}</td></tr>` : ''}
          ${p.packageType ? `<tr><td style="padding: 8px 0; color: #69786f;"><strong>Export Packaging:</strong></td><td style="padding: 8px 0; color: #0f2b20;">${p.packageType}</td></tr>` : ''}
          ${p.moq ? `<tr><td style="padding: 8px 0; color: #69786f;"><strong>Minimum Order (MOQ):</strong></td><td style="padding: 8px 0; color: #0f2b20; font-weight: 600;">${p.moq}</td></tr>` : ''}
          <tr>
            <td style="padding: 8px 0; color: #69786f;"><strong>Sortex Quality Standard:</strong></td>
            <td style="padding: 8px 0; color: #16382b;">100% Optical Machine Cleaned (99.5% European Purity)</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #69786f;"><strong>Port Clearance:</strong></td>
            <td style="padding: 8px 0; color: #16382b;">Mundra Port (INMUN1) & JNPT Nhava Sheva</td>
          </tr>
        </table>

        ${p.shortDescription ? `
          <div style="margin-top: 18px; padding-top: 16px; border-top: 1px dashed #dcd5c7; color: #3b473f; font-size: 14px; line-height: 1.7;">
            <strong>Product Details & Description:</strong>
            <p style="margin: 6px 0 0;">${p.shortDescription.replace(/\n/g, '<br>')}</p>
          </div>
        ` : ''}
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${productLink}" style="display: inline-block; background-color: #c89b3c; color: #0b1a13 !important; text-decoration: none; font-weight: 800; font-size: 14px; padding: 15px 36px; border-radius: 12px;">Inspect Specifications & Request Quotation →</a>
      </div>
    `;
  };

  const renderMultipleProducts = (items) => {
    return items.map((p, idx) => {
      const photoUrl = p.image ? resolveEmailAssetUrl(p.image, clientUrl) : '';
      const productLink = p.slug ? `${clientUrl.replace(/\/+$/, '')}/product-details/${p.slug}` : `${clientUrl}/products`;

      return `
        <div style="background: #ffffff; border: 1px solid #e2dcce; border-radius: 14px; padding: 20px; margin-bottom: 24px; box-shadow: 0 4px 14px rgba(15,43,32,0.04);">
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; border-bottom: 1px solid #ede8dc; padding-bottom: 10px; margin-bottom: 14px;">
            <span style="font-size: 10px; font-weight: 800; color: #c89b3c; text-transform: uppercase; letter-spacing: 1.5px;">Arrival #${idx + 1} • ${p.categoryName || 'Commodity'}</span>
            <span style="font-size: 11px; font-weight: 600; color: #16382b; background: #f0f7f3; padding: 2px 8px; border-radius: 6px;">Origin: ${p.origin || 'India'}</span>
          </div>

          <h3 style="font-size: 18px; font-weight: 800; color: #0f2b20; margin: 0 0 12px 0;">${p.name}</h3>

          ${photoUrl ? `<div style="text-align: center; margin-bottom: 14px;"><img src="${photoUrl}" alt="${p.name}" style="width: 100%; max-height: 240px; object-fit: contain; background: #fbf9f4; border-radius: 10px; padding: 8px; border: 1px solid #eee8dc; display: block;" /></div>` : ''}

          <div style="font-size: 13px; color: #4a554e; line-height: 1.6; margin-bottom: 14px;">
            ${p.shortDescription || '100% Sortex cleaned export grade with certified international specifications.'}
          </div>

          <div style="background: #fbf9f4; border-radius: 8px; padding: 10px 14px; font-size: 12px; margin-bottom: 16px;">
            <div><strong>Packaging:</strong> ${p.packageType || '25kg Bags'} • <strong>MOQ:</strong> ${p.moq || '1 FCL'}${p.hsCode ? ` • <strong>HS:</strong> ${p.hsCode}` : ''}</div>
          </div>

          <a href="${productLink}" style="display: block; text-align: center; background: #0f2b20; color: #c89b3c !important; text-decoration: none; font-weight: 700; font-size: 13px; padding: 10px 20px; border-radius: 8px;">View ${p.name} Specs →</a>
        </div>
      `;
    }).join('');
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${emailTitle}</title>
      <style>
        body { margin: 0; padding: 0; background-color: #f5f2e9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
        .wrapper { width: 100%; max-width: 640px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2dcce; box-shadow: 0 12px 36px rgba(15,43,32,0.09); }
        .header { background: #0f2b20; padding: 36px 30px 30px; text-align: center; border-bottom: 3px solid #c89b3c; }
        .badge { display: inline-block; background: rgba(200, 155, 60, 0.2); border: 1px solid #c89b3c; color: #fdfaf3; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 2.5px; padding: 5px 14px; border-radius: 50px; margin-bottom: 14px; }
        .title { color: #fdfaf3; font-size: 24px; font-weight: 800; line-height: 1.3; margin: 0 0 10px 0; }
        .meta { color: #c89b3c; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 32px 30px; color: #2d3731; }
        .intro-msg { font-size: 15px; line-height: 1.8; color: #2d3731; margin-bottom: 24px; }
        .footer { background: #0b1a13; padding: 30px 24px; text-align: center; font-size: 12px; color: #8f9b93; line-height: 1.6; }
        .footer a { color: #c89b3c; text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <span class="badge">🌟 FRESH ARRIVAL • IMMEDIATE CONTAINER BOOKING</span>
          <h1 class="title">${emailTitle}</h1>
          <div class="meta">Direct Farm Mandi Sourcing • Sortex Laser Graded</div>
        </div>

        <div class="content">
          ${message ? `<div class="intro-msg">${message.replace(/\n/g, '<br>')}</div>` : ''}

          ${isSingle ? renderSingleProduct(product) : renderMultipleProducts(products || [])}
        </div>

        <div class="footer">
          <div style="margin-bottom: 12px; font-size: 11px; color: #c89b3c; font-family: monospace; letter-spacing: 1.5px;">APEDA REG. • SPICE BOARD INDIA • FSSAI CERTIFIED</div>
          <p style="margin: 4px 0;">© ${new Date().getFullYear()} Nirmala Multi Trading Co. All rights reserved.</p>
          <p style="margin: 4px 0;">Port-Direct Container Stuffing: Mundra Port (INMUN1) & JNPT Nhava Sheva.</p>
          <p style="margin: 14px 0 0; font-size: 11px; color: #69786f;">
            You received this notification because you are registered for harvest alerts at <a href="${clientUrl}">nirmalamultitrading.com</a>.
            <br>
            <a href="${unsubscribeLink}">Click here to unsubscribe</a>.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Helper: build luxury HTML email template with responsive styling, custom elements, and unsubscribe link
export function buildEmailTemplate({
  subject,
  heading,
  badge = 'NIRMALA MULTI TRADING CO. • EXPORTER INTELLIGENCE',
  message,
  link,
  buttonText = 'View On Website →',
  bannerImage,
  features,
  showDefaultCard = true,
  recipientEmail,
  clientUrl = process.env.CLIENT_URL || 'http://localhost:5173',
  isWelcome = false,
  customHtml,
}) {
  const fullLink = link ? (link.startsWith('http') ? link : `${clientUrl}${link}`) : clientUrl;
  const unsubscribeLink = recipientEmail
    ? `${clientUrl}/unsubscribe?email=${encodeURIComponent(recipientEmail)}`
    : `${clientUrl}/unsubscribe`;

  const bannerUrl = resolveEmailAssetUrl(bannerImage, clientUrl);

  // If the admin provides custom raw HTML, wrap it cleanly with styling and luxury footer
  if (customHtml && customHtml.trim()) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { margin: 0; padding: 0; background-color: #f6f3eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c221e; }
          .wrapper { width: 100%; max-width: 650px; margin: 24px auto; background: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #e5dfd3; box-shadow: 0 10px 30px rgba(15,43,32,0.08); }
          .header { background: #0f2b20; padding: 32px 24px; text-align: center; border-bottom: 3px solid #c89b3c; }
          .badge { display: inline-block; background: rgba(200, 155, 60, 0.2); border: 1px solid #c89b3c; color: #fdfaf3; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2.5px; padding: 4px 12px; border-radius: 50px; margin-bottom: 12px; }
          .header h1 { color: #fdfaf3; font-size: 22px; font-weight: 800; margin: 0; }
          .custom-content { padding: 32px 28px; }
          .footer { background: #0b1a13; padding: 28px 24px; text-align: center; font-size: 12px; color: #8f9b93; line-height: 1.6; }
          .footer a { color: #c89b3c; text-decoration: underline; }
          .badges-row { margin: 14px 0; font-size: 11px; color: #c89b3c; font-family: monospace; letter-spacing: 1px; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <span class="badge">${badge || 'NIRMALA MULTI TRADING CO.'}</span>
            <h1>${heading || subject}</h1>
          </div>
          <div class="custom-content">
            ${customHtml}
          </div>
          <div class="footer">
            <div class="badges-row">APEDA REG. • SPICE BOARD INDIA • FSSAI CERTIFIED</div>
            <p>© ${new Date().getFullYear()} Nirmala Multi Trading Co. All rights reserved.</p>
            <p>Mundra Port Ocean Freight & Global Containerized Logistics.</p>
            <p>Official Contact: <a href="mailto:nirmalamultitradingco@gmail.com">nirmalamultitradingco@gmail.com</a> | +91 7069826082</p>
            <p style="margin-top: 14px; font-size: 11px; color: #69786f;">
              You received this export update because you subscribed at <a href="${clientUrl}">nirmalamultitrading.com</a>.
              <br>
              <a href="${unsubscribeLink}">Click here to unsubscribe</a>.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Parse message: if contains HTML tags, use directly; otherwise render linebreaks
  const isHtmlMessage = /<[a-z][\s\S]*>/i.test(message);
  const formattedMessage = isHtmlMessage ? message : (message || '').replace(/\n/g, '<br>');

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
        .badge { display: inline-block; background: rgba(200, 155, 60, 0.2); border: 1px solid #c89b3c; color: #fdfaf3; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; padding: 4px 12px; border-radius: 50px; margin-bottom: 12px; }
        .header h1 { color: #fdfaf3; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.5px; line-height: 1.3; }
        .content { padding: 32px 28px; color: #2a332d; font-size: 15px; line-height: 1.7; }
        .banner { width: 100%; max-height: 280px; object-fit: cover; border-radius: 12px; margin-bottom: 24px; border: 1px solid #ede8dc; display: block; }
        .headline { font-size: 18px; font-weight: 700; color: #0f2b20; margin-top: 0; margin-bottom: 16px; }
        .message-body { margin: 18px 0 28px 0; color: #3b473f; font-size: 15px; line-height: 1.7; }
        .card { background: #fbf9f4; border: 1px solid #ede8dc; border-radius: 12px; padding: 20px; margin: 24px 0; }
        .card-item { margin-bottom: 10px; font-size: 13px; color: #4a544f; }
        .card-item:last-child { margin-bottom: 0; }
        .card-item strong { color: #0f2b20; }
        .btn-wrapper { text-align: center; margin: 32px 0; }
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
          <span class="badge">${badge}</span>
          <h1>${heading || subject}</h1>
        </div>
        <div class="content">
          ${bannerUrl ? `<img src="${bannerUrl}" alt="${subject}" class="banner" />` : ''}
          ${isWelcome ? `<h2 class="headline">Welcome to Verified Indian Agro Trade Updates</h2>` : ''}
          
          <div class="message-body">${formattedMessage || 'We are pleased to share our latest harvest update and export catalogue availability.'}</div>
          
          ${
            features && Array.isArray(features) && features.length > 0
              ? `<div class="card">
                  ${features
                    .map((f) =>
                      typeof f === 'string'
                        ? `<div class="card-item">• ${f}</div>`
                        : `<div class="card-item"><strong>${f.label}:</strong> ${f.value}</div>`
                    )
                    .join('')}
                </div>`
              : showDefaultCard
              ? `<div class="card">
                  <div class="card-item"><strong>Origin Hubs:</strong> Gujarat (Unjha, Saurashtra, Mahuva) & North India Clusters</div>
                  <div class="card-item"><strong>Port Clearance:</strong> Mundra Port (INMUN1) & Nhava Sheva (JNPT, Mumbai)</div>
                  <div class="card-item"><strong>Quality Guarantee:</strong> 100% Sortex Cleaned, ASTA & European MRL Compliance</div>
                </div>`
              : ''
          }

          ${
            link
              ? `<div class="btn-wrapper">
                  <a href="${fullLink}" class="btn">${buttonText || 'View On Website →'}</a>
                </div>`
              : ''
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
    const {
      subject,
      heading,
      badge,
      message,
      link,
      buttonText,
      bannerImage,
      features,
      showDefaultCard = true,
      customHtml,
      recipientEmails: customRecipients,
    } = req.body;

    if (!subject || !subject.trim()) {
      return res.status(400).json({ message: 'Subject is required for broadcast.' });
    }

    let recipientEmails = [];
    if (Array.isArray(customRecipients) && customRecipients.length > 0) {
      recipientEmails = customRecipients.map((e) => e.trim().toLowerCase()).filter(Boolean);
    } else {
      const activeSubscribers = await Subscriber.find({ status: 'active' }).select('email');
      recipientEmails = activeSubscribers.map((s) => s.email);
    }

    const recipientCount = recipientEmails.length;
    if (recipientCount === 0) {
      return res.status(400).json({
        message: 'No active subscribers selected or found to broadcast to. You need at least one subscriber.',
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
        heading: heading ? heading.trim() : subject.trim(),
        badge: badge ? badge.trim() : undefined,
        message: message ? message.trim() : '',
        link: link ? link.trim() : '',
        buttonText: buttonText ? buttonText.trim() : 'View On Website →',
        bannerImage: bannerImage ? bannerImage.trim() : undefined,
        features: Array.isArray(features) ? features : undefined,
        showDefaultCard,
        customHtml: customHtml ? customHtml.trim() : undefined,
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
        : `Broadcast announcement successfully dispatched to ${successfulCount} subscriber(s).`;

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
    const {
      subject = 'Test NMC Broadcast Email',
      heading,
      badge,
      message,
      link = '/products',
      buttonText = 'View On Website →',
      bannerImage,
      features,
      showDefaultCard = true,
      customHtml,
    } = req.body;

    if (!rawEmail || !rawEmail.trim()) {
      return res.status(400).json({ message: 'Target email is required.' });
    }
    const email = rawEmail.trim();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const html = buildEmailTemplate({
      subject: subject.trim(),
      heading: heading ? heading.trim() : subject.trim(),
      badge: badge ? badge.trim() : undefined,
      message: message || 'This is a test broadcast email from the NMC Exporter admin panel.',
      link,
      buttonText,
      bannerImage,
      features,
      showDefaultCard,
      customHtml,
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
 * Automated & direct helper: sends full content and attached photos to subscribers or test email
 */
export async function notifySubscribers({
  type,
  item,
  items,
  title,
  slug,
  excerpt = '',
  message = '',
  testEmail,
}) {
  try {
    let recipientEmails = [];
    if (testEmail && testEmail.trim()) {
      recipientEmails = [testEmail.trim()];
    } else {
      const activeSubscribers = await Subscriber.find({ status: 'active' }).select('email');
      recipientEmails = activeSubscribers.map((s) => s.email);
    }

    const count = recipientEmails.length;
    if (count === 0) return null;

    let emailSubject = title;
    if (!emailSubject) {
      if (type === 'blog') emailSubject = `📰 ${item?.title || 'New Export Intelligence Article'}`;
      else if (type === 'product') emailSubject = `🌟 New Product Arrival: ${item?.name || 'Export Commodity'}`;
      else if (type === 'arrivals_all') emailSubject = `🌟 New Seasonal Export Product Arrivals 2026`;
      else emailSubject = 'NMC Exporter Intelligence Update';
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    let samplePreviewUrl = '';
    let deliveryMode = 'live_smtp';
    let successfulCount = 0;
    let failedCount = 0;

    const promises = recipientEmails.map(async (email) => {
      let html = '';
      if (type === 'blog') {
        html = buildBlogEmailTemplate({
          blog: item,
          subject: emailSubject,
          message: message || excerpt || '',
          recipientEmail: email,
          clientUrl,
        });
      } else if (type === 'product') {
        html = buildProductArrivalEmailTemplate({
          product: item,
          subject: emailSubject,
          message: message || '',
          recipientEmail: email,
          clientUrl,
        });
      } else if (type === 'arrivals_all') {
        html = buildProductArrivalEmailTemplate({
          products: items,
          subject: emailSubject,
          message: message || '',
          recipientEmail: email,
          clientUrl,
        });
      } else {
        html = buildEmailTemplate({
          subject: emailSubject,
          message: message || excerpt || '',
          link: slug ? (type === 'blog' ? `/blog/${slug}` : `/product-details/${slug}`) : '/products',
          recipientEmail: email,
          clientUrl,
        });
      }

      try {
        const sendResult = await sendEmail({
          to: email,
          subject: testEmail ? `[TEST] ${emailSubject}` : emailSubject,
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
        console.log(`Notification email to ${email} error:`, e.message);
      }
    });

    await Promise.all(promises);

    const log = await BroadcastLog.create({
      type,
      subject: emailSubject,
      message: message || excerpt || (type === 'blog' ? item?.excerpt || item?.content?.slice(0, 180) : item?.shortDescription || ''),
      link: slug ? (type === 'blog' ? `/blog/${slug}` : `/product-details/${slug}`) : '/products',
      recipientCount: count,
      recipientEmails,
      status: failedCount === 0 ? 'sent' : successfulCount > 0 ? 'partial' : 'failed',
      deliveryMode,
      previewUrl: samplePreviewUrl,
      failedCount,
      sentAt: new Date(),
    });

    console.log(
      `[${testEmail ? 'TEST ' : ''}Broadcast] Sent to ${successfulCount}/${count} recipient(s) for ${type}: "${emailSubject}"`
    );
    return log;
  } catch (error) {
    console.error('Broadcast notification failed:', error);
    throw error;
  }
}

/**
 * Admin: Broadcast a new arrival product (single or all) with photos and specifications
 * POST /api/subscribers/broadcast-arrival
 */
export async function broadcastArrival(req, res) {
  try {
    const { product, products, subject, message, testEmail } = req.body;
    const isSingle = Boolean(product);
    const title = subject || (isSingle ? `🌟 New Product Arrival: ${product.name}` : '🌟 New Seasonal Export Product Arrivals');

    const log = await notifySubscribers({
      type: isSingle ? 'product' : 'arrivals_all',
      item: product,
      items: products,
      title,
      message,
      testEmail,
    });

    const statusMessage = testEmail
      ? `Test arrival email with full photos and specifications dispatched to ${testEmail}!`
      : isSingle
      ? `New arrival "${product.name}" with photos and specifications successfully broadcast to subscribers!`
      : `All seasonal product arrivals with photos and specifications successfully broadcast to subscribers!`;

    res.json({
      message: statusMessage,
      log,
      deliveryMode: log?.deliveryMode || 'live_smtp',
      previewUrl: log?.previewUrl || null,
    });
  } catch (error) {
    console.error('Broadcast arrival error:', error);
    res.status(500).json({ message: 'Failed to broadcast arrival: ' + error.message });
  }
}
