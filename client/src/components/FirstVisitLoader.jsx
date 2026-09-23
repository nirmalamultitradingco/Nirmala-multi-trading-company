import { useEffect, useState } from 'react';
import { BRAND } from '../config.js';

const STORAGE_KEY = 'nmc_has_visited_site_v1';

export default function FirstVisitLoader() {
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [duration, setDuration] = useState(2000);

  useEffect(() => {
    let isFirstTime = false;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        isFirstTime = true;
        window.localStorage.setItem(STORAGE_KEY, '1');
      }
    } catch {
      // Storage unavailable fallback
    }

    // 3 seconds on first visit, 2 seconds on reloads / subsequent loads
    const displayDuration = isFirstTime ? 3000 : 2000;
    setDuration(displayDuration);

    const fadeTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, displayDuration - 400);

    const finishTimer = window.setTimeout(() => {
      setVisible(false);
      window.dispatchEvent(new CustomEvent('nmc:loader-finished'));
    }, displayDuration);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(finishTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`first-visit-loader ${isExiting ? 'is-exiting' : ''}`}
      aria-label="Loading Nirmala Multitrading Company"
      role="status"
    >
      <div className="first-visit-loader__content">
        {/* Animated Brand Logo in Gold-Bordered Circle */}
        <div className="first-visit-loader__logo-circle">
          <img
            src="/NMC logo.png"
            alt={BRAND.name}
            className="first-visit-loader__logo"
          />
        </div>

        {/* Brand Name */}
        <h2 className="first-visit-loader__brand">
          {BRAND.fullName}
        </h2>

        {/* Brand Tagline */}
        <p className="first-visit-loader__tagline">
          {BRAND.tagline}
        </p>

        {/* Synchronized Gold Progress Bar */}
        <div className="first-visit-loader__progress" aria-hidden="true">
          <span
            style={{
              animationDuration: `${duration - 300}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
