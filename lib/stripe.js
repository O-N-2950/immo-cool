/**
 * immo.cool — Stripe Integration Layer
 * 
 * ARCHITECTURE:
 * Same Stripe account shared with PEP's V2.
 * Every Stripe object (customer, payment, checkout, transfer) is tagged with:
 *   metadata.app = "immo_cool"
 *   metadata.app_display = "immo.cool"
 * 
 * This allows filtering in Stripe Dashboard and webhooks to distinguish
 * immo.cool transactions from PEP's V2.
 * 
 * PAYMENT FLOW (Plan B):
 * 1. Landlord signs up → Stripe Connect onboarding (connected account)
 * 2. Lease signed → Checkout session: tenant pays 50% of first rent
 *    - 50% goes to immo.cool platform (application_fee_amount)
 *    - 0% to landlord (no payment to landlord on commission)
 * 3. Monthly rent → Direct transfer tenant → landlord (immo.cool not involved)
 * 4. Artisan intervention → Checkout: tenant pays artisan
 *    - 10% commission to immo.cool (application_fee_amount)
 *    - 90% to artisan connected account
 */

import Stripe from 'stripe';

let _stripe = null;

function getStripe() {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('[immo.cool] STRIPE_SECRET_KEY not configured');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
      appInfo: {
        name: 'immo.cool',
        version: '1.0.0',
        url: 'https://www.immocool.ch',
      },
    });
  }
  return _stripe;
}

// Project metadata — attached to EVERY Stripe object
const APP_METADATA = {
  app: process.env.STRIPE_PRODUCT_PREFIX || 'immo_cool',
  app_display: process.env.APP_DISPLAY_NAME || 'immo.cool',
  platform: 'immo.cool',
};

/**
 * Create metadata for any Stripe object, merging app identity with custom data
 */
export function createMetadata(custom = {}) {
  return {
    ...APP_METADATA,
    ...custom,
  };
}

/**
 * Check if a Stripe object belongs to immo.cool (vs PEP's V2)
 */
export function isImmoCoolObject(stripeObject) {
  return stripeObject?.metadata?.app === 'immo_cool';
}

// Export getter instead of instance
export const stripe = new Proxy({}, {
  get(_, prop) {
    return getStripe()[prop];
  }
});

export { APP_METADATA };
export default stripe;
