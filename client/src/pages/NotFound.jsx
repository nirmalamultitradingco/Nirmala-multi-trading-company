import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper px-6 text-center">
      <div>
        <p className="font-mono text-sm uppercase tracking-widest text-moss">Error 404</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold text-ink">Page not found</h1>
        <p className="mt-3 text-ink/60">The page you're looking for doesn't exist or has moved.</p>
        <Link to="/" className="btn-primary mt-6">Back home</Link>
      </div>
    </div>
  );
}
