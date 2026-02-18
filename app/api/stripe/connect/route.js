/**
 * POST /api/stripe/connect
 * 
 * Creates a Stripe Connect account for a landlord and returns
 * the onboarding URL. The landlord completes KYC on Stripe's hosted page.
 * 
 * Body: { email, landlordId, landlordName }
 * Returns: { accountId, onboardingUrl }
 */

import { NextResponse } from 'next/server';
import stripe, { createMetadata } from '@/lib/stripe';

export async function POST(request) {
  try {
    const { email, landlordId, landlordName } = await request.json();

    if (!email || !landlordId) {
      return NextResponse.json(
        { error: 'Email and landlordId are required' },
        { status: 400 }
      );
    }

    // Create connected account for the landlord
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'CH',
      email,
      capabilities: {
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: createMetadata({
        landlord_id: landlordId,
        landlord_name: landlordName || '',
        role: 'landlord',
      }),
    });

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/owner?stripe=refresh`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/owner?stripe=success&account=${account.id}`,
      type: 'account_onboarding',
    });

    return NextResponse.json({
      accountId: account.id,
      onboardingUrl: accountLink.url,
    });

  } catch (error) {
    console.error('[immo.cool] Stripe Connect error:', error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/stripe/connect?accountId=acct_xxx
 * 
 * Check status of a connected account
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'accountId is required' },
        { status: 400 }
      );
    }

    const account = await stripe.accounts.retrieve(accountId);

    return NextResponse.json({
      id: account.id,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
      email: account.email,
      metadata: account.metadata,
    });

  } catch (error) {
    console.error('[immo.cool] Stripe account check error:', error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
