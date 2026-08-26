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

  const load = () => api.get('/brochures').then((r) => setItems(r.data));

  useEffect(() => {
    load();
    api.get('/segments', { params: { all: true } }).then((r) => setSegments(r.data));
  }, []);

  const openNew = () => { setForm(blank); setError(''); setOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    if (!form.file) { setError('Please attach a PDF file.'); return; }
    setBusy(true); setError('');
    try {
      // Brochures are created with a multipart body: the PDF plus its metadata.
      const fd = new FormData();
      fd.append('file', form.file);
      fd.append('title', form.title);
      fd.append('description', form.description);
      if (form.segment) fd.append('segment', form.segment);
      await api.post('/brochures', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setOpen(false);
      load();
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  const remove = async (b) => {
    if (!confirm(`Delete brochure "${b.title}"?`)) return;
    try { await api.delete(`/brochures/${b._id}`); load(); }
    catch (err) { alert(err.message); }
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
