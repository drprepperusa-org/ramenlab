import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-soot pt-24 pb-10">
      <div className="absolute inset-0 bg-asanoha opacity-30" />

      {/* Animated divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="ink-underline absolute top-0 h-px w-full origin-left"
      />

      {/* Floating lantern */}
      <motion.div
        className="pointer-events-none absolute right-12 top-12 hidden md:block"
        animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="relative shadow-lantern"
          style={{
            width: 64,
            height: 78,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at 50% 40%, #FFB703 0%, #E63946 65%, #7a1620 100%)',
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center font-japanese text-ink/70 text-2xl font-black">
            麺
          </div>
        </div>
      </motion.div>

      <div className="container-x relative z-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="font-japanese text-3xl font-black neon-red">ラ</span>
              <span className="font-display text-2xl tracking-[0.3em] text-bone">
                RAMEN<span className="text-crimson">·</span>LAB
              </span>
            </div>
            <p className="mt-6 max-w-md font-display text-xl italic text-bone/70">
              Crafted bowls. Tokyo soul. Slurped loud.
            </p>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-bone/50">
              An obsessive love letter to the alley shops of Shinjuku — built by chefs who think a 12-hour broth is a starting point.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 lg:col-span-7 lg:grid-cols-3">
            <div>
              <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-crimson">
                <span className="font-japanese mr-2">店舗</span>Visit
              </h4>
              <ul className="space-y-3 text-sm text-bone/70">
                <li>3-7-2 Nishi-Shinjuku</li>
                <li>Tokyo, 160-0023</li>
                <li>+81 3-1234-5678</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-crimson">
                <span className="font-japanese mr-2">案内</span>Site
              </h4>
              <ul className="space-y-3 text-sm">
                {['Featured', 'Story', 'Menu', 'Experience', 'Gallery'].map((l) => (
                  <li key={l}>
                    <a
                      href={`#${l.toLowerCase()}`}
                      data-cursor="hover"
                      className="text-bone/70 transition-colors hover:text-bone"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-crimson">
                <span className="font-japanese mr-2">繋がる</span>Connect
              </h4>
              <ul className="space-y-3 text-sm">
                {['Instagram', 'TikTok', 'X', 'YouTube', 'Newsletter'].map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      data-cursor="hover"
                      className="text-bone/70 transition-colors hover:text-gold"
                    >
                      {l} →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 border-t border-bone/10 pt-8 md:flex-row md:justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-bone/40">
            © {new Date().getFullYear()} Ramen Lab · All bowls reserved.
          </p>
          <p className="font-japanese text-xs text-bone/40">
            東京の夜に、最高の一杯を。
          </p>
        </div>
      </div>
    </footer>
  );
}
