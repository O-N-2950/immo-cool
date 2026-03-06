/**
 * Next.js Instrumentation — immo.cool
 * Inspiré du crash protection de WinWin V2 server/index.ts
 * 
 * ANTI-CRASH : Le process ne meurt JAMAIS sur une exception non gérée
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // ===== GLOBAL CRASH PROTECTION — NE JAMAIS LAISSER LE PROCESS MOURIR =====
    process.on('uncaughtException', (err) => {
      try { 
        console.error('🔴 [UNCAUGHT EXCEPTION] (server survived):', err?.message || err); 
        console.error(err?.stack?.split('\n').slice(0, 4).join('\n'));
      } catch {}
      // NE PAS appeler process.exit() — le serveur continue de tourner
    });

    process.on('unhandledRejection', (reason) => {
      try { 
        console.error('🟡 [UNHANDLED REJECTION] (server survived):', reason?.message || reason); 
      } catch {}
      // NE PAS appeler process.exit()
    });

    process.on('SIGTERM', () => { 
      console.log('🛑 SIGTERM — graceful shutdown'); 
      process.exit(0); 
    });

    process.on('SIGINT', () => { 
      console.log('🛑 SIGINT — graceful shutdown'); 
      process.exit(0); 
    });
    // =========================================================================

    console.log('🟢 [immo.cool] Server instrumentation loaded — crash protection active');
    console.log(`📊 ENV: ${process.env.NODE_ENV} | DB: ${process.env.DATABASE_URL ? '✅' : '❌'} | AI: ${process.env.ANTHROPIC_API_KEY ? '✅' : '❌'} | Stripe: ${process.env.STRIPE_SECRET_KEY ? '✅' : '❌'} | JWT: ${process.env.JWT_SECRET ? '✅' : '❌'}`);
  }
}
