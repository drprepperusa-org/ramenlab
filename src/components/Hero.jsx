import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

import SteamCanvas from './SteamCanvas';
import FloatingLanterns from './FloatingLanterns';
import { heroImages } from '../data/content';
import { openDialog } from '../hooks/useDialog';

export default function Hero() {
  const heroRef = useRef(null);
  const glowRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // scroll-tied transforms: slow background zoom + content fade
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Mouse-follow radial glow
  useEffect(() => {
    const el = heroRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      glow.style.background = `radial-gradient(600px circle at ${x}% ${y}%, rgba(230,57,70,0.22), rgba(15,15,15,0) 60%)`;
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  // Splitting headline letters for stagger
  const title = 'RAMEN LAB';

  return (
    <section
      ref={heroRef}
      id="top"
      className="section relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink letterbox"
    >
      {/* Background slideshow */}
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          loop
          speed={1800}
          autoplay={{ delay: 4200, disableOnInteraction: false }}
          onSlideChange={(s) => setActiveIdx(s.realIndex)}
          className="h-full w-full"
        >
          {heroImages.map((img, i) => (
            <SwiperSlide key={i}>
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${img.src})` }}
                role="img"
                aria-label={img.alt}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {/* Cinematic vignette + tint.
          Layered gradients so headline + CTAs stay readable on ANY frame
          (some hero images are bright/cream — text would otherwise blend).
          1. Top fade: protects the navbar.
          2. Main wash: darkens the whole canvas baseline.
          3. Bottom fade: anchors the text area in deep ink. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/30 to-transparent" />
      <div className="absolute inset-0 bg-ink/30" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/80 to-transparent" />
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute inset-0 bg-asanoha opacity-30 mix-blend-overlay" />
      <div ref={glowRef} className="absolute inset-0 transition-[background] duration-300" />

      {/* Steam layer */}
      <SteamCanvas density={50} origin="bottom" tint="rgba(241, 250, 238, 0.40)" />

      {/* Lanterns */}
      <FloatingLanterns count={2} />

      {/* Vertical Japanese accent — left */}
      <motion.div
        className="absolute left-6 top-1/2 hidden -translate-y-1/2 md:block"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <div className="vertical-jp text-[10px] text-bone/40">
          東京の夜に、最高の一杯を。
        </div>
      </motion.div>

      {/* Vertical counter — right */}
      <motion.div
        className="absolute right-6 top-1/2 hidden -translate-y-1/2 md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <div className="flex flex-col items-center gap-3 font-mono text-[10px] tracking-[0.4em] text-bone/40">
          <span>{String(activeIdx + 1).padStart(2, '0')}</span>
          <span className="h-12 w-px bg-bone/20" />
          <span>{String(heroImages.length).padStart(2, '0')}</span>
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        style={{ y: yContent, opacity: opacityContent }}
        className="container-x relative z-10 flex h-full flex-col justify-end pb-24 md:pb-32"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.2 }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="h-px w-12 bg-crimson" />
          <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-crimson">
            <span className="font-japanese mr-2">麺処</span>Est. Shinjuku · 2018
          </span>
        </motion.div>

        <h1
          className="headline text-[3.25rem] leading-[0.95] text-bone sm:text-7xl md:text-[10rem] lg:text-[12rem]"
          style={{
            textShadow:
              '0 4px 24px rgba(0,0,0,0.9), 0 2px 6px rgba(0,0,0,0.7), 0 0 100px rgba(0,0,0,0.5)',
          }}
        >
          {title.split('').map((c, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.4 + i * 0.06,
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {c === ' ' ? ' ' : c}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <p className="max-w-md font-display text-xl italic text-bone/80 sm:text-2xl md:text-3xl">
            Crafted Bowls. <span className="text-crimson">Tokyo</span> Soul.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => openDialog('build')}
              data-cursor="hover"
              className="btn-yum btn-yum-lg btn-yum-light"
            >
              Build Your Bowl
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none" aria-hidden>
                <path d="M0 5h18m0 0L14 1m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => openDialog('reserve')}
              data-cursor="hover"
              className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone/70 transition-colors hover:text-gold"
            >
              <span className="font-japanese mr-2">予約</span>Reserve a Seat →
            </button>
            <button
              type="button"
              onClick={() => openDialog('gift')}
              data-cursor="hover"
              className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone/70 transition-colors hover:text-jade"
            >
              <span className="font-japanese mr-2">贈</span>Give a Gift →
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4 }}
        className="absolute bottom-12 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
          Scroll
        </span>
        <motion.span
          className="h-12 w-px bg-gradient-to-b from-bone/60 to-transparent"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.div>
    </section>
  );
}
