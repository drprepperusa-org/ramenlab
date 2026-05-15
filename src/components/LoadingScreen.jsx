import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Three-beat intro:
 *   1. Kanji ramps in (ラーメン)
 *   2. Counter ticks 0→100 while a hairline fills
 *   3. Curtain wipes up to reveal the page
 *
 * The transition is timed to the slowest user — we don't gate on actual asset
 * load because the page is dominated by Unsplash CDN images that lazy-load
 * lower in the document anyway. 2.4s is the "feels-cinematic, not-annoying"
 * sweet spot.
 */
export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const total = 2400;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const elapsed = t - start;
      const p = Math.min(100, Math.round((elapsed / total) * 100));
      setProgress(p);
      if (p < 100) raf = requestAnimationFrame(tick);
      else {
        setClosing(true);
        setTimeout(() => onDone?.(), 900);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!closing && (
        <motion.div
          key="loading"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
        >
          {/* curtain panels that slide off on exit */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-ink"
            initial={{ y: 0 }}
            animate={closing ? { y: '-100%' } : { y: 0 }}
            transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
            initial={{ y: 0 }}
            animate={closing ? { y: '100%' } : { y: 0 }}
            transition={{ duration: 0.9, ease: [0.85, 0, 0.15, 1] }}
          />

          {/* content */}
          <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
            <motion.div
              className="font-japanese text-7xl font-black tracking-[0.4em] text-bone md:text-9xl"
              initial={{ opacity: 0, letterSpacing: '1em' }}
              animate={{ opacity: 1, letterSpacing: '0.4em' }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
            >
              <span className="neon-red">ラ</span>
              <span>ー</span>
              <span className="neon-gold">メ</span>
              <span>ン</span>
            </motion.div>

            <motion.div
              className="h-px w-72 origin-left bg-gradient-to-r from-transparent via-bone/80 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ ease: 'linear' }}
            />

            <div className="flex w-72 items-center justify-between font-mono text-[10px] uppercase tracking-[0.4em] text-bone/50">
              <span>Ramen Lab</span>
              <span className="tabular-nums">{String(progress).padStart(3, '0')}%</span>
            </div>

            <motion.p
              className="mt-4 font-display text-sm italic text-bone/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Twelve hours of broth. Twenty seconds of patience.
            </motion.p>
          </div>

          {/* corner crops */}
          {[
            'top-6 left-6 border-t border-l',
            'top-6 right-6 border-t border-r',
            'bottom-6 left-6 border-b border-l',
            'bottom-6 right-6 border-b border-r',
          ].map((cls, i) => (
            <div
              key={i}
              className={`absolute h-8 w-8 border-crimson/60 ${cls}`}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
