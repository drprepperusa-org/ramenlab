import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function AnimatedClock() {
  // Live clock — Tokyo (JST = UTC+9). Updates every second.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Convert local → JST (UTC+9)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const jst = new Date(utc + 9 * 3600000);
  const h = jst.getHours();
  const m = jst.getMinutes();
  const s = jst.getSeconds();

  // Smooth analog hand angles
  const sec = s * 6;
  const min = m * 6 + s * 0.1;
  const hr = (h % 12) * 30 + m * 0.5;

  const isOpen = h >= 17 || h < 2; // open 5pm → 2am JST

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-32 w-32 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle cx="50" cy="50" r="48" fill="none" stroke="#F1FAEE" strokeOpacity="0.15" strokeWidth="0.5" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="6"
              x2="50"
              y2="10"
              stroke="#F1FAEE"
              strokeOpacity={i % 3 === 0 ? 0.6 : 0.25}
              strokeWidth={i % 3 === 0 ? 1.2 : 0.6}
              transform={`rotate(${i * 30} 50 50)`}
            />
          ))}
          {/* hands */}
          <line x1="50" y1="50" x2="50" y2="28" stroke="#F1FAEE" strokeWidth="2" strokeLinecap="round" transform={`rotate(${hr} 50 50)`} />
          <line x1="50" y1="50" x2="50" y2="18" stroke="#FFB703" strokeWidth="1.4" strokeLinecap="round" transform={`rotate(${min} 50 50)`} />
          <line x1="50" y1="55" x2="50" y2="14" stroke="#E63946" strokeWidth="0.8" strokeLinecap="round" transform={`rotate(${sec} 50 50)`} />
          <circle cx="50" cy="50" r="2" fill="#E63946" />
        </svg>
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">Tokyo · JST</div>
        <div className="mt-1 font-display text-4xl tabular-nums text-bone">
          {String(h).padStart(2, '0')}<span className={s % 2 ? 'opacity-30' : ''}>:</span>{String(m).padStart(2, '0')}
        </div>
        <div className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.32em]">
          <span
            className={`relative flex h-2 w-2 ${isOpen ? 'text-jade' : 'text-crimson'}`}
          >
            <span className={`absolute inset-0 rounded-full bg-current ${isOpen ? 'animate-pulse' : ''}`} />
            {isOpen && <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-60" />}
          </span>
          <span className={isOpen ? 'text-jade' : 'text-crimson'}>
            {isOpen ? 'Now Serving' : 'Closed'}
          </span>
        </div>
      </div>
    </div>
  );
}

function NeonInput({ label, type = 'text', name, required, rows }) {
  const id = `f-${name}`;
  const Tag = rows ? 'textarea' : 'input';
  return (
    <label htmlFor={id} className="group relative block">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.4em] text-bone/50 transition-colors group-focus-within:text-crimson">
        {label}
      </span>
      <Tag
        id={id}
        name={name}
        type={type}
        rows={rows}
        required={required}
        className="peer w-full resize-none border border-bone/15 bg-ink/40 px-4 py-3 font-mono text-sm text-bone outline-none transition-all duration-300 placeholder:text-bone/20 focus:border-crimson focus:shadow-neon focus:bg-ink"
        placeholder=" "
      />
      <span className="pointer-events-none absolute inset-0 -z-10 opacity-0 blur-xl transition-opacity duration-500 peer-focus:opacity-100" style={{ background: 'radial-gradient(circle, rgba(230,57,70,0.3), transparent 70%)' }} />
    </label>
  );
}

