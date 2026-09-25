import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios.js';
import { BRAND } from '../config.js';

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleUnsubscribe = async (e) => {
    if (e) e.preventDefault();
    if (!email || !email.trim()) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await api.post('/subscribers/unsubscribe', { email: email.trim() });
      setStatus({
        type: 'success',
        message: res.data?.message || 'You have been successfully unsubscribed from NMC export updates.',
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to unsubscribe. Please check the email address and try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-paper">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-8 shadow-xl text-center">
        {/* Brand Icon & Heading */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-forest/10 border border-forest/20 text-3xl">
          📬
        </div>

        <p className="mt-4 font-mono text-xs font-bold uppercase tracking-wider text-gold">
          Export Market Intelligence
        </p>
        <h1 className="mt-1 font-display text-2xl font-extrabold text-ink">
          Unsubscribe from Updates
        </h1>
        <p className="mt-2 text-xs text-ink/60 leading-relaxed">
          We're sorry to see you go. Confirm your email address below to stop receiving seasonal crop alerts, container bookings, and market reports from {BRAND.name}.
        </p>

        {status.type === 'success' ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800">
              ✓ {status.message}
            </div>
            <p className="text-xs text-ink/50">
              Changed your mind? You can resubscribe anytime from the footer of our website.
            </p>
            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl bg-forest px-6 py-2.5 text-xs font-bold text-white shadow transition hover:bg-forest/90"
              >
                Return to Homepage →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUnsubscribe} className="mt-6 space-y-4 text-left">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink/70 mb-1">
                Your Subscribed Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-xl border border-line bg-[#fbf9f4] px-4 py-2.5 text-sm text-ink outline-none transition focus:border-forest focus:bg-white focus:ring-2 focus:ring-forest/15"
              />
            </div>

            {status.type === 'error' && (
              <p className="text-xs font-medium text-rose-600">
                {status.message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-ink px-5 py-3 text-xs font-bold text-white shadow-md transition hover:bg-rose-700 disabled:opacity-50"
            >
              {submitting ? 'Processing…' : 'Unsubscribe My Email'}
            </button>

            <div className="text-center pt-2">
              <Link to="/" className="text-xs text-ink/50 hover:text-forest transition">
                ← Keep my subscription and return to website
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
