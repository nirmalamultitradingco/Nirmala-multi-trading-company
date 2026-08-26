import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import { BRAND } from '../config.js';
import SectionHeading from '../components/SectionHeading.jsx';

const empty = {
  name: '',
  email: '',
  phone: '',
  company: '',
  country: '',
  product: '',
  message: '',
};

export default function Inquiry() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({ ...empty, product: params.get('product') || '' });
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  useEffect(() => {
    api.get('/products', { params: { limit: 100 } }).then((r) => setProducts(r.data.products));
  }, []);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'loading', message: '' });
    try {
      const payload = { ...form, product: form.product || undefined };
      const res = await api.post('/inquiries', payload);
      setStatus({ state: 'success', message: res.data.message });
      setForm({ ...empty });
    } catch (err) {
      setStatus({ state: 'error', message: err.message });
    }
  };

  return (
    <div className="container-x grid gap-12 py-14 md:grid-cols-[0.9fr_1.1fr] md:py-20">
      <div>
        <SectionHeading eyebrow="Get in touch" title="Send an inquiry">
          Share the product, quantity and destination. Our team replies with samples, specs and pricing.
        </SectionHeading>
        <div className="mt-8 space-y-4 text-sm">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-moss">Email</p>
            <a href={`mailto:${BRAND.email}`} className="font-display text-lg font-bold text-ink hover:underline">
              {BRAND.email}
            </a>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-moss">Phone</p>
            <p className="font-display text-lg font-bold text-ink">{BRAND.phone}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-moss">Office</p>
            <p className="font-display text-lg font-bold text-ink">{BRAND.address}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white p-6 shadow-card md:p-8">
        {status.state === 'success' ? (
          <div className="grid place-items-center py-12 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-2xl text-paper">✓</span>
            <h3 className="mt-4 font-display text-xl font-bold text-ink">Inquiry sent</h3>
            <p className="mt-2 max-w-sm text-sm text-ink/65">{status.message}</p>
            <button className="btn-outline mt-6" onClick={() => setStatus({ state: 'idle', message: '' })}>
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">Name *</label>
              <input id="name" name="name" className="field" required value={form.name} onChange={update} />
            </div>
            <div>
              <label className="label" htmlFor="email">Email *</label>
              <input id="email" name="email" type="email" className="field" required value={form.email} onChange={update} />
            </div>
            <div>
              <label className="label" htmlFor="phone">Phone</label>
              <input id="phone" name="phone" className="field" value={form.phone} onChange={update} />
            </div>
            <div>
              <label className="label" htmlFor="company">Company</label>
              <input id="company" name="company" className="field" value={form.company} onChange={update} />
            </div>
            <div>
              <label className="label" htmlFor="country">Country</label>
              <input id="country" name="country" className="field" value={form.country} onChange={update} />
            </div>
            <div>
              <label className="label" htmlFor="product">Product of interest</label>
              <select id="product" name="product" className="field" value={form.product} onChange={update}>
                <option value="">General inquiry</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="message">Message *</label>
              <textarea id="message" name="message" rows="5" className="field" required value={form.message} onChange={update} />
            </div>

            {status.state === 'error' && (
              <p className="sm:col-span-2 rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{status.message}</p>
            )}

            <div className="sm:col-span-2">
              <button className="btn-primary w-full" disabled={status.state === 'loading'}>
                {status.state === 'loading' ? 'Sending…' : 'Submit inquiry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
