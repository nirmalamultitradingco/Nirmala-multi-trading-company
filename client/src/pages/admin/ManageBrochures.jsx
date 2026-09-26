import { useEffect, useState } from 'react';
import api, { asset } from '../../api/axios.js';
import Modal from '../../components/admin/Modal.jsx';

const blank = { title: '', description: '', segment: '', file: null };

export default function ManageBrochures() {
  const [items, setItems] = useState([]);
  const [segments, setSegments] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [bannerSuccess, setBannerSuccess] = useState('');
  const [bannerError, setBannerError] = useState('');

  const load = () => api.get('/brochures').then((r) => setItems(r.data));

  useEffect(() => {
    load();
    api.get('/segments', { params: { all: true } }).then((r) => setSegments(r.data));
  }, []);

  const openNew = () => { setForm(blank); setError(''); setOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    if (!form.file) { setError('Please attach a PDF file.'); return; }
    setBusy(true);
    setError('');
    setBannerError('');
    try {
      // Brochures are created with a multipart body: the PDF plus its metadata.
      const fd = new FormData();
      fd.append('file', form.file);
      fd.append('title', form.title);
      fd.append('description', form.description);
      if (form.segment) fd.append('segment', form.segment);
      await api.post('/brochures', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setBannerSuccess('✓ Data is successfully added in MongoDB!');
      setOpen(false);
      setTimeout(() => setBannerSuccess(''), 6000);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to upload brochure to MongoDB.';
      setError(msg);
      setBannerError('✗ Error: ' + msg);
      setTimeout(() => setBannerError(''), 8000);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (b) => {
    if (!confirm(`Delete brochure "${b.title}"?`)) return;
    try {
      await api.delete(`/brochures/${b._id}`);
      setBannerSuccess('✓ Data is successfully deleted from MongoDB!');
      setTimeout(() => setBannerSuccess(''), 6000);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete brochure.';
      setBannerError('✗ Error: ' + msg);
      setTimeout(() => setBannerError(''), 8000);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Brochures</h1>
          <p className="mt-1 text-sm text-ink/60">Catalogues and line cards buyers can download.</p>
        </div>
        <button className="btn-primary" onClick={openNew}>+ Upload brochure</button>
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

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((b) => (
          <div key={b._id} className="rounded-xl border border-line bg-white p-4 shadow-card">
            {b.segment?.name && <p className="eyebrow">{b.segment.name}</p>}
            <h3 className="mt-1 font-display text-lg font-bold text-ink">{b.title}</h3>
            {b.description && <p className="mt-1 text-sm text-ink/60">{b.description}</p>}
            <div className="mt-3 flex items-center gap-2">
              <a href={asset(b.file)} target="_blank" rel="noreferrer" className="btn-outline">Open PDF</a>
              <button className="text-sm font-medium text-clay hover:underline" onClick={() => remove(b)}>Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-ink/50">No brochures yet.</p>}
      </div>

      <Modal open={open} title="Upload brochure" onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input className="field" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="field" rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Segment (optional)</label>
            <select className="field" value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })}>
              <option value="">Not tied to a segment</option>
              {segments.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">PDF file *</label>
            <input type="file" accept="application/pdf" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })} className="text-sm" />
          </div>
          {error && <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-outline" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn-primary" disabled={busy}>{busy ? 'Uploading…' : 'Upload'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
