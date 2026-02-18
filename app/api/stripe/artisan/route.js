/**
 * POST /api/stripe/artisan
 * 
 * Creates a Stripe Checkout for artisan intervention payment.
 * Uses Stripe Connect: 90% to artisan, 10% to immo.cool.
 * 
 * Body: {
 *   artisanConnectAccountId (Stripe connected account),
 *   artisanName,
 *   interventionType (plomberie, électricité, peinture, serrurerie),
 *   interventionDescription,
 *   amount (total in CHF),
 *   propertyId,
 *   tenantEmail,
 *   tenantId
 * }
 * 
 * Returns: { checkoutUrl, sessionId }
 */

import { NextResponse } from 'next/server';
import stripe, { createMetadata } from '@/lib/stripe';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      artisanConnectAccountId,
      artisanName,
      interventionType,
      interventionDescription,
      amount,
      propertyId,
      tenantEmail,
      tenantId,
    } = body;

    if (!artisanConnectAccountId || !amount || !tenantEmail) {
      return NextResponse.json(
        { error: 'artisanConnectAccountId, amount, and tenantEmail are required' },
        { status: 400 }
      );
    }

    // 10% commission to immo.cool
    const totalCentimes = Math.round(amount * 100);
    const platformFee = Math.round(totalCentimes * 0.10);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: tenantEmail,
      currency: 'chf',
      line_items: [
        {
          price_data: {
            currency: 'chf',
            unit_amount: totalCentimes,
            product_data: {
              name: `Intervention ${interventionType || 'artisan'} — ${artisanName || 'Artisan'}`,
              description: interventionDescription || `Intervention artisan via immo.cool`,
              metadata: createMetadata({
                type: 'artisan_intervention',
                intervention_type: interventionType || '',
              }),
            },
          },
          quantity: 1,
        },
      ],
      // Stripe Connect: payment goes to artisan, platform takes 10%
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: artisanConnectAccountId,
        },
        metadata: createMetadata({
          type: 'artisan_intervention',
          artisan_name: artisanName || '',
          intervention_type: interventionType || '',
          property_id: propertyId || '',
          tenant_id: tenantId || '',
          commission_rate: '0.10',
        }),
      },
      metadata: createMetadata({
        type: 'artisan_intervention',
        artisan_account: artisanConnectAccountId,
        artisan_name: artisanName || '',
        amount_total: String(amount),
        platform_fee: String(platformFee / 100),
        property_id: propertyId || '',
      }),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/tenant?artisan=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/tenant?artisan=cancelled`,
    });

    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });

  } catch (error) {
    console.error('[immo.cool] Artisan checkout error:', error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
