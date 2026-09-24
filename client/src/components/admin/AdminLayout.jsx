import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { BRAND } from '../../config.js';

const links = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/segments', label: 'Products', icon: '📦' },
  { to: '/admin/subsegments', label: 'Sub Products', icon: '📑' },
  { to: '/admin/products', label: 'Product Details', icon: '🏷️' },
  { to: '/admin/partners', label: 'Partners & Suppliers', icon: '🤝' },
  { to: '/admin/brochures', label: 'Brochures', icon: '📄' },
  { to: '/admin/inquiries', label: 'Inquiries', icon: '✉️' },
  { to: '/admin/subscribers', label: 'Subscribers', icon: '📬' },
  { to: '/admin/blog', label: 'Blog & News', icon: '📰' },
  { to: '/admin/content', label: 'Site Content CMS', icon: '⚙️' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef(null);
  const [showTopBtn, setShowTopBtn] = useState(false);

  // Load persisted sidebar state (default: open on desktop, closed on mobile)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nmc_admin_sidebar_open');
      if (saved !== null) return saved === 'true';
      return window.innerWidth >= 1024;
    }
    return true;
  });

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem('nmc_admin_sidebar_open', String(next));
      return next;
    });
  };

  const handleMainScroll = (e) => {
    if (e.currentTarget.scrollTop > 200) {
      setShowTopBtn(true);
    } else {
      setShowTopBtn(false);
    }
  };

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close drawer on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const signOut = () => {
    logout();
    navigate('/admin/login');
  };

  // Current page label
  const activeLink = links.find((l) =>
    l.end ? location.pathname === l.to : location.pathname.startsWith(l.to)
  );

  return (
    <div className="admin-panel relative min-h-screen bg-[#f8f9fa] md:flex md:h-screen md:overflow-hidden">
      {/* Mobile Backdrop Overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 
        Collapsible Sidebar:
        Controlled by the three-line hamburger button on the left.
      */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full shrink-0 flex-col border-r border-line/80 bg-[#0d1e17] text-paper shadow-2xl transition-all duration-300 ease-in-out lg:static lg:shadow-xl ${
          sidebarOpen
            ? 'w-64 translate-x-0 opacity-100'
            : '-translate-x-full lg:w-0 lg:overflow-hidden lg:opacity-0 lg:border-none'
        }`}
      >
        {/* Header / Brand */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-forest/80 border border-gold/40 shadow-sm">
              <span className="block h-3 w-3 rounded-full bg-gold" />
            </div>
            <div className="flex flex-col font-display leading-tight">
              <strong className="text-sm font-extrabold tracking-tight text-white">{BRAND.name}</strong>
              <small className="text-[10px] text-paper/60 uppercase tracking-wider">Admin Workspace</small>
            </div>
          </Link>

          {/* Toggle button inside sidebar header */}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            title="Toggle sidebar (☰)"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-paper/80 hover:bg-white/15 transition"
          >
            <div className="flex flex-col gap-1 w-3.5 justify-center items-center">
              <span className="block h-0.5 w-3.5 rounded-full bg-white/80" />
              <span className="block h-0.5 w-3.5 rounded-full bg-white/80" />
              <span className="block h-0.5 w-3.5 rounded-full bg-white/80" />
            </div>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3.5 no-scrollbar">
          <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-paper/40">
            Navigation Menu
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
              <span className="truncate">{l.label}</span>
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
        Main Workspace Area:
        Top header with three-line toggle button + Scrollable content canvas
      */}
      <div className="flex flex-1 flex-col min-w-0 md:h-screen md:overflow-hidden">
        {/* Top Header Bar with Tree Line (Hamburger ☰) button on the left */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-line/80 bg-white/95 px-6 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            {/* THREE LINE (HAMBURGER ☰) TOGGLE BUTTON ON THE LEFT */}
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              className="group flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-paper/70 text-ink shadow-xs transition-all hover:border-gold hover:bg-forest hover:text-white"
            >
              <div className="flex flex-col gap-1 w-4.5 justify-center items-center">
                <span className={`block h-0.5 w-4.5 rounded-full transition-all duration-200 ${sidebarOpen ? 'bg-current' : 'bg-current'}`} />
                <span className={`block h-0.5 w-4.5 rounded-full transition-all duration-200 ${sidebarOpen ? 'bg-current' : 'bg-current'}`} />
                <span className={`block h-0.5 w-4.5 rounded-full transition-all duration-200 ${sidebarOpen ? 'bg-current' : 'bg-current'}`} />
              </div>
            </button>

            {/* Active section title or breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-ink sm:text-base">
                {activeLink?.label || 'Admin Panel'}
              </span>
              <span className="hidden font-mono text-[11px] text-ink/40 sm:inline-block">
                / {BRAND.fullName}
              </span>
            </div>
          </div>

          {/* Right Header Quick Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3.5 py-1.5 text-xs font-semibold text-ink/80 transition hover:border-gold hover:text-ink"
            >
              <span>View Website</span>
              <span aria-hidden="true">↗</span>
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-line/60">
              <div className="h-7 w-7 rounded-full bg-forest text-gold flex items-center justify-center text-xs font-bold font-mono">
                {user?.email ? user.email[0].toUpperCase() : 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Workspace */}
        <main
          ref={mainRef}
          onScroll={handleMainScroll}
          className="relative flex-1 min-w-0 overflow-y-auto p-6 lg:p-8 bg-[#fbf9f4]"
        >
          <Outlet />

          {/* FLOATING TOP BUTTON IN ADMIN PANEL */}
          {showTopBtn && (
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll workspace to top"
              title="Scroll to Top"
              className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-forest text-gold border border-gold/40 shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#0d1e17] hover:border-gold animate-in fade-in"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>
          )}
        </main>
      </div>
    </div>
  );
}

