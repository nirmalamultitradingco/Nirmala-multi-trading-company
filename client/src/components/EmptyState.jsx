export default function EmptyState({ title, hint }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white/50 py-16 text-center">
      <p className="font-display text-lg font-bold text-ink">{title}</p>
      {hint && <p className="mt-1 text-sm text-ink/55">{hint}</p>}
    </div>
  );
}
