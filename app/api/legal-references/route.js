/**
 * API Route: /api/legal-references
 * 
 * GET  — Récupère les références légales actuelles (taux + IPC)
 *         Utilisé par le générateur de bail pour injecter les bonnes valeurs
 * 
 * PUT  — Met à jour une référence (admin seulement)
 *         Body: { type: 'taux_reference'|'ipc', value: number, ... }
 * 
 * POST — Force un refresh depuis les sources officielles
 */

import { NextResponse } from 'next/server';
import {
  getCurrentReferences,
  updateTauxReference,
  updateIPC,
  fetchTauxReference,
  fetchIPC,
  LEGAL_DEFAULTS,
  getNextOflPublicationDates,
  calculateRentAdjustment,
  calculateIPCAdjustment,
} from '@/lib/legal-references';

// En attendant Prisma en production, on utilise un store en mémoire
// qui sera remplacé par prisma quand la DB sera connectée
let memoryStore = {};

const mockPrisma = {
  legalReference: {
    findUnique: async ({ where }) => memoryStore[where.key] || null,
    upsert: async ({ where, update, create }) => {
      const data = memoryStore[where.key]
        ? { ...memoryStore[where.key], ...update, updatedAt: new Date() }
        : { ...create, id: `lr_${Date.now()}`, createdAt: new Date(), updatedAt: new Date() };
      memoryStore[where.key] = data;
      return data;
    },
  },
};

// TODO: Remplacer par le vrai client Prisma quand la DB sera connectée
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
const prisma = mockPrisma;

// ============================================================
// GET /api/legal-references
// ============================================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format'); // 'bail' pour les champs prêts à injecter
    const strict = searchParams.get('strict') === 'true';

    const refs = await getCurrentReferences({
      prisma,
      autoFetch: false,  // Pas de fetch auto en GET pour la perf
      strict,
    });

    // Format simplifié pour le générateur de bail
    if (format === 'bail') {
      return NextResponse.json({
        ...refs.bail_fields,
        warnings: refs.warnings,
      });
    }

    // Format complet pour l'admin
    return NextResponse.json({
      taux_reference: refs.taux_reference,
      ipc: refs.ipc,
      warnings: refs.warnings,
      meta: refs.meta,
      next_ofl_dates: getNextOflPublicationDates(),
      defaults: LEGAL_DEFAULTS,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('périmées') ? 409 : 500 }
    );
  }
}

// ============================================================
// PUT /api/legal-references — Mise à jour admin
// ============================================================
export async function PUT(request) {
  try {
    // TODO: Vérifier l'authentification admin
    // const user = await authenticate(request);
    // if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { type, value, date_effective, month, base } = body;

    if (!type || !value) {
      return NextResponse.json(
        { error: 'Champs requis: type (taux_reference|ipc), value' },
        { status: 400 }
      );
    }

    let result;

    if (type === 'taux_reference') {
      if (!date_effective) {
        return NextResponse.json(
          { error: 'date_effective requise pour le taux de référence (format YYYY-MM-DD)' },
          { status: 400 }
        );
      }
      result = await updateTauxReference(prisma, {
        value: parseFloat(value),
        date_effective,
        updatedBy: 'admin', // TODO: user.email
      });
    } else if (type === 'ipc') {
      if (!month) {
        return NextResponse.json(
          { error: 'month requis pour l\'IPC (format YYYY-MM)' },
          { status: 400 }
        );
      }
      result = await updateIPC(prisma, {
        value: parseFloat(value),
        month,
        base,
        updatedBy: 'admin',
      });
    } else {
      return NextResponse.json(
        { error: 'Type invalide. Valeurs acceptées: taux_reference, ipc' },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

// ============================================================
// POST /api/legal-references — Refresh depuis sources officielles
// ============================================================
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const results = {};

    // Refresh taux de référence
    if (!body.type || body.type === 'taux_reference') {
      const taux = await fetchTauxReference();
      results.taux_reference = taux;
      
      if (taux.success && prisma) {
        await prisma.legalReference.upsert({
          where: { key: 'taux_reference' },
          update: {
            value: taux.value,
            metadata: JSON.stringify({
              source: taux.source,
              fetched_at: taux.fetched_at,
            }),
            updatedBy: 'system-autofetch',
          },
          create: {
            key: 'taux_reference',
            value: taux.value,
            metadata: JSON.stringify({
              source: taux.source,
              fetched_at: taux.fetched_at,
            }),
            updatedBy: 'system-autofetch',
          },
        });
      }
    }

    // Refresh IPC
    if (!body.type || body.type === 'ipc') {
      const ipc = await fetchIPC();
      results.ipc = ipc;

      if (ipc.success && prisma) {
        await prisma.legalReference.upsert({
          where: { key: 'ipc' },
          update: {
            value: ipc.value,
            metadata: JSON.stringify({
              source: ipc.source,
              fetched_at: ipc.fetched_at,
            }),
            updatedBy: 'system-autofetch',
          },
          create: {
            key: 'ipc',
            value: ipc.value,
            metadata: JSON.stringify({
              source: ipc.source,
              fetched_at: ipc.fetched_at,
            }),
            updatedBy: 'system-autofetch',
          },
        });
      }
    }

    return NextResponse.json({
      message: 'Refresh terminé',
      results,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
