/**
 * POST /api/stripe/webhook
 * 
 * Handles Stripe webhooks for immo.cool.
 * CRITICAL: Filters events by metadata.app === 'immo_cool'
 * to ignore PEP's V2 events on the same Stripe account.
 * 
 * Handled events:
 * - checkout.session.completed → Mark lease as paid / artisan as paid
 * - account.updated → Track landlord/artisan Connect onboarding status
 * - payment_intent.succeeded → Confirm payment
 * - payment_intent.payment_failed → Alert on failure
 */

import { NextResponse } from 'next/server';
import { stripe, isImmoCoolObject } from '@/lib/stripe';

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    let event;

    // Verify webhook signature
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      try {
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.error('[immo.cool] Webhook signature verification failed:', err.message);
        return NextResponse.json(
          { error: 'Webhook signature verification failed' },
          { status: 400 }
        );
      }
    } else {
      event = JSON.parse(body);
    }

    const obj = event.data.object;

    // ============================================
    // CRITICAL FILTER: Only process immo.cool events
    // Ignore PEP's V2 events on same Stripe account
    // ============================================
    if (!isImmoCoolObject(obj)) {
      // Not our event — acknowledge but don't process
      return NextResponse.json({ received: true, filtered: true, reason: 'not_immo_cool' });
    }

    console.log(`[immo.cool] Webhook: ${event.type} — ${obj.id}`);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = obj;
        const paymentType = session.metadata?.type;

        if (paymentType === 'lease_commission') {
          // Landlord paid 50% commission → activate lease
          console.log(`[immo.cool] ✅ Lease commission paid: ${session.metadata.lease_id}`);
          console.log(`  Landlord: ${session.metadata.landlord_name} (${session.metadata.landlord_email})`);
          console.log(`  Property: ${session.metadata.property_address}`);
          console.log(`  Rent: CHF ${session.metadata.monthly_rent}/mois`);
          console.log(`  Commission: CHF ${session.amount_total / 100}`);
          
          // TODO: Update lease status in DB → 'active'
          // TODO: Send confirmation email to landlord + tenant
          // TODO: Trigger état des lieux creation

        } else if (paymentType === 'artisan_intervention') {
          // Artisan intervention paid → confirm to all parties
          console.log(`[immo.cool] 🔧 Artisan payment: ${session.metadata.artisan_name}`);
          console.log(`  Total: CHF ${session.metadata.amount_total}`);
          console.log(`  Platform fee: CHF ${session.metadata.platform_fee}`);
          
          // TODO: Update intervention status in DB → 'paid'
          // TODO: Notify artisan
          // TODO: Notify tenant (confirmation)
        }
        break;
      }

      case 'account.updated': {
        // Connected account status change (landlord or artisan)
        const account = obj;
        console.log(`[immo.cool] Account updated: ${account.id}`);
        console.log(`  Charges enabled: ${account.charges_enabled}`);
        console.log(`  Payouts enabled: ${account.payouts_enabled}`);
        console.log(`  Role: ${account.metadata?.role}`);
        
        // TODO: Update landlord/artisan status in DB
        break;
      }

      case 'payment_intent.succeeded': {
        console.log(`[immo.cool] ✅ Payment succeeded: ${obj.id} — CHF ${obj.amount / 100}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        console.error(`[immo.cool] ❌ Payment failed: ${obj.id}`);
        console.error(`  Reason: ${obj.last_payment_error?.message}`);
        
        // TODO: Notify landlord/tenant of failure
        // TODO: Update payment status in DB
        break;
      }

      default:
        console.log(`[immo.cool] Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true, processed: true });

  } catch (error) {
    console.error('[immo.cool] Webhook error:', error.message);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Disable body parsing for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};
