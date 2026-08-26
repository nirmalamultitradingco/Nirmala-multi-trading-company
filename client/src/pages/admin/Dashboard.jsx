import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/segments', { params: { all: true } }),
      api.get('/products', { params: { admin: true, limit: 1 } }),
      api.get('/partners', { params: { all: true } }),
      api.get('/inquiries'),
    ]).then(([seg, prod, part, inq]) =>
      setStats({
        segments: seg.data.length,
        products: prod.data.total,
        partners: part.data.length,
        inquiries: inq.data.length,
        newInquiries: inq.data.filter((i) => i.status === 'new').length,
      })
    );
  }, []);

  const cards = [
    { label: 'Segments', value: stats?.segments, to: '/admin/segments' },
    { label: 'Products', value: stats?.products, to: '/admin/products' },
    { label: 'Partners', value: stats?.partners, to: '/admin/partners' },
    { label: 'Inquiries', value: stats?.inquiries, to: '/admin/inquiries', badge: stats?.newInquiries },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/60">Overview of your catalogue and inquiries.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-xl border border-line bg-white p-5 shadow-card transition hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-widest text-moss">{c.label}</p>
              {c.badge > 0 && (
                <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-semibold text-ink">
                  {c.badge} new
                </span>
              )}
            </div>
            <p className="mt-2 font-display text-3xl font-extrabold text-ink">
              {c.value ?? '—'}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-line bg-white p-5 shadow-card">
        <h2 className="font-display text-lg font-bold text-ink">Quick actions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/admin/products" className="btn-primary">Add a product</Link>
          <Link to="/admin/segments" className="btn-outline">Add a segment</Link>
          <Link to="/admin/partners" className="btn-outline">Add a partner</Link>
          <Link to="/admin/brochures" className="btn-outline">Upload a brochure</Link>
        </div>
      </div>
    </div>
  );
}
