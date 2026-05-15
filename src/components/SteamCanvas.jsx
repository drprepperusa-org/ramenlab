import { useEffect, useRef } from 'react';

/**
 * Canvas-based volumetric steam.
 *
 * Each particle is a soft radial gradient that drifts up and fades. We use
 * `lighter` composite mode so overlapping particles brighten into a glow
 * rather than darkening — that's what gives it the wet, lit-from-below feel.
 *
 * Density and lifespan are tuned so the layer stays at ~60fps on a mid-tier
 * laptop GPU. If perf budget tightens, drop `MAX` to 40.
 */
export default function SteamCanvas({
  className = '',
  density = 70,
  origin = 'bottom', // 'bottom' | 'center'
  tint = 'rgba(241, 250, 238, 0.55)',
}) {
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

    const MAX = density;
    const particles = [];

    const spawn = () => {
      const x =
        origin === 'center'
          ? w / 2 + (Math.random() - 0.5) * w * 0.6
          : Math.random() * w;
      const y = origin === 'center' ? h * 0.5 : h + 20;
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.4 + Math.random() * 0.8),
        r: 40 + Math.random() * 80,
        a: 0,
        life: 0,
        max: 200 + Math.random() * 120,
      };
    };

    for (let i = 0; i < MAX; i++) {
      const p = spawn();
      p.life = Math.random() * p.max; // pre-seed so they don't all appear at once
      particles.push(p);
    }

    let raf;
    let running = true;
    const onVis = () => (running = !document.hidden);
    document.addEventListener('visibilitychange', onVis);

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        // bell-curve opacity: rise, peak, fade
        const t = p.life / p.max;
        p.a = Math.sin(t * Math.PI) * 0.35;
        if (p.life >= p.max || p.y < -p.r) {
          particles[i] = spawn();
          continue;
        }
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, tint.replace(/[\d.]+\)$/, `${p.a})`));
        g.addColorStop(1, 'rgba(241, 250, 238, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (running) raf = requestAnimationFrame(tick);
      else setTimeout(() => (raf = requestAnimationFrame(tick)), 250);
    };
    tick();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
      ro.disconnect();
    };
  }, [density, origin, tint]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
    />
  );
}
