import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    // During build or when no DB configured, return a proxy that throws helpful errors
    return new Proxy({}, {
      get(_, prop) {
        if (prop === '$connect' || prop === '$disconnect') return () => Promise.resolve();
        if (prop === '$transaction') return (fn) => fn(createPrismaClient());
        return new Proxy({}, {
          get() {
            return () => {
              throw new Error('[immo.cool] DATABASE_URL not configured — add PostgreSQL on Railway');
            };
          }
        });
      }
    });
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
