import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { openDialog } from '../hooks/useDialog';

const links = [
  { href: '#featured', label: 'Bowls', jp: '丼' },
  { href: '#story', label: 'Story', jp: '物語' },
  { href: '#menu', label: 'Menu', jp: 'お品書き' },
  { href: '#experience', label: 'Experience', jp: '体験' },
  { href: '#gallery', label: 'Gallery', jp: '写真' },
  { href: '#reserve', label: 'Reserve', jp: '予約' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 backdrop-blur-md bg-ink/80'
            : 'py-5 bg-gradient-to-b from-ink/70 to-transparent'
        }`}
      >
        <div className="container-x flex items-center justify-between gap-6">
          <a href="#top" className="group flex items-center gap-3" data-cursor="hover">
            <span className="font-japanese text-2xl font-black leading-none neon-red transition-all duration-500 group-hover:tracking-widest">
              ラ
            </span>
            <span className="font-display text-xl tracking-[0.3em] text-bone">
              RAMEN<span className="text-crimson">·</span>LAB
            </span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-cursor="hover"
                className="group relative font-mono text-[11px] uppercase tracking-[0.32em] text-bone/70 transition-colors hover:text-bone"
              >
                <span className="absolute -top-3 left-0 font-japanese text-[10px] text-crimson/0 transition-all duration-300 group-hover:text-crimson/70">
                  {l.jp}
                </span>
                {l.label}
                <span className="absolute -bottom-2 left-0 h-px w-0 bg-crimson transition-all duration-500 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openDialog('gift')}
              data-cursor="hover"
              className="hidden font-mono text-[10px] uppercase tracking-[0.32em] text-bone/70 transition-colors hover:text-jade md:inline-flex md:items-center md:gap-2"
            >
              <span className="font-japanese text-sm">贈</span>
              <span>Give a Gift</span>
            </button>
            <button
              type="button"
              onClick={() => openDialog('reserve')}
              data-cursor="hover"
              className="btn-yum btn-yum-sm btn-yum-light hidden md:inline-flex"
            >
              <span className="font-japanese">予約</span>
              <span>Reserve</span>
            </button>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              data-cursor="hover"
              className="relative flex h-10 w-10 items-center justify-center lg:hidden"
            >
              <span
                className={`absolute h-px w-6 bg-bone transition-transform duration-300 ${
                  open ? 'rotate-45' : '-translate-y-1.5'
                }`}
              />
              <span
                className={`absolute h-px w-6 bg-bone transition-transform duration-300 ${
                  open ? '-rotate-45' : 'translate-y-1.5'
                }`}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile sheet */}
      <motion.div
        initial={false}
        animate={open ? { x: 0 } : { x: '100%' }}
        transition={{ duration: 0.5, ease: [0.85, 0, 0.15, 1] }}
        className="fixed inset-y-0 right-0 z-40 flex w-full max-w-sm flex-col bg-soot/95 backdrop-blur-xl lg:hidden"
      >
        <div className="flex flex-col gap-8 pt-32 px-10">
          {links.map((l, i) => (
            <motion.a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, x: 30 }}
              animate={open ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="group flex items-baseline justify-between border-b border-bone/10 pb-3"
            >
              <span className="font-display text-3xl text-bone group-hover:text-crimson">
                {l.label}
              </span>
              <span className="font-japanese text-sm text-bone/40">{l.jp}</span>
            </motion.a>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex flex-col gap-3"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openDialog('reserve');
              }}
              className="btn-yum btn-yum-light w-full"
            >
              <span className="font-japanese">予約</span>
              <span>Reserve a Seat</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openDialog('build');
              }}
              className="btn-yum btn-yum-gold w-full"
            >
              <span className="font-japanese">一杯</span>
              <span>Build Your Bowl</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openDialog('gift');
              }}
              className="btn-yum btn-yum-jade btn-yum-light w-full"
            >
              <span className="font-japanese">贈</span>
              <span>Give a Gift</span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
