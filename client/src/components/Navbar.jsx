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
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 p-4 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-5">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <img
            src="/NMC logo.png"
            alt={`${BRAND.name} — ${BRAND.tagline}`}
            className="h-16 w-auto object-contain"
          />
          <span className="flex flex-col font-display leading-tight">
            <strong className="text-lg font-extrabold tracking-tight text-ink">{BRAND.fullName}</strong>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-forest' : 'text-ink/70 hover:text-ink'
                }`
              }
            >
              {getNavLabel(n, t)}
            </NavLink>
          ))}

          <Link to="/inquiry" className="btn-primary header-quote-btn">
            <span>{t('getQuote')}</span><span className="header-quote-btn__arrow" aria-hidden="true">↗</span>
          </Link>

          <label className="relative flex items-center" aria-label={t('language')}>
            <span className="mr-2 text-base" aria-hidden="true">🌐</span>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="cursor-pointer appearance-none rounded-full border border-line bg-paper px-3 py-2 pr-8 text-sm font-medium text-ink outline-none transition hover:border-forest focus:border-forest focus:ring-2 focus:ring-forest/15"
            >
              {languages.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 text-xs text-ink/50" aria-hidden="true">⌄</span>
          </label>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-ink" />
            <span className="block h-0.5 w-6 bg-ink" />
            <span className="block h-0.5 w-6 bg-ink" />
          </div>
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-paper md:hidden">
          <div className="container-x flex flex-col py-3">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-2 text-sm font-medium ${isActive ? 'text-forest' : 'text-ink/75'}`
                }
              >
                {getNavLabel(n, t)}
              </NavLink>
            ))}

            <Link to="/inquiry" className="btn-primary mt-3 header-quote-btn" onClick={() => setOpen(false)}>
              {t('getQuote')}
            </Link>

            <label className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-sm font-medium text-ink/80">
              <span aria-hidden="true">🌐</span>
              <span>{t('language')}</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="ml-auto rounded-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-forest"
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
        </nav>
      )}
    </header>
  );
}
