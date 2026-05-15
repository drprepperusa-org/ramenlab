import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DialogShell, { Stepper, StepHeading } from './DialogShell';
import { closeDialog } from '../../hooks/useDialog';

const TIME_SLOTS = [
  '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
  '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM',
];

const STEPS = ['Date', 'Time', 'Party', 'Details', 'Confirm'];

function nextFourteenDays() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

const fmtDay = (d) =>
  d.toLocaleDateString('en-US', { weekday: 'short' });
const fmtDate = (d) => d.getDate();
const fmtMonth = (d) =>
  d.toLocaleDateString('en-US', { month: 'short' });
const fmtFull = (d) =>
  d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

export default function ReserveDialog({ open }) {
  const [step, setStep] = useState(0);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [party, setParty] = useState(2);
  const [details, setDetails] = useState({ name: '', phone: '', email: '', note: '' });
  const [submitted, setSubmitted] = useState(false);

  const days = useMemo(() => nextFourteenDays(), []);

  const detailsValid =
    details.name.trim().length >= 2 &&
    /^[\d\s\-()+]{7,}$/.test(details.phone) &&
    /^\S+@\S+\.\S+$/.test(details.email);

  const canAdvance =
    (step === 0 && date) ||
    (step === 1 && time) ||
    (step === 2 && party >= 1 && party <= 8) ||
    (step === 3 && detailsValid);

  const next = () => {
    if (step === 3) {
      setSubmitted(true);
      setStep(4);
    } else {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <DialogShell open={open} title="Reserve Your Bowl" kanji="予約" accent="crimson">
      {!submitted && <Stepper steps={STEPS} current={step} />}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {step === 0 && (
            <>
              <StepHeading label="Choose a date" hint="We hold tables up to 14 days out." />
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                {days.map((d) => {
                  const selected = date?.toDateString() === d.toDateString();
                  return (
                    <button
                      key={d.toISOString()}
                      onClick={() => setDate(d)}
                      className={`flex flex-col items-center justify-center rounded-xl border px-3 py-4 transition-all ${
                        selected
                          ? 'border-crimson bg-crimson/10 text-bone shadow-[0_0_20px_rgba(230,57,70,0.25)]'
                          : 'border-bone/15 bg-ink/40 text-bone/70 hover:border-bone/35 hover:bg-ink/60'
                      }`}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">
                        {fmtDay(d)}
                      </span>
                      <span className="mt-1 font-display text-3xl leading-none">{fmtDate(d)}</span>
                      <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-bone/50">
                        {fmtMonth(d)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <StepHeading
                label="Pick a time"
                hint={`Slots for ${fmtFull(date)}. Bowls drop fastest before 7 PM.`}
              />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {TIME_SLOTS.map((slot) => {
                  const selected = time === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => setTime(slot)}
                      className={`rounded-full border py-3 font-mono text-sm tracking-[0.1em] transition-all ${
                        selected
                          ? 'border-crimson bg-crimson text-bone'
                          : 'border-bone/15 text-bone/80 hover:border-bone/40'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <StepHeading label="How many?" hint="Up to 8 per booking. Larger parties — call us." />
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setParty((p) => Math.max(1, p - 1))}
                  disabled={party <= 1}
                  aria-label="Decrease party size"
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-bone/20 text-bone/80 transition-colors hover:bg-bone/5 disabled:opacity-30"
                >
                  <svg width="14" height="2" viewBox="0 0 14 2" aria-hidden>
                    <rect width="14" height="2" fill="currentColor" />
                  </svg>
                </button>
                <div className="text-center">
                  <div className="font-display text-7xl leading-none text-bone">{party}</div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-bone/50">
                    {party === 1 ? 'Guest' : 'Guests'}
                  </div>
                </div>
                <button
                  onClick={() => setParty((p) => Math.min(8, p + 1))}
                  disabled={party >= 8}
                  aria-label="Increase party size"
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-bone/20 text-bone/80 transition-colors hover:bg-bone/5 disabled:opacity-30"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                    <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <StepHeading label="Your details" hint="We'll text confirmation in under 30 seconds." />
              <div className="space-y-4">
                <Field label="Full name">
                  <input
                    type="text"
                    autoComplete="name"
                    value={details.name}
                    onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))}
                    placeholder="Haruki Tanaka"
                    className="w-full bg-transparent text-bone outline-none placeholder:text-bone/30"
                  />
                </Field>
                <Field label="Phone">
                  <input
                    type="tel"
                    autoComplete="tel"
                    value={details.phone}
                    onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))}
                    placeholder="(415) 555-0142"
                    className="w-full bg-transparent text-bone outline-none placeholder:text-bone/30"
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    autoComplete="email"
                    value={details.email}
                    onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))}
                    placeholder="you@domain.com"
                    className="w-full bg-transparent text-bone outline-none placeholder:text-bone/30"
                  />
                </Field>
                <Field label="Note (optional)" hint="Allergies, occasion, seating preference.">
                  <textarea
                    rows={3}
                    value={details.note}
                    onChange={(e) => setDetails((d) => ({ ...d, note: e.target.value }))}
                    placeholder="Celebrating a birthday — surprise miso bowl with a candle, if possible."
                    className="w-full resize-none bg-transparent text-bone outline-none placeholder:text-bone/30"
                  />
                </Field>
              </div>
            </>
          )}

          {step === 4 && (
            <ConfirmationCard
              kanji="ご予約承りました"
              eyebrow="Reservation confirmed"
              title={`Table for ${party}`}
              lines={[
                fmtFull(date),
                `${time}`,
                `Held under: ${details.name}`,
                `Confirmation sent to ${details.email}`,
              ]}
              footnote="A 24-hour cancellation window applies. We'll text a reminder the morning of."
            />
          )}
        </motion.div>
      </AnimatePresence>

      <DialogFooter
        step={step}
        finalStep={4}
        canAdvance={canAdvance}
        onBack={back}
        onNext={next}
        onClose={closeDialog}
        nextLabel={step === 3 ? 'Confirm booking' : 'Continue'}
      />
    </DialogShell>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block rounded-xl border border-bone/15 bg-ink/40 px-4 py-3 focus-within:border-crimson/60">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-bone/50">{label}</span>
        {hint && <span className="text-[10px] text-bone/40">{hint}</span>}
      </div>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function DialogFooter({ step, finalStep, canAdvance, onBack, onNext, onClose, nextLabel }) {
  if (step === finalStep) {
    return (
      <div className="mt-8 flex justify-center">
        <button onClick={onClose} className="btn-yum btn-yum-lg btn-yum-light">
          Close
        </button>
      </div>
    );
  }
  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      <button
        onClick={onBack}
        disabled={step === 0}
        className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone/60 transition-colors hover:text-bone disabled:opacity-30 disabled:hover:text-bone/60"
      >
        ← Back
      </button>
      <button
        onClick={onNext}
        disabled={!canAdvance}
        className="btn-yum btn-yum-light"
      >
        {nextLabel}
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none" aria-hidden>
          <path d="M0 5h18m0 0L14 1m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
    </div>
  );
}

export function ConfirmationCard({ kanji, eyebrow, title, lines, footnote }) {
  return (
    <div className="py-4 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-jade/15 ring-1 ring-jade/40"
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path
            d="M8 16.5l5.5 5.5L24 11"
            stroke="#2A9D8F"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
      <p className="font-japanese text-sm text-crimson/80">{kanji}</p>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-jade">{eyebrow}</p>
      <h3 className="mt-3 font-display text-4xl text-bone">{title}</h3>
      <div className="mt-6 space-y-1.5">
        {lines.map((line, i) => (
          <p key={i} className="text-bone/80">
            {line}
          </p>
        ))}
      </div>
      {footnote && (
        <p className="mt-8 text-xs italic text-bone/50">
          {footnote}
        </p>
      )}
    </div>
  );
}
