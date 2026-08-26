import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BRAND } from '../config.js';

const nav = [
  { to: '/segments', label: 'Segments' },
  { to: '/products', label: 'Products' },
  { to: '/partners', label: 'Partners' },
  { to: '/brochures', label: 'Brochures' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-forest">
            <span className="block h-3.5 w-3.5 rounded-full bg-gold" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-ink">
            {BRAND.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive ? 'text-forest' : 'text-ink/70 hover:text-ink'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
          <Link to="/inquiry" className="btn-primary">
            Get a quote
          </Link>
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
                {n.label}
              </NavLink>
            ))}
            <Link to="/inquiry" className="btn-primary mt-3" onClick={() => setOpen(false)}>
              Get a quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
