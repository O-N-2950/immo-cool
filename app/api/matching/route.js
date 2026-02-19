/**
 * /api/matching — Intelligent matching engine
 * 
 * GET /api/matching?propertyId=xxx → Rank tenants for a property
 * GET /api/matching?tenantId=xxx   → Find best properties for a tenant
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { rankTenants, findBestProperties, calculateTenantScore } from '@/lib/matching';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const tenantId = searchParams.get('tenantId');

    if (propertyId) {
      // Rank tenants for a property (landlord view)
      const property = await prisma.property.findUnique({ where: { id: propertyId } });
      if (!property) return NextResponse.json({ error: 'Propriété introuvable' }, { status: 404 });

      const tenantProfiles = await prisma.tenantProfile.findMany({
        where: {
          OR: [
            { preferredCantons: { has: property.canton } },
            { preferredCities: { has: property.city } },
          ],
        },
        include: { user: { select: { firstName: true, lastName: true, email: true, avatarUrl: true } } },
      });

      const ranked = rankTenants(tenantProfiles, property);

      return NextResponse.json({
        property: { id: property.id, title: property.title, city: property.city },
        matches: ranked.map(r => ({
          tenant: {
            id: r.tenantProfile.id,
            name: `${r.tenantProfile.user.firstName} ${r.tenantProfile.user.lastName}`,
            avatar: r.tenantProfile.user.avatarUrl,
            score: r.tenantProfile.score,
          },
          matchScore: r.score,
          recommendation: r.recommendation,
          breakdown: r.breakdown,
        })),
        total: ranked.length,
      });
    }

    if (tenantId) {
      // Find best properties for a tenant
      const tenantProfile = await prisma.tenantProfile.findUnique({
        where: { id: tenantId },
        include: { user: { select: { firstName: true, lastName: true } } },
      });
      if (!tenantProfile) return NextResponse.json({ error: 'Profil locataire introuvable' }, { status: 404 });

      const properties = await prisma.property.findMany({
        where: {
          status: 'ACTIVE',
          canton: { in: tenantProfile.preferredCantons.length > 0 ? tenantProfile.preferredCantons : undefined },
        },
        include: { owner: { select: { firstName: true, lastName: true } } },
      });

      const matches = findBestProperties(tenantProfile, properties);

      return NextResponse.json({
        tenant: {
          id: tenantProfile.id,
          name: `${tenantProfile.user.firstName} ${tenantProfile.user.lastName}`,
          score: tenantProfile.score,
        },
        matches: matches.map(m => ({
          property: {
            id: m.property.id,
            title: m.property.title,
            city: m.property.city,
            canton: m.property.canton,
            rooms: m.property.rooms,
            rent: m.property.monthlyRent,
            images: m.property.images,
          },
          matchScore: m.score,
          recommendation: m.recommendation,
          breakdown: m.breakdown,
        })),
        total: matches.length,
      });
    }

    return NextResponse.json({ error: 'Paramètre propertyId ou tenantId requis' }, { status: 400 });
  } catch (error) {
    console.error('[immo.cool] Matching error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/matching — Create an application (tenant applies to property)
 */
export async function POST(request) {
  try {
    const { propertyId, tenantProfileId, message } = await request.json();

    if (!propertyId || !tenantProfileId) {
      return NextResponse.json({ error: 'propertyId et tenantProfileId requis' }, { status: 400 });
    }

    // Check existing application
    const existing = await prisma.application.findUnique({
      where: { propertyId_tenantProfileId: { propertyId, tenantProfileId } },
    });
    if (existing) {
      return NextResponse.json({ error: 'Candidature déjà existante' }, { status: 409 });
    }

    // Get profile and property for scoring
    const [tenantProfile, property] = await Promise.all([
      prisma.tenantProfile.findUnique({ where: { id: tenantProfileId } }),
      prisma.property.findUnique({ where: { id: propertyId } }),
    ]);

    if (!tenantProfile || !property) {
      return NextResponse.json({ error: 'Profil ou propriété introuvable' }, { status: 404 });
    }

    const { calculateMatchScore } = await import('@/lib/matching');
    const { score } = calculateMatchScore(tenantProfile, property);

    const application = await prisma.application.create({
      data: {
        propertyId,
        tenantProfileId,
        message,
        matchScore: score,
        status: 'PENDING',
      },
    });

    // Log
    await prisma.auditLog.create({
      data: {
        userId: tenantProfile.userId,
        action: 'application.created',
        entityType: 'Application',
        entityId: application.id,
        details: { propertyId, matchScore: score },
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error('[immo.cool] Application error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
