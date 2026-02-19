/**
 * POST /api/auth/register
 * 
 * Register a new user (landlord, tenant, or artisan)
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { calculateTenantScore } from '@/lib/matching';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      email, password, role, firstName, lastName, phone,
      nationality, permitType, birthDate,
      // Tenant-specific
      monthlyIncome, employmentType, employer, maxBudget,
      minRooms, maxRooms, preferredCantons, preferredCities, moveInDate,
      // Artisan-specific
      companyName, specialties, cantons, hourlyRate, description,
    } = body;

    if (!email || !password || !role || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'email, password, role, firstName, lastName sont requis' },
        { status: 400 }
      );
    }

    if (!['LANDLORD', 'TENANT', 'ARTISAN'].includes(role)) {
      return NextResponse.json({ error: 'Role invalide' }, { status: 400 });
    }

    // Check existing
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    // Create user with profile in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role,
          firstName,
          lastName,
          phone,
          nationality,
          permitType,
          birthDate: birthDate ? new Date(birthDate) : null,
          status: 'ACTIVE',
        },
      });

      let profile = null;

      if (role === 'TENANT') {
        const tenantData = {
          userId: user.id,
          monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : null,
          employmentType,
          employer,
          maxBudget: maxBudget ? parseFloat(maxBudget) : null,
          minRooms: minRooms ? parseFloat(minRooms) : null,
          maxRooms: maxRooms ? parseFloat(maxRooms) : null,
          preferredCantons: preferredCantons || [],
          preferredCities: preferredCities || [],
          moveInDate: moveInDate ? new Date(moveInDate) : null,
        };

        profile = await tx.tenantProfile.create({ data: tenantData });

        // Calculate initial score
        const score = calculateTenantScore(profile);
        await tx.tenantProfile.update({
          where: { id: profile.id },
          data: { score },
        });
        profile.score = score;
      }

      if (role === 'ARTISAN') {
        profile = await tx.artisanProfile.create({
          data: {
            userId: user.id,
            companyName,
            specialties: specialties || [],
            cantons: cantons || [],
            hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
            description,
          },
        });
      }

      // Audit log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'user.registered',
          entityType: 'User',
          entityId: user.id,
          details: { role, email },
        },
      });

      return { user, profile };
    });

    const token = generateToken(result.user);

    return NextResponse.json({
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
      },
      profile: result.profile,
      token,
    }, { status: 201 });
  } catch (error) {
    console.error('[immo.cool] Register error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
