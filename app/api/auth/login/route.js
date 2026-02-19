/**
 * POST /api/auth/login
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tenantProfile: true,
        artisanProfile: true,
      },
    });

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
      profile: user.tenantProfile || user.artisanProfile || null,
      token,
    });

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[immo.cool] Login error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
