import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BRAND } from '../config.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const nav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/partners', label: 'Partners' },
  { to: '/brochures', label: 'Brochures' },
  { to: '/blog', label: 'Blog' },
];

const getNavLabel = (n, t) => {
  switch (n.to) {
    case '/':
      return t('home') || 'Home';
    case '/about':
      return t('aboutUs') || 'About';
    case '/products':
      return t('products') || 'Products';
    case '/product-details':
      return t('productDetails') || 'Product Details';
    case '/partners':
      return t('partners') || 'Partners';
    case '/brochures':
      return t('brochures') || 'Brochures';
    case '/blog':
      return t('blog') || 'Blog';
    default:
      return n.label;
  }
};

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'ar', label: 'UAE (العربية)' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/95 shadow-sm backdrop-blur-md transition-all">
      <div className="container-x flex h-20 items-center justify-between gap-4">
        {/* Brand Logo & Name - 100% aligned with container-x */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
          onClick={() => setOpen(false)}
        >
          <img
            src="/NMC logo.png"
            alt={`${BRAND.name} — ${BRAND.tagline}`}
            className="h-12 w-auto object-contain sm:h-14"
          />
          <div className="flex flex-col leading-tight">
            <strong className="font-display text-base font-extrabold tracking-tight text-ink sm:text-lg">
              {BRAND.fullName}
            </strong>
            <span className="hidden font-mono text-[10px] uppercase tracking-wider text-moss sm:block">
              {BRAND.tagline}
            </span>
          </div>
        </Link>

        {/* Center / Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors duration-200 ${
                  isActive
                    ? 'text-forest font-bold border-b-2 border-forest pb-0.5'
                    : 'text-ink/75 hover:text-forest'
                }`
              }
            >
              {getNavLabel(n, t)}
            </NavLink>
          ))}
        </nav>

        {/* Header Right Actions (Quote CTA + Language Switcher) */}
        <div className="hidden items-center gap-3.5 md:flex">
          <Link to="/inquiry" className="btn-primary text-xs px-5 py-2.5 shadow-sm header-quote-btn">
            <span>{t('getQuote')}</span>
            <span className="header-quote-btn__arrow" aria-hidden="true">↗</span>
          </Link>

          <label className="relative flex items-center" aria-label={t('language')}>
            <span className="mr-1.5 text-sm" aria-hidden="true">🌐</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="cursor-pointer appearance-none rounded-full border border-line bg-white/90 py-1.5 pl-3 pr-7 text-xs font-semibold text-ink outline-none transition hover:border-forest focus:border-forest shadow-sm"
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 text-[10px] text-ink/50" aria-hidden="true">⌄</span>
          </label>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-line/80 bg-white p-2 text-ink shadow-sm md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <div className="space-y-1">
            <span className={`block h-0.5 w-5 bg-ink transition-transform duration-200 ${open ? 'translate-y-1.5 rotate-45' : ''}`} />
            <span className={`block h-0.5 w-5 bg-ink transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-ink transition-transform duration-200 ${open ? '-translate-y-1.5 -rotate-45' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {open && (
        <nav className="border-t border-line bg-paper/98 px-5 py-4 shadow-xl md:hidden">
          <div className="container-x flex flex-col space-y-2">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive ? 'bg-forest/10 text-forest font-bold' : 'text-ink/80 hover:bg-black/5'
                  }`
                }
              >
                {getNavLabel(n, t)}
              </NavLink>
            ))}

            <div className="pt-3 border-t border-line flex flex-col gap-3">
              <Link
                to="/inquiry"
                className="btn-primary w-full text-center py-2.5 text-xs font-bold"
                onClick={() => setOpen(false)}
              >
                {t('getQuote')} ↗
              </Link>

              <label className="flex items-center justify-between rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-ink">
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true">🌐</span>
                  <span>{t('language')}</span>
                </span>
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="bg-transparent font-medium outline-none text-right cursor-pointer"
                  aria-label={t('language')}
                >
                  {languages.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
