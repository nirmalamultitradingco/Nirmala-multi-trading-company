import { Link } from 'react-router-dom';
import { BRAND } from '../config.js';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-ink text-paper/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            {/* <span className="grid h-8 w-8 place-items-center rounded-lg bg-forest">
              <span className="block h-3.5 w-3.5 rounded-full bg-gold" />
            </span> */}
             <img
    src="/NMC logo.png"
    alt="Nirmala Multitrading Co."
    className="h-12 w-auto object-contain"
  />

            <span className="font-display text-lg font-extrabold text-paper">{BRAND.name}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper/65">{BRAND.blurb}</p>
        </div>

        <div>
          <p className="eyebrow text-gold">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/segments" className="hover:text-paper">Segments</Link></li>
            <li><Link to="/products" className="hover:text-paper">Products</Link></li>
            <li><Link to="/partners" className="hover:text-paper">Partners</Link></li>
            <li><Link to="/brochures" className="hover:text-paper">Brochures</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-gold">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href={`mailto:${BRAND.email}`} className="hover:text-paper">{BRAND.email}</a></li>
            <li>{BRAND.phone}</li>
            <li>{BRAND.address}</li>
            <li><Link to="/inquiry" className="text-gold hover:underline">Send an inquiry →</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-paper/50 sm:flex-row">
          <span>© {BRAND.year} {BRAND.name}. All rights reserved.</span>
          <Link to="/admin/login" className="hover:text-paper/80">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
