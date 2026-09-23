import { useEffect, useState } from 'react';
import api, { asset } from '../../api/axios.js';
import Modal from '../../components/admin/Modal.jsx';
import ImageUpload from '../../components/admin/ImageUpload.jsx';

const blank = {
  name: '',
  segment: '',
  description: '',
  image: '',
  order: 0,
  isActive: true,
};

export default function ManageSubSegments() {
  const [items, setItems] = useState([]);
  const [segments, setSegments] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () =>
    api.get('/subsegments', { params: { all: true } }).then((r) => setItems(r.data));

  useEffect(() => {
    load();
    api.get('/segments', { params: { all: true } }).then((r) => setSegments(r.data));
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
      segment: item.segment?._id || item.segment || '',
    });
    setError('');
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');

    try {
      if (editing) await api.put(`/subsegments/${editing._id}`, form);
      else await api.post('/subsegments', form);
      setOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (item) => {
    if (!confirm(`Delete sub product "${item.name}"?`)) return;
    try {
      await api.delete(`/subsegments/${item._id}`);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const activeSegments = segments.filter((s) => s.isActive !== false);

  const grouped = activeSegments.map((segment) => ({
    segment,
    items: items.filter((item) => (item.segment?._id || item.segment) === segment._id),
  }));

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Sub Products</h1>
          <p className="mt-1 text-sm text-ink/60">Manage the second-level categories shown inside each product.</p>
        </div>
        <button className="btn-primary shrink-0" onClick={openNew}>+ New sub product</button>
      </div>

      <div className="mt-6 space-y-6">
        {grouped.map(({ segment, items: segmentItems }) => (
          <section key={segment._id}>
            <div className="mb-2 flex items-center gap-2">
              <h2 className="font-display font-bold text-ink">{segment.name}</h2>
              <span className="tag">{segmentItems.length}</span>
            </div>
            <div className="grid gap-3">
              {segmentItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4 rounded-xl border border-line bg-white p-4 shadow-card">
                  <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-line">
                    {item.image ? <img src={asset(item.image)} alt="" className="h-full w-full object-cover" /> : <span className="text-ink/30">—</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-bold text-ink">{item.name}</p>
                    <p className="truncate text-sm text-ink/55">{item.description}</p>
                  </div>
                  <span className="hidden font-mono text-xs text-ink/40 sm:block">#{item.order}</span>
                  {!item.isActive && <span className="tag">hidden</span>}
                  <button className="btn-outline" onClick={() => openEdit(item)}>Edit</button>
                  <button className="text-sm font-medium text-clay hover:underline" onClick={() => remove(item)}>Delete</button>
                </div>
              ))}
              {segmentItems.length === 0 && <p className="rounded-xl border border-dashed border-line px-4 py-5 text-sm text-ink/50">No sub products for this product yet.</p>}
            </div>
          </section>
        ))}
        {segments.length === 0 && <p className="text-sm text-ink/50">Create a product first.</p>}
      </div>

      <Modal open={open} title={editing ? 'Edit sub product' : 'New sub product'} onClose={() => setOpen(false)} wide>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="label">Parent product *</label>
            <select className="field" required value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })}>
              <option value="">Select product…</option>
              {activeSegments.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Name *</label>
            <input className="field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="field" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
          <div className="flex items-center gap-4">
            <div className="w-24">
              <label className="label">Order</label>
              <input type="number" className="field" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
            <label className="mt-6 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
              Visible on site
            </label>
          </div>
          {error && <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-outline" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
