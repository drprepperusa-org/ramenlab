# Ramen Lab — Crafted Bowls. Tokyo Soul.

A cinematic, animation-intensive one-page experience for a fictional premium Japanese ramen brand. Built to feel like a late-night walk through Omoide Yokocho: neon, steam, rain, and a 12-hour broth.

> **Stack:** React 18 · Vite 5 · Tailwind CSS 3 · Framer Motion · GSAP ScrollTrigger · Swiper · Lenis (smooth scroll)

---

## Quick start

```bash
npm install
npm run dev
```

Vite opens the site on **http://localhost:5173** with hot module replacement.

### Production build

```bash
npm run build      # outputs ./dist
npm run preview    # serves the build at http://localhost:4173
```

---

## Architecture

```
ramenlab/
├── index.html                  ← Google Fonts preconnect + meta
├── tailwind.config.js          ← brand palette, custom shadows + keyframes
├── vite.config.js              ← code-splitting (react / anim / swiper chunks)
└── src/
    ├── main.jsx                ← React root
    ├── App.jsx                 ← Composes the page; mounts Lenis once loaded
    ├── index.css               ← Tailwind layers + global components (glass, brush, btn-neon, masonry…)
    │
    ├── data/content.js         ← All copy + curated Unsplash image URLs
    ├── hooks/useLenis.js       ← Bridges Lenis smooth scroll into GSAP ScrollTrigger
    │
    └── components/
        ├── LoadingScreen.jsx   ← Curtain reveal + kanji + counter (2.4s)
        ├── Navbar.jsx          ← Fixed header, kanji-on-hover, mobile sheet
        ├── Hero.jsx            ← Swiper background, mouse-glow, parallax content
        ├── FeaturedRamen.jsx   ← Auto-rotating ramen showcase with thumbs
        ├── Story.jsx           ← Two-image parallax + GSAP word-by-word reveal
        ├── MenuHighlights.jsx  ← Hover-reveal cards + marquee strip
        ├── Experience.jsx      ← Horizontal scroll alley + rain + ambient audio
        ├── Gallery.jsx         ← Masonry grid + animated lightbox
        ├── Contact.jsx         ← Neon form, live Tokyo clock (SVG analog), map SVG
        ├── Footer.jsx          ← Floating lantern + animated divider
        │
        ├── CursorTrail.jsx     ← Two-layer cursor + canvas ember trail
        ├── SteamCanvas.jsx     ← Volumetric steam particle system
        ├── RainParticles.jsx   ← Angled rain streaks
        └── FloatingLanterns.jsx← Chochin lanterns with sway animation
```

### Animation strategy

| Concern                          | Library                       |
|----------------------------------|-------------------------------|
| Component enter/exit, hover/tap  | **Framer Motion** (`motion.*`, `AnimatePresence`) |
| Scroll-tied transforms           | **Framer Motion** (`useScroll`, `useTransform`) |
| Scroll-scrubbed text reveal      | **GSAP ScrollTrigger** (with Lenis bridge) |
| Carousel + fade transitions      | **Swiper.js** (Autoplay + EffectFade) |
| Smooth scroll                    | **Lenis** (RAF synced to GSAP ticker) |
| Particle systems (steam, rain, embers, cursor) | **Vanilla Canvas 2D** (cheaper than DOM) |

Two libraries fighting over `requestAnimationFrame` is the #1 cause of janky portfolio sites. The `useLenis` hook explicitly registers Lenis's RAF inside `gsap.ticker` so both are driven by the same clock, and `ScrollTrigger.update` is called on every Lenis scroll event.

### Color palette

| Token       | Hex      | Use                                  |
|-------------|----------|--------------------------------------|
| `ink`       | #0F0F0F  | Page bg, body                        |
| `soot`      | #151515  | Alternate sections, cards            |
| `crimson`   | #E63946  | Primary accent, neon, brush stamps   |
| `gold`      | #FFB703  | Secondary accent, prices, clock min  |
| `bone`      | #F1FAEE  | Body text, foreground                |
| `jade`      | #2A9D8F  | Tertiary accent, "open" status       |

### Typography

- **Cormorant Garamond** — editorial display headlines (`font-display`)
- **Noto Serif JP** — Japanese characters and vertical kanji decorations (`font-japanese`)
- **Inter** — body / UI default
- **JetBrains Mono** — labels, prices, numbers, eyebrow text

All four are loaded from Google Fonts with `preconnect` and `display=swap`.

---

## Performance notes

- Unsplash URLs use `?auto=format&w=…&fm=webp` so the CDN ships pre-resized WebP — average payload is **~4 MB** for ~20 images.
- All `<img>` tags below the hero use `loading="lazy"` and `decoding="async"`.
- Vite's manual chunks split vendor code into `vendor-react`, `vendor-anim`, `vendor-swiper` so cache hits dominate after the first load.
- Canvas particle systems pause when `document.hidden` becomes true.
- Heavy filters (`backdrop-blur`, `mix-blend-mode: overlay`) are confined to small overlay layers, not the whole page.
- Cursor effects are gated behind `(pointer: coarse)` media query — phones use the system cursor.

## Customizing

- **Swap photography:** edit `src/data/content.js`. The Unsplash photo IDs sit in `u(...)` calls — replace just the ID, the resizing wrapper handles the rest.
- **Adjust palette:** update `tailwind.config.js` → `theme.extend.colors`. Re-run dev server.
- **Change copy:** all marketing strings live in `content.js` (`storyParagraphs`, `testimonials`, `featuredRamen[].tagline`, etc.).
- **Tune the loading time:** in `src/components/LoadingScreen.jsx` change `const total = 2400;`.

## Browser support

Tested in Chromium 120+, Firefox 121+, Safari 17+. The grain overlay uses `mix-blend-mode: overlay` which falls back gracefully in older engines.

## License

Code: MIT. Photography: Unsplash license (royalty-free). Brand name "Ramen Lab" is fictitious.
