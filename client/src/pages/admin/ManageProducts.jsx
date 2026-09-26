// import { useEffect, useState } from 'react';
// import api, { asset } from '../../api/axios.js';
// import Modal from '../../components/admin/Modal.jsx';
// import ImageUpload from '../../components/admin/ImageUpload.jsx';

// const blank = {
//   name: '', segment: '', partner: '', shortDescription: '', description: '',
//   image: '', origin: '', hsCode: '', packaging: '', moq: '',
//   certifications: '', featured: false, isActive: true,
// };

// export default function ManageProducts() {
//   const [items, setItems] = useState([]);
//   const [segments, setSegments] = useState([]);
//   const [partners, setPartners] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState(blank);
//   const [error, setError] = useState('');
//   const [busy, setBusy] = useState(false);

//   const load = () =>
//     api.get('/products', { params: { admin: true, limit: 200 } }).then((r) => setItems(r.data.products));

//   useEffect(() => {
//     load();
//     api.get('/segments', { params: { all: true } }).then((r) => setSegments(r.data));
//     api.get('/partners', { params: { all: true } }).then((r) => setPartners(r.data));
//   }, []);

//   const openNew = () => { setEditing(null); setForm(blank); setError(''); setOpen(true); };
//   const openEdit = (p) => {
//     setEditing(p);
//     setForm({
//       ...blank,
//       ...p,
//       segment: p.segment?._id || p.segment || '',
//       partner: p.partner?._id || p.partner || '',
//       certifications: (p.certifications || []).join(', '),
//     });
//     setError('');
//     setOpen(true);
//   };

//   const save = async (e) => {
//     e.preventDefault();
//     setBusy(true); setError('');
//     const payload = {
//       ...form,
//       partner: form.partner || undefined,
//       certifications: form.certifications
//         ? form.certifications.split(',').map((c) => c.trim()).filter(Boolean)
//         : [],
//     };
//     try {
//       if (editing) await api.put(`/products/${editing._id}`, payload);
//       else await api.post('/products', payload);
//       setOpen(false);
//       load();
//     } catch (err) { setError(err.message); } finally { setBusy(false); }
//   };

//   const remove = async (p) => {
//     if (!confirm(`Delete product "${p.name}"?`)) return;
//     try { await api.delete(`/products/${p._id}`); load(); }
//     catch (err) { alert(err.message); }
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-display text-2xl font-extrabold text-ink">Products</h1>
//           <p className="mt-1 text-sm text-ink/60">The catalogue buyers browse and inquire about.</p>
//         </div>
//         <button className="btn-primary" onClick={openNew}>+ New product</button>
//       </div>

