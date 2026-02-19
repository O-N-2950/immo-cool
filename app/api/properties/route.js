/**
 * /api/properties — CRUD for rental properties
 * 
 * GET    → List properties (with filters)
 * POST   → Create property (landlord only)
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCantonRules, requiresInitialRentForm, getComplianceChecklist } from '@/lib/cantonal-rules';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const canton = searchParams.get('canton');
    const city = searchParams.get('city');
    const minRooms = searchParams.get('minRooms');
    const maxRent = searchParams.get('maxRent');
    const status = searchParams.get('status') || 'ACTIVE';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where = { status };
    if (canton) where.canton = canton.toUpperCase();
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (minRooms) where.rooms = { gte: parseFloat(minRooms) };
    if (maxRent) where.monthlyRent = { lte: parseFloat(maxRent) };

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        include: { owner: { select: { firstName: true, lastName: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    // Enrich with cantonal info
    const enriched = properties.map(p => ({
      ...p,
      cantonInfo: {
        name: getCantonRules(p.canton).name,
        initialRentFormRequired: requiresInitialRentForm(p.canton),
      },
    }));

    return NextResponse.json({
      properties: enriched,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('[immo.cool] Properties GET error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      ownerId, type, title, description,
      street, streetNumber, postalCode, city, canton, floor,
      rooms, surface, balcony, parking, elevator, laundry, dishwasher,
      monthlyRent, charges, deposit, images, availableFrom,
      buildingYear, lastRenovation, previousRent, previousRentDate,
    } = body;

    if (!ownerId || !monthlyRent || !canton || !rooms || !street || !city || !postalCode) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants: ownerId, monthlyRent, canton, rooms, street, city, postalCode' },
        { status: 400 }
      );
    }

    // Validate canton
    let cantonRules;
    try {
      cantonRules = getCantonRules(canton);
    } catch {
      return NextResponse.json({ error: `Canton invalide: ${canton}` }, { status: 400 });
    }

    // Create property
    const property = await prisma.property.create({
      data: {
        ownerId,
        type: type || 'APARTMENT',
        title: title || `${rooms} pièces — ${city}`,
        description,
        street, streetNumber, postalCode, city,
        canton: canton.toUpperCase(),
        floor,
        rooms: parseFloat(rooms),
        surface: surface ? parseFloat(surface) : null,
        balcony: !!balcony,
        parking: !!parking,
        elevator: !!elevator,
        laundry: !!laundry,
        dishwasher: !!dishwasher,
        monthlyRent: parseFloat(monthlyRent),
        charges: parseFloat(charges || 0),
        deposit: deposit || 3,
        images: images || [],
        availableFrom: new Date(availableFrom || Date.now()),
        buildingYear,
        lastRenovation,
        previousRent: previousRent ? parseFloat(previousRent) : null,
        previousRentDate: previousRentDate ? new Date(previousRentDate) : null,
        status: 'ACTIVE',
      },
    });

    // Generate compliance checklist
    const checklist = getComplianceChecklist(canton);

    // Log
    await prisma.auditLog.create({
      data: {
        userId: ownerId,
        action: 'property.created',
        entityType: 'Property',
        entityId: property.id,
        details: { canton, monthlyRent, rooms, city },
      },
    });

    return NextResponse.json({
      property,
      cantonInfo: {
        name: cantonRules.name,
        initialRentFormRequired: cantonRules.initialRentFormRequired,
        checklist,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('[immo.cool] Properties POST error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
