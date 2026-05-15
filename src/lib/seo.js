/**
 * Central site metadata.
 *
 * Read by:
 *   - `index.html` (statically — keep meta tags + JSON-LD in sync if you
 *     change site identity)
 *   - `src/lib/analytics.js` (event payload context)
 *   - Future generators (sitemap, RSS, OG images)
 *
 * When the brand pivots from "restaurant" to "subscription box", swap
 * `schema.type` from 'Restaurant' to 'Product' (or add a second schema
 * object) — the rest stays the same.
 */
export const SEO = {
  name: 'Ramen Lab',
  legalName: 'Ramen Lab',
  tagline: 'Crafted Bowls. Tokyo Soul.',
  description:
    'Ramen Lab — A cinematic Japanese ramen experience. Twelve-hour broths, hand-pulled noodles, and the obsessive soul of a Shinjuku alley shop.',
  shortDescription: 'Crafted bowls, Tokyo soul.',
  // Update once domain is live.
  url: import.meta.env?.VITE_SITE_URL || 'https://ramenlab.vercel.app',
  locale: 'en_US',
  // Drop an actual og image at /public/og-image.jpg (1200x630).
  ogImage: '/og-image.jpg',
  twitter: '@ramenlab',
  themeColor: '#0F0F0F',

  // Set once known.
  social: {
    instagram: 'https://instagram.com/ramenlab',
    tiktok: 'https://tiktok.com/@ramenlab',
    x: 'https://x.com/ramenlab',
    youtube: 'https://youtube.com/@ramenlab',
  },

  // schema.org JSON-LD shape — current brand is a restaurant. For a
  // subscription box, switch type to 'Product' or 'Organization'.
  schema: {
    type: 'Restaurant',
    address: {
      streetAddress: '3-7-2 Nishi-Shinjuku',
      addressLocality: 'Tokyo',
      postalCode: '160-0023',
      addressCountry: 'JP',
    },
    telephone: '+81-3-1234-5678',
    priceRange: '$$',
    servesCuisine: ['Japanese', 'Ramen'],
    openingHours: [
      'Mo-Th 17:00-24:00',
      'Fr-Sa 17:00-26:00',
    ],
  },
};
