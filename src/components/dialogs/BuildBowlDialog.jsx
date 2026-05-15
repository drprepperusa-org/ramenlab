import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DialogShell, { Stepper, StepHeading } from './DialogShell';
import { ConfirmationCard } from './ReserveDialog';
import { closeDialog } from '../../hooks/useDialog';

const STEPS = ['Broth', 'Noodle', 'Toppings', 'Heat', 'Drink', 'Review'];

const BROTHS = [
  { id: 'tonkotsu', name: 'Tonkotsu', kanji: '豚骨', desc: '12-hour pork bone. Cloudy, deep, foundational.', basePrice: 18 },
  { id: 'shoyu', name: 'Shoyu', kanji: '醤油', desc: 'Aged soy + dashi. Clear and balanced.', basePrice: 16 },
  { id: 'miso', name: 'Miso', kanji: '味噌', desc: 'Hokkaido red miso. Fermented, full-bodied.', basePrice: 17 },
  { id: 'black-garlic', name: 'Spicy Black Garlic', kanji: '黒辛', desc: 'Charred garlic oil + Sichuan chili.', basePrice: 19 },
];

const NOODLES = [
  { id: 'thin', name: 'Thin straight', desc: 'Hakata-style. Best with tonkotsu.' },
  { id: 'wavy', name: 'Wavy medium', desc: 'Catches broth. Our house default.' },
  { id: 'thick', name: 'Thick chewy', desc: 'Tsukemen cut. Bite-forward.' },
];

const TOPPINGS = [
  { id: 'chashu', name: 'Chashu pork', price: 3 },
  { id: 'egg', name: 'Marinated egg', price: 2 },
  { id: 'menma', name: 'Bamboo shoots', price: 1.5 },
  { id: 'nori', name: 'Nori', price: 1 },
  { id: 'corn', name: 'Sweet corn', price: 1.5 },
  { id: 'sprouts', name: 'Bean sprouts', price: 1 },
  { id: 'wood-ear', name: 'Wood-ear mushroom', price: 1.5 },
  { id: 'scallion', name: 'Extra scallion', price: 1 },
  { id: 'butter', name: 'Cultured butter', price: 2 },
  { id: 'mayu', name: 'Black garlic oil', price: 1.5 },
];

const HEAT_LEVELS = [
  { v: 0, label: 'None', kanji: '無し' },
  { v: 1, label: 'Whisper', kanji: '微' },
  { v: 2, label: 'Warm', kanji: '小' },
  { v: 3, label: 'Real', kanji: '中' },
  { v: 4, label: 'Loud', kanji: '辛' },
  { v: 5, label: 'Punishing', kanji: '激辛' },
];

const DRINKS = [
  { id: 'none', name: 'No drink', desc: 'Just the bowl.', price: 0 },
  { id: 'sapporo', name: 'Sapporo lager', desc: 'Crisp, cold, classic pairing.', price: 7 },
  { id: 'hojicha', name: 'Hojicha', desc: 'Roasted green tea. Calms the heat.', price: 5 },
  { id: 'calpico', name: 'Calpico', desc: 'Yogurt soda. Tames spice fast.', price: 4 },
  { id: 'highball', name: 'Yamazaki highball', desc: 'Soda + a splash of single malt.', price: 12 },
];

