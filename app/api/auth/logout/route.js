/**
 * POST /api/auth/logout — Déconnexion
 */
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Déconnecté' });
  response.cookies.set('immo_session', '', { maxAge: 0, path: '/' });
  response.cookies.set('token', '', { maxAge: 0, path: '/' }); // legacy
  return response;
}
