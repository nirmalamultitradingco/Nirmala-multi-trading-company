export default function Modal({ open, title, onClose, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/50 p-4 py-10">
      <div className={`w-full rounded-2xl border border-line bg-paper shadow-xl ${wide ? 'max-w-2xl' : 'max-w-lg'}`}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="text-xl leading-none text-ink/50 hover:text-ink" aria-label="Close">×</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
