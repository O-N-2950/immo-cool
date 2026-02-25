/**
 * immo.cool — Next.js Middleware
 * 
 * Protège les routes API qui nécessitent une authentification.
 * Les routes publiques (outils, health, auth) restent accessibles.
 */

import { NextResponse } from 'next/server';

// Routes publiques — pas besoin d'auth
const PUBLIC_ROUTES = [
  '/api/health',
  '/api/auth/login',
  '/api/auth/register',
  '/api/ai/chat',
  '/api/ai/estimate',
  '/api/tools/contest',
  '/api/tools/generate-bail',
  '/api/tools/generate-resiliation',
  '/api/tools/generate-edl',
  '/api/cantonal',
  '/api/legal-references',
  '/api/stripe/webhook',
];

// Routes semi-publiques — GET public, POST/PUT/DELETE protégé
const SEMI_PUBLIC_ROUTES = [
  '/api/reverse',
  '/api/properties',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Ne traiter que les routes API
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Routes publiques → passer
  if (PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'))) {
    return NextResponse.next();
  }

  // Routes semi-publiques → GET passe, le reste nécessite auth
  if (SEMI_PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'))) {
    if (request.method === 'GET') {
      return NextResponse.next();
    }
  }

  // Vérifier le token
  const token = request.cookies.get('token')?.value
    || request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { error: 'Authentification requise', code: 'AUTH_REQUIRED' },
      { status: 401 }
    );
  }

  // Vérification JWT basique (la vérification complète se fait dans les routes)
  // Le middleware passe le token, les routes vérifient la signature
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-auth-token', token);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/api/:path*'],
};
