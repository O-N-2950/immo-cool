/**
 * /api/reverse — Reverse Marketplace
 * 
 * GET  — Liste les demandes actives (filtres: canton, rooms)
 * POST — Publie une nouvelle demande locataire
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/reverse?canton=JU&rooms=3.5&page=1
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const canton = searchParams.get('canton');
    const rooms = searchParams.get('rooms');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const skip = (page - 1) * limit;

    const where = {
      status: 'ACTIVE',
      expiresAt: { gt: new Date() },
    };

    if (canton) where.canton = canton;
    if (rooms) where.rooms = parseFloat(rooms);

    const [requests, total] = await Promise.all([
      prisma.searchRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          canton: true,
          city: true,
          rooms: true,
          maxBudget: true,
          description: true,
          moveInDate: true,
          verified: true,
          firstName: true,
          viewCount: true,
          responseCount: true,
          createdAt: true,
          // Ne PAS exposer email/phone/userId
        },
      }),
      prisma.searchRequest.count({ where }),
    ]);

    return NextResponse.json({
      requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[immo.cool] Reverse GET error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/reverse
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, phone, firstName, canton, city, rooms, maxBudget, description, moveInDate } = body;

    // Validation
    if (!email || !canton) {
      return NextResponse.json(
        { error: 'Email et canton sont requis' },
        { status: 400 }
      );
    }

    // Validation email basique
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    // Limiter: max 3 demandes actives par email
    const activeCount = await prisma.searchRequest.count({
      where: {
        email,
        status: 'ACTIVE',
        expiresAt: { gt: new Date() },
      },
    });

    if (activeCount >= 3) {
      return NextResponse.json(
        { error: 'Maximum 3 demandes actives par email. Fermez une demande existante.' },
        { status: 429 }
      );
    }

    // Expiration dans 30 jours
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const searchRequest = await prisma.searchRequest.create({
      data: {
        email,
        phone: phone || null,
        firstName: firstName || null,
        canton,
        city: city || null,
        rooms: rooms ? parseFloat(rooms) : null,
        maxBudget: maxBudget ? parseFloat(maxBudget) : null,
        description: description || null,
        moveInDate: moveInDate ? new Date(moveInDate) : null,
        expiresAt,
      },
    });

    // Audit
    await prisma.auditLog.create({
      data: {
        action: 'search_request.created',
        entityType: 'SearchRequest',
        entityId: searchRequest.id,
        details: { canton, city, rooms, email: email.replace(/(.{2}).*(@.*)/, '$1***$2') },
      },
    }).catch(() => {}); // Non-blocking

    return NextResponse.json({
      id: searchRequest.id,
      message: 'Demande publiée ! Les propriétaires pourront vous contacter.',
      expiresAt: searchRequest.expiresAt,
    }, { status: 201 });
  } catch (error) {
    console.error('[immo.cool] Reverse POST error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