//       <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-white shadow-card">
//         <table className="w-full text-left text-sm">
//           <thead className="border-b border-line font-mono text-[11px] uppercase tracking-wide text-ink/50">
//             <tr>
//               <th className="px-4 py-3">Product</th>
//               <th className="px-4 py-3">Segment</th>
//               <th className="px-4 py-3">Partner</th>
//               <th className="px-4 py-3">Flags</th>
//               <th className="px-4 py-3 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((p) => (
//               <tr key={p._id} className="border-b border-line/70 last:border-0">
//                 <td className="px-4 py-3">
//                   <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 overflow-hidden rounded-lg bg-line">
//                       {p.image && <img src={asset(p.image)} alt="" className="h-full w-full object-cover" />}
//                     </div>
//                     <span className="font-medium text-ink">{p.name}</span>
//                   </div>
//                 </td>
//                 <td className="px-4 py-3 text-ink/70">{p.segment?.name || '—'}</td>
//                 <td className="px-4 py-3 text-ink/70">{p.partner?.name || '—'}</td>
//                 <td className="px-4 py-3">
//                   <div className="flex gap-1">
//                     {p.featured && <span className="tag">featured</span>}
//                     {!p.isActive && <span className="tag">hidden</span>}
//                   </div>
//                 </td>
//                 <td className="px-4 py-3">
//                   <div className="flex justify-end gap-2">
//                     <button className="btn-outline" onClick={() => openEdit(p)}>Edit</button>
//                     <button className="text-sm font-medium text-clay hover:underline" onClick={() => remove(p)}>Delete</button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//             {items.length === 0 && (
//               <tr><td colSpan="6" className="px-4 py-8 text-center text-ink/50">No products yet.</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <Modal open={open} title={editing ? 'Edit product' : 'New product'} onClose={() => setOpen(false)} wide>
//         <form onSubmit={save} className="space-y-4">
//           <div>
//             <label className="label">Name *</label>
//             <input className="field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
//           </div>
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div>
//               <label className="label">Segment *</label>
//               <select className="field" required value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })}>
//                 <option value="">Select…</option>
//                 {segments.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="label">Partner</label>
//               <select className="field" value={form.partner} onChange={(e) => setForm({ ...form, partner: e.target.value })}>
//                 <option value="">None</option>
//                 {partners.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
//               </select>
//             </div>
//           </div>
//           <div>
//             <label className="label">Short description</label>
//             <input className="field" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
//           </div>
//           <div>
//             <label className="label">Full description</label>
//             <textarea className="field" rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
//           </div>
//           <ImageUpload label="Main image" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
//           <div className="grid gap-4 sm:grid-cols-2">
//             <div><label className="label">Origin</label><input className="field" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} /></div>
//             <div><label className="label">HS code</label><input className="field" value={form.hsCode} onChange={(e) => setForm({ ...form, hsCode: e.target.value })} /></div>
//             <div><label className="label">Packaging</label><input className="field" value={form.packaging} onChange={(e) => setForm({ ...form, packaging: e.target.value })} /></div>
//             <div><label className="label">MOQ</label><input className="field" value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })} /></div>
//           </div>
//           <div>
//             <label className="label">Certifications (comma separated)</label>
//             <input className="field" placeholder="ISO 22000, FSSAI, HACCP" value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} />
//           </div>
//           <div className="flex gap-6">
//             <label className="flex items-center gap-2 text-sm">
//               <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
//               Featured on home
//             </label>
//             <label className="flex items-center gap-2 text-sm">
//               <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
//               Visible on site
//             </label>
//           </div>
//           {error && <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>}
//           <div className="flex justify-end gap-2">
//             <button type="button" className="btn-outline" onClick={() => setOpen(false)}>Cancel</button>
//             <button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import api, { asset } from '../../api/axios.js';
import Modal from '../../components/admin/Modal.jsx';
import ImageUpload from '../../components/admin/ImageUpload.jsx';

const blank = {
  name: '',
  segment: '',
  subSegment: '',
  partner: '',
  shortDescription: '',
  description: '',
  image: '',
  origin: '',
  hsCode: '',
  boxSize: '',
  packageType: '',
  flavour: '',
  moq: '',
  featured: false,
  isActive: true,
};

