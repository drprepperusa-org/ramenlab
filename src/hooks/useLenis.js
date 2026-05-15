import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Wires Lenis (smooth scroll) into GSAP's ScrollTrigger so scroll-linked
 * animations stay in lockstep with the eased scroll position. Without this
 * bridge, ScrollTrigger reads native scrollY while Lenis lerps an internal
 * offset — the two desync and animations jitter.
 */
export function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [enabled]);
}
