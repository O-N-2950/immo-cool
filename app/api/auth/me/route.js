/**
 * GET /api/auth/me — Retourne le profil de l'utilisateur connecté
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticate } from '@/lib/auth';

export async function GET(request) {
  try {
    const decoded = await authenticate(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        nationality: true,
        permitType: true,
        stripeOnboarded: true,
        status: true,
        createdAt: true,
        tenantProfile: {
          select: {
            id: true,
            score: true,
            maxBudget: true,
            preferredCantons: true,
            preferredCities: true,
            incomeVerified: true,
            identityVerified: true,
          },
        },
        artisanProfile: {
          select: {
            id: true,
            companyName: true,
            specialties: true,
            cantons: true,
            avgRating: true,
            totalReviews: true,
            available: true,
          },
        },
        properties: {
          where: { status: { not: 'ARCHIVED' } },
          select: { id: true, title: true, status: true, city: true, monthlyRent: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            properties: true,
            leasesAsLandlord: true,
            sentMessages: { where: { read: false } },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('[immo.cool] Auth/me error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
