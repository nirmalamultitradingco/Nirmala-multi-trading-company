import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { BRAND } from '../../config.js';

const links = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/segments', label: 'Products', icon: '📦' },
  { to: '/admin/subsegments', label: 'Sub Products', icon: '📑' },
  { to: '/admin/products', label: 'Product Details', icon: '🏷️' },
  { to: '/admin/partners', label: 'Partners', icon: '🤝' },
  { to: '/admin/brochures', label: 'Brochures', icon: '📄' },
  { to: '/admin/inquiries', label: 'Inquiries', icon: '✉️' },
  { to: '/admin/subscribers', label: 'Subscribers', icon: '📬' },
  { to: '/admin/blog', label: 'Blog', icon: '📰' },
  { to: '/admin/content', label: 'Site Content', icon: '⚙️' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-panel min-h-screen bg-[#f8f9fa] md:flex md:h-screen md:overflow-hidden">
      {/* 
        Sticky Left Sidebar:
        Completely fixed and stationary while the right main content scrolls independently.
      */}
      <aside className="w-full shrink-0 flex-col border-r border-line/80 bg-[#0d1e17] text-paper md:flex md:w-64 md:h-screen md:sticky md:top-0 md:overflow-y-auto z-30 shadow-xl">
        {/* Header / Brand */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-forest/80 border border-gold/40 shadow-sm">
            <span className="block h-3 w-3 rounded-full bg-gold" />
          </div>
          <div className="flex flex-col font-display leading-tight">
            <strong className="text-sm font-extrabold tracking-tight text-white">{BRAND.name}</strong>
            <small className="text-[10px] text-paper/60 uppercase tracking-wider">Admin Workspace</small>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-1 flex-col gap-1.5 p-3.5">
          <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-paper/40">
            Navigation
          </p>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-forest text-white shadow-md border-l-4 border-gold font-semibold'
                    : 'text-paper/75 hover:bg-white/8 hover:text-white'
                }`
              }
            >
              <span className="text-base leading-none" aria-hidden="true">{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer User Info & Sign Out */}
        <div className="border-t border-white/10 bg-black/20 p-4">
          <div className="flex items-center gap-2 px-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <p className="truncate text-xs font-mono text-paper/70">{user?.email || 'admin@nmc.com'}</p>
          </div>
          <div className="mt-3 flex gap-2">
            <Link
              to="/"
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-center text-xs font-medium text-paper transition hover:bg-white/15"
            >
              Public Site ↗
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="flex-1 rounded-lg bg-clay/80 px-2.5 py-2 text-xs font-medium text-white transition hover:bg-clay shadow-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* 
        Scrollable Right Main Content:
        Scrolls smoothly while left sidebar stays firmly anchored.
      */}
      <main className="flex-1 min-w-0 md:h-screen md:overflow-y-auto p-5 sm:p-8 bg-[#fbf9f4]">
        <Outlet />
      </main>
    </div>
  );
}
