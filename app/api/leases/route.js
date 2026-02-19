/**
 * /api/leases — Lease management with cantonal compliance
 * 
 * GET    → List leases (for landlord or tenant)
 * POST   → Create lease (generates cantonal-compliant contract)
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateLease, getComplianceChecklist, generateInitialRentFormData, REFERENCE_RATE } from '@/lib/cantonal-rules';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const landlordId = searchParams.get('landlordId');
    const tenantId = searchParams.get('tenantId');
    const status = searchParams.get('status');

    const where = {};
    if (landlordId) where.landlordId = landlordId;
    if (tenantId) where.tenantProfileId = tenantId;
    if (status) where.status = status;

    const leases = await prisma.lease.findMany({
      where,
      include: {
        property: { select: { title: true, city: true, canton: true, street: true, rooms: true } },
        landlord: { select: { firstName: true, lastName: true, email: true } },
        tenant: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ leases });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      propertyId, landlordId, tenantProfileId,
      startDate, endDate, monthlyRent, charges, depositMonths,
    } = body;

    if (!propertyId || !landlordId || !tenantProfileId || !startDate || !monthlyRent) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    // Get property for canton
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return NextResponse.json({ error: 'Propriété introuvable' }, { status: 404 });

    // Validate against cantonal rules
    const validation = validateLease({
      cantonCode: property.canton,
      monthlyRent: parseFloat(monthlyRent),
      charges: parseFloat(charges || 0),
      depositMonths: depositMonths || 3,
      startDate: new Date(startDate),
    });

    if (!validation.valid) {
      return NextResponse.json({
        error: 'Le bail ne respecte pas les règles cantonales',
        violations: validation.errors,
        warnings: validation.warnings,
      }, { status: 422 });
    }

    // Calculate commission (Plan B: 50% first rent)
    const commissionAmount = parseFloat(monthlyRent) * 0.50;

    // Create lease
    const lease = await prisma.lease.create({
      data: {
        propertyId,
        landlordId,
        tenantProfileId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        monthlyRent: parseFloat(monthlyRent),
        charges: parseFloat(charges || 0),
        depositMonths: depositMonths || 3,
        canton: property.canton,
        referenceRate: REFERENCE_RATE.current,
        commissionAmount,
        status: 'DRAFT',
      },
    });

    // Generate checklist
    const checklist = getComplianceChecklist(property.canton);

    // Generate initial rent form data if required
    const landlord = await prisma.user.findUnique({ where: { id: landlordId } });
    const tenant = await prisma.tenantProfile.findUnique({
      where: { id: tenantProfileId },
      include: { user: true },
    });

    const initialRentForm = generateInitialRentFormData({
      cantonCode: property.canton,
      newRent: monthlyRent,
      newCharges: charges,
      previousRent: property.previousRent,
      previousRentDate: property.previousRentDate,
      leaseStartDate: startDate,
      landlordName: `${landlord.firstName} ${landlord.lastName}`,
      tenantName: `${tenant.user.firstName} ${tenant.user.lastName}`,
      propertyAddress: `${property.street} ${property.streetNumber || ''}, ${property.postalCode} ${property.city}`,
    });

    // Update property status
    await prisma.property.update({
      where: { id: propertyId },
      data: { status: 'RENTED' },
    });

    // Log
    await prisma.auditLog.create({
      data: {
        userId: landlordId,
        action: 'lease.created',
        entityType: 'Lease',
        entityId: lease.id,
        details: {
          canton: property.canton,
          monthlyRent,
          commission: commissionAmount,
          tenantProfileId,
        },
      },
    });

    return NextResponse.json({
      lease,
      commission: {
        amount: commissionAmount,
        currency: 'CHF',
        description: `50% du premier loyer (CHF ${monthlyRent}/mois)`,
        paymentRequired: true,
      },
      compliance: {
        validation,
        checklist,
        initialRentForm,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('[immo.cool] Lease creation error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
