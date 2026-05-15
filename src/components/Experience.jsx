import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import RainParticles from './RainParticles';
import { experiencePanels, testimonials } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

/**
 * Horizontal-scroll experience strip.
 *
 * Pattern (GSAP-driven pin):
 *   - Section is `h-screen` (just 100vh).
 *   - ScrollTrigger pins the section while the inner track translates X.
 *   - ScrollTrigger creates its own scroll spacer = (panels - 1) * 100vh,
 *     so the pin releases the moment the horizontal animation completes.
 *     No CSS-sticky "trail" of empty black at the end.
 */
export default function Experience() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const [audioOn, setAudioOn] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    // Compute distance from the rendered track width so the last panel's
    // right edge lands exactly at viewport-right at progress=1 — independent
    // of panel size (which is responsive: 88vw mobile, 60vw md+).
    const getDistance = () =>
      Math.max(0, trackRef.current.scrollWidth - window.innerWidth);

    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Ambient audio toggle (free-to-stream rain loop, muted by default for
  // browser autoplay compliance).
  useEffect(() => {
    if (!audioRef.current) return;
    if (audioOn) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [audioOn]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-ink"
    >
      {/* Backdrop gradient + rain */}
      <div className="absolute inset-0 bg-gradient-to-b from-soot via-ink to-soot" />
      <div className="absolute inset-0 bg-asanoha opacity-40" />
      <RainParticles density={150} />

      {/* Section heading + audio toggle */}
      <div className="container-x absolute inset-x-0 top-12 z-10 flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="h-px w-12 bg-crimson" />
            <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-crimson">
              <span className="font-japanese mr-2">体験</span>The Experience
            </span>
          </div>
          <h2 className="headline text-4xl text-bone md:text-6xl">
            Walk the <em className="not-italic text-crimson">alley</em>.
          </h2>
        </div>

        <button
          onClick={() => setAudioOn((v) => !v)}
          data-cursor="hover"
          className="group flex items-center gap-3 border border-bone/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.32em] text-bone/70 transition-all hover:border-gold hover:text-gold"
        >
          <span className={`relative flex h-2 w-2 ${audioOn ? 'animate-pulse' : ''}`}>
            <span
              className={`absolute inset-0 rounded-full ${
                audioOn ? 'bg-gold' : 'bg-bone/40'
              }`}
            />
            {audioOn && (
              <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />
            )}
          </span>
          Ambient · {audioOn ? 'On' : 'Off'}
        </button>
        <audio
          ref={audioRef}
          loop
          preload="none"
          src="https://cdn.pixabay.com/audio/2022/03/15/audio_1f63d3f1f3.mp3"
        />
      </div>

      {/* Horizontal track — GSAP-driven X transform */}
      <div
        ref={trackRef}
        className="absolute inset-y-0 left-0 flex items-center gap-6 pl-[4vw] pr-[4vw] pt-24 will-change-transform"
      >
        {experiencePanels.map((p, i) => (
          <div
            key={p.title}
            className="relative h-[72vh] w-[88vw] shrink-0 overflow-hidden md:w-[60vw]"
          >
            <img
              src={p.image}
              alt={p.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-ink via-ink/50 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(230,57,70,0.18),transparent_60%)]" />

            {i === 0 && (
              <div className="absolute right-8 top-8 font-japanese text-5xl font-black animate-flicker neon-red md:text-7xl">
                営業中
              </div>
            )}

            <div className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/60">
              Frame {String(i + 1).padStart(2, '0')} / {String(experiencePanels.length).padStart(2, '0')}
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="headline text-5xl text-bone md:text-7xl">{p.title}</h3>
              <p className="mt-3 max-w-md font-display text-lg italic text-bone/80 md:text-xl">
                {p.sub}
              </p>
            </div>

            {testimonials[i] && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass absolute right-8 top-1/2 hidden max-w-xs -translate-y-1/2 p-6 md:block"
              >
                <div className="mb-3 font-japanese text-3xl text-crimson">「</div>
                <p className="font-display text-lg italic text-bone/90">
                  {testimonials[i].quote}
                </p>
                <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.32em] text-bone/50">
                  — {testimonials[i].author}
                  <div className="mt-1 text-bone/30 normal-case tracking-[0.18em]">
                    {testimonials[i].role}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar — driven by ScrollTrigger's onUpdate, not framer-motion */}
      <div className="absolute inset-x-0 bottom-8 z-10 mx-auto h-px w-2/3 max-w-2xl bg-bone/10">
        <div
          ref={progressRef}
          className="h-full origin-left bg-gradient-to-r from-crimson via-gold to-jade"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </section>
  );
}
