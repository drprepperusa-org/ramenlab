/**
 * Vendor-neutral analytics wrapper.
 *
 * - Reads pixel IDs from Vite env vars at build time.
 * - No-ops cleanly if an ID is missing (so dev/preview deploys don't
 *   fire test traffic to production pixels).
 * - Single `trackEvent()` fans out to every configured vendor.
 *
 * Wire IDs in `.env` (or your host's env settings):
 *   VITE_GA4_ID                 e.g. G-XXXXXXXXXX
 *   VITE_META_PIXEL_ID          15-digit Facebook Pixel ID
 *   VITE_GOOGLE_ADS_ID          e.g. AW-1234567890
 *   VITE_GOOGLE_ADS_CONV_LABEL  conversion label (paired with the AW id)
 *   VITE_TIKTOK_PIXEL_ID        optional
 */

const env = import.meta.env || {};
const GA_ID = env.VITE_GA4_ID;
const META_PIXEL_ID = env.VITE_META_PIXEL_ID;
const GADS_ID = env.VITE_GOOGLE_ADS_ID;
const GADS_CONV_LABEL = env.VITE_GOOGLE_ADS_CONV_LABEL;
const TIKTOK_PIXEL_ID = env.VITE_TIKTOK_PIXEL_ID;

let initialized = false;

function loadScript(src, attrs = {}) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

/** Initialize every configured vendor exactly once. Safe to call repeatedly. */
export function initAnalytics() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  // --- Google Analytics 4 + Google Ads (share gtag) ---
  if (GA_ID || GADS_ID) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    if (GA_ID) {
      window.gtag('config', GA_ID, { send_page_view: true });
      loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
    }
    if (GADS_ID) {
      window.gtag('config', GADS_ID);
      if (!GA_ID) loadScript(`https://www.googletagmanager.com/gtag/js?id=${GADS_ID}`);
    }
  }

  // --- Meta (Facebook) Pixel ---
  if (META_PIXEL_ID) {
    /* eslint-disable */
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0;
      t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  // --- TikTok Pixel ---
  if (TIKTOK_PIXEL_ID) {
    /* eslint-disable */
    !(function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = (w[t] = w[t] || []);
      ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
      ttq.setAndDefer = function (e, n) { e[n] = function () { e.push([n].concat(Array.prototype.slice.call(arguments, 0))); }; };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (e) { for (var n = ttq._i[e] || [], i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(n, ttq.methods[i]); return n; };
      ttq.load = function (e, n) {
        var r = 'https://analytics.tiktok.com/i18n/pixel/events.js';
        ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r;
        ttq._t = ttq._t || {}; ttq._t[e] = +new Date(); ttq._o = ttq._o || {}; ttq._o[e] = n || {};
        var o = document.createElement('script'); o.type = 'text/javascript'; o.async = !0; o.src = r + '?sdkid=' + e + '&lib=' + t;
        var a = document.getElementsByTagName('script')[0]; a.parentNode.insertBefore(o, a);
      };
      ttq.load(TIKTOK_PIXEL_ID);
      ttq.page();
    })(window, document, 'ttq');
    /* eslint-enable */
  }
}

/**
 * Fire a custom event to every configured vendor.
 *
 * `name` is the canonical event name (snake_case).
 * `params` is a flat key/value object — vendor-specific keys are added
 * inside this function.
 */
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return;

  // GA4 / Google Ads
  if (window.gtag) {
    window.gtag('event', name, params);
    // Mirror conversions to Google Ads if a label is configured.
    if (GADS_ID && GADS_CONV_LABEL && isConversion(name)) {
      window.gtag('event', 'conversion', {
        send_to: `${GADS_ID}/${GADS_CONV_LABEL}`,
        value: params.value ?? 0,
        currency: params.currency ?? 'USD',
        transaction_id: params.transaction_id ?? '',
      });
    }
  }

  // Meta Pixel — map canonical names to standard events where it makes sense.
  if (window.fbq) {
    const META_MAP = {
      reserve_booked: 'Schedule',
      bowl_built: 'AddToCart',
      gift_sent: 'Purchase',
      dialog_opened: null, // not a standard event
    };
    const metaName = META_MAP[name];
    if (metaName) {
      window.fbq('track', metaName, {
        value: params.value,
        currency: params.currency ?? 'USD',
      });
    } else {
      window.fbq('trackCustom', name, params);
    }
  }

  // TikTok
  if (window.ttq) {
    window.ttq.track(name, params);
  }
}

function isConversion(name) {
  return name === 'gift_sent' || name === 'reserve_booked' || name === 'purchase';
}
