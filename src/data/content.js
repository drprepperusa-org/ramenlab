// Centralized content + image manifest.
// Unsplash + Pexels CDN URLs are used with explicit ?w=&q=&fm=webp params so
// the browser hits the right pre-resized variant. All photos are royalty-free.

const u = (id, w = 1600, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}&fm=webp`;

/* ─────────────────────────────────────────────
 * Hero — cinematic ramen + Tokyo nightlife
 * ───────────────────────────────────────────── */
export const heroImages = [
  {
    src: u('1623341214825-9f4f963727da', 1920, 80),
    alt: 'Steaming bowl of tonkotsu ramen lit by crimson light',
  },
  {
    src: u('1557872943-16a5ac26437e', 1920, 80),
    alt: 'Tokyo alley at night with red lanterns and neon',
  },
  {
    src: u('1569718212165-3a8278d5f624', 1920, 80),
    alt: 'Close-up of ramen noodles being lifted with chopsticks',
  },
  {
    src: u('1542838132-92c53300491e', 1920, 80),
    alt: 'Shibuya neon street with rain reflections',
  },
  {
    src: u('1591814468924-caf88d1232e1', 1920, 80),
    alt: 'Ramen broth poured into a black bowl',
  },
];

/* ─────────────────────────────────────────────
 * Featured ramen — Swiper showcase
 * ───────────────────────────────────────────── */
export const featuredRamen = [
  {
    id: 'tonkotsu',
    name: 'Tonkotsu',
    kanji: '豚骨',
    tagline: 'Slow-rendered pork bone broth, twelve hours deep.',
    ingredients: ['Chashu pork', 'Marinated egg', 'Wood-ear', 'Scallion', 'Black garlic oil'],
    heat: 1,
    price: '$18',
    image: u('1591814468924-caf88d1232e1', 1600, 82),
  },
  {
    id: 'shoyu',
    name: 'Shoyu',
    kanji: '醤油',
    tagline: 'Aged soy, dashi, and clarity over richness.',
    ingredients: ['Aged soy tare', 'Bamboo shoots', 'Nori', 'Chicken chashu', 'Mitsuba'],
    heat: 1,
    price: '$16',
    image: u('1618841557871-b4664fbf0cb3', 1600, 82),
  },
  {
    id: 'miso',
    name: 'Miso',
    kanji: '味噌',
    tagline: 'Sapporo-style — red miso, fermented depth, butter finish.',
    ingredients: ['Red miso', 'Corn', 'Bean sprouts', 'Ground pork', 'Cultured butter'],
    heat: 2,
    price: '$17',
    image: u('1614563637806-1d0e645e0940', 1600, 82),
  },
  {
    id: 'black-garlic',
    name: 'Spicy Black Garlic',
    kanji: '黒辛',
    tagline: 'Charred garlic oil, chili crisp, an after-burn that lingers.',
    ingredients: ['Mayu oil', 'Sichuan chili', 'Pork belly', 'Pickled mustard', 'Sesame'],
    heat: 4,
    price: '$19',
    image: u('1569718212165-3a8278d5f624', 1600, 82),
  },
  {
    id: 'tsukemen',
    name: 'Tsukemen',
    kanji: 'つけ麺',
    tagline: 'Thick noodles, concentrated dipping broth. Slurp aggressively.',
    ingredients: ['Cold noodles', 'Fish powder', 'Citrus zest', 'Charred pork', 'Yuzu kosho'],
    heat: 2,
    price: '$20',
    image: u('1623341214825-9f4f963727da', 1600, 82),
  },
];

/* ─────────────────────────────────────────────
 * Menu highlights — full menu cards
 * ───────────────────────────────────────────── */
export const menuItems = [
  {
    name: 'Tonkotsu Ramen',
    kanji: '豚骨ラーメン',
    desc: 'Cloudy pork bone broth, simmered 12 hours.',
    ingredients: 'Chashu · Ajitama · Black garlic oil · Scallion',
    price: '18',
    image: u('1591814468924-caf88d1232e1', 1100, 80),
  },
  {
    name: 'Shoyu Ramen',
    kanji: '醤油ラーメン',
    desc: 'Tokyo-style. Soy-forward, clear, balanced.',
    ingredients: 'Bamboo · Nori · Chicken chashu · Spring onion',
    price: '16',
    image: u('1618841557871-b4664fbf0cb3', 1100, 80),
  },
  {
    name: 'Miso Ramen',
    kanji: '味噌ラーメン',
    desc: 'Hokkaido red miso, corn, butter, ground pork.',
    ingredients: 'Red miso · Bean sprouts · Cultured butter · Corn',
    price: '17',
    image: u('1614563637806-1d0e645e0940', 1100, 80),
  },
  {
    name: 'Spicy Black Garlic',
    kanji: '黒にんにく',
    desc: 'Charred mayu oil + Sichuan heat. Not for the timid.',
    ingredients: 'Mayu · Chili crisp · Pork belly · Sesame',
    price: '19',
    image: u('1569718212165-3a8278d5f624', 1100, 80),
  },
  {
    name: 'Gyoza (6 pc)',
    kanji: '餃子',
    desc: 'Pan-fried pork & cabbage dumplings. Crispy bottoms.',
    ingredients: 'Pork · Cabbage · Garlic · Black vinegar dip',
    price: '9',
    image: u('1496116218417-1a781b1c416c', 1100, 80),
  },
  {
    name: 'Matcha Service',
    kanji: '抹茶',
    desc: 'Ceremonial-grade Uji matcha, whisked to order.',
    ingredients: 'Uji matcha · Spring water · Wagashi',
    price: '8',
    image: u('1545486332-9e0999c535b2', 1100, 80),
  },
];

/* ─────────────────────────────────────────────
 * Experience strip — horizontal scroll panels
 * ───────────────────────────────────────────── */
export const experiencePanels = [
  {
    title: 'Step Inside',
    sub: 'Concrete walls, copper bar, oil-soaked timber stools.',
    image: u('1554118811-1e0d58224f24', 1500, 80),
  },
  {
    title: 'The Pass',
    sub: 'Open kitchen — every bowl built in front of you.',
    image: u('1565299624946-b28f40a0ae38', 1500, 80),
  },
  {
    title: 'Tokyo Alley',
    sub: 'Inspired by yokochō — narrow, dim, intimate.',
    image: u('1542838132-92c53300491e', 1500, 80),
  },
  {
    title: 'Late Hours',
    sub: 'Open until 2am. Rain or shine, neon or fog.',
    image: u('1557872943-16a5ac26437e', 1500, 80),
  },
  {
    title: 'The Slurp',
    sub: 'Loud is respect. Quiet is wasted broth.',
    image: u('1569718212165-3a8278d5f624', 1500, 80),
  },
];

/* ─────────────────────────────────────────────
 * Gallery — masonry
 * ───────────────────────────────────────────── */
export const galleryImages = [
  { src: u('1623341214825-9f4f963727da', 900, 78), span: 'tall', alt: 'Ramen close-up' },
  { src: u('1557872943-16a5ac26437e', 900, 78), span: 'wide', alt: 'Tokyo neon' },
  { src: u('1554118811-1e0d58224f24', 900, 78), span: 'normal', alt: 'Restaurant interior' },
  { src: u('1591814468924-caf88d1232e1', 900, 78), span: 'tall', alt: 'Broth pour' },
  { src: u('1618841557871-b4664fbf0cb3', 900, 78), span: 'normal', alt: 'Shoyu bowl' },
  { src: u('1542838132-92c53300491e', 900, 78), span: 'wide', alt: 'Rainy street' },
  { src: u('1496116218417-1a781b1c416c', 900, 78), span: 'normal', alt: 'Gyoza' },
  { src: u('1565299624946-b28f40a0ae38', 900, 78), span: 'tall', alt: 'Chef plating' },
  { src: u('1545486332-9e0999c535b2', 900, 78), span: 'normal', alt: 'Matcha bowl' },
  { src: u('1569718212165-3a8278d5f624', 900, 78), span: 'wide', alt: 'Noodle lift' },
  { src: u('1614563637806-1d0e645e0940', 900, 78), span: 'normal', alt: 'Miso bowl' },
  { src: u('1517248135467-4c7edcad34c4', 900, 78), span: 'tall', alt: 'Lanterns' },
];

/* ─────────────────────────────────────────────
 * Testimonials — appear in the alley strip
 * ───────────────────────────────────────────── */
export const testimonials = [
  {
    quote:
      'This is the closest you can get to Shinjuku without buying a plane ticket. The tonkotsu wrecked me. I came back the next night.',
    author: 'Yuki H.',
    role: 'Food Writer, Tokyo Bites',
  },
  {
    quote:
      'They turn the lights low, the music up, and serve broth that tastes like a memory. Best ramen on this side of the Pacific.',
    author: 'Marcus J.',
    role: 'Regular, Friday Slurp Club',
  },
  {
    quote:
      'Cinematic in every sense. The black garlic ramen is a religious experience. The room hums.',
    author: 'Elena R.',
    role: 'James Beard nominee',
  },
];

/* ─────────────────────────────────────────────
 * Story copy — used in the Story section
 * ───────────────────────────────────────────── */
export const storyParagraphs = [
  'Ramen Lab began in a six-stool shop in Shinjuku\'s Omoide Yokocho — the kind of place where the broth simmered through the night and the regulars knew the chef by the curve of his shoulders.',
  'We took that obsession home. Twelve-hour bones. Hand-pulled noodles. A tare aged the way wine is aged. No corners. No imitations. No nostalgia for things that weren\'t earned.',
  'Every bowl that leaves our pass is one chef\'s answer to a single question: what would Tokyo taste like, if you ate it slowly?',
];

export const storyImages = [
  u('1554118811-1e0d58224f24', 1400, 80),
  u('1565299624946-b28f40a0ae38', 1400, 80),
];
