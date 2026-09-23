import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let frameId;

    const move = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const updateHover = (event) => {
      const interactive = event.target.closest?.('a, button, select, input, textarea, [role="button"]');
      const isHovering = Boolean(interactive);
      ring.classList.toggle('is-hovering', isHovering);
      dot.classList.toggle('is-hovering', isHovering);
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', updateHover, { passive: true });
    frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', updateHover);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <>
      <span ref={ringRef} className="custom-cursor-ring" aria-hidden="true" />
      <span ref={dotRef} className="custom-cursor-dot" aria-hidden="true" />
    </>
  );
}
