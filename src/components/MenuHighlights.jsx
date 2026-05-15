import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { menuItems } from '../data/content';

function Card({ item, idx }) {
  // Tilt-on-hover via spring-less motion (CSS handles it; we just toggle).
  // Reveal of ingredients uses height:auto with `whileHover` variant trick:
  // a child opacity + translateY animates while a sibling overlay desaturates.
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay: (idx % 3) * 0.1 }}
      className="group relative overflow-hidden border border-bone/10 bg-soot transition-all duration-700 hover:border-crimson/60 hover:shadow-neon"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover grayscale transition-all duration-[1.2s] ease-out group-hover:scale-110 group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

        {/* Floating price tag */}
        <div className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center bg-crimson font-display text-xl text-bone shadow-neon transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
          ${item.price}
        </div>

        {/* Big kanji that fades in */}
        <div className="pointer-events-none absolute bottom-4 left-4 font-japanese text-7xl font-black text-bone/0 leading-none transition-all duration-700 group-hover:text-bone/30">
          {item.kanji}
        </div>
      </div>

      <div className="relative p-6 md:p-8">
        <div className="mb-2 flex items-baseline gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-crimson">
            {String(idx + 1).padStart(2, '0')}
          </span>
          <span className="h-px flex-1 bg-bone/10" />
          <span className="font-japanese text-sm text-bone/60">{item.kanji}</span>
        </div>

        <h3 className="font-display text-3xl text-bone md:text-4xl">{item.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-bone/70">{item.desc}</p>

        {/* Ingredients drawer */}
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-out group-hover:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="mt-6 border-t border-bone/10 pt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-bone/60">
              <div className="mb-2 text-crimson">Ingredients</div>
              {item.ingredients}
            </div>
          </div>
        </div>
      </div>

      {/* Animated bottom hairline */}
      <div className="ink-underline absolute bottom-0 left-0 h-px w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </motion.article>
  );
}

export default function MenuHighlights() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const headingY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="menu" ref={sectionRef} className="section relative bg-ink py-24 md:py-32">
      {/* Asanoha pattern in background */}
      <div className="absolute inset-0 bg-asanoha opacity-50" />

      <div className="container-x relative z-10">
        <motion.div
          style={{ y: headingY }}
          className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-12 bg-crimson" />
              <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-crimson">
                <span className="font-japanese mr-2">お品書き</span>Menu Highlights
              </span>
            </div>
            <h2 className="headline text-5xl text-bone md:text-7xl">
              Every bowl, a <em className="not-italic text-crimson">single answer</em>.
            </h2>
          </div>
          <a
            href="#reserve"
            data-cursor="hover"
            className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone/60 transition-colors hover:text-gold"
          >
            View full menu →
          </a>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, i) => (
            <Card key={item.name} item={item} idx={i} />
          ))}
        </div>

        {/* Scrolling marquee for tonal flavor */}
        <div className="mt-24 overflow-hidden border-y border-bone/10 py-6">
          <div className="marquee-strip font-display text-3xl italic text-bone/30 md:text-5xl">
            {Array.from({ length: 2 }).map((_, repeat) => (
              <div key={repeat} className="flex shrink-0 items-center gap-12">
                <span>本格 · Authentic</span>
                <span className="text-crimson">✺</span>
                <span>手作り · Handmade</span>
                <span className="text-gold">✺</span>
                <span>新鮮 · Fresh Daily</span>
                <span className="text-jade">✺</span>
                <span>こだわり · Obsessive</span>
                <span className="text-crimson">✺</span>
                <span>東京 · Tokyo Soul</span>
                <span className="text-gold">✺</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
