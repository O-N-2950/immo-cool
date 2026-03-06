/**
 * Next.js Middleware — immo.cool
 * Inspiré de WinWin V2 auth middleware
 * 
 * 1. Redirect immocool.ch → www.immocool.ch (apex domain fix)
 * 2. Protection routes /api/properties, /api/leases, /api/documents (JWT)
 * 3. Headers de sécurité
 */

import { NextResponse } from 'next/server';

// Routes publiques (pas besoin d'auth)
const PUBLIC_ROUTES = [
  '/api/health',
  '/api/ai/chat',
  '/api/ai/estimate',
  '/api/tools/contest',
  '/api/tools/generate-bail',
  '/api/tools/generate-resiliation',
  '/api/tools/generate-edl',
  '/api/cantonal',
  '/api/legal-references',
  '/api/auth/login',
  '/api/auth/register',
  '/api/stripe/webhook',
];

// Routes protégées (nécessitent JWT)
const PROTECTED_ROUTES = [
  '/api/properties',
  '/api/leases',
  '/api/documents',
  '/api/matching',
  '/api/stripe/checkout',
  '/api/stripe/connect',
  '/api/stripe/artisan',
];

export function middleware(request) {
  const { pathname, hostname } = request.nextUrl;

  // 1. REDIRECT apex → www (inspiré WinWin V2)
  if (hostname === 'immocool.ch') {
    const url = request.nextUrl.clone();
    url.hostname = 'www.immocool.ch';
    return NextResponse.redirect(url, 301);
  }

  // 2. SECURITY HEADERS
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');

  // 3. AUTH CHECK pour routes protégées
  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r));
  if (isProtected) {
    const token = request.cookies.get('immo_session')?.value 
      || request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }
    // Note: la vérification JWT complète se fait dans les routes elles-mêmes
    // Le middleware fait juste un gate rapide
  }

  return response;
}

export const config = {
  matcher: [
    // Tout sauf static files, _next, favicon
    '/((?!_next/static|_next/image|favicon.ico|icon-.*\\.png|robots.txt|sitemap.xml).*)',
  ],
};
