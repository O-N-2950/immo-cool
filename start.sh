#!/bin/sh
# immo.cool — Start script
# Exécute les migrations Prisma au démarrage (quand la DB est accessible)
# puis lance le serveur Next.js standalone

echo "🔄 Running database migrations..."
npx prisma migrate deploy 2>&1 || echo "⚠️  Migration warning (may already be applied)"

echo "🚀 Starting immo.cool server..."
PORT=${PORT:-3000} HOSTNAME=0.0.0.0 node .next/standalone/server.js
