/**
 * /api/cantonal — Public API for cantonal rules
 * 
 * GET /api/cantonal?canton=JU → Get all rules for a canton
 * GET /api/cantonal?canton=VD&action=termination → Get termination dates
 * GET /api/cantonal?canton=VD&action=checklist → Get compliance checklist
 * GET /api/cantonal?canton=VD&action=rentReduction&currentRent=1200&rateAtStart=1.75
 */

import { NextResponse } from 'next/server';
import {
  getCantonRules,
  getNextTerminationDates,
  getComplianceChecklist,
  calculateRentReduction,
  calculateMaxDeposit,
  generateInitialRentFormData,
  getRomandieCantons,
  REFERENCE_RATE,
  CANTONS,
} from '@/lib/cantonal-rules';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const canton = searchParams.get('canton');
  const action = searchParams.get('action');

  try {
    // List all cantons
    if (!canton) {
      if (action === 'romandie') {
        return NextResponse.json({ cantons: getRomandieCantons() });
      }
      return NextResponse.json({
        referenceRate: REFERENCE_RATE,
        cantons: Object.values(CANTONS).map(c => ({
          code: c.code,
          name: c.name,
          language: c.language,
          initialRentFormRequired: c.initialRentFormRequired,
          penurieLogement: c.penurieLogement,
        })),
      });
    }

    const rules = getCantonRules(canton);

    switch (action) {
      case 'termination': {
        const dates = getNextTerminationDates(canton);
        return NextResponse.json({
          canton: rules.name,
          cantonCode: rules.code,
          noticePeriodMonths: rules.terminationNotice,
          nextDates: dates.map(d => d.toISOString().split('T')[0]),
          raw: rules.terminationDates,
        });
      }

      case 'checklist': {
        return NextResponse.json({
          canton: rules.name,
          checklist: getComplianceChecklist(canton),
        });
      }

      case 'rentReduction': {
        const currentRent = parseFloat(searchParams.get('currentRent') || '0');
        const rateAtStart = parseFloat(searchParams.get('rateAtStart') || REFERENCE_RATE.previous);
        const reduction = calculateRentReduction(currentRent, rateAtStart);
        return NextResponse.json({
          canton: rules.name,
          reduction,
          referenceRate: REFERENCE_RATE,
        });
      }

      case 'deposit': {
        const rent = parseFloat(searchParams.get('rent') || '0');
        const charges = parseFloat(searchParams.get('charges') || '0');
        return NextResponse.json({
          canton: rules.name,
          maxDeposit: calculateMaxDeposit(canton, rent, charges),
          maxMonths: rules.depositMax,
          monthlyTotal: rent + charges,
        });
      }

      case 'initialRentForm': {
        const formData = generateInitialRentFormData({
          cantonCode: canton,
          newRent: searchParams.get('newRent'),
          newCharges: searchParams.get('newCharges'),
          previousRent: searchParams.get('previousRent'),
          previousCharges: searchParams.get('previousCharges'),
          previousRentDate: searchParams.get('previousRentDate'),
          referenceRateAtPreviousRent: searchParams.get('rateAtPreviousRent'),
          leaseStartDate: searchParams.get('leaseStartDate'),
          landlordName: searchParams.get('landlordName'),
          tenantName: searchParams.get('tenantName'),
          propertyAddress: searchParams.get('propertyAddress'),
        });
        return NextResponse.json(formData);
      }

      default: {
        // Return full canton info
        const nextDates = getNextTerminationDates(canton);
        return NextResponse.json({
          ...rules,
          referenceRate: REFERENCE_RATE,
          nextTerminationDates: nextDates.map(d => d.toISOString().split('T')[0]),
          complianceChecklist: getComplianceChecklist(canton),
        });
      }
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
