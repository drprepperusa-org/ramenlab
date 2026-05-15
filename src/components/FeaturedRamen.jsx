import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

import SteamCanvas from './SteamCanvas';
import { featuredRamen } from '../data/content';

const Heat = ({ level }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <span
        key={i}
        className={`h-1.5 w-1.5 rounded-full ${
          i < level ? 'bg-crimson shadow-neon' : 'bg-bone/15'
        }`}
      />
    ))}
  </div>
);

export default function FeaturedRamen() {
  const [active, setActive] = useState(0);
  const swiperRef = useRef(null);
  const item = featuredRamen[active];

  return (
    <section id="featured" className="section relative bg-ink py-16 sm:py-24 md:py-32">
      {/* background kanji watermark — rotates slowly */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 select-none font-japanese text-[14rem] font-black text-bone/[0.025] leading-none sm:text-[24rem] md:text-[36rem]"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      >
        麺
      </motion.div>

      <div className="container-x relative z-10">
        {/* Section header */}
        <div className="mb-12 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="mb-3 flex items-center gap-3"
            >
              <span className="h-px w-12 bg-crimson" />
              <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-crimson">
                <span className="font-japanese mr-2">名物</span>Featured Bowls
              </span>
            </motion.div>
            <h2 className="headline text-5xl text-bone md:text-7xl">
              The lineup, <em className="not-italic text-crimson">slurped</em>.
            </h2>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.32em] text-bone/40">
            <span className="text-crimson">{String(active + 1).padStart(2, '0')}</span>
            <span className="h-px w-12 bg-bone/20" />
            <span>{String(featuredRamen.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Stage */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Big rotating bowl */}
          <div className="relative min-w-0 order-2 lg:order-1 lg:col-span-7">
            <div className="relative aspect-square w-full overflow-hidden">
              <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                speed={1200}
                loop
                autoplay={{ delay: 5500, disableOnInteraction: false }}
                onSwiper={(s) => (swiperRef.current = s)}
                onSlideChange={(s) => setActive(s.realIndex)}
                className="h-full w-full"
              >
                {featuredRamen.map((r) => (
                  <SwiperSlide key={r.id}>
                    <motion.div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${r.image})` }}
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
                      role="img"
                      aria-label={r.name}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* radial vignette over image */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(15,15,15,0.85)_100%)]" />

              {/* Floating kanji on image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.kanji}
                  className="pointer-events-none absolute right-6 top-6 font-japanese text-7xl font-black text-bone/90 md:text-9xl"
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.8 }}
                >
                  {item.kanji}
                </motion.div>
              </AnimatePresence>

              {/* Steam over the bowl */}
              <SteamCanvas density={40} origin="bottom" tint="rgba(241, 250, 238, 0.45)" />

              {/* Corner crops */}
              {[
                'top-4 left-4 border-t border-l',
                'top-4 right-4 border-t border-r',
                'bottom-4 left-4 border-b border-l',
                'bottom-4 right-4 border-b border-r',
              ].map((cls, i) => (
                <div key={i} className={`absolute h-6 w-6 border-bone/40 ${cls}`} />
              ))}
            </div>

            {/* Thumbnails */}
            <div className="mt-6 grid grid-cols-5 gap-3">
              {featuredRamen.map((r, i) => (
                <button
                  key={r.id}
                  data-cursor="hover"
                  onClick={() => swiperRef.current?.slideToLoop(i)}
                  className={`group relative aspect-square overflow-hidden transition-all duration-500 ${
                    i === active
                      ? 'opacity-100 shadow-neon'
                      : 'opacity-50 hover:opacity-90'
                  }`}
                >
                  <img
                    src={r.image}
                    alt={r.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
                  <span className="absolute bottom-1 left-2 font-japanese text-xs text-bone/80">
                    {r.kanji}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Detail card */}
          <div className="order-1 lg:order-2 lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="glass relative p-6 sm:p-8 md:p-10"
              >
                <div className="absolute -left-3 top-8 font-japanese text-xl text-crimson">
                  {item.kanji}
                </div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
                  No. {String(active + 1).padStart(2, '0')}
                </div>
                <h3 className="font-display text-4xl text-bone sm:text-5xl md:text-6xl">{item.name}</h3>
                <p className="mt-4 max-w-md font-display text-lg italic text-bone/70">
                  {item.tagline}
                </p>

                <div className="my-8 h-px w-full bg-gradient-to-r from-bone/30 via-bone/10 to-transparent" />

                <ul className="grid grid-cols-2 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-bone/70">
                  {item.ingredients.map((ing) => (
                    <li key={ing} className="flex items-center gap-2">
                      <span className="h-1 w-1 bg-crimson" />
                      {ing}
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex items-end justify-between">
                  <div>
                    <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
                      Heat
                    </div>
                    <Heat level={item.heat} />
                  </div>
                  <div className="text-right">
                    <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
                      Price
                    </div>
                    <div className="font-display text-4xl text-gold">{item.price}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
