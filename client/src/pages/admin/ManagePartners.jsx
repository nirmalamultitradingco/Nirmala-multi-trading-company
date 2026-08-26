import { useEffect, useState } from 'react';
import api, { asset } from '../../api/axios.js';
import Modal from '../../components/admin/Modal.jsx';
import ImageUpload from '../../components/admin/ImageUpload.jsx';

const blank = { name: '', country: '', description: '', website: '', logo: '', isActive: true };

export default function ManagePartners() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => api.get('/partners', { params: { all: true } }).then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(blank); setError(''); setOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...blank, ...p }); setError(''); setOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      if (editing) await api.put(`/partners/${editing._id}`, form);
      else await api.post('/partners', form);
      setOpen(false);
      load();
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  const remove = async (p) => {
    if (!confirm(`Delete partner "${p.name}"? Products will be unlinked from it.`)) return;
    try { await api.delete(`/partners/${p._id}`); load(); }
    catch (err) { alert(err.message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Partners</h1>
          <p className="mt-1 text-sm text-ink/60">Collaborating companies whose products you list.</p>
        </div>
        <button className="btn-primary" onClick={openNew}>+ New partner</button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((p) => (
          <div key={p._id} className="rounded-xl border border-line bg-white p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg bg-line">
                {p.logo ? <img src={asset(p.logo)} alt="" className="h-full w-full object-cover" /> : <span className="font-display font-bold text-forest">{p.name[0]}</span>}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold text-ink">{p.name}</p>
                <p className="font-mono text-xs uppercase tracking-wide text-moss">{p.country || '—'}</p>
              </div>
              {!p.isActive && <span className="tag">hidden</span>}
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-ink/60">{p.description}</p>
            <div className="mt-3 flex gap-2">
              <button className="btn-outline" onClick={() => openEdit(p)}>Edit</button>
              <button className="text-sm font-medium text-clay hover:underline" onClick={() => remove(p)}>Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-ink/50">No partners yet.</p>}
      </div>

      <Modal open={open} title={editing ? 'Edit partner' : 'New partner'} onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name *</label>
              <input className="field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Country</label>
              <input className="field" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Website</label>
            <input className="field" placeholder="https://…" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="field" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <ImageUpload label="Logo" value={form.logo} onChange={(url) => setForm({ ...form, logo: url })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Visible on site
          </label>
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
