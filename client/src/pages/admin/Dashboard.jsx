import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';

const statusStyles = {
  new: 'bg-amber-100 text-amber-900 border-amber-300 font-semibold',
  read: 'bg-sky-100 text-sky-900 border-sky-300 font-semibold',
  responded: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold',
};

const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentInquiries, setRecentInquiries] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/segments', { params: { all: true } }),
      api.get('/products', { params: { admin: true, limit: 1 } }),
      api.get('/partners', { params: { all: true } }),
      api.get('/inquiries'),
    ]).then(([seg, prod, part, inq]) => {
      const inqList = inq.data || [];
      setStats({
        segments: seg.data.length,
        products: prod.data.total,
        partners: part.data.length,
        inquiries: inqList.length,
        newInquiries: inqList.filter((i) => i.status === 'new').length,
      });
      setRecentInquiries(inqList.slice(0, 5));
    });
  }, []);

  const cards = [
    { label: 'Products', value: stats?.segments, to: '/admin/segments' },
    { label: 'Product Details', value: stats?.products, to: '/admin/products' },
    { label: 'Partners', value: stats?.partners, to: '/admin/partners' },
    { label: 'Inquiries', value: stats?.inquiries, to: '/admin/inquiries', badge: stats?.newInquiries },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink/60">Overview of your catalogue and inquiries.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-2xl border border-line bg-white p-6 shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-widest text-moss">{c.label}</p>
              {c.badge > 0 && (
                <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-semibold text-ink">
                  {c.badge} new
                </span>
              )}
            </div>
            <p className="mt-3 font-display text-3xl font-extrabold text-ink">
              {c.value ?? '—'}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Inquiries Section */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Recent Inquiries</h2>
            <p className="text-xs text-ink/60 mt-0.5">Latest export inquiries with segment or product interest.</p>
          </div>
          <Link to="/admin/inquiries" className="text-xs font-semibold text-forest hover:underline">
            View all ({stats?.inquiries ?? 0}) →
          </Link>
        </div>

        <div className="mt-4 divide-y divide-line">
          {recentInquiries.map((i) => {
            const interestLabel =
              i.segment?.name ? `Segment: ${i.segment.name}` :
              i.product?.name ? `Product: ${i.product.name}` :
              i.productInterest || 'General inquiry';

            return (
              <div key={i._id} className="py-3.5 flex flex-wrap items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-ink">{i.name}</p>
                    <span className={`rounded-full border px-2 py-0.2 text-[10px] uppercase font-mono ${statusStyles[i.status] || ''}`}>
                      {i.status}
                    </span>
                    <span className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.2 text-[10px] font-medium">
                      {interestLabel}
                    </span>
                  </div>
                  <p className="text-xs text-ink/60 mt-0.5">
                    {i.email}
                    {i.company && <span> · {i.company}</span>}
                    {i.country && <span> · {i.country}</span>}
                    <span className="font-mono text-ink/40 ml-2">({fmtDate(i.createdAt)})</span>
                  </p>
                </div>
                <Link to="/admin/inquiries" className="text-xs font-medium text-forest hover:underline">
                  Open →
                </Link>
              </div>
            );
          })}

          {recentInquiries.length === 0 && (
            <p className="py-6 text-center text-xs text-ink/50">No inquiries received yet.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-8 shadow-card">
        <h2 className="font-display text-lg font-bold text-ink">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/admin/segments" className="btn-primary">Add a product</Link>
          <Link to="/admin/subsegments" className="btn-outline">Add a sub product</Link>
          <Link to="/admin/products" className="btn-outline">Add product details</Link>
          <Link to="/admin/partners" className="btn-outline">Add a partner</Link>
          <Link to="/admin/brochures" className="btn-outline">Upload a brochure</Link>
          <Link to="/admin/inquiries" className="btn-outline">Manage inquiries</Link>
        </div>
      </div>
    </div>
  );
}
