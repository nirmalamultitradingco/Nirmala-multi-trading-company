import { useEffect, useState, useMemo } from 'react';
import api from '../../api/axios.js';

const statusStyles = {
  new: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
  read: 'bg-sky-100 text-sky-900 border-sky-300 font-semibold',
  responded: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold',
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function Inquiries() {
  const [items, setItems] = useState([]);
  const [segments, setSegments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(null); // currently expanded inquiry id
  const [copiedId, setCopiedId] = useState(null);
  const [replyInquiry, setReplyInquiry] = useState(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [copiedDraft, setCopiedDraft] = useState(false);

  const load = () => {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (segmentFilter) params.segment = segmentFilter;
    if (search.trim()) params.search = search.trim();

    return api.get('/inquiries', { params }).then((r) => setItems(r.data));
  };

  useEffect(() => {
    api.get('/segments', { params: { all: true } }).then((r) => setSegments(r.data || []));
  }, []);

  useEffect(() => {
    load();
    /* eslint-disable-next-line */
  }, [statusFilter, segmentFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    load();
  };

  const setStatus = async (id, status) => {
    await api.patch(`/inquiries/${id}`, { status });
    load();
  };

  const remove = async (i) => {
    if (!confirm(`Delete inquiry from ${i.name}?`)) return;
    await api.delete(`/inquiries/${i._id}`);
    load();
  };

  const handleOpenReply = (inquiry) => {
    const interest = getInterestMeta(inquiry).name;
    const defaultSubject = `Re: Inquiry regarding ${interest} - Nirmala Multi Trading Co.`;
    const defaultBody = `Dear ${inquiry.name},

Thank you for contacting Nirmala Multi Trading Co. regarding your export inquiry about ${interest}.

In response to your query:
"${inquiry.message}"

We are pleased to assist you with export-grade supply, Sortex optical grading, phytosanitary lab testing, and scheduled container dispatch from Mundra Port (Gujarat) / JNPT (Mumbai).

Could you please confirm:
1. Your preferred destination port (FOB or CIF terms)?
2. Approximate volume / packaging requirement?
3. Would you like us to dispatch physical sample kits for quality evaluation?

Best regards,

Exports & International Trade Desk
Nirmala Multi Trading Co.
Email: info@nirmalamultitrading.com
Phone / WhatsApp: +91 94263 70966
Website: https://nirmalamultitrading.com`;

    setReplyInquiry(inquiry);
    setReplySubject(defaultSubject);
    setReplyBody(defaultBody);
    setCopiedDraft(false);
  };

  const sendViaMailto = () => {
    if (!replyInquiry) return;
    const mailtoUrl = `mailto:${encodeURIComponent(replyInquiry.email)}?subject=${encodeURIComponent(
      replySubject
    )}&body=${encodeURIComponent(replyBody)}`;
    window.location.href = mailtoUrl;
    setStatus(replyInquiry._id, 'responded');
  };

  const openInGmail = () => {
    if (!replyInquiry) return;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      replyInquiry.email
    )}&su=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    setStatus(replyInquiry._id, 'responded');
  };

  const copyReplyDraft = () => {
    const fullDraft = `To: ${replyInquiry.email}\nSubject: ${replySubject}\n\n${replyBody}`;
    navigator.clipboard?.writeText(fullDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  const copyMessage = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getInterestMeta = (i) => {
    if (i.segment?.name) {
      return {
        type: 'Segment',
        name: i.segment.name,
        badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        icon: '🏷️',
      };
    }
    if (i.product?.name) {
      return {
        type: 'Product',
        name: i.product.name,
        badgeStyle: 'bg-blue-50 text-blue-800 border-blue-200',
        icon: '📦',
      };
    }
    if (i.productInterest && i.productInterest !== 'General inquiry') {
      return {
        type: 'Interest',
        name: i.productInterest,
        badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
        icon: '⭐',
      };
    }
    return {
      type: 'General',
      name: 'General inquiry',
      badgeStyle: 'bg-stone-100 text-stone-700 border-stone-200',
      icon: '💬',
    };
  };

  // Metrics
  const stats = useMemo(() => {
    const total = items.length;
    const newCount = items.filter((i) => i.status === 'new').length;
    const respondedCount = items.filter((i) => i.status === 'responded').length;
    return { total, newCount, respondedCount };
  }, [items]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header and KPI bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Inquiries</h1>
          <p className="mt-1 text-sm text-ink/60">
            Messages & export inquiries submitted through the website form.
          </p>
        </div>

        {/* Quick summary counts */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-line bg-white px-4 py-2 text-center shadow-sm">
            <span className="text-xs uppercase tracking-wider text-moss font-mono">Total</span>
            <p className="font-display text-lg font-bold text-ink">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-line bg-amber-50/60 px-4 py-2 text-center shadow-sm">
            <span className="text-xs uppercase tracking-wider text-amber-800 font-mono">New</span>
            <p className="font-display text-lg font-bold text-amber-900">{stats.newCount}</p>
          </div>
          <div className="rounded-xl border border-line bg-emerald-50/60 px-4 py-2 text-center shadow-sm">
            <span className="text-xs uppercase tracking-wider text-emerald-800 font-mono">Responded</span>
            <p className="font-display text-lg font-bold text-emerald-900">{stats.respondedCount}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Status filter buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-ink/50 mr-1 uppercase tracking-wider font-mono">Status:</span>
            {['', 'new', 'read', 'responded'].map((s) => (
              <button
                key={s || 'all'}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  statusFilter === s
                    ? 'bg-forest text-paper shadow-sm'
                    : 'border border-line text-ink/70 hover:bg-paper'
                }`}
              >
                {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Statuses'}
              </button>
            ))}
          </div>

          {/* Segment dropdown filter & Search form */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Segment filter dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="segmentFilter" className="text-xs font-semibold text-ink/50 uppercase tracking-wider font-mono">
                Segment:
              </label>
              <select
                id="segmentFilter"
                value={segmentFilter}
                onChange={(e) => setSegmentFilter(e.target.value)}
                className="rounded-lg border border-line bg-paper px-3 py-1.5 text-xs text-ink font-medium focus:outline-none focus:ring-1 focus:ring-forest"
              >
                <option value="">All Segments</option>
                {segments.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Keyword search */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Search inquiries…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 sm:w-56 rounded-lg border border-line bg-paper px-3 py-1.5 text-xs text-ink placeholder:text-ink/40 focus:outline-none focus:ring-1 focus:ring-forest"
              />
              <button type="submit" className="btn-primary text-xs px-3 py-1.5">
                Search
              </button>
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setTimeout(load, 50);
                  }}
                  className="text-xs text-ink/50 hover:text-ink underline"
                >
                  Clear
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Inquiry List */}
      <div className="grid gap-3">
        {items.map((i) => {
          const interestMeta = getInterestMeta(i);
          const isExpanded = open === i._id;

          return (
            <div
              key={i._id}
              className={`rounded-2xl border transition duration-150 ${
                isExpanded
                  ? 'border-forest/40 bg-white shadow-md'
                  : 'border-line bg-white hover:border-moss/40 shadow-card'
              } p-5`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <p className="font-display text-base font-bold text-ink">{i.name}</p>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${
                        statusStyles[i.status] || 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {i.status}
                    </span>

                    {/* Interest Badge */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${interestMeta.badgeStyle}`}
                    >
                      <span>{interestMeta.icon}</span>
                      <span>{interestMeta.name}</span>
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-ink/65">
                    <a href={`mailto:${i.email}`} className="font-medium text-forest hover:underline">
                      {i.email}
                    </a>
                    {i.phone && <span> · <span className="font-mono text-xs">{i.phone}</span></span>}
                    {i.company && <span> · <span className="font-medium">{i.company}</span></span>}
                    {i.country && <span className="text-ink/60"> ({i.country})</span>}
                  </p>

                  <p className="mt-1 font-mono text-[11px] text-ink/40">
                    Received: {fmtDate(i.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenReply(i)}
                    className="rounded-lg bg-forest px-3 py-1.5 text-xs font-bold text-white shadow-xs transition hover:bg-forest/90 flex items-center gap-1.5"
                  >
                    <span>✉️</span>
                    <span>Reply</span>
                  </button>

                  <button
                    className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                      isExpanded
                        ? 'border-forest bg-forest text-paper'
                        : 'border-line text-ink hover:bg-paper'
                    }`}
                    onClick={() => setOpen(isExpanded ? null : i._id)}
                  >
                    {isExpanded ? 'Collapse' : 'View Details'}
                  </button>
                </div>
              </div>

              {/* Expanded details view */}
              {isExpanded && (
                <div className="mt-4 border-t border-line pt-4 space-y-4">
                  {/* Detailed Information Grid */}
                  <div className="grid gap-3 rounded-xl bg-paper/60 p-4 sm:grid-cols-2 md:grid-cols-3 text-xs">
                    <div>
                      <span className="font-mono uppercase tracking-wider text-moss">Product of Interest</span>
                      <p className="mt-0.5 font-semibold text-ink text-sm flex items-center gap-1.5">
                        <span>{interestMeta.icon}</span>
                        <span>{interestMeta.name}</span>
                        <span className="text-[11px] font-normal text-ink/50">({interestMeta.type})</span>
                      </p>
                    </div>

                    <div>
                      <span className="font-mono uppercase tracking-wider text-moss">Company & Country</span>
                      <p className="mt-0.5 font-semibold text-ink text-sm">
                        {i.company || '—'} {i.country ? `· ${i.country}` : ''}
                      </p>
                    </div>

                    <div>
                      <span className="font-mono uppercase tracking-wider text-moss">Phone Number</span>
                      <p className="mt-0.5 font-semibold text-ink text-sm">
                        {i.phone ? <a href={`tel:${i.phone}`} className="hover:underline">{i.phone}</a> : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Message container */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono uppercase tracking-wider text-moss">Message Content</span>
                      <button
                        onClick={() => copyMessage(i._id, i.message)}
                        className="text-xs text-forest hover:underline font-medium"
                      >
                        {copiedId === i._id ? '✓ Copied' : 'Copy message'}
                      </button>
                    </div>
                    <div className="rounded-xl border border-line bg-white p-4">
                      <p className="whitespace-pre-line text-sm leading-relaxed text-ink/85 font-sans">
                        {i.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono text-ink/50">Set Status:</span>
                      {['new', 'read', 'responded']
                        .filter((s) => s !== i.status)
                        .map((s) => (
                          <button
                            key={s}
                            className="btn-outline text-xs py-1.5 px-3"
                            onClick={() => setStatus(i._id, s)}
                          >
                            Mark as {s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      <button
                        type="button"
                        onClick={() => handleOpenReply(i)}
                        className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                      >
                        <span>✉️</span>
                        <span>Reply from Mail</span>
                      </button>
                    </div>

                    <button
                      className="text-xs font-semibold text-clay hover:underline"
                      onClick={() => remove(i)}
                    >
                      Delete Inquiry
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="rounded-2xl border border-line bg-white p-12 text-center shadow-card">
            <span className="text-3xl">📭</span>
            <h3 className="mt-3 font-display text-lg font-bold text-ink">No inquiries found</h3>
            <p className="mt-1 text-sm text-ink/50">
              {statusFilter || segmentFilter || search
                ? 'Try changing or clearing your search and filter parameters.'
                : 'No export inquiries have been submitted through the website yet.'}
            </p>
          </div>
        )}
      </div>

      {/* DIRECT EMAIL REPLY MODAL */}
      {replyInquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl rounded-3xl border border-line bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line bg-gradient-to-r from-[#0d1e17] to-[#16382b] px-6 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">✉️</span>
                <div>
                  <h3 className="font-display text-base font-bold text-white">
                    Direct Email Reply to {replyInquiry.name}
                  </h3>
                  <p className="text-xs text-paper/70">
                    Recipient: <span className="font-mono text-gold">{replyInquiry.email}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReplyInquiry(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Buyer & Message Recap */}
              <div className="rounded-xl border border-line bg-paper/60 p-3.5 text-xs space-y-1">
                <div className="flex items-center justify-between text-ink/60">
                  <span>
                    Company: <strong>{replyInquiry.company || 'Individual / Buyer'}</strong> (
                    {replyInquiry.country || 'International'})
                  </span>
                  <span>Phone: {replyInquiry.phone || '—'}</span>
                </div>
                <div className="mt-1 pt-1.5 border-t border-line/60 text-ink/80 italic">
                  "{replyInquiry.message}"
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="label text-xs">Email Subject Line</label>
                <input
                  type="text"
                  autoFocus
                  className="field text-xs font-semibold"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                />
              </div>

              {/* Email Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="label text-xs mb-0">Email Message Draft</label>
                  <span className="text-[11px] text-ink/40">You can customize this before launching your email client</span>
                </div>
                <textarea
                  rows="10"
                  className="field text-xs font-sans leading-relaxed"
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                />
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-[#faf8f4] px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyReplyDraft}
                  className="rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-semibold text-ink shadow-xs hover:border-gold hover:text-forest transition"
                >
                  {copiedDraft ? '✓ Copied to Clipboard' : '📋 Copy Draft'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStatus(replyInquiry._id, 'responded');
                    setReplyInquiry(null);
                  }}
                  className="rounded-xl border border-line bg-white px-3.5 py-2 text-xs font-semibold text-moss shadow-xs hover:border-moss transition"
                >
                  ✓ Mark as Responded
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openInGmail}
                  className="rounded-xl border border-line bg-white px-4 py-2 text-xs font-bold text-red-600 shadow-sm hover:bg-red-50 hover:border-red-300 transition flex items-center gap-1.5"
                  title="Open compose in Gmail web browser"
                >
                  <span>🔴</span>
                  <span>Open in Gmail Web</span>
                </button>

                <button
                  type="button"
                  onClick={sendViaMailto}
                  className="rounded-xl bg-forest px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-forest/90 transition flex items-center gap-1.5"
                  title="Launch in your computer's default mail client (Outlook, Apple Mail, Thunderbird)"
                >
                  <span>🚀</span>
                  <span>Launch Mail App</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
