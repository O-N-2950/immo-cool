/**
 * POST /api/reverse — Créer une demande locataire (reverse marketplace)
 * GET  /api/reverse — Lister les demandes actives (pour les propriétaires)
 */

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma.js';

// GET — Liste des demandes actives
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const canton = url.searchParams.get('canton');
    const rooms = url.searchParams.get('rooms');

    const where = {
      status: 'ACTIVE',
      expiresAt: { gt: new Date() },
    };
    if (canton) where.canton = canton;
    if (rooms) where.rooms = parseFloat(rooms);

    const requests = await prisma.searchRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        canton: true,
        city: true,
        rooms: true,
        maxBudget: true,
        description: true,
        moveInDate: true,
        verified: true,
        viewCount: true,
        createdAt: true,
        firstName: true,
        // PAS email/phone (privacy)
      },
    });

    return NextResponse.json({ requests, total: requests.length });
  } catch (e) {
    console.error('[REVERSE] GET error:', e.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST — Publier une demande
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, phone, firstName, canton, city, rooms, maxBudget, description, moveInDate } = body;

    // Validation
    if (!email || !canton) {
      return NextResponse.json({ error: 'Email et canton requis' }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    // Anti-spam : max 3 demandes actives par email
    const existing = await prisma.searchRequest.count({
      where: { email, status: 'ACTIVE' },
    });
    if (existing >= 3) {
      return NextResponse.json(
        { error: 'Maximum 3 demandes actives par email' },
        { status: 429 }
      );
    }

    // Créer la demande (expire dans 30 jours)
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
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({
      success: true,
      id: searchRequest.id,
      message: 'Votre demande a été publiée. Les propriétaires pourront vous contacter.',
    }, { status: 201 });
  } catch (e) {
    console.error('[REVERSE] POST error:', e.message);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
