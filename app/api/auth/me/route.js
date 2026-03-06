/**
 * GET /api/auth/me — Profil utilisateur connecté
 */
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma.js';
import { authenticate } from '../../../../lib/auth.js';

export async function GET(request) {
  const payload = await authenticate(request);
  if (!payload) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true, email: true, role: true, firstName: true, lastName: true,
        phone: true, status: true, stripeOnboarded: true, stripeConnectId: true,
        tenantProfile: { select: { score: true, maxBudget: true, preferredCantons: true } },
        artisanProfile: { select: { companyName: true, specialties: true, avgRating: true } },
        _count: { select: { properties: true, leasesAsLandlord: true } },
      },
    });

    if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    return NextResponse.json({ user });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
