import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { BRAND } from '../config.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const ALL_CATEGORIES = [
  'Whole Spices (Cumin, Coriander, Fennel, Mustard)',
  'Ground Spices & Blended Masalas',
  'Basmati & Non-Basmati Grains',
  'Pulses, Lentils & Dals',
  'Oil Seeds (Sesame, Mustard)',
  'Dehydrated Vegetables (Onion, Garlic Flakes & Powder)',
  'Processed Food, Namkeen & Savouries',
  'Other Agricultural Commodities',
];

const emptyForm = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  country: 'India',
  city: '',
  website: '',
  businessType: 'Manufacturer / Processor',
  categories: [],
  annualCapacity: '',
  message: '',
};

export default function BecomePartner() {
  const { t } = useLanguage();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [submitted, setSubmitted] = useState(false);

  const toggleCategory = (cat) => {
    setForm((prev) => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', text: '' });

    try {
      const res = await api.post('/partners/register', form);
      setFeedback({
        type: 'success',
        text: res.data?.message || 'Your partner registration has been submitted successfully!',
      });
      setSubmitted(true);
      setForm(emptyForm);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.message || 'Failed to submit registration. Please check required fields and try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fbf9f4] py-12 md:py-20">
      <div className="container-x max-w-4xl space-y-10">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-ink/50">
          <Link to="/" className="hover:text-forest transition">Home</Link>
          <span>/</span>
          <Link to="/partners" className="hover:text-forest transition">Partners</Link>
          <span>/</span>
          <span className="text-forest font-bold">Become a Partner</span>
        </div>

        {/* Hero Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-forest px-8 py-12 text-paper md:px-14 shadow-2xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
          <div className="relative">
            <span className="rounded-full bg-gold/20 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-gold border border-gold/30">
              Supplier & Grower Partnership Program
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
              Become an NMC Export Partner
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper/80 sm:text-base">
              Join {BRAND.fullName}’s verified supplier network. We connect Indian agro-producers, mills, and food manufacturers directly with institutional buyers and supermarket chains across 40+ countries.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 pt-2 border-t border-white/10 text-xs font-medium text-paper/90">
              <div className="flex items-center gap-2">
                <span className="text-gold">✓</span> Verified Global Buyers (USA, UK, EU, GCC)
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold">✓</span> Mundra & JNPT Container Stuffing
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold">✓</span> Assured Export LC & Bank Settlements
              </div>
            </div>
          </div>
        </div>

        {/* Partner Value Proposition Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-line bg-white p-5 text-center shadow-card">
            <span className="text-3xl" aria-hidden="true">🌐</span>
            <h3 className="mt-2.5 font-display text-base font-bold text-ink">Worldwide Distribution</h3>
            <p className="mt-1 text-xs leading-relaxed text-ink/65">
              Direct access to ethnic wholesalers, mainstream retail brands, and food service importers.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-5 text-center shadow-card">
            <span className="text-3xl" aria-hidden="true">🚢</span>
            <h3 className="mt-2.5 font-display text-base font-bold text-ink">Container Logistics</h3>
            <p className="mt-1 text-xs leading-relaxed text-ink/65">
              End-to-end container consolidation (FCL/LCL) at Mundra and Nhava Sheva with zero hassle.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-5 text-center shadow-card">
            <span className="text-3xl" aria-hidden="true">📜</span>
            <h3 className="mt-2.5 font-display text-base font-bold text-ink">Compliance Support</h3>
            <p className="mt-1 text-xs leading-relaxed text-ink/65">
              Guidance for APEDA registration, FSSAI, phytosanitary clearance, and pesticide MRL testing.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="rounded-3xl border border-line bg-white p-8 md:p-12 shadow-card">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-800">
                ✓
              </div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Registration Submitted Successfully!
              </h2>
              <p className="mx-auto max-w-md text-sm text-ink/70">
                Thank you for applying to partner with {BRAND.name}. Our export procurement team will review your company profile and contact you within 24–48 business hours.
              </p>
              <div className="pt-6 flex justify-center gap-4">
                <Link to="/partners" className="btn-outline text-xs py-2 px-4">
                  ← View Collaborating Partners
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFeedback({ type: '', text: '' });
                  }}
                  className="btn-primary text-xs py-2 px-4"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-line pb-6">
                <h2 className="font-display text-2xl font-bold text-ink">
                  Partner Registration Form
                </h2>
                <p className="mt-1 text-xs text-ink/60">
                  Please provide accurate information about your enterprise, products, and processing capacity.
                </p>
              </div>

              {feedback.text && (
                <div
                  className={`mt-6 rounded-xl p-4 text-sm font-medium ${
                    feedback.type === 'success'
                      ? 'border border-emerald-300 bg-emerald-50 text-emerald-900'
                      : 'border border-red-300 bg-red-50 text-red-900'
                  }`}
                >
                  {feedback.type === 'success' ? '✓ ' : '⚠️ '}
                  {feedback.text}
                </div>
              )}

              <form onSubmit={handleRegister} className="mt-8 space-y-6">
                {/* 1. Company and Contact */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="label">
                      Company / Mill Name <span className="text-clay">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gujarat Organic Spice Mills Pvt Ltd"
                      className="field"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">
                      Contact Person Name <span className="text-clay">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel (Director / Proprietor)"
                      className="field"
                      value={form.contactPerson}
                      onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="label">
                      Official Email Address <span className="text-clay">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="sales@yourcompany.com"
                      className="field"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">
                      Phone / WhatsApp Number <span className="text-clay">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      className="field"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                  <div>
                    <label className="label">Country</label>
                    <input
                      type="text"
                      className="field"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">City & State</label>
                    <input
                      type="text"
                      placeholder="e.g. Unjha, Gujarat"
                      className="field"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Website / Online Catalog</label>
                    <input
                      type="url"
                      placeholder="https://…"
                      className="field"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                    />
                  </div>
                </div>

                {/* 2. Business Type & Annual Capacity */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="label">Business Type</label>
                    <select
                      className="field"
                      value={form.businessType}
                      onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                    >
                      <option value="Manufacturer / Processor">Manufacturer / Processor</option>
                      <option value="Farmer Producer Organization (FPO)">Farmer Producer Organization (FPO)</option>
                      <option value="Agricultural Miller / Grader">Agricultural Miller / Grader</option>
                      <option value="Authorized Mandi Merchant">Authorized Mandi Merchant</option>
                      <option value="Packager / Brand Owner">Packager / Brand Owner</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Annual Export / Processing Capacity</label>
                    <input
                      type="text"
                      placeholder="e.g. 500 Metric Tons / year, 25 Containers"
                      className="field"
                      value={form.annualCapacity}
                      onChange={(e) => setForm({ ...form, annualCapacity: e.target.value })}
                    />
                  </div>
                </div>

                {/* 3. Product Categories Offered */}
                <div>
                  <label className="label">
                    Commodity & Product Categories Offered (Select all that apply)
                  </label>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {ALL_CATEGORIES.map((cat) => {
                      const checked = form.categories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                            checked
                              ? 'border-forest bg-forest/10 text-forest shadow-xs'
                              : 'border-line bg-paper/60 text-ink/75 hover:bg-white hover:text-ink'
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                              checked
                                ? 'border-forest bg-forest text-white'
                                : 'border-line bg-white'
                            }`}
                          >
                            {checked ? '✓' : ''}
                          </span>
                          <span className="truncate">{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Message / Note */}
                <div>
                  <label className="label">
                    Certifications, Facilities & Message for Procurement Desk
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Describe your processing facilities, Sortex cleaning capabilities, food safety licenses (FSSAI, APEDA, ISO, HACCP, Halal), or current export markets…"
                    className="field"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>

                {/* Submit button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-line">
                  <Link
                    to="/partners"
                    className="text-xs font-semibold text-ink/60 hover:text-ink transition order-2 sm:order-1"
                  >
                    ← Back to Partners Overview
                  </Link>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full sm:w-auto px-8 py-3 text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 order-1 sm:order-2"
                  >
                    {submitting ? 'Submitting Application…' : 'Submit Partner Registration →'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
