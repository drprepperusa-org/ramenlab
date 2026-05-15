import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryImages } from '../data/content';

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null);

  // ESC closes lightbox
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setLightbox(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section id="gallery" className="section relative bg-soot py-24 md:py-32">
      <div className="container-x relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-12 bg-crimson" />
              <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-crimson">
                <span className="font-japanese mr-2">写真</span>Gallery
              </span>
            </div>
            <h2 className="headline text-5xl text-bone md:text-7xl">
              Frames from the <em className="not-italic text-crimson">pass</em>.
            </h2>
          </div>
          <p className="max-w-md font-display text-lg italic text-bone/70">
            A visual record of late nights, hot bowls, and the people who turn this place into a temple.
          </p>
        </motion.div>

        <div className="masonry">
          {galleryImages.map((img, i) => {
            const aspect =
              img.span === 'tall' ? 'aspect-[3/4]'
              : img.span === 'wide' ? 'aspect-[4/3]'
              : 'aspect-square';
            return (
              <motion.button
                key={i}
                onClick={() => setLightbox(img)}
                data-cursor="hover"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: (i % 4) * 0.08 }}
                className={`group relative w-full overflow-hidden ${aspect}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-ink/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {/* hairline cross on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="absolute h-12 w-px bg-bone" />
                  <span className="absolute h-px w-12 bg-bone" />
                </div>
                <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.32em] text-bone opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-crimson">View</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 backdrop-blur-sm"
          >
            <motion.img
              src={lightbox.src.replace(/w=\d+/, 'w=1800')}
              alt={lightbox.alt}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-h-[88vh] max-w-[88vw] object-contain shadow-neon"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center border border-bone/30 font-mono text-xs text-bone hover:border-crimson hover:text-crimson"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/60">
              ESC to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
