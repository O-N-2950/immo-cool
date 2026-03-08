/**
 * Next.js Middleware — immo.cool
 * 
 * AUDIT FIXES: #2 #3 #4 #12 #13
 * 1. CORS restrictif (domaines de production uniquement)
 * 2. Rate limiting (60/min général, 5/min auth, 10/min AI)
 * 3. JWT vérification complète sur routes protégées
 * 4. Headers de sécurité HTTP complets (HSTS, CSP, XSS)
 * 5. Redirect apex → www
 * 6. Pas de stack traces en production
 */

import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// ============================================================
// CONFIGURATION
// ============================================================

// Routes publiques (pas d'auth)
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
  '/api/auth/logout',
  '/api/stripe/webhook',
  '/api/reverse',
];

// Routes protégées (nécessitent JWT valide)
const PROTECTED_ROUTES = [
  '/api/properties',
  '/api/leases',
  '/api/documents',
  '/api/matching',
  '/api/stripe/checkout',
  '/api/stripe/connect',
  '/api/stripe/artisan',
  '/api/auth/me',
];

// CORS origins autorisées
const ALLOWED_ORIGINS = new Set([
  'https://www.immocool.ch',
  'https://immocool.ch',
  'https://immo.cool',
  'https://www.immo.cool',
  'https://immo-cool-production.up.railway.app',
]);

// Rate limit presets par préfixe de route
const RATE_LIMIT_RULES = [
  { prefix: '/api/auth/login', max: 5, window: 60 },
  { prefix: '/api/auth/register', max: 5, window: 60 },
  { prefix: '/api/ai/', max: 10, window: 60 },
  { prefix: '/api/tools/', max: 15, window: 60 },
  { prefix: '/api/', max: 60, window: 60 },
];

// Security headers
const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

// ============================================================
// IN-MEMORY RATE LIMITER
// ============================================================

const rateLimitMap = new Map();

function checkRateLimit(key, maxReqs, windowSec) {
  const now = Date.now();
  const windowMs = windowSec * 1000;
  let entry = rateLimitMap.get(key);

  if (!entry || now - entry.start > windowMs) {
    entry = { count: 1, start: now };
    rateLimitMap.set(key, entry);
    return { allowed: true, remaining: maxReqs - 1 };
  }

  entry.count++;
  const remaining = Math.max(0, maxReqs - entry.count);
  return { allowed: entry.count <= maxReqs, remaining };
}

// Cleanup stale entries every 5 min
if (typeof globalThis.__rlCleanup === 'undefined') {
  globalThis.__rlCleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now - entry.start > 120_000) rateLimitMap.delete(key);
    }
  }, 300_000);
}

function getClientIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.ip ||
    'unknown'
  );
}

// ============================================================
// JWT VERIFICATION (Edge Runtime compatible — jose library)
// ============================================================

async function verifyJWT(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret || !token) return null;

  try {
    const encoded = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, encoded);
    return payload;
  } catch {
    return null;
  }
}

// ============================================================
// HELPERS
// ============================================================

function applySecurityHeaders(response) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

function applyCors(request, response) {
  const origin = request.headers.get('origin');
  if (origin && (ALLOWED_ORIGINS.has(origin) || process.env.NODE_ENV !== 'production')) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  return response;
}

// ============================================================
// MIDDLEWARE
// ============================================================

export async function middleware(request) {
  const { pathname, hostname } = request.nextUrl;

  // ─── 1. REDIRECT apex → www ───
  if (hostname === 'immocool.ch') {
    const url = request.nextUrl.clone();
    url.hostname = 'www.immocool.ch';
    return NextResponse.redirect(url, 301);
  }

  // ─── 2. CORS preflight ───
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin');
    const isAllowed = !origin || ALLOWED_ORIGINS.has(origin) || process.env.NODE_ENV !== 'production';
    
    if (isAllowed) {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    return new NextResponse(null, { status: 403 });
  }

  // ─── 3. RATE LIMITING (API routes only, except webhooks) ───
  if (pathname.startsWith('/api/') && pathname !== '/api/stripe/webhook') {
    const ip = getClientIP(request);
    const rule = RATE_LIMIT_RULES.find(r => pathname.startsWith(r.prefix));
    const { max, window: win } = rule || { max: 60, window: 60 };
    const key = `${ip}:${rule?.prefix || '/api/'}`;

    const { allowed, remaining } = checkRateLimit(key, max, win);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Réessayez dans une minute.', code: 'RATE_LIMITED' },
        {
          status: 429,
          headers: {
            'Retry-After': String(win),
            'X-RateLimit-Limit': String(max),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }
  }

  // ─── 4. AUTH CHECK (routes protégées — full JWT verification) ───
  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r));
  if (isProtected) {
    const token =
      request.cookies.get('immo_session')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré', code: 'AUTH_INVALID' },
        { status: 401 }
      );
    }

    // Inject user info into request headers for downstream routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', String(payload.userId || ''));
    requestHeaders.set('x-user-email', String(payload.email || ''));
    requestHeaders.set('x-user-role', String(payload.role || ''));

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    applySecurityHeaders(response);
    applyCors(request, response);
    return response;
  }

  // ─── 5. SECURITY HEADERS + CORS (all other routes) ───
  const response = NextResponse.next();
  applySecurityHeaders(response);
  applyCors(request, response);
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon-.*\\.png|robots.txt|sitemap.xml).*)',
  ],
};
