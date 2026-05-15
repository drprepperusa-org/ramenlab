import { useEffect, useRef } from 'react';

/**
 * Cinematic rain — angled streaks with a subtle splash at the bottom.
 * Used in the Experience section to evoke a wet Tokyo alley.
 */
export default function RainParticles({ className = '', density = 200 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w, h;
    const resize = () => {
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };
    resize();

    const drops = Array.from({ length: density }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      l: 12 + Math.random() * 20,
      v: 8 + Math.random() * 8,
    }));

    let raf;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(241, 250, 238, 0.32)';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';

      for (const d of drops) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.l); // slight angle
        ctx.stroke();
        d.x -= 0.5;
        d.y += d.v;
        if (d.y > h) {
          d.y = -d.l;
          d.x = Math.random() * w + 50;
        }
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    />
  );
}
