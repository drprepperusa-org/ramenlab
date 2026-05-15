import { motion } from 'framer-motion';

/**
 * Decorative chochin lanterns — pure CSS + framer for sway/glow.
 * They're absolutely-positioned, so a parent must be relative + overflow-hidden.
 */
const Lantern = ({ delay = 0, side = 'left', top = '20%', size = 80 }) => {
  const pos = side === 'left' ? 'left-4 md:left-12' : 'right-4 md:right-12';
  return (
    <motion.div
      className={`pointer-events-none absolute ${pos}`}
      style={{ top }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay }}
    >
      {/* string */}
      <div
        className="absolute left-1/2 -top-24 w-px bg-gradient-to-b from-transparent to-bone/30"
        style={{ height: '6rem' }}
      />
      <motion.div
        className="origin-top"
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="relative shadow-lantern"
          style={{
            width: size,
            height: size * 1.2,
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at 50% 40%, #FFB703 0%, #E63946 65%, #7a1620 100%)',
          }}
        >
          {/* horizontal bands */}
          <div className="absolute inset-0">
            {[20, 40, 60, 80].map((t) => (
              <div
                key={t}
                className="absolute left-0 right-0 border-t border-ink/40"
                style={{ top: `${t}%` }}
              />
            ))}
          </div>
          {/* kanji */}
          <div className="absolute inset-0 flex items-center justify-center font-japanese text-ink/70 text-2xl font-black">
            ラ
          </div>
          {/* tassel */}
          <div className="absolute left-1/2 -bottom-3 h-3 w-1 -translate-x-1/2 bg-gold/80" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function FloatingLanterns({ count = 2 }) {
  const positions = [
    { side: 'left', top: '15%', size: 72, delay: 0 },
    { side: 'right', top: '35%', size: 88, delay: 0.4 },
    { side: 'left', top: '60%', size: 64, delay: 0.8 },
    { side: 'right', top: '75%', size: 80, delay: 1.2 },
  ];
  return (
    <>
      {positions.slice(0, count).map((p, i) => (
        <Lantern key={i} {...p} />
      ))}
    </>
  );
}
