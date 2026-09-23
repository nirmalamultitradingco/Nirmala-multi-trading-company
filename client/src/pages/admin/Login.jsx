import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { BRAND } from '../../config.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-panel grid min-h-screen place-items-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          {/* <span className="grid h-9 w-9 place-items-center rounded-lg bg-forest">
            <span className="block h-4 w-4 rounded-full bg-gold" />
          </span> */}
          <img
            src="/NMC logo.png"
            alt={`${BRAND.name} — ${BRAND.tagline}`}
            className="h-16 w-auto object-contain"
          />
          <span className="font-display text-xl font-extrabold text-paper">{BRAND.fullName}</span>
        </div>
        <div className="rounded-2xl border border-white/10 bg-paper p-6 shadow-xl">
          <h1 className="font-display text-xl font-bold text-ink">Admin sign in</h1>
          {/* <p className="mt-1 text-sm text-ink/60">Manage products, partners and inquiries.</p> */}
          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="field"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="field"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            {error && <p className="rounded-lg bg-clay/10 px-3 py-2 text-sm text-clay">{error}</p>}
            <button className="btn-primary w-full" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