export default function BuildBowlDialog({ open }) {
  const [step, setStep] = useState(0);
  const [broth, setBroth] = useState(null);
  const [noodle, setNoodle] = useState(null);
  const [toppings, setToppings] = useState([]);
  const [heat, setHeat] = useState(2);
  const [drink, setDrink] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const toppingsTotal = toppings.reduce(
    (sum, id) => sum + (TOPPINGS.find((t) => t.id === id)?.price ?? 0),
    0
  );
  const drinkPrice = DRINKS.find((d) => d.id === drink)?.price ?? 0;
  const total = (broth?.basePrice ?? 0) + toppingsTotal + drinkPrice;

  const canAdvance =
    (step === 0 && broth) ||
    (step === 1 && noodle) ||
    step === 2 ||
    step === 3 ||
    (step === 4 && drink) ||
    step === 5;

  const next = () => {
    if (step === 5) {
      setSubmitted(true);
    } else {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const toggleTopping = (id) =>
    setToppings((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  if (submitted) {
    return (
      <DialogShell open={open} title="Bowl Ordered" kanji="一杯" accent="gold">
        <ConfirmationCard
          kanji="ご注文ありがとうございます"
          eyebrow="Bowl in the works"
          title={`${broth.name} Ramen`}
          lines={[
            `${noodle.name} noodles · Heat: ${HEAT_LEVELS[heat].label}`,
            toppings.length > 0
              ? `+ ${toppings.map((id) => TOPPINGS.find((t) => t.id === id)?.name).join(', ')}`
              : 'No add-ons',
            DRINKS.find((d) => d.id === drink)?.name,
            `Total: $${total.toFixed(2)}`,
          ]}
          footnote="Show this screen to the host when you arrive — or call ahead and we'll fire it on your ETA."
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
    <DialogShell open={open} title="Build Your Bowl" kanji="一杯" accent="gold">
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
              <StepHeading label="Pick a broth" hint="The foundation. Everything else answers to this." />
              <div className="grid gap-3 sm:grid-cols-2">
                {BROTHS.map((b) => {
                  const selected = broth?.id === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setBroth(b)}
                      className={`group relative overflow-hidden rounded-xl border p-5 text-left transition-all ${
                        selected
                          ? 'border-gold bg-gold/5 shadow-[0_0_30px_rgba(255,183,3,0.15)]'
                          : 'border-bone/15 bg-ink/40 hover:border-bone/35'
                      }`}
                    >
                      <div className="flex items-baseline justify-between">
                        <span className="font-display text-2xl text-bone">{b.name}</span>
                        <span className="font-japanese text-xl text-crimson/80">{b.kanji}</span>
                      </div>
                      <p className="mt-2 text-sm text-bone/65">{b.desc}</p>
                      <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.32em] text-bone/50">
                        From ${b.basePrice}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <StepHeading label="Choose your noodle" hint="Each cut hugs broth differently." />
              <div className="space-y-3">
                {NOODLES.map((n) => {
                  const selected = noodle?.id === n.id;
                  return (
                    <button
                      key={n.id}
                      onClick={() => setNoodle(n)}
                      className={`flex w-full items-center justify-between gap-6 rounded-xl border p-4 text-left transition-all ${
                        selected
                          ? 'border-gold bg-gold/5'
                          : 'border-bone/15 bg-ink/40 hover:border-bone/35'
                      }`}
                    >
                      <div>
                        <div className="font-display text-xl text-bone">{n.name}</div>
                        <div className="mt-1 text-sm text-bone/60">{n.desc}</div>
                      </div>
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                          selected ? 'border-gold bg-gold' : 'border-bone/30'
                        }`}
                      >
                        {selected && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                            <path d="M2 6l3 3 5-6" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <StepHeading
                label="Add toppings"
                hint="Pick as many as you want. We'll layer them in order of weight."
              />
              <div className="grid gap-2 sm:grid-cols-2">
                {TOPPINGS.map((t) => {
                  const selected = toppings.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleTopping(t.id)}
                      className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
                        selected
                          ? 'border-gold bg-gold/10 text-bone'
                          : 'border-bone/15 bg-ink/40 text-bone/80 hover:border-bone/35'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            selected ? 'border-gold bg-gold' : 'border-bone/30'
                          }`}
                        >
                          {selected && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                              <path d="M1 5l2.5 2.5L9 2" stroke="#0F0F0F" strokeWidth="2" />
                            </svg>
                          )}
                        </span>
                        {t.name}
                      </span>
                      <span className="font-mono text-xs text-bone/60">+${t.price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-bone/50">
                Added: <span className="text-bone/80">{toppings.length}</span> · Topping total{' '}
                <span className="text-bone/80">${toppingsTotal.toFixed(2)}</span>
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <StepHeading
                label="Set the heat"
                hint="Five is our line cooks calling family. We don't recommend it."
              />
              <div className="space-y-6">
                <div className="grid grid-cols-6 gap-2">
                  {HEAT_LEVELS.map((h) => {
                    const active = heat === h.v;
                    return (
                      <button
                        key={h.v}
                        onClick={() => setHeat(h.v)}
                        className={`flex flex-col items-center gap-1 rounded-lg border py-3 transition-all ${
                          active
                            ? 'border-crimson bg-crimson/10'
                            : 'border-bone/15 bg-ink/40 hover:border-bone/35'
                        }`}
                      >
                        <span className="font-japanese text-lg text-crimson/80">{h.kanji}</span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/60">
                          {h.v}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="rounded-xl border border-bone/10 bg-ink/40 p-4 text-center">
                  <p className="font-display text-2xl text-bone">{HEAT_LEVELS[heat].label}</p>
                  {heat >= 4 && (
                    <p className="mt-2 text-xs text-crimson/80">
                      ⚠ This one earns its name. Cold milk on standby.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <StepHeading label="Pair a drink" hint="Optional — or send the chef a thank-you." />
              <div className="space-y-3">
                {DRINKS.map((d) => {
                  const selected = drink === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setDrink(d.id)}
                      className={`flex w-full items-center justify-between gap-6 rounded-xl border p-4 text-left transition-all ${
                        selected
                          ? 'border-gold bg-gold/5'
                          : 'border-bone/15 bg-ink/40 hover:border-bone/35'
                      }`}
                    >
                      <div>
                        <div className="font-display text-lg text-bone">{d.name}</div>
                        <div className="mt-1 text-xs text-bone/60">{d.desc}</div>
                      </div>
                      <div className="font-mono text-xs text-bone/70">
                        {d.price > 0 ? `+$${d.price.toFixed(2)}` : '—'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <StepHeading label="Your bowl" hint="Last look before we fire it." />
              <div className="space-y-3 rounded-xl border border-bone/10 bg-ink/40 p-5">
                <Row label="Broth" value={broth.name} price={`$${broth.basePrice.toFixed(2)}`} kanji={broth.kanji} />
                <Row label="Noodle" value={noodle.name} />
                <Row
                  label="Toppings"
                  value={
                    toppings.length === 0
                      ? 'None'
                      : toppings.map((id) => TOPPINGS.find((t) => t.id === id)?.name).join(' · ')
                  }
                  price={toppingsTotal > 0 ? `$${toppingsTotal.toFixed(2)}` : '—'}
                />
                <Row label="Heat" value={`${HEAT_LEVELS[heat].label} (${heat})`} />
                <Row
                  label="Drink"
                  value={DRINKS.find((d) => d.id === drink)?.name}
                  price={drinkPrice > 0 ? `$${drinkPrice.toFixed(2)}` : '—'}
                />
                <div className="my-3 h-px bg-bone/10" />
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-bone/60">
                    Total
                  </span>
                  <span className="font-display text-3xl text-gold">${total.toFixed(2)}</span>
                </div>
              </div>
              <p className="mt-4 text-xs italic text-bone/50">
                You'll be charged when you sit. We hold this order for 90 minutes.
              </p>
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
        <button onClick={next} disabled={!canAdvance} className="btn-yum btn-yum-light">
          {step === 5 ? 'Place order' : 'Continue'}
          <svg width="20" height="10" viewBox="0 0 20 10" fill="none" aria-hidden>
            <path d="M0 5h18m0 0L14 1m4 4l-4 4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    </DialogShell>
  );
}

function Row({ label, value, price, kanji }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div className="min-w-0">
        <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-bone/50">
          {label}
        </div>
        <div className="mt-0.5 truncate text-bone">
          {value}
          {kanji && <span className="ml-2 font-japanese text-crimson/70">{kanji}</span>}
        </div>
      </div>
      {price && <span className="shrink-0 font-mono text-sm text-bone/70">{price}</span>}
    </div>
  );
}
