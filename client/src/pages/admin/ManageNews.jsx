import { useEffect, useState } from 'react';
import api, { asset } from '../../api/axios.js';
import Modal from '../../components/admin/Modal.jsx';
import ImageUpload from '../../components/admin/ImageUpload.jsx';

const blank = {
  title: '',
  excerpt: '',
  content: '',
  image: '',
  images: [],
  sections: [],
  publishedAt: new Date().toISOString().slice(0, 10),
  order: 0,
  isActive: true,
  featured: false,
  notifySubscribers: false,
  broadcastSubject: '',
  broadcastMessage: '',
};

const dateValue = (v) => (v ? new Date(v).toISOString().slice(0, 10) : '');

export default function ManageNews() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [bannerSuccess, setBannerSuccess] = useState('');

  // Blog broadcast modal state
  const [broadcastItem, setBroadcastItem] = useState(null);
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState(null);

  // Test email state
  const [testEmailTarget, setTestEmailTarget] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const load = () =>
    api.get('/news', { params: { all: true } }).then((r) => setItems(r.data || []));

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(blank);
    setError('');
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      ...blank,
      ...item,
      images: Array.isArray(item.images) ? item.images : [],
      sections: Array.isArray(item.sections) ? item.sections : [],
      publishedAt: dateValue(item.publishedAt),
      notifySubscribers: false,
      broadcastSubject: `📰 Article: ${item.title || ''}`,
      broadcastMessage: item.excerpt || '',
    });
    setError('');
    setOpen(true);
  };

  const openBroadcastModal = (item) => {
    setBroadcastItem(item);
    setBroadcastSubject(`📰 New Export Intelligence Article: ${item.title || 'Market Update'}`);
    setBroadcastMessage(
      item.excerpt ||
      (item.content ? item.content.slice(0, 220) + '…' : 'Read the latest agricultural trade insights published by NMC.')
    );
    setBroadcastResult(null);
    setTestResult(null);
  };

  // Gallery image helpers
  const addGalleryImage = () => {
    setForm({
      ...form,
      images: [...(form.images || []), ''],
    });
  };

  const updateGalleryImage = (index, url) => {
    const nextImages = [...(form.images || [])];
    nextImages[index] = url;
    setForm({ ...form, images: nextImages });
  };

  const removeGalleryImage = (index) => {
    const nextImages = (form.images || []).filter((_, i) => i !== index);
    setForm({ ...form, images: nextImages });
  };

  // Content section helpers
  const addSection = () => {
    setForm({
      ...form,
      sections: [
        ...(form.sections || []),
        {
          subtitle: '',
          text: '',
          image: '',
          order: (form.sections?.length || 0) + 1,
        },
      ],
    });
  };

  const updateSection = (index, field, value) => {
    const nextSections = [...(form.sections || [])];
    nextSections[index] = { ...nextSections[index], [field]: value };
    setForm({ ...form, sections: nextSections });
  };

  const removeSection = (index) => {
    const nextSections = (form.sections || []).filter((_, i) => i !== index);
    setForm({ ...form, sections: nextSections });
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastItem || !broadcastSubject.trim()) return;

    try {
      setSendingBroadcast(true);
      setBroadcastResult(null);

      const res = await api.post(`/news/${broadcastItem._id}/broadcast`, {
        subject: broadcastSubject.trim(),
        message: broadcastMessage.trim(),
      });

      setBroadcastResult(res.data);
      setBannerSuccess(res.data?.message || 'Blog broadcast successfully dispatched to subscribers!');
      setTimeout(() => setBannerSuccess(''), 6000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to dispatch blog broadcast.');
    } finally {
      setSendingBroadcast(false);
    }
  };

  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    if (!broadcastItem || !testEmailTarget.trim()) return;

    try {
      setSendingTest(true);
      setTestResult(null);

      const res = await api.post(`/news/${broadcastItem._id}/broadcast`, {
        subject: broadcastSubject.trim() || `📰 Article: ${broadcastItem.title}`,
        message: broadcastMessage.trim(),
        testEmail: testEmailTarget.trim(),
      });

      setTestResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send test email.');
    } finally {
      setSendingTest(false);
    }
  };

  const [bannerError, setBannerError] = useState('');

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setBannerError('');
    try {
      const payload = {
        ...form,
        title: form.title?.trim() || 'Untitled Post',
        publishedAt: form.publishedAt
          ? new Date(`${form.publishedAt}T12:00:00`).toISOString()
          : new Date().toISOString(),
        images: (form.images || []).filter(Boolean),
      };

      if (editing) {
        await api.put(`/news/${editing._id}`, payload);
        setBannerSuccess('✓ Data updated successfully in MongoDB!');
      } else {
        await api.post('/news', payload);
        setBannerSuccess('✓ Data added successfully to MongoDB!');
      }

      setOpen(false);
      setTimeout(() => setBannerSuccess(''), 6000);
      await load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save data in MongoDB.';
      setError(msg);
      setBannerError('✗ Error: ' + msg);
      setTimeout(() => setBannerError(''), 8000);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (item) => {
    if (!confirm(`Delete blog post "${item.title || 'Untitled'}"?`)) return;
    try {
      await api.delete(`/news/${item._id}`);
      setBannerSuccess('✓ Post deleted successfully from MongoDB!');
      setTimeout(() => setBannerSuccess(''), 6000);
      await load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete post.';
      setBannerError('✗ Error: ' + msg);
      setTimeout(() => setBannerError(''), 8000);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Blog & News</h1>
          <p className="mt-1 text-sm text-ink/60">
            Publish export articles, market intelligence, and broadcast updates to your subscribers.
          </p>
        </div>
        <button className="btn-primary" onClick={openNew}>
          + Add blog post
        </button>
      </div>

      {bannerSuccess && (
        <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-sm flex items-center justify-between">
          <span>{bannerSuccess}</span>
          <button
            type="button"
            onClick={() => setBannerSuccess('')}
            className="text-emerald-700 hover:text-emerald-950 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {bannerError && (
        <div className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 shadow-sm flex items-center justify-between">
          <span>{bannerError}</span>
          <button
            type="button"
            onClick={() => setBannerError('')}
            className="text-red-700 hover:text-red-950 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}


      <div className="mt-6 grid gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-card sm:flex-row sm:items-center"
          >
            <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-line sm:w-32">
              {item.image || (item.images && item.images[0]) ? (
                <img
                  src={asset(item.image || item.images[0])}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-xs text-ink/35">No image</div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2">
                <span className="tag">{dateValue(item.publishedAt)}</span>
                {item.featured && <span className="tag">featured</span>}
                {!item.isActive && <span className="tag">hidden</span>}
                {item.images?.length > 0 && (
                  <span className="tag bg-gold/15 text-gold-dark font-mono text-[11px]">
                    +{item.images.length} images
                  </span>
                )}
                {item.sections?.length > 0 && (
                  <span className="tag bg-forest/10 text-forest font-mono text-[11px]">
                    {item.sections.length} sections
                  </span>
                )}
              </div>
              <h2 className="mt-2 font-display text-lg font-bold text-ink">
                {item.title || 'Untitled Post'}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-ink/55">{item.excerpt}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-forest/30 bg-forest/5 px-3 py-1.5 text-xs font-bold text-forest transition hover:bg-forest hover:text-white"
                onClick={() => openBroadcastModal(item)}
                title="Send email broadcast to subscribers about this post"
              >
                <span>✉️</span> Mail Subscribers
              </button>
              <button className="btn-outline" onClick={() => openEdit(item)}>
                Edit
              </button>
              <button
                className="text-sm font-medium text-clay hover:underline"
                onClick={() => remove(item)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!items.length && (
          <p className="rounded-xl border border-dashed border-line p-6 text-sm text-ink/50">
            No blog posts yet. Add your first article.
          </p>
        )}
      </div>

      <Modal open={open} title={editing ? 'Edit blog post' : 'Add blog post'} onClose={() => setOpen(false)} wide>
        <form onSubmit={save} className="space-y-5">
          {/* Note: All fields are non-compulsory */}
          <div>
            <label className="label">Title</label>
            <input
              className="field"
              placeholder="e.g. India's Agricultural Export Boom in 2026"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Published date</label>
              <input
                type="date"
                className="field"
                value={form.publishedAt}
                onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Order</label>
              <input
                type="number"
                className="field"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </div>
          </div>

          <ImageUpload
            label="Post cover image"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />

          <div>
            <label className="label">Short description / excerpt</label>
            <textarea
              className="field"
              rows="2"
              placeholder="Brief summary displayed on blog list cards..."
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Full article content</label>
            <textarea
              className="field"
              rows="6"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write the full article. Use blank lines between paragraphs."
            />
          </div>

          {/* Multiple Gallery Images */}
          <div className="rounded-2xl border border-line bg-paper/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-bold text-ink">Additional Gallery Images</h3>
                <p className="text-xs text-ink/60">Add multiple photos to display in an image gallery within this post.</p>
              </div>
              <button
                type="button"
                onClick={addGalleryImage}
                className="btn-outline py-1 text-xs"
              >
                + Add Image
              </button>
            </div>

            {form.images?.length > 0 && (
              <div className="mt-4 space-y-3">
                {form.images.map((imgUrl, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-xl border border-line bg-white p-3">
                    <span className="font-mono text-xs text-gold">#{idx + 1}</span>
                    <div className="flex-1">
                      <ImageUpload
                        label={`Gallery Image ${idx + 1}`}
                        value={imgUrl}
                        onChange={(url) => updateGalleryImage(idx, url)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="self-center text-xs font-semibold text-clay hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Multiple Content Sections */}
          <div className="rounded-2xl border border-line bg-paper/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-bold text-ink">Additional Content Sections</h3>
                <p className="text-xs text-ink/60">Add multiple headings, narrative paragraphs, and accompanying photos.</p>
              </div>
              <button
                type="button"
                onClick={addSection}
                className="btn-outline py-1 text-xs"
              >
                + Add Section
              </button>
            </div>

            {form.sections?.length > 0 && (
              <div className="mt-4 space-y-4">
                {form.sections.map((sec, idx) => (
                  <div key={idx} className="rounded-xl border border-line bg-white p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-line/50 pb-2">
                      <span className="font-mono text-xs font-bold text-forest">
                        Section {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSection(idx)}
                        className="text-xs font-semibold text-clay hover:underline"
                      >
                        Delete Section
                      </button>
                    </div>

                    <div>
                      <label className="label">Section Heading / Subtitle</label>
                      <input
                        className="field"
                        placeholder="e.g. Sourcing from Western Ghats"
                        value={sec.subtitle || ''}
                        onChange={(e) => updateSection(idx, 'subtitle', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="label">Section Text / Paragraph</label>
                      <textarea
                        className="field"
                        rows="3"
                        placeholder="Write this section's content..."
                        value={sec.text || ''}
                        onChange={(e) => updateSection(idx, 'text', e.target.value)}
                      />
                    </div>

                    <ImageUpload
                      label="Section Image (optional)"
                      value={sec.image || ''}
                      onChange={(url) => updateSection(idx, 'image', url)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Email Notification to Subscribers Section */}
          <div className="rounded-2xl border border-line bg-paper/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-bold text-ink">📢 Email Notification to Subscribers</h3>
                <p className="text-xs text-ink/60">Broadcast this blog article directly to your active newsletter subscribers when saved.</p>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-forest bg-forest/5 px-3 py-1.5 rounded-full border border-forest/20">
                <input
                  type="checkbox"
                  checked={form.notifySubscribers}
                  onChange={(e) => setForm({ ...form, notifySubscribers: e.target.checked })}
                />
                <span>Email Subscribers on Save</span>
              </label>
            </div>

            {form.notifySubscribers && (
              <div className="mt-3 space-y-3 pt-3 border-t border-line/60">
                <div>
                  <label className="label text-xs">Custom Email Subject</label>
                  <input
                    className="field text-xs"
                    placeholder="e.g. 📰 New Export Article: India's Agricultural Boom"
                    value={form.broadcastSubject}
                    onChange={(e) => setForm({ ...form, broadcastSubject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label text-xs">Custom Email Intro / Note</label>
                  <textarea
                    className="field text-xs"
                    rows="2"
                    placeholder="Brief intro for the email announcement..."
                    value={form.broadcastMessage}
                    onChange={(e) => setForm({ ...form, broadcastMessage: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />{' '}
              Published / visible
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />{' '}
              Featured
            </label>
          </div>

          {error && <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>}

          <div className="flex justify-end gap-2 pt-2 border-t border-line/60">
            <button type="button" className="btn-outline" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button className="btn-primary" disabled={busy}>
              {busy ? 'Saving…' : form.notifySubscribers ? 'Save & Broadcast Email' : 'Save article'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Broadcast Blog Post Modal */}
      {broadcastItem && (
        <Modal
          open={true}
          title={`✉️ Broadcast Blog to Subscribers`}
          onClose={() => setBroadcastItem(null)}
          wide
        >
          <div className="space-y-4">
            {/* Post Summary & Photo Preview Card */}
            <div className="rounded-2xl border border-line bg-[#fbf9f4] p-4 space-y-3">
              <div className="flex items-start gap-4">
                <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-white border border-line shadow-xs">
                  {broadcastItem.image ? (
                    <img
                      src={asset(broadcastItem.image)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : broadcastItem.images && broadcastItem.images[0] ? (
                    <img
                      src={asset(broadcastItem.images[0])}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-[10px] text-ink/40">No photo</div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-forest bg-forest/10 px-2 py-0.5 rounded">
                      FULL BLOG ARTICLE
                    </span>
                    {broadcastItem.images?.length > 0 && (
                      <span className="font-mono text-[10px] font-bold text-gold-dark bg-gold/15 px-2 py-0.5 rounded">
                        📷 {broadcastItem.images.length} Attached Photo(s)
                      </span>
                    )}
                  </div>
                  <h4 className="mt-1 font-display text-base font-bold text-ink">
                    {broadcastItem.title}
                  </h4>
                  <p className="mt-1 text-xs text-ink/65 line-clamp-2">
                    {broadcastItem.content ? broadcastItem.content.slice(0, 180) + '…' : broadcastItem.excerpt}
                  </p>
                </div>
              </div>

              {/* Informational banner */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-2.5 text-xs text-emerald-900 flex items-center gap-2">
                <span className="text-base">✨</span>
                <span>
                  <strong>Full Article Delivery:</strong> Subscribers will receive this exact blog post with its cover photo, full article text, and all attached photos.
                </span>
              </div>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="label text-xs">Email Subject Line *</label>
                <input
                  required
                  className="field text-sm"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  placeholder="e.g. 📰 New Export Intelligence Article: ..."
                />
              </div>

              <div>
                <label className="label text-xs">Introductory Message / Excerpt for Newsletter</label>
                <textarea
                  className="field text-xs"
                  rows="3"
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Write an inviting excerpt for your subscribers..."
                />
              </div>

              {/* Test Email Section */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs space-y-2">
                <span className="font-bold text-amber-900 block">
                  🧪 Send Test Email First (Verify Delivery):
                </span>
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
                    className="rounded-lg bg-amber-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-800 disabled:opacity-50 whitespace-nowrap shadow-sm transition"
                  >
                    {sendingTest ? 'Sending…' : 'Send Test Mail'}
                  </button>
                </div>

                {testResult && (
                  <div className="rounded-lg bg-white p-2.5 border border-amber-200 text-xs space-y-1">
                    <p className="font-semibold text-emerald-800">✓ {testResult.message}</p>
                    {testResult.previewUrl && (
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-ink/60">Test mailbox preview link:</span>
                        <a
                          href={testResult.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded bg-amber-700 px-2 py-0.5 text-[11px] font-bold text-white hover:bg-amber-800 transition"
                        >
                          Open Preview ↗
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {broadcastResult && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 space-y-1">
                  <p className="font-bold">✓ {broadcastResult.message}</p>
                  {broadcastResult.log?.previewUrl && (
                    <a
                      href={broadcastResult.log.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-1 text-emerald-700 underline font-bold"
                    >
                      View Generated Email in Test Mailbox ↗
                    </a>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-line/60">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setBroadcastItem(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingBroadcast || !broadcastSubject.trim()}
                  className="rounded-xl bg-forest px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-forest/90 disabled:opacity-50"
                >
                  {sendingBroadcast ? 'Dispatching Broadcast…' : '🚀 Send to All Active Subscribers'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
