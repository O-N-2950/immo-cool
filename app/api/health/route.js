/**
 * GET /api/health
 * 
 * Health check endpoint for Railway monitoring.
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'immo.cool',
    timestamp: new Date().toISOString(),
    stripe: !!process.env.STRIPE_SECRET_KEY,
    env: process.env.NODE_ENV,
  });
}