export default function ManageProducts() {
  const [items, setItems] = useState([]);
  const [segments, setSegments] = useState([]);
  const [subsegments, setSubsegments] = useState([]);
  const [partners, setPartners] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [bannerSuccess, setBannerSuccess] = useState('');
  const [bannerError, setBannerError] = useState('');

  const load = () =>
    api
      .get('/products', {
        params: {
          admin: true,
          limit: 200,
        },
      })
      .then((r) => setItems(r.data.products));

  useEffect(() => {
    if (!form.segment) {
      setSubsegments([]);
      return;
    }

    const selectedSegment = segments.find((s) => s._id === form.segment);
    if (!selectedSegment) return;

    api
      .get('/subsegments', { params: { segment: selectedSegment.slug } })
      .then((r) => setSubsegments(r.data))
      .catch(() => setSubsegments([]));
  }, [form.segment, segments]);

  useEffect(() => {
    load();

    api
      .get('/segments', {
        params: {
          all: true,
        },
      })
      .then((r) => setSegments(r.data));

    api
      .get('/partners', {
        params: {
          all: true,
        },
      })
      .then((r) => setPartners(r.data));
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(blank);
    setError('');
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);

    setForm({
      ...blank,
      ...p,

      segment: p.segment?._id || p.segment || '',
      subSegment: p.subSegment?._id || p.subSegment || '',
      partner: p.partner?._id || p.partner || '',

      boxSize: p.boxSize || '',
      packageType: p.packageType || '',
      flavour: p.flavour || '',
    });

    setError('');
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();

    setBusy(true);
    setError('');

    const payload = {
      ...form,

      partner: form.partner || undefined,
      subSegment: form.subSegment || undefined,

      boxSize: form.boxSize.trim(),
      packageType: form.packageType.trim(),
      flavour: form.flavour.trim(),

      // Make sure old certification data is not sent anymore.
      certifications: undefined,
      packaging: undefined,
    };

    try {
      if (editing) {
        await api.put(`/products/${editing._id}`, payload);
        setBannerSuccess('✓ Product updated successfully in MongoDB!');
      } else {
        await api.post('/products', payload);
        setBannerSuccess('✓ Product added successfully to MongoDB!');
      }

      setOpen(false);
      setTimeout(() => setBannerSuccess(''), 6000);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save product in MongoDB.';
      setError(msg);
      setBannerError('✗ Error: ' + msg);
      setTimeout(() => setBannerError(''), 8000);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p) => {
    if (!confirm(`Delete product "${p.name}"?`)) return;

    try {
      await api.delete(`/products/${p._id}`);
      setBannerSuccess('✓ Product deleted successfully from MongoDB!');
      setTimeout(() => setBannerSuccess(''), 6000);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete product.';
      setBannerError('✗ Error: ' + msg);
      setTimeout(() => setBannerError(''), 8000);
    }
  };

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">
            Product Details
          </h1>

          <p className="mt-1 text-sm text-ink/60">
            The catalogue of individual product specifications, packaging, and origins.
          </p>
        </div>

        <button className="btn-primary" onClick={openNew}>
          + New product detail
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

      {/* PRODUCT TABLE */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line font-mono text-[11px] uppercase tracking-wide text-ink/50">
            <tr>
              <th className="px-4 py-3">Product Detail</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Sub Product</th>
              <th className="px-4 py-3">Partner</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((p) => (
              <tr
                key={p._id}
                className="border-b border-line/70 last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-line">
                      {p.image && (
                        <img
                          src={asset(p.image)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <span className="font-medium text-ink">
                      {p.name}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3 text-ink/70">
                  {p.segment?.name || '—'}
                </td>

                <td className="px-4 py-3 text-ink/70">
                  {p.subSegment?.name || '—'}
                </td>

                <td className="px-4 py-3 text-ink/70">
                  {p.partner?.name || '—'}
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {p.featured && (
                      <span className="tag">
                        featured
                      </span>
                    )}

                    {!p.isActive && (
                      <span className="tag">
                        hidden
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      className="btn-outline"
                      onClick={() => openEdit(p)}
                    >
                      Edit
                    </button>

                    <button
                      className="text-sm font-medium text-clay hover:underline"
                      onClick={() => remove(p)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-8 text-center text-ink/50"
                >
                  No product details yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PRODUCT FORM */}
      <Modal
        open={open}
        title={editing ? 'Edit product detail' : 'New product detail'}
        onClose={() => setOpen(false)}
        wide
      >
        <form onSubmit={save} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="label">
              Name *
            </label>

            <input
              className="field"
              required
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </div>

          {/* SEGMENT + SUB-SEGMENT + PARTNER */}
          <div className="grid gap-4 sm:grid-cols-3">

            <div>
              <label className="label">Parent Product *</label>
              <select
                className="field"
                required
                value={form.segment}
                onChange={(e) =>
                  setForm({
                    ...form,
                    segment: e.target.value,
                    subSegment: '',
                  })
                }
              >
                <option value="">Select product…</option>
                {segments.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Sub Product</label>
              <select
                className="field"
                value={form.subSegment}
                disabled={!form.segment}
                onChange={(e) => setForm({ ...form, subSegment: e.target.value })}
              >
                <option value="">None</option>
                {subsegments.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
              {form.segment && subsegments.length === 0 && (
                <p className="mt-1 text-xs text-ink/45">No sub products added for this product.</p>
              )}
            </div>

            <div>
              <label className="label">Partner</label>

              <select
                className="field"
                value={form.partner}
                onChange={(e) =>
                  setForm({
                    ...form,
                    partner: e.target.value,
                  })
                }
              >
                <option value="">
                  None
                </option>

                {partners.map((p) => (
                  <option
                    key={p._id}
                    value={p._id}
                  >
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* SHORT DESCRIPTION */}
          <div>
            <label className="label">
              Short description
            </label>

            <input
              className="field"
              value={form.shortDescription}
              onChange={(e) =>
                setForm({
                  ...form,
                  shortDescription: e.target.value,
                })
              }
            />
          </div>

          {/* FULL DESCRIPTION */}
          <div>
            <label className="label">
              Full description
            </label>

            <textarea
              className="field"
              rows="4"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          {/* IMAGE */}
          <ImageUpload
            label="Main image"
            value={form.image}
            onChange={(url) =>
              setForm({
                ...form,
                image: url,
              })
            }
          />

          {/* PRODUCT DETAILS */}
          <div className="grid gap-4 sm:grid-cols-2">

            {/* ORIGIN */}
            <div>
              <label className="label">
                Origin
              </label>

              <input
                className="field"
                placeholder="e.g. Gujarat, India"
                value={form.origin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    origin: e.target.value,
                  })
                }
              />
            </div>

            {/* HS CODE */}
            <div>
              <label className="label">
                HS code
              </label>

              <input
                className="field"
                placeholder="e.g. 0910.30"
                value={form.hsCode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hsCode: e.target.value,
                  })
                }
              />
            </div>

            {/* BOX SIZE */}
            <div>
              <label className="label">
                Box Size
              </label>

              <input
                className="field"
                placeholder="e.g. 200 g, 500 g, 1 kg"
                value={form.boxSize}
                onChange={(e) =>
                  setForm({
                    ...form,
                    boxSize: e.target.value,
                  })
                }
              />
            </div>

            {/* PACKAGE TYPE */}
            <div>
              <label className="label">
                Package Type
              </label>

              <input
                className="field"
                placeholder="e.g. Pouch, Box, Jar"
                value={form.packageType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    packageType: e.target.value,
                  })
                }
              />
            </div>

            {/* FLAVOUR */}
            <div>
              <label className="label">
                Flavour
              </label>

              <input
                className="field"
                placeholder="e.g. Classic, Spicy, Salted"
                value={form.flavour}
                onChange={(e) =>
                  setForm({
                    ...form,
                    flavour: e.target.value,
                  })
                }
              />
            </div>

            {/* MOQ */}
            <div>
              <label className="label">
                MOQ
              </label>

              <input
                className="field"
                placeholder="e.g. 3 MT"
                value={form.moq}
                onChange={(e) =>
                  setForm({
                    ...form,
                    moq: e.target.value,
                  })
                }
              />
            </div>

          </div>

          {/* FLAGS */}
          <div className="flex gap-6">

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm({
                    ...form,
                    featured: e.target.checked,
                  })
                }
              />

              Featured on home
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isActive: e.target.checked,
                  })
                }
              />

              Visible on site
            </label>

          </div>

          {/* ERROR */}
          {error && (
            <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">
              {error}
            </p>
          )}

          {/* BUTTONS */}
          <div className="flex justify-end gap-2">

            <button
              type="button"
              className="btn-outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>

            <button
              className="btn-primary"
              disabled={busy}
            >
              {busy ? 'Saving…' : 'Save'}
            </button>

          </div>

        </form>
      </Modal>
    </div>
  );
}