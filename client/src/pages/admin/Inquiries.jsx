import { useEffect, useState } from 'react';
import api from '../../api/axios.js';

const statusStyles = {
  new: 'bg-gold/20 text-gold',
  read: 'bg-moss/15 text-moss',
  responded: 'bg-forest/15 text-forest',
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function Inquiries() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(null); // currently expanded inquiry id

  const load = () =>
    api.get('/inquiries', { params: { status: filter || undefined } }).then((r) => setItems(r.data));

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  const setStatus = async (id, status) => {
    await api.patch(`/inquiries/${id}`, { status });
    load();
  };

  const remove = async (i) => {
    if (!confirm(`Delete inquiry from ${i.name}?`)) return;
    await api.delete(`/inquiries/${i._id}`);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink">Inquiries</h1>
          <p className="mt-1 text-sm text-ink/60">Messages submitted through the site's inquiry form.</p>
        </div>
        <div className="flex gap-2">
          {['', 'new', 'read', 'responded'].map((s) => (
            <button
              key={s || 'all'}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                filter === s ? 'bg-forest text-paper' : 'border border-line text-ink/70 hover:bg-white'
              }`}
            >
              {s ? s[0].toUpperCase() + s.slice(1) : 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {items.map((i) => (
          <div key={i._id} className="rounded-xl border border-line bg-white p-4 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display font-bold text-ink">{i.name}</p>
                  <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide ${statusStyles[i.status]}`}>
                    {i.status}
                  </span>
                </div>
                <p className="text-sm text-ink/60">
                  <a href={`mailto:${i.email}`} className="hover:underline">{i.email}</a>
                  {i.company && <span> · {i.company}</span>}
                  {i.country && <span> · {i.country}</span>}
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-ink/40">
                  {fmtDate(i.createdAt)}
                  {i.product?.name && <span> · re: {i.product.name}</span>}
                  {i.phone && <span> · {i.phone}</span>}
                </p>
              </div>
              <button
                className="text-sm font-medium text-forest hover:underline"
                onClick={() => setOpen(open === i._id ? null : i._id)}
              >
                {open === i._id ? 'Hide' : 'View message'}
              </button>
            </div>

            {open === i._id && (
              <div className="mt-3 border-t border-line pt-3">
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink/75">{i.message}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {['new', 'read', 'responded']
                    .filter((s) => s !== i.status)
                    .map((s) => (
                      <button key={s} className="btn-outline" onClick={() => setStatus(i._id, s)}>
                        Mark {s}
                      </button>
                    ))}
                  <a href={`mailto:${i.email}`} className="btn-primary">Reply by email</a>
                  <button className="ml-auto text-sm font-medium text-clay hover:underline" onClick={() => remove(i)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-ink/50">No inquiries{filter && ` with status "${filter}"`} yet.</p>}
      </div>
    </div>
  );
}
