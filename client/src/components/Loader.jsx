export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="grid place-items-center py-24 text-center">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-line border-t-forest" />
      <p className="mt-3 font-mono text-xs uppercase tracking-widest text-ink/50">{label}</p>
    </div>
  );
}
