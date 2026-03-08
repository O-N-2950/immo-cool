/**
 * POST /api/auth/login
 * AUDIT: #5 input validation, #6 XSS, #13 safe errors
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';
import { sanitizeString, isValidEmail, safeErrorResponse } from '@/lib/security';

export async function POST(request) {
  try {
    const body = await request.json();
    const email = sanitizeString(body.email || '').toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Format email invalide' }, { status: 400 });
    }

    if (typeof password !== 'string' || password.length > 128) {
      return NextResponse.json({ error: 'Mot de passe invalide' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tenantProfile: true,
        artisanProfile: true,
      },
    });

    // Generic error message (don't reveal if email exists)
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 });
    }

    if (user.status === 'SUSPENDED') {
      return NextResponse.json({ error: 'Compte suspendu' }, { status: 403 });
    }

    const token = generateToken(user);

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        stripeOnboarded: user.stripeOnboarded,
      },
      token,
    });

    // Set HTTP-only cookie
    response.cookies.set('immo_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    const safe = safeErrorResponse(error);
    return NextResponse.json({ error: safe.error }, { status: safe.status });
  }
}
