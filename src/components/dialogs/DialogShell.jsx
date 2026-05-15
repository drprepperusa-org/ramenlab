import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { closeDialog } from '../../hooks/useDialog';

/**
 * Shared modal shell.
 *
 * - Full-screen on mobile, centered panel on desktop.
 * - Backdrop click + ESC close (ESC handled in useDialog).
 * - Focus trap: traps Tab to elements inside the panel.
 * - Renders a header with kanji accent + title + close button, then children.
 *
 * Children receive control via the imperative `onDone` prop — call it after
 * the last step to dismiss the dialog. Steps are managed by each flow.
 */
export default function DialogShell({ open, title, kanji, accent = 'crimson', children }) {
  const panelRef = useRef(null);

  // Focus the first focusable child when the panel mounts.
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      first?.focus?.();
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Trap Tab inside the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      const els = panelRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!els || els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const accentText = accent === 'gold' ? 'text-gold' : accent === 'jade' ? 'text-jade' : 'text-crimson';
  const accentBg = accent === 'gold' ? 'bg-gold' : accent === 'jade' ? 'bg-jade' : 'bg-crimson';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-stretch justify-center md:items-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          data-lenis-prevent
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-ink/85 backdrop-blur-md"
            onClick={() => closeDialog()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="absolute inset-0 bg-asanoha opacity-10 pointer-events-none" />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex h-full w-full max-w-2xl flex-col overflow-hidden border border-bone/10 bg-soot/95 backdrop-blur-xl md:h-auto md:max-h-[90vh] md:rounded-2xl md:shadow-2xl"
          >
            {/* Accent rail */}
            <div className={`h-1 w-full ${accentBg}`} />

            {/* Header */}
            <div className="flex items-start justify-between gap-6 border-b border-bone/10 px-6 py-5 md:px-8 md:py-6">
              <div>
                <div className="flex items-center gap-3">
                  <span className={`h-px w-8 ${accentBg}`} />
                  <span className={`font-mono text-[10px] uppercase tracking-[0.4em] ${accentText}`}>
                    <span className="font-japanese mr-2">{kanji}</span>
                    Ramen Lab
                  </span>
                </div>
                <h2 className="mt-2 font-display text-3xl text-bone md:text-4xl">{title}</h2>
              </div>
              <button
                onClick={() => closeDialog()}
                aria-label="Close"
                className="-mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-bone/60 transition-colors hover:bg-bone/10 hover:text-bone"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                  <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Step indicator. Mirrors Universal Yums' progress feel — pill segments,
 * filled to current step. Kanji label sits above as a calm anchor.
 */
export function Stepper({ steps, current }) {
  return (
    <div className="mb-6 flex items-center gap-2">
      {steps.map((label, i) => (
        <div key={label} className="flex flex-1 items-center gap-2">
          <div
            className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
              i <= current ? 'bg-crimson' : 'bg-bone/15'
            }`}
          />
          {i === steps.length - 1 && (
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-bone/50">
              {String(current + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Section heading inside a dialog body.
 */
export function StepHeading({ label, hint }) {
  return (
    <div className="mb-5">
      <h3 className="font-display text-2xl text-bone md:text-3xl">{label}</h3>
      {hint && <p className="mt-1 text-sm text-bone/60">{hint}</p>}
    </div>
  );
}
