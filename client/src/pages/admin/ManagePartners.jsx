import { useEffect, useState } from 'react';
import api, { asset } from '../../api/axios.js';
import Modal from '../../components/admin/Modal.jsx';
import ImageUpload from '../../components/admin/ImageUpload.jsx';

const blank = { name: '', country: '', description: '', website: '', logo: '', isActive: true };

const statusStyles = {
  pending: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
  reviewed: 'bg-sky-100 text-sky-900 border-sky-300 font-semibold',
  approved: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold',
  rejected: 'bg-red-100 text-red-900 border-red-300 font-semibold',
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function ManagePartners() {
  const [activeTab, setActiveTab] = useState('partners'); // 'partners' or 'applications'
  const [items, setItems] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [regSearch, setRegSearch] = useState('');
  const [regStatusFilter, setRegStatusFilter] = useState('');

  const loadPartners = () =>
    api.get('/partners', { params: { all: true } }).then((r) => setItems(r.data));

  const loadRegistrations = () =>
    api.get('/partners/registrations/all').then((r) => setRegistrations(r.data || []));

  useEffect(() => {
    loadPartners();
    loadRegistrations();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(blank);
    setError('');
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...blank, ...p });
    setError('');
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (editing) await api.put(`/partners/${editing._id}`, form);
      else await api.post('/partners', form);
      setOpen(false);
      loadPartners();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p) => {
    if (!confirm(`Delete partner "${p.name}"? Products will be unlinked from it.`)) return;
    try {
      await api.delete(`/partners/${p._id}`);
      loadPartners();
    } catch (err) {
      alert(err.message);
    }
  };

  /* Application Actions */
  const handleApprove = async (reg) => {
    if (!confirm(`Approve "${reg.companyName}" as an active partner on the website?`)) return;
    try {
      const res = await api.post(`/partners/registrations/${reg._id}/approve`);
      alert(res.data?.message || 'Partner approved!');
      loadRegistrations();
      loadPartners();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/partners/registrations/${id}/status`, { status });
      loadRegistrations();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteReg = async (id, name) => {
    if (!confirm(`Delete application from "${name}"?`)) return;
    try {
      await api.delete(`/partners/registrations/${id}`);
      loadRegistrations();
    } catch (err) {
      alert(err.message);
    }
  };

  const pendingCount = registrations.filter((r) => r.status === 'pending').length;

  const filteredRegistrations = registrations.filter((r) => {
    if (regStatusFilter && r.status !== regStatusFilter) return false;
    if (regSearch) {
      const q = regSearch.toLowerCase();
      return (
        r.companyName?.toLowerCase().includes(q) ||
        r.contactPerson?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.country?.toLowerCase().includes(q) ||
        r.businessType?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Partners & Suppliers</h1>
          <p className="mt-1 text-sm text-ink/60">
            Manage collaborating food companies, suppliers, and incoming partnership registrations.
          </p>
        </div>
        {activeTab === 'partners' && (
          <button className="btn-primary" onClick={openNew}>
            + New partner
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-line pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('partners')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === 'partners'
              ? 'bg-forest text-white shadow-sm'
              : 'bg-white text-ink/75 hover:bg-black/5'
          }`}
        >
          <span>🤝 Active Partners ({items.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('applications')}
          className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            activeTab === 'applications'
              ? 'bg-forest text-white shadow-sm'
              : 'bg-white text-ink/75 hover:bg-black/5'
          }`}
        >
          <span>📝 Partner Registrations ({registrations.length})</span>
          {pendingCount > 0 && (
            <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-ink">
              {pendingCount} new
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ACTIVE PARTNERS */}
      {activeTab === 'partners' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((p) => (
            <div key={p._id} className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-line border border-line">
                  {p.logo ? (
                    <img src={asset(p.logo)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-display font-extrabold text-forest text-lg">
                      {p.name[0]}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold text-ink text-base">{p.name}</p>
                  <p className="font-mono text-xs uppercase tracking-wide text-moss">
                    📍 {p.country || 'India'}
                  </p>
                </div>
                {!p.isActive && <span className="tag">hidden</span>}
              </div>

              {p.website && (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block truncate text-xs text-forest hover:underline"
                >
                  🔗 {p.website}
                </a>
              )}

              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink/70">
                {p.description || 'No description provided.'}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3">
                <button className="btn-outline text-xs py-1.5 px-3" onClick={() => openEdit(p)}>
                  Edit Details
                </button>
                <button
                  className="text-xs font-semibold text-clay hover:underline"
                  onClick={() => remove(p)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-ink/50 py-8">No partners listed yet.</p>}
        </div>
      )}

      {/* TAB 2: PARTNER REGISTRATIONS (INCOMING APPLICATIONS) */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm">
            <div className="flex flex-1 items-center gap-3 min-w-[240px]">
              <span className="text-ink/40 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search by company, person, email, city..."
                className="w-full text-sm outline-none bg-transparent"
                value={regSearch}
                onChange={(e) => setRegSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink/50 font-medium">Filter:</span>
              <select
                className="rounded-lg border border-line bg-paper px-3 py-1.5 text-xs font-semibold text-ink outline-none cursor-pointer"
                value={regStatusFilter}
                onChange={(e) => setRegStatusFilter(e.target.value)}
              >
                <option value="">All Statuses ({registrations.length})</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Applications Grid */}
          <div className="grid gap-4">
            {filteredRegistrations.map((reg) => (
              <div
                key={reg._id}
                className="rounded-2xl border border-line bg-white p-6 shadow-card space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/60 pb-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-display text-lg font-bold text-ink">
                        {reg.companyName}
                      </h3>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] uppercase font-mono ${
                          statusStyles[reg.status] || ''
                        }`}
                      >
                        {reg.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink/60">
                      Submitted on <span className="font-mono">{fmtDate(reg.createdAt)}</span>
                    </p>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {reg.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => handleApprove(reg)}
                        className="rounded-lg bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition"
                      >
                        ✓ Approve as Partner
                      </button>
                    )}

                    <select
                      value={reg.status}
                      onChange={(e) => handleUpdateStatus(reg._id, e.target.value)}
                      className="rounded-lg border border-line bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink outline-none cursor-pointer"
                    >
                      <option value="pending">Mark Pending</option>
                      <option value="reviewed">Mark Reviewed</option>
                      <option value="approved">Mark Approved</option>
                      <option value="rejected">Mark Rejected</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDeleteReg(reg._id, reg.companyName)}
                      className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Details Meta */}
                <div className="grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4 bg-[#fbf9f4] p-4 rounded-xl border border-line/80">
                  <div>
                    <p className="font-mono text-[10px] uppercase text-moss font-semibold">Contact Person</p>
                    <p className="font-medium text-ink mt-0.5">{reg.contactPerson}</p>
                    <p className="text-ink/60 truncate">{reg.email}</p>
                    {reg.phone && <p className="font-mono text-ink/75">{reg.phone}</p>}
                  </div>

                  <div>
                    <p className="font-mono text-[10px] uppercase text-moss font-semibold">Location & Origin</p>
                    <p className="font-medium text-ink mt-0.5">
                      📍 {reg.country || 'India'} {reg.city ? `(${reg.city})` : ''}
                    </p>
                    {reg.website && (
                      <a
                        href={reg.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-forest hover:underline truncate block mt-0.5"
                      >
                        🔗 {reg.website}
                      </a>
                    )}
                  </div>

                  <div>
                    <p className="font-mono text-[10px] uppercase text-moss font-semibold">Business Type</p>
                    <p className="font-medium text-ink mt-0.5">{reg.businessType || 'Supplier'}</p>
                    {reg.annualCapacity && (
                      <p className="text-ink/65 mt-0.5">Cap: {reg.annualCapacity}</p>
                    )}
                  </div>

                  <div>
                    <p className="font-mono text-[10px] uppercase text-moss font-semibold">Products Supplied</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {reg.categories?.length > 0 ? (
                        reg.categories.map((c) => (
                          <span
                            key={c}
                            className="rounded bg-white border border-line px-1.5 py-0.5 text-[10px] font-medium text-ink/80"
                          >
                            {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-ink/40">General Agro</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Proposal Message */}
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-moss font-semibold">
                    Proposal / Capabilities Message:
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink/80 whitespace-pre-line bg-paper/40 p-3 rounded-lg border border-line/50">
                    {reg.message}
                  </p>
                </div>
              </div>
            ))}

            {filteredRegistrations.length === 0 && (
              <p className="py-12 text-center text-xs text-ink/50 bg-white rounded-2xl border border-line">
                No partner registration requests found matching current filter.
              </p>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PARTNER */}
      <Modal open={open} title={editing ? 'Edit partner' : 'New partner'} onClose={() => setOpen(false)}>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name *</label>
              <input
                className="field"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Country</label>
              <input
                className="field"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label">Website</label>
            <input
              className="field"
              placeholder="https://…"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="field"
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <ImageUpload label="Logo" value={form.logo} onChange={(url) => setForm({ ...form, logo: url })} />
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Visible on site
          </label>
          {error && <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-outline" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button className="btn-primary" disabled={busy}>
              {busy ? 'Saving…' : 'Save Partner'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

