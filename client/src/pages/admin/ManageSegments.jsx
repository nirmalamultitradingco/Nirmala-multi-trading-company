import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import Modal from '../../components/admin/Modal.jsx';
import ImageUpload from '../../components/admin/ImageUpload.jsx';

const blank = { name: '', description: '', image: '', order: 0, isActive: true };

export default function ManageSegments() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api.get('/segments', { params: { all: true } }).then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(blank); setError(''); setOpen(true); };
  const openEdit = (s) => { setEditing(s); setForm({ ...blank, ...s }); setError(''); setOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      if (editing) await api.put(`/segments/${editing._id}`, form);
      else await api.post('/segments', form);
      setOpen(false);
      load();
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  const remove = async (s) => {
    if (!confirm(`Delete product "${s.name}"?`)) return;
    try { await api.delete(`/segments/${s._id}`); load(); }
    catch (err) { alert(err.message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Products</h1>
          <p className="mt-1 text-sm text-ink/60">Product categories shown across the site. Order is automatically normalized after every save and delete.</p>
        </div>
        <button className="btn-primary" onClick={openNew}>+ New product</button>
      </div>

      <div className="mt-6 grid gap-3">
        {items.map((s) => (
          <div key={s._id} className="flex items-center gap-4 rounded-xl border border-line bg-white p-4 shadow-card">
            <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-line">
              {s.image ? <img src={s.image.startsWith('http') ? s.image : s.image} alt="" className="h-full w-full object-cover" /> : <span className="text-ink/30">—</span>}
            </div>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-forest text-xs font-bold text-paper">#{s.order}</div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-bold text-ink">{s.name}</p>
              <p className="truncate text-sm text-ink/55">{s.description}</p>
            </div>
            {!s.isActive && <span className="tag">hidden</span>}
            <button className="btn-outline" onClick={() => openEdit(s)}>Edit</button>
            <button className="text-sm font-medium text-clay hover:underline" onClick={() => remove(s)}>Delete</button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-ink/50">No products yet.</p>}
      </div>

      <Modal open={open} title={editing ? 'Edit product' : 'New product'} onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-4">
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