export default function Contact() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section id="reserve" className="section relative bg-ink py-24 md:py-32">
      <div className="absolute inset-0 bg-asanoha opacity-40" />
      <div className="container-x relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center md:mb-16"
        >
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-crimson" />
            <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-crimson">
              <span className="font-japanese mr-2">予約</span>Reserve
            </span>
            <span className="h-px w-12 bg-crimson" />
          </div>
          <h2 className="headline mx-auto max-w-3xl text-5xl text-bone md:text-7xl">
            A seat at the <em className="not-italic text-crimson">pass</em>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-display text-lg italic text-bone/70">
            Twelve stools. Two seatings a night. Walk-ins welcome — reservations honored first.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            onSubmit={onSubmit}
            className="glass relative space-y-5 p-8 md:p-10 lg:col-span-7"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <NeonInput label="Name" name="name" required />
              <NeonInput label="Party Size" name="size" type="number" required />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <NeonInput label="Date" name="date" type="date" required />
              <NeonInput label="Time" name="time" type="time" required />
            </div>
            <NeonInput label="Email" name="email" type="email" required />
            <NeonInput label="Special Requests" name="notes" rows={4} />

            <div className="flex flex-col items-start justify-between gap-4 pt-2 md:flex-row md:items-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-bone/40">
                We&apos;ll confirm within an hour.
              </p>
              <button
                type="submit"
                data-cursor="hover"
                disabled={sent}
                className={`btn-yum btn-yum-lg ${sent ? 'btn-yum-jade' : ''}`}
              >
                {sent ? 'Reservation Sent ✓' : 'Reserve a Bowl'}
                <svg width="20" height="10" viewBox="0 0 20 10" fill="none" aria-hidden>
                  <path d="M0 5h18m0 0L14 1m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
            </div>
          </motion.form>

          {/* Sidebar — clock + map + socials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 lg:col-span-5"
          >
            <div className="glass p-8">
              <AnimatedClock />
              <div className="mt-6 space-y-3 font-mono text-[11px] uppercase tracking-[0.32em] text-bone/60">
                <div className="flex justify-between">
                  <span>Mon — Thu</span>
                  <span className="text-bone">17:00 — 00:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Fri — Sat</span>
                  <span className="text-bone">17:00 — 02:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sun</span>
                  <span className="text-bone/40">Closed</span>
                </div>
              </div>
            </div>

            {/* Stylized "map" — pure SVG, no API */}
            <div className="glass relative h-56 overflow-hidden p-6">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
                <span className="font-japanese mr-2">所在地</span>Location
              </div>
              <div className="font-display text-xl text-bone">
                3-7-2 Nishi-Shinjuku<br />
                Tokyo, 160-0023
              </div>
              <svg
                viewBox="0 0 200 100"
                className="absolute inset-x-0 bottom-0 h-32 w-full opacity-50"
                aria-hidden
              >
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#F1FAEE" strokeOpacity="0.1" strokeWidth="0.4" />
                  </pattern>
                </defs>
                <rect width="200" height="100" fill="url(#grid)" />
                <path d="M0 60 Q50 50 100 55 T200 50" fill="none" stroke="#E63946" strokeWidth="0.8" strokeOpacity="0.6" />
                <path d="M20 80 L60 40 L120 60 L180 30" fill="none" stroke="#FFB703" strokeWidth="0.5" strokeOpacity="0.5" />
                <circle cx="100" cy="55" r="2" fill="#E63946">
                  <animate attributeName="r" values="2;6;2" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="100" cy="55" r="1.5" fill="#FFB703" />
              </svg>
            </div>

            <div className="glass p-6">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/40">
                Follow
              </div>
              <div className="flex gap-3">
                {['Instagram', 'TikTok', 'X', 'YouTube'].map((s) => (
                  <a
                    key={s}
                    href="#"
                    data-cursor="hover"
                    className="group relative flex h-12 flex-1 items-center justify-center border border-bone/15 font-mono text-[10px] uppercase tracking-[0.32em] text-bone/70 transition-all hover:border-crimson hover:text-crimson hover:shadow-neon"
                  >
                    <span className="absolute inset-0 origin-left scale-x-0 bg-crimson/10 transition-transform duration-500 group-hover:scale-x-100" />
                    <span className="relative">{s}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
