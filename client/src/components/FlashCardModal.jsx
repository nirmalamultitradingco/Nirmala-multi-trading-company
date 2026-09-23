import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { asset } from '../api/axios.js';

const SESSION_KEY = 'nmc_flash_card_shown_session';

export default function FlashCardModal() {
  const [open, setOpen] = useState(false);
  const [flashCard, setFlashCard] = useState(null);

  useEffect(() => {
    let mounted = true;

    // Check if already dismissed in this browser session
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === '1') {
        return undefined;
      }
    } catch {
      // Storage unavailable fallback
    }

    // Fetch flash card configuration from site-content
    api
      .get('/site-content')
      .then((res) => {
        if (!mounted) return;
        const config = res.data?.flashCard;
        if (config && config.isActive !== false && (config.title || config.image)) {
          setFlashCard(config);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!flashCard) return undefined;

    // Trigger popup right after loader finishes
    const handleLoaderFinished = () => {
      setTimeout(() => {
        setOpen(true);
      }, 350);
    };

    window.addEventListener('nmc:loader-finished', handleLoaderFinished);

    // Fallback: If loader was already finished before data loaded or on route change
    const fallbackTimer = setTimeout(() => {
      setOpen((current) => {
        if (!current) return true;
        return current;
      });
    }, 3600);

    return () => {
      window.removeEventListener('nmc:loader-finished', handleLoaderFinished);
      clearTimeout(fallbackTimer);
    };
  }, [flashCard]);

  const close = () => {
    setOpen(false);
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Storage unavailable fallback
    }
  };

  // Keyboard Escape key to dismiss
  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  if (!open || !flashCard) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={flashCard.title || 'Special Announcement'}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-gold/50 bg-[#0d1e17] text-paper shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top-Right */}
        <button
          type="button"
          onClick={close}
          aria-label="Close announcement"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-ink/60 text-paper/80 backdrop-blur-md transition hover:border-gold hover:bg-forest hover:text-white"
        >
          <span className="text-base font-bold leading-none select-none">✕</span>
        </button>

        {/* Photo Banner */}
        {flashCard.image ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-forest/30">
            <img
              src={asset(flashCard.image)}
              alt={flashCard.title || 'Announcement'}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1e17] via-transparent to-transparent opacity-90" />
            <div className="absolute left-4 top-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-ink/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-gold backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-ping" />
                Special Announcement
              </span>
            </div>
          </div>
        ) : (
          <div className="px-6 pt-6">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Special Announcement
            </span>
          </div>
        )}

        {/* Card Body */}
        <div className="p-6 sm:p-8 text-center sm:text-left">
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            {flashCard.title || 'India’s Taste. The World’s Table'}
          </h3>

          {flashCard.subtitle && (
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-paper/75">
              {flashCard.subtitle}
            </p>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <Link
              to={flashCard.buttonLink || '/products'}
              onClick={close}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-bold text-white shadow-lg border border-gold/40 transition hover:bg-forest/80 hover:border-gold hover:shadow-[0_0_20px_rgba(198,145,46,0.35)]"
            >
              <span>{flashCard.buttonText || 'Explore Products'}</span>
              <span>→</span>
            </Link>

            <button
              type="button"
              onClick={close}
              className="w-full sm:w-auto rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-paper/70 transition hover:border-white/40 hover:text-white"
            >
              Continue to site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
