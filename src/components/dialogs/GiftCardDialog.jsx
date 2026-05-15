import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DialogShell, { Stepper, StepHeading } from './DialogShell';
import { ConfirmationCard } from './ReserveDialog';
import { closeDialog } from '../../hooks/useDialog';
import { trackEvent } from '../../lib/analytics';

const STEPS = ['Amount', 'Recipient', 'Message', 'Confirm'];

const AMOUNTS = [
  { v: 25, label: 'One bowl', kanji: '一杯', desc: 'A single bowl with broth and toppings.' },
  { v: 50, label: 'Date night', kanji: '二人', desc: 'Two bowls and two drinks. The most popular.' },
  { v: 100, label: 'A small feast', kanji: '宴', desc: 'Bowls for four, plus the gyoza tray.' },
  { v: 200, label: 'Chef\'s table', kanji: '匠', desc: 'Counter seats and the omakase tasting.' },
];

const PRESET_MESSAGES = [
  'You deserve this. Slurp loud.',
  'Tokyo by way of [city]. Enjoy every drop.',
  'Thank you. The broth is on me.',
  'Happy birthday — go get your bowl.',
];

export default function GiftCardDialog({ open }) {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(50);
  const [custom, setCustom] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [recipient, setRecipient] = useState({ name: '', email: '' });
  const [message, setMessage] = useState(PRESET_MESSAGES[0]);
  const [sender, setSender] = useState({ name: '', deliverOn: 'now' });
  const [submitted, setSubmitted] = useState(false);

  const finalAmount = useCustom ? Number(custom) || 0 : amount;

  const recipientValid =
    recipient.name.trim().length >= 2 && /^\S+@\S+\.\S+$/.test(recipient.email);
  const senderValid = sender.name.trim().length >= 2;

  const canAdvance =
    (step === 0 && finalAmount >= 10 && finalAmount <= 1000) ||
    (step === 1 && recipientValid) ||
    (step === 2 && message.trim().length > 0) ||
    (step === 3 && senderValid);

  const next = () => {
    if (step === 3) {
      trackEvent('gift_sent', {
        value: finalAmount,
        currency: 'USD',
        custom_amount: useCustom,
        deliver_on: sender.deliverOn,
      });
      setSubmitted(true);
    } else {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  if (submitted) {
    return (
      <DialogShell open={open} title="Gift Sent" kanji="贈" accent="jade">
        <ConfirmationCard
          kanji="お贈り物を承りました"
          eyebrow="Gift delivered"
          title={`$${finalAmount.toFixed(2)} to ${recipient.name}`}
          lines={[
            sender.deliverOn === 'now'
              ? `Arriving in ${recipient.email}'s inbox right now`
              : `Scheduled for ${sender.deliverOn}`,
            `From: ${sender.name}`,
            `"${message}"`,
          ]}
          footnote="Receipt sent to you. The recipient can redeem in-store or pre-load a future bowl."
        />
        <div className="mt-8 flex justify-center">
          <button onClick={() => closeDialog()} className="btn-yum btn-yum-lg btn-yum-light">
            Done
          </button>
        </div>
      </DialogShell>
    );
  }

  return (
    <DialogShell open={open} title="Give the Ramen Experience" kanji="贈" accent="jade">
      <Stepper steps={STEPS} current={step} />

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
              <StepHeading
                label="Choose an amount"
                hint="No fees. The full amount lands in their hands."
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {AMOUNTS.map((a) => {
                  const selected = !useCustom && amount === a.v;
                  return (
                    <button
                      key={a.v}
                      onClick={() => {
                        setAmount(a.v);
                        setUseCustom(false);
                      }}
                      className={`group relative overflow-hidden rounded-xl border p-5 text-left transition-all ${
                        selected
                          ? 'border-jade bg-jade/10 shadow-[0_0_24px_rgba(42,157,143,0.2)]'
                          : 'border-bone/15 bg-ink/40 hover:border-bone/35'
                      }`}
                    >
                      <div className="flex items-baseline justify-between">
                        <span className="font-display text-3xl text-bone">${a.v}</span>
                        <span className="font-japanese text-xl text-crimson/70">{a.kanji}</span>
                      </div>
                      <p className="mt-2 font-display text-lg text-bone/90">{a.label}</p>
                      <p className="mt-1 text-xs text-bone/60">{a.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setUseCustom(true)}
                  className={`flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all ${
                    useCustom
                      ? 'border-jade bg-jade/10'
                      : 'border-bone/15 bg-ink/40 hover:border-bone/35'
                  }`}
                >
                  <div>
                    <div className="font-display text-lg text-bone">Custom amount</div>
                    <div className="mt-0.5 text-xs text-bone/60">$10 to $1,000.</div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-bone/60">$</span>
                    <input
                      type="number"
                      min={10}
                      max={1000}
                      value={custom}
                      onFocus={() => setUseCustom(true)}
                      onChange={(e) => setCustom(e.target.value)}
                      placeholder="75"
                      className="w-28 rounded-lg border border-bone/20 bg-ink/60 py-2 pl-7 pr-3 text-right text-bone outline-none focus:border-jade"
                    />
                  </div>
                </button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <StepHeading
                label="Who's it for?"
                hint="We'll email the gift to them — no shipping, no waiting."
              />
              <div className="space-y-4">
                <Field label="Their name">
                  <input
                    type="text"
                    value={recipient.name}
                    onChange={(e) => setRecipient((r) => ({ ...r, name: e.target.value }))}
                    placeholder="Mira K."
                    className="w-full bg-transparent text-bone outline-none placeholder:text-bone/30"
                  />
                </Field>
                <Field label="Their email">
                  <input
                    type="email"
                    value={recipient.email}
                    onChange={(e) => setRecipient((r) => ({ ...r, email: e.target.value }))}
                    placeholder="mira@domain.com"
                    className="w-full bg-transparent text-bone outline-none placeholder:text-bone/30"
                  />
                </Field>
              </div>
              <p className="mt-4 text-xs text-bone/50">
                Their email is only used for the gift. We don't add them to anything.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <StepHeading label="Add a note" hint="Pick a line or write your own." />
              <div className="space-y-2">
                {PRESET_MESSAGES.map((m) => {
                  const selected = message === m;
                  return (
                    <button
                      key={m}
                      onClick={() => setMessage(m)}
                      className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition-all ${
                        selected
                          ? 'border-jade bg-jade/10 text-bone'
                          : 'border-bone/15 bg-ink/40 text-bone/80 hover:border-bone/35'
                      }`}
                    >
                      "{m}"
                    </button>
                  );
                })}
              </div>
              <div className="mt-4">
                <Field label="Or write your own">
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={240}
                    className="w-full resize-none bg-transparent text-bone outline-none placeholder:text-bone/30"
                  />
                </Field>
                <div className="mt-1 text-right text-[10px] text-bone/40">
                  {message.length} / 240
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <StepHeading label="Last bit" hint="Who's it from? When should we send?" />
              <div className="space-y-4">
                <Field label="Your name">
                  <input
                    type="text"
                    value={sender.name}
                    onChange={(e) => setSender((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Alex P."
                    className="w-full bg-transparent text-bone outline-none placeholder:text-bone/30"
                  />
                </Field>
                <Field label="Deliver when?">
                  <div className="flex flex-wrap gap-2">
                    {['now', 'tomorrow morning', 'next monday', 'on a specific date'].map((opt) => {
                      const active = sender.deliverOn === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setSender((s) => ({ ...s, deliverOn: opt }))}
                          className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-all ${
                            active
                              ? 'border-jade bg-jade text-ink'
                              : 'border-bone/20 text-bone/70 hover:border-bone/40'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </div>

              <div className="mt-6 rounded-xl border border-bone/10 bg-ink/40 p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-bone/50">
                  Preview
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-display text-2xl text-bone">${finalAmount.toFixed(2)} gift</span>
                  <span className="font-japanese text-xl text-crimson/70">贈</span>
                </div>
                <p className="mt-3 text-sm text-bone/75">For {recipient.name || '—'}</p>
                <p className="mt-3 text-sm italic text-bone/60">"{message}"</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.32em] text-bone/50">
                  Total charged today: ${finalAmount.toFixed(2)}
                </p>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          onClick={back}
          disabled={step === 0}
          className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone/60 transition-colors hover:text-bone disabled:opacity-30"
        >
          ← Back
        </button>
        <button onClick={next} disabled={!canAdvance} className="btn-yum btn-yum-jade btn-yum-light">
          {step === 3 ? 'Send gift' : 'Continue'}
          <svg width="20" height="10" viewBox="0 0 20 10" fill="none" aria-hidden>
            <path d="M0 5h18m0 0L14 1m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    </DialogShell>
  );
}

function Field({ label, children }) {
  return (
    <label className="block rounded-xl border border-bone/15 bg-ink/40 px-4 py-3 focus-within:border-jade/60">
      <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-bone/50">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
