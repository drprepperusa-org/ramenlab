import { useEffect, useState, useCallback } from 'react';

// Tiny pub/sub on window. Avoids React context — any component can fire
// `openDialog('reserve')` without parent wiring. The host listens and renders.
//
// Event payload: { detail: 'reserve' | 'build' | 'gift' | null }
const EVENT = 'ramenlab:dialog';

export function openDialog(name) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: name }));
}

export function closeDialog() {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: null }));
}

export function useDialog() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const onEvent = (e) => setActive(e.detail);
    window.addEventListener(EVENT, onEvent);
    return () => window.removeEventListener(EVENT, onEvent);
  }, []);

  // Lock Lenis smooth-scroll AND native scroll while a dialog is open.
  useEffect(() => {
    const html = document.documentElement;
    if (active) {
      html.classList.add('lenis-stopped');
      html.style.overflow = 'hidden';
    } else {
      html.classList.remove('lenis-stopped');
      html.style.overflow = '';
    }
    return () => {
      html.classList.remove('lenis-stopped');
      html.style.overflow = '';
    };
  }, [active]);

  // ESC closes
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeDialog();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  const close = useCallback(() => closeDialog(), []);
  return { active, close };
}
