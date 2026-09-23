export default function SectionHeading({ eyebrow, title, children, align = 'left', className = '' }) {
  return (
    <div className={`${align === 'center' ? 'text-center' : ''} ${className}`.trim()}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {children && (
        <p className={`mt-3 max-w-2xl text-ink/65 ${align === 'center' ? 'mx-auto' : ''}`}>
          {children}
        </p>
      )}
    </div>
  );
}
