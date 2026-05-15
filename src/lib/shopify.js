/**
 * Shopify Storefront API client (stub-friendly).
 *
 * Reads:
 *   VITE_SHOPIFY_DOMAIN          e.g. ramenlab.myshopify.com (NO https://)
 *   VITE_SHOPIFY_STOREFRONT_TOKEN  public Storefront API token
 *   VITE_SHOPIFY_API_VERSION     defaults to 2025-01
 *
 * If env vars are missing, every function resolves to `null` and emits a
 * one-time console warning — components can treat that as "not connected
 * yet" and fall back to a mock or hide the buy button.
 *
 * Use cases this stub is shaped for:
 *   - createCart() + addLineToCart() for the Build-Your-Bowl flow
 *   - querySellingPlans() for subscription tiers (monthly box)
 *   - createCheckout() to hand off to Shopify-hosted checkout
 */

const env = import.meta.env || {};
const DOMAIN = env.VITE_SHOPIFY_DOMAIN;
const TOKEN = env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = env.VITE_SHOPIFY_API_VERSION || '2025-01';

export const shopifyEnabled = Boolean(DOMAIN && TOKEN);

let warned = false;
function warnUnconfigured() {
  if (warned) return;
  warned = true;
  console.warn(
    '[shopify] Storefront API not configured — set VITE_SHOPIFY_DOMAIN ' +
    'and VITE_SHOPIFY_STOREFRONT_TOKEN to enable cart/checkout.'
  );
}

async function shopifyFetch(query, variables) {
  if (!shopifyEnabled) {
    warnUnconfigured();
    return null;
  }
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
      Accept: 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    console.error('[shopify] HTTP', res.status, await res.text());
    return null;
  }
  const json = await res.json();
  if (json.errors) {
    console.error('[shopify] errors', json.errors);
    return null;
  }
  return json.data;
}

/** Create a new cart, optionally with line items. Returns { id, checkoutUrl } or null. */
export async function createCart(lines = []) {
  const data = await shopifyFetch(
    `mutation CartCreate($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart { id checkoutUrl }
        userErrors { field message }
      }
    }`,
    { lines }
  );
  return data?.cartCreate?.cart ?? null;
}

/** Add a single line to an existing cart. */
export async function addToCart(cartId, merchandiseId, quantity = 1, sellingPlanId) {
  const line = { merchandiseId, quantity };
  if (sellingPlanId) line.sellingPlanId = sellingPlanId;
  const data = await shopifyFetch(
    `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { id checkoutUrl totalQuantity }
        userErrors { field message }
      }
    }`,
    { cartId, lines: [line] }
  );
  return data?.cartLinesAdd?.cart ?? null;
}

/** Look up a product (and its subscription selling plans) by handle. */
export async function getProductByHandle(handle) {
  const data = await shopifyFetch(
    `query Product($handle: String!) {
      product(handle: $handle) {
        id title handle description
        priceRange { minVariantPrice { amount currencyCode } }
        images(first: 4) { edges { node { url altText } } }
        variants(first: 8) {
          edges {
            node {
              id title availableForSale
              price { amount currencyCode }
              sellingPlanAllocations(first: 4) {
                edges { node { sellingPlan { id name } } }
              }
            }
          }
        }
        sellingPlanGroups(first: 4) {
          edges { node { name sellingPlans(first: 4) { edges { node { id name } } } } }
        }
      }
    }`,
    { handle }
  );
  return data?.product ?? null;
}
