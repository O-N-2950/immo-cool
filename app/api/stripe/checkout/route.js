/**
 * POST /api/stripe/checkout
 * 
 * Creates a Stripe Checkout session for lease commission payment.
 * 
 * PLAN B FLOW:
 * - Landlord pays 50% of first month's rent to immo.cool
 * - Tenant pays NOTHING (GRATUIT)
 * - Payment goes 100% to immo.cool platform (no connected account split)
 * 
 * Body: {
 *   landlordEmail, landlordId, landlordName,
 *   propertyAddress, propertyId,
 *   monthlyRent (in CHF),
 *   leaseId
 * }
 * 
 * Returns: { checkoutUrl, sessionId }
 */

import { NextResponse } from 'next/server';
import { sanitizeObject, safeErrorResponse } from '@/lib/security';
import stripe, { createMetadata } from '@/lib/stripe';

export async function POST(request) {
  try {
    const rawBody = await request.json(); const body = sanitizeObject(rawBody);
    const {
      landlordEmail,
      landlordId,
      landlordName,
      propertyAddress,
      propertyId,
      monthlyRent,
      leaseId,
    } = body;

    if (!landlordEmail || !monthlyRent || !leaseId) {
      return NextResponse.json(
        { error: 'landlordEmail, monthlyRent, and leaseId are required' },
        { status: 400 }
      );
    }

    // Commission = 50% of first month's rent (in centimes)
    const commissionAmount = Math.round(monthlyRent * 0.50 * 100);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: landlordEmail,
      currency: 'chf',
      line_items: [
        {
          price_data: {
            currency: 'chf',
            unit_amount: commissionAmount,
            product_data: {
              name: `Commission immo.cool — Bail signé`,
              description: `50% du premier loyer (CHF ${monthlyRent}/mois) — ${propertyAddress || 'Propriété'}`,
              metadata: createMetadata({
                type: 'lease_commission',
                property_id: propertyId || '',
                lease_id: leaseId,
              }),
            },
          },
          quantity: 1,
        },
      ],
      metadata: createMetadata({
        type: 'lease_commission',
        landlord_id: landlordId || '',
        landlord_name: landlordName || '',
        landlord_email: landlordEmail,
        property_id: propertyId || '',
        property_address: propertyAddress || '',
        lease_id: leaseId,
        monthly_rent: String(monthlyRent),
        commission_rate: '0.50',
      }),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.immocool.ch'}/dashboard?payment=success&lease=${leaseId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.immocool.ch'}/dashboard?payment=cancelled&lease=${leaseId}`,
    });

    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });

  } catch (error) {
    const safe = safeErrorResponse(error); return NextResponse.json({ error: safe.error }, { status: safe.status });
  }
}
