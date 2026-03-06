/**
 * GET /api/health
 * 
 * Health check complet — inspiré du crash-monitor WinWin V2
 * Teste : DB PostgreSQL, Claude IA, Stripe, variables critiques
 * 
 * Retourne 200 = tout OK, 207 = dégradé, 503 = down
 */

import { NextResponse } from 'next/server';

const startupTime = new Date();

async function checkDatabase() {
  if (!process.env.DATABASE_URL) return { ok: false, error: 'DATABASE_URL manquante' };
  try {
    const { default: prismaModule } = await import('../../../lib/prisma.js');
    const prisma = prismaModule;
    await prisma.$queryRawUnsafe('SELECT 1 as ping');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message?.slice(0, 100) };
  }
}

function checkEnvVars() {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'ANTHROPIC_API_KEY', 'STRIPE_SECRET_KEY'];
  const missing = required.filter(v => !process.env[v]);
  return { ok: missing.length === 0, missing };
}

export async function GET(request) {
  const url = new URL(request.url);
  const quick = url.searchParams.get('quick') === 'true';
  
  // Quick mode = Railway healthcheck (rapide, pas de test externe)
  if (quick) {
    return NextResponse.json({
      status: 'ok',
      app: 'immo.cool',
      timestamp: new Date().toISOString(),
      uptime: Math.round((Date.now() - startupTime.getTime()) / 1000) + 's',
    });
  }

  const envCheck = checkEnvVars();
  
  // Test DB
  let db;
  try {
    db = await Promise.race([
      checkDatabase(),
      new Promise(resolve => setTimeout(() => resolve({ ok: false, error: 'timeout 5s' }), 5000))
    ]);
  } catch {
    db = { ok: false, error: 'exception' };
  }

  const services = {
    database: db,
    ai: { ok: !!process.env.ANTHROPIC_API_KEY, configured: !!process.env.ANTHROPIC_API_KEY },
    stripe: { ok: !!process.env.STRIPE_SECRET_KEY, configured: !!process.env.STRIPE_SECRET_KEY },
    auth: { ok: !!process.env.JWT_SECRET, configured: !!process.env.JWT_SECRET },
    env: envCheck,
  };

  const allOk = db.ok && envCheck.ok;
  const anyDown = !db.ok;
  const status = anyDown ? 'down' : allOk ? 'ok' : 'degraded';
  const httpStatus = anyDown ? 503 : allOk ? 200 : 207;

  return NextResponse.json({
    status,
    app: 'immo.cool',
    version: '3.1',
    timestamp: new Date().toISOString(),
    uptime: Math.round((Date.now() - startupTime.getTime()) / 1000) + 's',
    startedAt: startupTime.toISOString(),
    env: process.env.NODE_ENV,
    services,
  }, { status: httpStatus });
}
