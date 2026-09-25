import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function ManageSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [broadcastLogs, setBroadcastLogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // SMTP status
  const [smtpStatus, setSmtpStatus] = useState(null);
  const [showSmtpGuide, setShowSmtpGuide] = useState(false);

  // Broadcast modal state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({ subject: '', message: '', link: '' });
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState(null);

  // Test email state
  const [testEmailTarget, setTestEmailTarget] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // View broadcast detail modal
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError('');
      const [subsRes, logsRes, smtpRes] = await Promise.all([
        api.get('/subscribers', { params: { search: search.trim() || undefined } }),
        api.get('/subscribers/broadcasts').catch(() => ({ data: [] })),
        api.get('/subscribers/smtp-status').catch(() => ({ data: null })),
      ]);
      setSubscribers(subsRes.data.subscribers || []);
      setTotalCount(subsRes.data.totalCount || 0);
      setActiveCount(subsRes.data.activeCount || 0);
      setBroadcastLogs(logsRes.data || []);
      if (smtpRes?.data) setSmtpStatus(smtpRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load subscribers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [search]);

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Are you sure you want to remove subscriber "${email}"?`)) return;
    try {
      await api.delete(`/subscribers/${id}`);
      setSuccessMsg(`Subscriber ${email} removed.`);
      setTimeout(() => setSuccessMsg(''), 4000);
      fetchSubscribers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete subscriber.');
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.subject.trim()) return;

    try {
      setSendingBroadcast(true);
      setBroadcastResult(null);
      const res = await api.post('/subscribers/broadcast', broadcastForm);
      setBroadcastResult(res.data);
      setSuccessMsg(res.data?.message || 'Broadcast announcement successfully dispatched!');
      fetchSubscribers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send broadcast.');
    } finally {
      setSendingBroadcast(false);
    }
  };

  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    if (!testEmailTarget.trim()) return;

    try {
      setSendingTest(true);
      setTestResult(null);
      const res = await api.post('/subscribers/test-email', {
        email: testEmailTarget.trim(),
        subject: broadcastForm.subject.trim() || 'NMC Exporter Intelligence Update',
        message:
          broadcastForm.message.trim() ||
          'This is a test notification from the Nirmala Multi Trading Co. admin workspace.',
        link: broadcastForm.link.trim() || '/products',
      });
      setTestResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send test email.');
    } finally {
      setSendingTest(false);
    }
  };

  const applyTemplate = (type) => {
    if (type === 'harvest') {
      setBroadcastForm({
        subject: '🌾 Fresh Harvest Alert: Gujarat Cumin & Sesame Lots Available',
        message:
          'We have commenced procurement of the new seasonal crop from farm clusters across Gujarat & Rajasthan.\n\n• Sortex Laser Graded: 99% & 99.5% European purity\n• Low moisture content (< 8.0%), aflatoxin compliant\n• Available in 25kg / 50kg multi-wall paper & PP packaging\n• Prompt 20ft & 40ft container stuffing at Mundra Port (INMUN1)',
        link: '/products',
      });
    } else if (type === 'freight') {
      setBroadcastForm({
        subject: '🚢 Ocean Container Freight Allocation: Mundra & JNPT Direct Sailings',
        message:
          'Special containerized ocean freight allocation available for immediate bookings:\n\n• Mundra to Jebel Ali / Dammam / Doha (Direct 3-5 days transit)\n• Mundra to Rotterdam / Hamburg / Felixstowe (Direct ocean line 18-24 days)\n• Commodities: Basmati Rice, Cumin Seeds, Turmeric, Dehydrated Onion Flakes\n• Available in FOB, CIF, or CFR incoterms.',
        link: '/inquiry',
      });
    } else if (type === 'catalog') {
      setBroadcastForm({
        subject: '📦 New Export Catalogue & Sortex Specification Release 2026',
        message:
          'We have updated our export commodity catalogue with comprehensive laboratory test certificates, MRL thresholds, and container stuffing specifications.\n\nBrowse full technical brochures and request formal FOB/CIF proforma quotations directly online.',
        link: '/brochures',
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccessMsg(`Copied "${text}" to clipboard.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const exportCSV = () => {
    if (!subscribers.length) return;
    const headers = ['Email,Status,SubscribedAt,Source'];
    const rows = subscribers.map(
      (s) =>
        `"${s.email}","${s.status}","${new Date(s.subscribedAt).toISOString()}","${s.source || 'footer'}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow font-mono text-gold">AUDIENCE & NEWSLETTER</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-ink">Subscribers</h1>
          <p className="mt-1 text-sm text-ink/60">
            Manage subscribed global buyers, verify live email delivery, and dispatch broadcast announcements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={exportCSV}
            disabled={!subscribers.length}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-semibold text-ink shadow-sm transition hover:bg-line/20 disabled:opacity-50"
          >
            <span>📥</span> Export CSV
          </button>
          <button
            type="button"
            onClick={() => {
              setBroadcastResult(null);
              setTestResult(null);
              setShowBroadcastModal(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-forest px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-forest/90"
          >
            <span>📢</span> Send Broadcast Announcement
          </button>
        </div>
      </div>

      {/* SMTP Live Delivery Status Banner */}
      <div
        className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-sm ${
          smtpStatus?.isConfigured
            ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900'
            : 'border-amber-200 bg-amber-50/80 text-amber-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <span className="text-2xl shrink-0">
              {smtpStatus?.isConfigured ? '🟢' : '🟡'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-sm font-bold">
                  {smtpStatus?.isConfigured
                    ? 'SMTP Live Email Sending Active'
                    : 'Email System: Test Preview Mode Active (Ethereal)'}
                </strong>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider ${
                    smtpStatus?.isConfigured
                      ? 'bg-emerald-200 text-emerald-800'
                      : 'bg-amber-200 text-amber-800'
                  }`}
                >
                  {smtpStatus?.mode || 'Active'}
                </span>
              </div>
              <p className="mt-1 text-xs opacity-85 leading-relaxed">
                {smtpStatus?.isConfigured
                  ? `Emails are dispatched live via SMTP Host: ${smtpStatus.host} (${smtpStatus.user}) • Sender: "${smtpStatus.from}"`
                  : 'Live SMTP credentials are not yet configured in server/.env. Test mailbox is running — all subscriber emails and broadcasts generate live clickable web preview links.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSmtpGuide(!showSmtpGuide)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-sm border ${
              smtpStatus?.isConfigured
                ? 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-100/50'
                : 'bg-amber-700 text-white border-amber-800 hover:bg-amber-800'
            }`}
          >
            {showSmtpGuide ? 'Hide Setup Guide ✕' : '⚙️ SMTP Configuration Guide'}
          </button>
        </div>

        {/* Collapsible SMTP Guide */}
        {showSmtpGuide && (
          <div className="mt-4 rounded-xl border border-black/10 bg-white/90 p-4 text-xs space-y-3 text-ink">
            <h4 className="font-bold text-sm text-ink">
              How to configure live email delivery in <code className="font-mono text-forest">server/.env</code>:
            </h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-stone-50 p-3 border border-stone-200">
                <strong className="block text-ink font-semibold mb-1">Option A: Gmail SMTP (Recommended)</strong>
                <p className="text-ink/70 text-[11px] mb-2 leading-relaxed">
                  1. In your Google Account, enable 2-Step Verification.<br/>
                  2. Generate an <strong>App Password</strong> (Security → App Passwords).<br/>
                  3. Paste the following in <code className="font-mono">server/.env</code>:
                </p>
                <pre className="rounded bg-ink p-2 text-[11px] text-paper font-mono overflow-x-auto">
{`SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=nirmalamultitradingco@gmail.com
SMTP_PASS=your-16-char-app-password
MAIL_FROM="Nirmala Multi Trading Co. <nirmalamultitradingco@gmail.com>"`}
                </pre>
              </div>

              <div className="rounded-lg bg-stone-50 p-3 border border-stone-200">
                <strong className="block text-ink font-semibold mb-1">Option B: Custom SMTP / Brevo / SendGrid</strong>
                <p className="text-ink/70 text-[11px] mb-2 leading-relaxed">
                  Provide your company SMTP server host and port:
                </p>
                <pre className="rounded bg-ink p-2 text-[11px] text-paper font-mono overflow-x-auto">
{`SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
MAIL_FROM="Nirmala Multi Trading Co. <sales@nmc.com>"`}
                </pre>
              </div>
            </div>
            <p className="text-[11px] text-ink/60">
              * Note: Restart the server after updating <code className="font-mono font-bold">server/.env</code> to load new credentials.
            </p>
          </div>
        )}
      </div>

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-sm flex items-center justify-between">
          <span>✓ {successMsg}</span>
          <button
            type="button"
            onClick={() => setSuccessMsg('')}
            className="text-emerald-600 hover:text-emerald-900 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-ink/60">
            <span className="font-mono text-xs font-bold uppercase tracking-wider">Total Subscribers</span>
            <span className="text-xl">👥</span>
          </div>
          <p className="mt-2 font-display text-3xl font-extrabold text-ink">{totalCount}</p>
          <span className="mt-1 inline-block text-xs text-ink/50">All registered email leads</span>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-ink/60">
            <span className="font-mono text-xs font-bold uppercase tracking-wider">Active Audience</span>
            <span className="text-xl">✅</span>
          </div>
          <p className="mt-2 font-display text-3xl font-extrabold text-forest">{activeCount}</p>
          <span className="mt-1 inline-block text-xs text-emerald-600 font-medium">Ready to receive emails</span>
        </div>

        <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-ink/60">
            <span className="font-mono text-xs font-bold uppercase tracking-wider">Broadcasts Dispatched</span>
            <span className="text-xl">🚀</span>
          </div>
          <p className="mt-2 font-display text-3xl font-extrabold text-ink">{broadcastLogs.length}</p>
          <span className="mt-1 inline-block text-xs text-ink/50">Total notification logs</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink/40 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search subscribers by email address…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-line bg-[#fbf9f4] py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-forest focus:bg-white focus:ring-2 focus:ring-forest/15"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs text-ink/40 hover:text-ink"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="rounded-2xl border border-line bg-white shadow-sm overflow-hidden">
        <div className="border-b border-line px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-ink">
            Subscribed Email Directory ({subscribers.length})
          </h2>
          <span className="font-mono text-xs text-ink/40">Showing all subscriber emails</span>
        </div>

        {loading ? (
          <div className="py-16">
            <Loader />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-rose-600">{error}</div>
        ) : subscribers.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title={search ? 'No matching subscribers found' : 'No subscribers yet'}
              hint={
                search
                  ? 'Try clearing your search term.'
                  : 'Subscribers from the public website footer will show up here.'
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-ink/80">
              <thead className="bg-[#f8f9fa] border-b border-line text-xs font-mono uppercase tracking-wider text-ink/50">
                <tr>
                  <th className="px-6 py-3.5">Email Address</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Subscribed On</th>
                  <th className="px-6 py-3.5">Channel</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {subscribers.map((s) => (
                  <tr key={s._id} className="hover:bg-[#fbf9f4]/60 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-ink">{s.email}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(s.email)}
                          className="rounded px-1.5 py-0.5 text-[11px] text-ink/40 hover:bg-line/40 hover:text-ink transition"
                          title="Copy email"
                        >
                          📋
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          s.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            s.status === 'active' ? 'bg-emerald-500' : 'bg-stone-400'
                          }`}
                        />
                        {s.status === 'active' ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-ink/60">
                      {new Date(s.subscribedAt || s.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono uppercase text-ink/50">
                      {s.source || 'footer'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(s._id, s.email)}
                        className="rounded-lg px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Broadcast History Table */}
      <div className="rounded-2xl border border-line bg-white shadow-sm overflow-hidden">
        <div className="border-b border-line px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-ink">Broadcast & Notification History</h2>
            <p className="text-xs text-ink/50 mt-0.5">
              Every dispatched email notification. Click "View Recipients" to see subscriber details.
            </p>
          </div>
          <span className="rounded-full bg-forest/10 px-2.5 py-1 text-xs font-mono font-bold text-forest">
            {broadcastLogs.length} Records
          </span>
        </div>

        {broadcastLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-ink/50">
            No broadcast notifications recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-ink/80">
              <thead className="bg-[#f8f9fa] border-b border-line text-xs font-mono uppercase tracking-wider text-ink/50">
                <tr>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Recipients</th>
                  <th className="px-6 py-3">Delivery Mode</th>
                  <th className="px-6 py-3">Date Dispatched</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {broadcastLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#fbf9f4]/60 transition">
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-mono font-bold uppercase ${
                          log.type === 'blog'
                            ? 'bg-amber-100 text-amber-800'
                            : log.type === 'product'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-ink max-w-xs truncate">
                      {log.subject}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs text-ink/70">
                      {log.recipientCount} subscriber(s)
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-mono font-bold ${
                          log.deliveryMode === 'test_preview'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {log.deliveryMode === 'test_preview' ? '🟡 Test Preview' : '🟢 Live SMTP'}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-xs font-mono text-ink/50">
                      {new Date(log.sentAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5 text-right space-x-2">
                      {log.previewUrl && (
                        <a
                          href={log.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 text-xs font-semibold hover:bg-amber-200 transition inline-flex items-center gap-1"
                        >
                          <span>🔗 View Email</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        className="rounded-lg bg-line/30 px-3 py-1 text-xs font-semibold text-ink hover:bg-forest hover:text-white transition inline-flex items-center gap-1"
                      >
                        <span>👁️ View Recipients</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: View Broadcast Details & Recipient Emails */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-forest bg-forest/10 px-2 py-0.5 rounded">
                  {selectedLog.type} NOTIFICATION
                </span>
                <h3 className="mt-1 font-display text-lg font-bold text-ink">
                  {selectedLog.subject}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-lg p-1.5 text-ink/40 hover:bg-line/20 hover:text-ink"
              >
                ✕
              </button>
            </div>

            {selectedLog.previewUrl && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-center justify-between">
                <span className="text-xs text-amber-900 font-medium">
                  Test mailbox preview is available for this broadcast:
                </span>
                <a
                  href={selectedLog.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-amber-700 px-3 py-1 text-xs font-bold text-white hover:bg-amber-800 transition"
                >
                  Open Preview Link ↗
                </a>
              </div>
            )}

            <div>
              <p className="text-xs font-mono uppercase text-ink/50 mb-1">Message Content:</p>
              <div className="rounded-xl bg-[#fbf9f4] p-3 text-xs text-ink/80 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-line border border-line">
                {selectedLog.message || 'No additional message text.'}
              </div>
            </div>

            {selectedLog.link && (
              <p className="text-xs text-ink/60">
                <strong>Target Link:</strong>{' '}
                <span className="font-mono text-forest">{selectedLog.link}</span>
              </p>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-mono uppercase text-ink/50">
                  Recipient Subscriber Emails ({selectedLog.recipientEmails?.length || selectedLog.recipientCount}):
                </p>
                {selectedLog.recipientEmails?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedLog.recipientEmails.join(', '))}
                    className="text-[11px] text-forest font-semibold hover:underline"
                  >
                    Copy All Emails
                  </button>
                )}
              </div>
              <div className="max-h-44 overflow-y-auto rounded-xl border border-line bg-white p-2.5 space-y-1">
                {selectedLog.recipientEmails && selectedLog.recipientEmails.length > 0 ? (
                  selectedLog.recipientEmails.map((email, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded px-2 py-1 text-xs font-mono hover:bg-[#fbf9f4]"
                    >
                      <span className="text-ink font-medium">{email}</span>
                      <span className="text-[10px] text-emerald-600">✓ Sent</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-ink/50 p-2">
                    Dispatched to {selectedLog.recipientCount} active subscriber(s).
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-line flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-xl bg-forest px-4 py-2 text-xs font-bold text-white hover:bg-forest/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Compose Broadcast & Send Test Email */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-ink">Broadcast Announcement</h3>
                <p className="text-xs text-ink/60 mt-0.5">
                  Sends an email announcement to all <strong>{activeCount} active subscriber(s)</strong> with luxury NMC branding.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="rounded-lg p-1.5 text-ink/40 hover:bg-line/20 hover:text-ink"
              >
                ✕
              </button>
            </div>

            {/* Quick Templates */}
            <div className="mt-4 pt-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-ink/50 block mb-1.5">
                Quick Template Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyTemplate('harvest')}
                  className="rounded-lg border border-line bg-[#fbf9f4] px-2.5 py-1 text-xs text-ink hover:border-forest hover:bg-white transition"
                >
                  🌾 New Harvest Alert
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('freight')}
                  className="rounded-lg border border-line bg-[#fbf9f4] px-2.5 py-1 text-xs text-ink hover:border-forest hover:bg-white transition"
                >
                  🚢 Ocean Freight Booking
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('catalog')}
                  className="rounded-lg border border-line bg-[#fbf9f4] px-2.5 py-1 text-xs text-ink hover:border-forest hover:bg-white transition"
                >
                  📦 2026 Export Catalog
                </button>
              </div>
            </div>

            <form onSubmit={handleSendBroadcast} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 mb-1">
                  Email Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Harvest Offer: Premium Gujarat Cumin & Fennel Available"
                  value={broadcastForm.subject}
                  onChange={(e) =>
                    setBroadcastForm({ ...broadcastForm, subject: e.target.value })
                  }
                  className="w-full rounded-xl border border-line bg-[#fbf9f4] px-4 py-2.5 text-sm text-ink outline-none focus:border-forest focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 mb-1">
                  Message / Announcement Body
                </label>
                <textarea
                  rows={4}
                  placeholder="Share details about new crop season, container bookings, lab clearance or price indications…"
                  value={broadcastForm.message}
                  onChange={(e) =>
                    setBroadcastForm({ ...broadcastForm, message: e.target.value })
                  }
                  className="w-full rounded-xl border border-line bg-[#fbf9f4] px-4 py-2.5 text-sm text-ink outline-none focus:border-forest focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 mb-1">
                  Optional Target Link
                </label>
                <input
                  type="text"
                  placeholder="e.g. /products or /inquiry"
                  value={broadcastForm.link}
                  onChange={(e) =>
                    setBroadcastForm({ ...broadcastForm, link: e.target.value })
                  }
                  className="w-full rounded-xl border border-line bg-[#fbf9f4] px-4 py-2.5 text-sm text-ink outline-none focus:border-forest focus:bg-white"
                />
              </div>

              {/* Test Email Option */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 block">
                    🧪 Send Test Email First (Verify Delivery):
                  </span>
                  {smtpStatus?.isConfigured ? (
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Live SMTP
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded">
                      Test Preview Mode
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email to test (e.g. yourname@gmail.com)…"
                    value={testEmailTarget}
                    onChange={(e) => setTestEmailTarget(e.target.value)}
                    className="flex-1 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs text-ink outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendTestEmail}
                    disabled={sendingTest || !testEmailTarget}
                    className="rounded-lg bg-amber-700 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-800 disabled:opacity-50 whitespace-nowrap shadow-sm transition"
                  >
                    {sendingTest ? 'Sending…' : 'Send Test'}
                  </button>
                </div>

                {testResult && (
                  <div className="rounded-lg bg-white p-2.5 border border-amber-200 text-xs space-y-1.5">
                    <p className="font-semibold text-emerald-800">
                      ✓ {testResult.message}
                    </p>
                    {testResult.previewUrl && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-ink/60">Ethereal preview link ready:</span>
                        <a
                          href={testResult.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded bg-amber-700 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-800 transition"
                        >
                          Open Rendered Email Preview ↗
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Broadcast Result Feedback */}
              {broadcastResult && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs space-y-2">
                  <p className="font-bold text-emerald-900 text-sm">
                    ✓ {broadcastResult.message}
                  </p>
                  <p className="text-emerald-800">
                    Dispatched to {broadcastResult.successfulCount} / {broadcastResult.recipientCount} subscriber(s).
                  </p>
                  {broadcastResult.previewUrl && (
                    <div className="pt-1">
                      <a
                        href={broadcastResult.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-forest px-3 py-1.5 text-xs font-bold text-white hover:bg-forest/90 transition shadow-sm"
                      >
                        <span>🔗 View Broadcast Email in Test Mailbox ↗</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="rounded-xl border border-line px-4 py-2 text-xs font-medium text-ink hover:bg-line/20"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={sendingBroadcast || activeCount === 0}
                  className="rounded-xl bg-forest px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-forest/90 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {sendingBroadcast
                    ? 'Dispatching Announcement…'
                    : `Dispatch to All ${activeCount} Active Subscribers`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
