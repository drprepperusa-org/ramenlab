import { useEffect, useRef } from 'react';

/**
 * Two-layer custom cursor:
 *   - dot:  precise, follows the pointer 1:1 (no lerp)
 *   - ring: lerps toward the dot, giving a magnetic trailing feel
 * A separate <canvas> draws a fading ember trail for cinematic motion.
 *
 * Touch devices fall back to the system cursor (body { cursor: auto } in CSS).
 */
export default function CursorTrail() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const mouse = { x: w / 2, y: h / 2 };
    const ring_pos = { x: mouse.x, y: mouse.y };
    const particles = [];

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%)`;
      // emit ember particle every other move
      if (Math.random() > 0.55) {
        particles.push({
          x: mouse.x,
          y: mouse.y,
          life: 1,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4 - 0.3,
          r: Math.random() * 2 + 0.6,
        });
      }
    };

    const onEnterInteractive = () => ring.classList.add('cursor-hover');
    const onLeaveInteractive = () => ring.classList.remove('cursor-hover');

    // delegate hover state for any interactive element
    document.querySelectorAll('a, button, [data-cursor="hover"]').forEach((el) => {
      el.addEventListener('mouseenter', onEnterInteractive);
      el.addEventListener('mouseleave', onLeaveInteractive);
    });

    let raf;
    const tick = () => {
      // ring lerps toward mouse
      ring_pos.x += (mouse.x - ring_pos.x) * 0.18;
      ring_pos.y += (mouse.y - ring_pos.y) * 0.18;
      ring.style.transform = `translate(${ring_pos.x}px, ${ring_pos.y}px) translate(-50%, -50%)`;

      // ember trail
      ctx.clearRect(0, 0, w, h);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.025;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 183, 3, ${p.life * 0.55})`;
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[90] hidden md:block"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[91] hidden h-10 w-10 rounded-full border border-crimson/70 mix-blend-difference transition-[width,height,border-color] duration-200 ease-out md:block"
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[92] hidden h-1.5 w-1.5 rounded-full bg-bone mix-blend-difference md:block"
      />
      <style>{`
        .cursor-hover { width: 64px; height: 64px; border-color: #FFB703; }
      `}</style>
    </>
  );
}
