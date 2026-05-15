import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { storyParagraphs, storyImages } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

export default function Story() {
  const sectionRef = useRef(null);
  const wordsRef = useRef(null);

  // Parallax: two images scroll at different speeds for layered depth.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const rotKanji = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  // Word-by-word reveal driven by ScrollTrigger.
  // We split each paragraph into spans, then animate them on scroll.
  useEffect(() => {
    if (!wordsRef.current) return;
    const ctx = gsap.context(() => {
      const words = wordsRef.current.querySelectorAll('.word');
      gsap.from(words, {
        opacity: 0.15,
        y: 12,
        stagger: 0.025,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: wordsRef.current,
          start: 'top 75%',
          end: 'bottom 35%',
          scrub: 1,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="section relative overflow-hidden bg-soot py-20 sm:py-32 md:py-44"
    >
      {/* Giant kanji background */}
      <motion.div
        style={{ rotate: rotKanji }}
        className="pointer-events-none absolute -left-20 top-1/2 -translate-y-1/2 select-none font-japanese text-[20rem] font-black text-crimson/[0.04] leading-none md:text-[40rem]"
      >
        物語
      </motion.div>

      <div className="container-x relative z-10 grid items-center gap-12 md:grid-cols-12 md:gap-16">
        {/* Left: parallax images */}
        <div className="relative md:col-span-5">
          <motion.div
            style={{ y: y1 }}
            className="relative aspect-[3/4] overflow-hidden"
          >
            <img
              src={storyImages[0]}
              alt="Restaurant interior"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/60" />
            <div className="absolute bottom-4 left-4 font-japanese text-sm text-bone/70">
              新宿 · Shinjuku
            </div>
          </motion.div>

          <motion.div
            style={{ y: y2 }}
            className="absolute -right-6 -top-12 hidden aspect-square w-44 overflow-hidden border-4 border-ink md:block md:w-56"
          >
            <img
              src={storyImages[1]}
              alt="Chef at the pass"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* circular brush stamp */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-4 -left-4 flex h-24 w-24 items-center justify-center rounded-full bg-crimson text-bone shadow-neon sm:-bottom-6 sm:-left-6 sm:h-32 sm:w-32"
          >
            <div className="text-center">
              <div className="font-japanese text-2xl font-black">本格</div>
              <div className="font-mono text-[8px] uppercase tracking-[0.3em] opacity-80">
                Authentic
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: story copy */}
        <div className="md:col-span-7 md:pl-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-12 bg-crimson" />
              <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-crimson">
                <span className="font-japanese mr-2">物語</span>Our Story
              </span>
            </div>
            <h2 className="headline text-5xl text-bone md:text-7xl">
              Six stools.<br />
              <em className="not-italic text-crimson">Three decades</em> of obsession.
            </h2>
          </motion.div>

          <div
            ref={wordsRef}
            className="mt-10 space-y-6 font-display text-lg leading-relaxed text-bone/85 sm:text-xl md:text-2xl"
          >
            {storyParagraphs.map((p, i) => (
              <p key={i}>
                {p.split(' ').map((w, j) => (
                  <span key={j} className="word inline-block">
                    {w}&nbsp;
                  </span>
                ))}
              </p>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40"
          >
            <span>— Kenji Mori, Head Chef</span>
            <span className="h-px flex-1 bg-bone/20" />
            <span>Est. 2018</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
