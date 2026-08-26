import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { BRAND } from '../../config.js';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/segments', label: 'Segments' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/partners', label: 'Partners' },
  { to: '/admin/brochures', label: 'Brochures' },
  { to: '/admin/inquiries', label: 'Inquiries' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-paper md:grid md:grid-cols-[240px_1fr]">
      <aside className="flex flex-col border-r border-line bg-ink text-paper md:h-screen md:sticky md:top-0">
        <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-forest">
            <span className="block h-3.5 w-3.5 rounded-full bg-gold" />
          </span>
          <span className="font-display font-extrabold">{BRAND.name}</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-forest text-paper' : 'text-paper/70 hover:bg-white/5 hover:text-paper'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <p className="px-2 text-xs text-paper/50">{user?.email}</p>
          <div className="mt-2 flex gap-2">
            <Link to="/" className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-center text-xs hover:bg-white/10">
              View site
            </Link>
            <button onClick={signOut} className="flex-1 rounded-lg bg-clay/80 px-3 py-2 text-xs text-paper hover:bg-clay">
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="p-5 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
