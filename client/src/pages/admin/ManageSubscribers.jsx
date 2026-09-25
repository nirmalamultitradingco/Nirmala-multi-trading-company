import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import Loader from '../../components/Loader.jsx';
import EmptyState from '../../components/EmptyState.jsx';

const initialBroadcastForm = {
  mode: 'visual', // 'visual' | 'html'
  subject: '',
  heading: '',
  badge: 'NIRMALA MULTI TRADING CO. • EXPORTER INTELLIGENCE',
  message: '',
  bannerImage: '',
  link: '/products',
  buttonText: 'Explore Product Catalog →',
  showDefaultCard: true,
  features: [
    { label: 'Origin Hubs', value: 'Gujarat (Unjha, Saurashtra, Mahuva) & North India Clusters' },
    { label: 'Port Clearance', value: 'Mundra Port (INMUN1) & Nhava Sheva (JNPT, Mumbai)' },
    { label: 'Quality Guarantee', value: '100% Sortex Cleaned, ASTA & European MRL Compliance' },
  ],
  customHtml: '',
  targetAudience: 'all', // 'all' | 'selected'
  selectedEmails: [],
};

export default function ManageSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [broadcastLogs, setBroadcastLogs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Table selection
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);

  // SMTP status
  const [smtpStatus, setSmtpStatus] = useState(null);
  const [showSmtpGuide, setShowSmtpGuide] = useState(false);

  // Full Custom Broadcast modal state
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState(initialBroadcastForm);
  const [modalTab, setModalTab] = useState('editor'); // 'editor' | 'preview'
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'
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
      setSelectedSubscribers((prev) => prev.filter((e) => e !== email));
      fetchSubscribers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete subscriber.');
    }
  };

  // Selection handlers
  const handleToggleSelectAll = () => {
    const activeEmails = subscribers.filter((s) => s.status === 'active').map((s) => s.email);
    if (selectedSubscribers.length === activeEmails.length && activeEmails.length > 0) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(activeEmails);
    }
  };

  const handleToggleSelectOne = (email) => {
    setSelectedSubscribers((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  // Open modal with target audience
  const openBroadcastStudio = (targetType = 'all') => {
    setBroadcastResult(null);
    setTestResult(null);
    setModalTab('editor');
    setBroadcastForm({
      ...initialBroadcastForm,
      targetAudience: targetType,
      selectedEmails: targetType === 'selected' ? [...selectedSubscribers] : [],
    });
    setShowBroadcastModal(true);
  };

  // Feature cards helpers in builder
  const addFeature = () => {
    setBroadcastForm((prev) => ({
      ...prev,
      features: [...(prev.features || []), { label: 'New Highlight', value: 'Specification detail' }],
    }));
  };

  const updateFeature = (idx, field, val) => {
    const next = [...(broadcastForm.features || [])];
    next[idx] = { ...next[idx], [field]: val };
    setBroadcastForm({ ...broadcastForm, features: next });
  };

  const removeFeature = (idx) => {
    const next = (broadcastForm.features || []).filter((_, i) => i !== idx);
    setBroadcastForm({ ...broadcastForm, features: next });
  };

  // Templates
  const applyTemplate = (type) => {
    if (type === 'harvest') {
      setBroadcastForm((prev) => ({
        ...prev,
        mode: 'visual',
        badge: '🌾 FRESH SEASON CROP ALLOCATION • GUJARAT CLUSTERS',
        subject: '🌾 Fresh Harvest Alert: Gujarat Cumin, Sesame & Fennel Lots Available',
        heading: 'Fresh Season Harvest Lots Now Open for Mundra Port Loading',
        message:
          'We have commenced procurement of the new seasonal crop from farm clusters across Gujarat & Rajasthan.\n\n• Sortex Laser Graded: 99% & 99.5% European purity standards\n• Low moisture content (< 8.0%), aflatoxin compliant with laboratory assay\n• Available in 25kg / 50kg multi-wall paper & PP packaging\n• Prompt 20ft & 40ft container stuffing at Mundra Port (INMUN1)',
        link: '/products',
        buttonText: 'Inspect Harvest Specifications →',
        showDefaultCard: true,
        features: [
          { label: 'Origin Hubs', value: 'Unjha, Saurashtra & Mahuva (Gujarat Mandis)' },
          { label: 'Purity Level', value: '99.5% European Sortex Laser Cleaned' },
          { label: 'Packaging', value: '25kg Paper Bags / Buyer Custom Brand Pouches' },
          { label: 'Loading Port', value: 'Mundra Port (INMUN1) Direct Container Freight' },
        ],
      }));
    } else if (type === 'freight') {
      setBroadcastForm((prev) => ({
        ...prev,
        mode: 'visual',
        badge: '🚢 CONTAINERIZED FREIGHT ADVISORY • MUNDRA & JNPT',
        subject: '🚢 Ocean Container Freight Allocation: Direct Sailings to GCC, Europe & USA',
        heading: 'Confirmed Vessel Bookings & Consolidated Container Openings',
        message:
          'Special containerized ocean freight allocation available for immediate bookings:\n\n• Mundra to Jebel Ali / Dammam / Doha (Direct 3-5 days transit)\n• Mundra to Rotterdam / Hamburg / Felixstowe (Direct ocean line 18-24 days)\n• Nhava Sheva to New York / Long Beach (Direct shipping line 24-28 days)\n• Commodities: Basmati Rice, Cumin Seeds, Turmeric, Dehydrated Onion Flakes\n• Available in FOB, CIF, or CFR incoterms.',
        link: '/inquiry',
        buttonText: 'Request Container Freight Quotation →',
        showDefaultCard: true,
        features: [
          { label: 'Vessel Corridors', value: 'Jebel Ali (3d), Europe (18d), USA (24d)' },
          { label: 'Incoterms Available', value: 'FOB Mundra/JNPT, CIF Destination Port, CFR' },
          { label: 'Consolidation', value: 'FCL & Mixed-Commodity LCL Container Stuffing' },
        ],
      }));
    } else if (type === 'catalog') {
      setBroadcastForm((prev) => ({
        ...prev,
        mode: 'visual',
        badge: '📦 EXPORT DIRECTORY & SPECIFICATIONS RELEASE',
        subject: '📦 New Export Catalogue & Sortex Specification Release 2026',
        heading: 'Official NMC Agricultural & Food Commodity Catalogue',
        message:
          'We have updated our export commodity catalogue with comprehensive laboratory test certificates, MRL thresholds, and container stuffing specifications.\n\nBrowse full technical brochures and request formal FOB/CIF proforma quotations directly online.',
        link: '/brochures',
        buttonText: 'Download Technical Catalogues →',
        showDefaultCard: true,
        features: [
          { label: 'Accreditation', value: 'FSSAI, APEDA, Spice Board of India, ISO 22000' },
          { label: 'Lab Clearance', value: 'Pesticide MRL, Aflatoxin & Phytosanitary assays' },
          { label: 'Format', value: 'High-Resolution PDF Brochures with HS Codes' },
        ],
      }));
    } else if (type === 'arrival') {
      setBroadcastForm((prev) => ({
        ...prev,
        mode: 'visual',
        badge: '🌟 NEW PRODUCT ARRIVAL • IMMEDIATE DISPATCH',
        subject: '🌟 New Product Arrival: Premium Indian Commodities Ready for Export',
        heading: 'New Export Arrivals Added to Our Verified Global Portfolio',
        message:
          'We are excited to introduce newly procured export-grade products from certified Indian processors.\n\nAvailable immediately with phytosanitary certificates, SGS inspection on request, and custom private label packaging.',
        link: '/products',
        buttonText: 'Browse New Arrivals Online →',
        showDefaultCard: false,
        features: [
          { label: 'Grading', value: '100% Optical Sortex Machine Graded' },
          { label: 'Minimum Order', value: '1 x 20ft FCL (LCL trial shipments supported)' },
          { label: 'Documentation', value: 'Phytosanitary, Certificate of Origin, MRL test' },
        ],
      }));
    } else if (type === 'blank') {
      setBroadcastForm((prev) => ({
        ...prev,
        mode: 'visual',
        badge: 'NIRMALA MULTI TRADING CO. • EXPORTER UPDATE',
        subject: '',
        heading: '',
        message: '',
        bannerImage: '',
        link: '/products',
        buttonText: 'View On Website →',
        showDefaultCard: true,
        features: [],
        customHtml: '',
      }));
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.subject.trim()) {
      alert('Please enter an email subject.');
      return;
    }

    const isSelectedMode = broadcastForm.targetAudience === 'selected';
    const recipientEmails = isSelectedMode ? broadcastForm.selectedEmails : [];

    if (isSelectedMode && recipientEmails.length === 0) {
      alert('Please select at least one subscriber recipient.');
      return;
    }

    const confirmCount = isSelectedMode ? recipientEmails.length : activeCount;
    if (
      !window.confirm(
        `Are you sure you want to dispatch this email to ${confirmCount} subscriber(s)?`
      )
    ) {
      return;
    }

    try {
      setSendingBroadcast(true);
      setBroadcastResult(null);

      const payload = {
        subject: broadcastForm.subject.trim(),
        heading: broadcastForm.heading.trim() || broadcastForm.subject.trim(),
        badge: broadcastForm.badge.trim(),
        message: broadcastForm.message,
        link: broadcastForm.link.trim(),
        buttonText: broadcastForm.buttonText.trim(),
        bannerImage: broadcastForm.bannerImage.trim(),
        features: broadcastForm.features,
        showDefaultCard: broadcastForm.showDefaultCard,
        customHtml: broadcastForm.mode === 'html' ? broadcastForm.customHtml : undefined,
        recipientEmails: isSelectedMode ? recipientEmails : undefined,
      };

      const res = await api.post('/subscribers/broadcast', payload);
      setBroadcastResult(res.data);
      setSuccessMsg(res.data?.message || 'Broadcast announcement successfully dispatched!');
      fetchSubscribers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send broadcast: ' + err.message);
    } finally {
      setSendingBroadcast(false);
    }
  };

  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    if (!testEmailTarget.trim()) {
      alert('Please enter a target email address for test delivery.');
      return;
    }

    try {
      setSendingTest(true);
      setTestResult(null);

      const payload = {
        email: testEmailTarget.trim(),
        subject: broadcastForm.subject.trim() || 'Test NMC Broadcast Email',
        heading: broadcastForm.heading.trim() || broadcastForm.subject.trim(),
        badge: broadcastForm.badge.trim(),
        message:
          broadcastForm.message ||
          'This is a test notification from the Nirmala Multi Trading Co. admin workspace.',
        link: broadcastForm.link.trim() || '/products',
        buttonText: broadcastForm.buttonText.trim(),
        bannerImage: broadcastForm.bannerImage.trim(),
        features: broadcastForm.features,
        showDefaultCard: broadcastForm.showDefaultCard,
        customHtml: broadcastForm.mode === 'html' ? broadcastForm.customHtml : undefined,
      };

      const res = await api.post('/subscribers/test-email', payload);
      setTestResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send test email.');
    } finally {
      setSendingTest(false);
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

  // Helper to render live HTML preview
  const renderLiveEmailPreview = () => {
    const isHtml = broadcastForm.mode === 'html';
    if (isHtml && broadcastForm.customHtml?.trim()) {
      return (
        <div className="rounded-2xl border border-line bg-white overflow-hidden shadow-lg max-w-[620px] mx-auto text-ink">
          <div className="bg-[#0f2b20] p-6 text-center border-b-2 border-gold">
            <span className="inline-block bg-gold/20 border border-gold text-[#fdfaf3] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">
              {broadcastForm.badge || 'NIRMALA MULTI TRADING CO.'}
            </span>
            <h1 className="text-white text-lg font-bold">
              {broadcastForm.heading || broadcastForm.subject || 'Custom Newsletter Email'}
            </h1>
          </div>
          <div
            className="p-6 text-sm"
            dangerouslySetInnerHTML={{ __html: broadcastForm.customHtml }}
          />
          <div className="bg-[#0b1a13] p-5 text-center text-xs text-stone-400">
            <p>© {new Date().getFullYear()} Nirmala Multi Trading Co. • Unsubscribe Link Included</p>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-line bg-white overflow-hidden shadow-lg max-w-[620px] mx-auto text-ink font-sans">
        {/* Email Header */}
        <div className="bg-[#0f2b20] p-6 sm:p-8 text-center border-b-4 border-gold">
          <span className="inline-block bg-gold/20 border border-gold text-[#fdfaf3] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            {broadcastForm.badge || 'NIRMALA MULTI TRADING CO. • EXPORTER INTELLIGENCE'}
          </span>
          <h1 className="text-white text-xl sm:text-2xl font-black tracking-tight">
            {broadcastForm.heading || broadcastForm.subject || 'Your Email Subject Here'}
          </h1>
        </div>

        {/* Email Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {broadcastForm.bannerImage && (
            <div className="rounded-xl overflow-hidden border border-line shadow-sm max-h-64">
              <img
                src={broadcastForm.bannerImage}
                alt="Banner"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
            {broadcastForm.message ||
              'Write your custom email announcement here. Paragraphs and points will render with luxury styling.'}
          </div>

          {/* Features Highlights Box */}
          {broadcastForm.features && broadcastForm.features.length > 0 && (
            <div className="rounded-xl border border-line bg-[#fbf9f4] p-4 space-y-2 text-xs">
              {broadcastForm.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-stone-700">
                  <span className="font-bold text-[#0f2b20] shrink-0">• {f.label}:</span>
                  <span>{f.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Default Exporter Card */}
          {broadcastForm.showDefaultCard && (!broadcastForm.features || broadcastForm.features.length === 0) && (
            <div className="rounded-xl border border-line bg-[#fbf9f4] p-4 space-y-2 text-xs">
              <div className="text-stone-700">
                <strong className="text-[#0f2b20]">Origin Hubs:</strong> Gujarat (Unjha, Saurashtra, Mahuva) & North India Clusters
              </div>
              <div className="text-stone-700">
                <strong className="text-[#0f2b20]">Port Clearance:</strong> Mundra Port (INMUN1) & Nhava Sheva (JNPT, Mumbai)
              </div>
              <div className="text-stone-700">
                <strong className="text-[#0f2b20]">Quality Guarantee:</strong> 100% Sortex Cleaned, ASTA & European MRL Compliance
              </div>
            </div>
          )}

          {/* Call to Action Button */}
          {broadcastForm.link && (
            <div className="text-center pt-2 pb-2">
              <span className="inline-block bg-[#c89b3c] text-[#0b1a13] font-extrabold text-sm px-7 py-3.5 rounded-xl shadow-md cursor-pointer hover:bg-[#d8aa49]">
                {broadcastForm.buttonText || 'View On Website →'}
              </span>
            </div>
          )}
        </div>

        {/* Email Footer */}
        <div className="bg-[#0b1a13] p-6 text-center text-xs text-stone-400 space-y-2">
          <div className="font-mono text-[11px] text-gold tracking-widest uppercase">
            APEDA REG. • SPICE BOARD INDIA • FSSAI CERTIFIED
          </div>
          <p>© {new Date().getFullYear()} Nirmala Multi Trading Co. All rights reserved.</p>
          <p>Mundra Port Ocean Freight & Global Containerized Logistics.</p>
          <p className="text-[11px] text-stone-500 pt-2">
            You received this export update because you subscribed at nirmalamultitrading.com.<br />
            <span className="text-gold underline cursor-pointer">Click here to unsubscribe</span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow font-mono text-gold">AUDIENCE & NEWSLETTER</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-ink">Subscribers & Email Studio</h1>
          <p className="mt-1 text-sm text-ink/60">
            Design fully customizable email announcements, manage verified buyers, and broadcast live export updates.
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

          {selectedSubscribers.length > 0 && (
            <button
              type="button"
              onClick={() => openBroadcastStudio('selected')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gold px-4 py-2.5 text-xs font-bold text-[#0b1a13] shadow-md transition hover:bg-gold/90 animate-pulse"
            >
              <span>✉️</span> Mail Selected ({selectedSubscribers.length})
            </button>
          )}

          <button
            type="button"
            onClick={() => openBroadcastStudio('all')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-forest px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-forest/90"
          >
            <span>📢</span> Compose Broadcast Email
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
                    : 'Email System: Test Preview Mode Active (Ethereal Mailbox)'}
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
                  : 'Live SMTP credentials are not yet configured in server/.env. Test mailbox is running — all broadcasts generate instant clickable web preview links.'}
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
                  1. In your Google Account, enable 2-Step Verification.<br />
                  2. Generate an <strong>App Password</strong> (Security → App Passwords).<br />
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

      {/* Search & Bulk Action Bar */}
      <div className="rounded-2xl border border-line bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-md w-full">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink/40 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search subscribers by email address…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-line bg-[#fbf9f4] py-2 pl-10 pr-4 text-sm text-ink outline-none transition focus:border-forest focus:bg-white focus:ring-2 focus:ring-forest/15"
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

        {selectedSubscribers.length > 0 && (
          <div className="flex items-center gap-2 bg-gold/15 border border-gold/30 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#0b1a13]">
            <span>{selectedSubscribers.length} subscriber(s) selected</span>
            <button
              type="button"
              onClick={() => setSelectedSubscribers([])}
              className="text-stone-500 hover:text-stone-800 underline ml-1"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => openBroadcastStudio('selected')}
              className="ml-2 bg-[#0f2b20] text-gold px-2.5 py-1 rounded-lg font-bold hover:bg-[#1a4334]"
            >
              Write Custom Mail →
            </button>
          </div>
        )}
      </div>

      {/* Subscribers Table */}
      <div className="rounded-2xl border border-line bg-white shadow-sm overflow-hidden">
        <div className="border-b border-line px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-base font-bold text-ink">
              Subscribed Email Directory ({subscribers.length})
            </h2>
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="text-xs text-forest hover:underline font-mono"
            >
              {selectedSubscribers.length > 0 && selectedSubscribers.length === subscribers.filter((s) => s.status === 'active').length
                ? 'Deselect All'
                : 'Select All Active'}
            </button>
          </div>
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
                  <th className="px-4 py-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        subscribers.filter((s) => s.status === 'active').length > 0 &&
                        selectedSubscribers.length ===
                          subscribers.filter((s) => s.status === 'active').length
                      }
                      onChange={handleToggleSelectAll}
                      title="Select all active"
                    />
                  </th>
                  <th className="px-4 py-3.5">Email Address</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Subscribed On</th>
                  <th className="px-6 py-3.5">Channel</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {subscribers.map((s) => {
                  const isChecked = selectedSubscribers.includes(s.email);
                  return (
                    <tr
                      key={s._id}
                      className={`hover:bg-[#fbf9f4]/60 transition ${
                        isChecked ? 'bg-gold/5' : ''
                      }`}
                    >
                      <td className="px-4 py-4 text-center">
                        <input
                          type="checkbox"
                          disabled={s.status !== 'active'}
                          checked={isChecked}
                          onChange={() => handleToggleSelectOne(s.email)}
                        />
                      </td>
                      <td className="px-4 py-4">
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
                      <td className="px-6 py-4 text-right space-x-2">
                        {s.status === 'active' && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSubscribers([s.email]);
                              openBroadcastStudio('selected');
                            }}
                            className="rounded-lg px-2.5 py-1 text-xs font-medium text-forest hover:bg-forest/10 transition"
                          >
                            ✉️ Mail
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(s._id, s.email)}
                          className="rounded-lg px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
              Every dispatched email notification. Click "View Recipients" to inspect details.
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

      {/* ========================================================= */}
      {/* MODAL: FULL CUSTOM EMAIL STUDIO (BUILDER + PREVIEW + DISPATCH) */}
      {/* ========================================================= */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl my-6 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-[#fbf9f4]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">✉️</span>
                  <h3 className="font-display text-xl font-black text-ink">
                    Email Studio & Custom Mail Composer
                  </h3>
                  <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-[11px] font-mono font-bold text-forest">
                    {broadcastForm.targetAudience === 'selected'
                      ? `${broadcastForm.selectedEmails.length} Selected Recipient(s)`
                      : `All ${activeCount} Active Subscribers`}
                  </span>
                </div>
                <p className="text-xs text-ink/60 mt-0.5">
                  Write, style, preview and dispatch custom emails with your own subject, content, banner, button, and highlights.
                </p>
              </div>

              {/* Tab Switcher: Editor vs Live Preview */}
              <div className="flex items-center gap-2">
                <div className="flex rounded-xl bg-white p-1 border border-line shadow-sm">
                  <button
                    type="button"
                    onClick={() => setModalTab('editor')}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                      modalTab === 'editor'
                        ? 'bg-forest text-white shadow-sm'
                        : 'text-ink/60 hover:text-ink'
                    }`}
                  >
                    ✏️ Email Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab('preview')}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition flex items-center gap-1 ${
                      modalTab === 'preview'
                        ? 'bg-forest text-white shadow-sm'
                        : 'text-ink/60 hover:text-ink'
                    }`}
                  >
                    <span>👁️ Live Preview</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="rounded-xl p-2 text-ink/40 hover:bg-line/20 hover:text-ink"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Presets Header */}
              <div className="rounded-2xl border border-line bg-[#fbf9f4] p-3.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-ink/50 block mb-2">
                  Quick Content Presets (Click to Load):
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyTemplate('harvest')}
                    className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:border-forest hover:text-forest transition shadow-2xs"
                  >
                    🌾 Fresh Harvest Alert
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('freight')}
                    className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:border-forest hover:text-forest transition shadow-2xs"
                  >
                    🚢 Ocean Freight Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('catalog')}
                    className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:border-forest hover:text-forest transition shadow-2xs"
                  >
                    📦 2026 Export Catalog
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('arrival')}
                    className="rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink hover:border-forest hover:text-forest transition shadow-2xs"
                  >
                    🌟 New Arrival Announcement
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('blank')}
                    className="rounded-lg border border-dashed border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-ink/70 hover:border-ink hover:text-ink transition shadow-2xs"
                  >
                    📝 Blank Canvas
                  </button>
                </div>
              </div>

              {/* TAB 1: EMAIL EDITOR */}
              {modalTab === 'editor' && (
                <div className="space-y-5">
                  {/* Mode Selector */}
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <span className="font-mono text-xs uppercase font-bold text-ink/70">
                      Composition Mode:
                    </span>
                    <div className="flex rounded-lg bg-[#fbf9f4] p-1 border border-line text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setBroadcastForm({ ...broadcastForm, mode: 'visual' })}
                        className={`rounded px-3 py-1 transition ${
                          broadcastForm.mode === 'visual'
                            ? 'bg-white shadow text-forest'
                            : 'text-ink/60'
                        }`}
                      >
                        Visual Form Builder
                      </button>
                      <button
                        type="button"
                        onClick={() => setBroadcastForm({ ...broadcastForm, mode: 'html' })}
                        className={`rounded px-3 py-1 transition ${
                          broadcastForm.mode === 'html'
                            ? 'bg-white shadow text-forest'
                            : 'text-ink/60'
                        }`}
                      >
                        Custom Raw HTML Code
                      </button>
                    </div>
                  </div>

                  {/* VISUAL BUILDER */}
                  {broadcastForm.mode === 'visual' ? (
                    <div className="space-y-4">
                      {/* Subject & Eyebrow Badge */}
                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 mb-1">
                            Email Subject Line *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 🌾 Special Harvest Alert: Sortex-Cleaned Gujarat Cumin Available"
                            value={broadcastForm.subject}
                            onChange={(e) =>
                              setBroadcastForm({ ...broadcastForm, subject: e.target.value })
                            }
                            className="w-full rounded-xl border border-line bg-[#fbf9f4] px-4 py-2.5 text-sm text-ink outline-none focus:border-forest focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 mb-1">
                            Eyebrow Badge Tag
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. EXPORTER INTELLIGENCE"
                            value={broadcastForm.badge}
                            onChange={(e) =>
                              setBroadcastForm({ ...broadcastForm, badge: e.target.value })
                            }
                            className="w-full rounded-xl border border-line bg-[#fbf9f4] px-4 py-2.5 text-xs text-ink font-mono outline-none focus:border-forest focus:bg-white"
                          />
                        </div>
                      </div>

                      {/* Header Title inside Email */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 mb-1">
                          Email Headline (Inside Header)
                        </label>
                        <input
                          type="text"
                          placeholder="Defaults to Subject Line if left blank"
                          value={broadcastForm.heading}
                          onChange={(e) =>
                            setBroadcastForm({ ...broadcastForm, heading: e.target.value })
                          }
                          className="w-full rounded-xl border border-line bg-[#fbf9f4] px-4 py-2.5 text-sm text-ink outline-none focus:border-forest focus:bg-white"
                        />
                      </div>

                      {/* Banner Image */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 mb-1">
                          Hero Banner Image URL (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="https://... or /uploads/... (Optional promotional photo banner at top)"
                          value={broadcastForm.bannerImage}
                          onChange={(e) =>
                            setBroadcastForm({ ...broadcastForm, bannerImage: e.target.value })
                          }
                          className="w-full rounded-xl border border-line bg-[#fbf9f4] px-4 py-2 text-xs font-mono text-ink outline-none focus:border-forest focus:bg-white"
                        />
                      </div>

                      {/* Message Body */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-mono uppercase tracking-wider text-ink/70">
                            Custom Email Body / Message *
                          </label>
                          <span className="text-[11px] text-ink/40">
                            Supports multi-paragraph, bullet points, or HTML tags
                          </span>
                        </div>
                        <textarea
                          rows={6}
                          placeholder="Write your email announcement to subscribers. Share seasonal harvest updates, container departures, lab assays, or new product arrivals…"
                          value={broadcastForm.message}
                          onChange={(e) =>
                            setBroadcastForm({ ...broadcastForm, message: e.target.value })
                          }
                          className="w-full rounded-xl border border-line bg-[#fbf9f4] px-4 py-3 text-sm text-ink outline-none focus:border-forest focus:bg-white leading-relaxed font-sans"
                        />
                      </div>

                      {/* Call-to-action Button */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 mb-1">
                            Action Button Label
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Explore Product Catalog →"
                            value={broadcastForm.buttonText}
                            onChange={(e) =>
                              setBroadcastForm({ ...broadcastForm, buttonText: e.target.value })
                            }
                            className="w-full rounded-xl border border-line bg-[#fbf9f4] px-4 py-2 text-xs text-ink outline-none focus:border-forest focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 mb-1">
                            Action Button Link (URL or relative path)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. /products or /inquiry or https://..."
                            value={broadcastForm.link}
                            onChange={(e) =>
                              setBroadcastForm({ ...broadcastForm, link: e.target.value })
                            }
                            className="w-full rounded-xl border border-line bg-[#fbf9f4] px-4 py-2 text-xs text-ink font-mono outline-none focus:border-forest focus:bg-white"
                          />
                        </div>
                      </div>

                      {/* Highlights Box Builder */}
                      <div className="rounded-2xl border border-line bg-[#fbf9f4] p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-display font-bold text-sm text-ink block">
                              Custom Specification / Highlight Pills
                            </span>
                            <span className="text-xs text-ink/50">
                              Highlight key specifications like purity, packaging, ports, or certifications.
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={addFeature}
                            className="rounded-lg bg-white border border-line px-3 py-1 text-xs font-bold text-forest hover:bg-forest hover:text-white transition"
                          >
                            + Add Key Point
                          </button>
                        </div>

                        {broadcastForm.features?.length > 0 && (
                          <div className="space-y-2 mt-2">
                            {broadcastForm.features.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-line">
                                <input
                                  type="text"
                                  placeholder="Label (e.g. Origin)"
                                  value={item.label}
                                  onChange={(e) => updateFeature(idx, 'label', e.target.value)}
                                  className="w-1/3 rounded-lg border border-line bg-[#fbf9f4] px-2.5 py-1 text-xs font-bold text-ink"
                                />
                                <input
                                  type="text"
                                  placeholder="Value (e.g. Gujarat, India)"
                                  value={item.value}
                                  onChange={(e) => updateFeature(idx, 'value', e.target.value)}
                                  className="flex-1 rounded-lg border border-line bg-[#fbf9f4] px-2.5 py-1 text-xs text-ink"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeFeature(idx)}
                                  className="text-xs text-rose-500 hover:text-rose-700 px-2"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* RAW HTML MODE */
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 mb-1">
                          Email Subject Line *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. NMC Official Export Newsletter"
                          value={broadcastForm.subject}
                          onChange={(e) =>
                            setBroadcastForm({ ...broadcastForm, subject: e.target.value })
                          }
                          className="w-full rounded-xl border border-line bg-[#fbf9f4] px-4 py-2.5 text-sm text-ink outline-none focus:border-forest focus:bg-white"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-mono uppercase tracking-wider text-ink/70">
                            Raw HTML Template Code
                          </label>
                          <span className="text-[11px] text-ink/40">
                            Luxury branded header, company info, and unsubscribe link are automatically appended.
                          </span>
                        </div>
                        <textarea
                          rows={12}
                          placeholder="<div><h2>Seasonal Market Update</h2><p>Paste or write custom responsive HTML code here...</p></div>"
                          value={broadcastForm.customHtml}
                          onChange={(e) =>
                            setBroadcastForm({ ...broadcastForm, customHtml: e.target.value })
                          }
                          className="w-full rounded-xl border border-line bg-[#fbf9f4] p-4 text-xs font-mono text-ink outline-none focus:border-forest focus:bg-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: LIVE PREVIEW */}
              {modalTab === 'preview' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-[#fbf9f4] p-3 rounded-xl border border-line">
                    <div className="text-xs text-ink/70">
                      <strong>Subject:</strong> {broadcastForm.subject || '(Subject line empty)'}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink/50 font-mono">Device View:</span>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('desktop')}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                          previewDevice === 'desktop'
                            ? 'bg-forest text-white'
                            : 'bg-white border text-ink/60'
                        }`}
                      >
                        🖥️ Desktop
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('mobile')}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                          previewDevice === 'mobile'
                            ? 'bg-forest text-white'
                            : 'bg-white border text-ink/60'
                        }`}
                      >
                        📱 Mobile
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#f0ede6] p-4 sm:p-8 rounded-2xl flex justify-center overflow-x-auto min-h-[420px]">
                    <div
                      className={`transition-all duration-300 ${
                        previewDevice === 'mobile' ? 'w-[375px]' : 'w-full max-w-[620px]'
                      }`}
                    >
                      {renderLiveEmailPreview()}
                    </div>
                  </div>
                </div>
              )}

              {/* Test Email Section */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 block">
                    🧪 Send Test Email First (Verify Delivery & Visual Formatting):
                  </span>
                  {smtpStatus?.isConfigured ? (
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                      🟢 Live SMTP Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-amber-800 bg-amber-200 px-2 py-0.5 rounded font-bold">
                      🟡 Test Preview Mode (Ethereal)
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email to test (e.g. yourname@gmail.com)…"
                    value={testEmailTarget}
                    onChange={(e) => setTestEmailTarget(e.target.value)}
                    className="flex-1 rounded-xl border border-amber-300 bg-white px-3.5 py-2 text-xs text-ink outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendTestEmail}
                    disabled={sendingTest || !testEmailTarget}
                    className="rounded-xl bg-amber-700 px-4 py-2 text-xs font-bold text-white hover:bg-amber-800 disabled:opacity-50 whitespace-nowrap shadow-sm transition"
                  >
                    {sendingTest ? 'Sending Test…' : 'Send Test Mail'}
                  </button>
                </div>

                {testResult && (
                  <div className="rounded-xl bg-white p-3 border border-amber-200 text-xs space-y-1.5">
                    <p className="font-semibold text-emerald-800">
                      ✓ {testResult.message}
                    </p>
                    {testResult.previewUrl && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-ink/60">Rendered test mailbox link ready:</span>
                        <a
                          href={testResult.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded bg-amber-700 px-3 py-1 text-[11px] font-bold text-white hover:bg-amber-800 transition shadow-xs"
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
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-line bg-[#fbf9f4]">
              <button
                type="button"
                onClick={() => setShowBroadcastModal(false)}
                className="rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-medium text-ink hover:bg-line/20 shadow-xs"
              >
                Close
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setModalTab(modalTab === 'editor' ? 'preview' : 'editor')}
                  className="rounded-xl border border-line bg-white px-4 py-2.5 text-xs font-semibold text-ink hover:bg-line/20 shadow-xs"
                >
                  {modalTab === 'editor' ? '👁️ Preview Email First' : '✏️ Back to Editor'}
                </button>

                <button
                  type="button"
                  onClick={handleSendBroadcast}
                  disabled={
                    sendingBroadcast ||
                    (broadcastForm.targetAudience === 'selected'
                      ? broadcastForm.selectedEmails.length === 0
                      : activeCount === 0) ||
                    !broadcastForm.subject.trim()
                  }
                  className="rounded-xl bg-forest px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-forest/90 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {sendingBroadcast
                    ? 'Dispatching Custom Announcement…'
                    : broadcastForm.targetAudience === 'selected'
                    ? `Dispatch to ${broadcastForm.selectedEmails.length} Selected Subscriber(s)`
                    : `Dispatch to All ${activeCount} Active Subscribers`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
