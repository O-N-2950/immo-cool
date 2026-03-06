# CONTEXT.md — immo.cool v3.2
## Dernière mise à jour : 6 mars 2026

---

## Vision
Première régie 100% IA de Suisse. Gratuit pour les locataires, commission propriétaire 50% du premier loyer.

## Stack technique
- **Frontend** : Next.js 15.5.12 (App Router, standalone mode)
- **Backend** : API Routes Next.js (19 endpoints)
- **Base de données** : PostgreSQL (Railway, Prisma 5, 2 migrations)
- **IA** : Claude API (Anthropic) — chat, estimation, contestation
- **Paiements** : Stripe Connect (propriétaires + artisans)
- **PDF** : pdf-lib (moteur unifié 596 lignes)
- **Hosting** : Railway (auto-deploy GitHub main)
- **Domaines** : www.immocool.ch ✅ propagé, immocool.ch ⏳

## Infrastructure Railway
- **Project** : e259bb36-94f5-4f7e-9306-31a0f1b85e71 (tender-hope)
- **Service** : b96273ab-7194-4f8d-a4a7-ade615f1f2bc (immo-cool)
- **Environment** : 49461362-f1ec-4d1b-a94c-39e4ff3b2a9e (production)
- **Workspace** : 3bcd3c2b-04d6-4979-95ff-c5862f606fd2 (NEO2950)
- **PostgreSQL** : fc99c4fc-7755-4966-85e6-04e071601c77

## Variables d'environnement (26 total)
DATABASE_URL, JWT_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL, ANTHROPIC_API_KEY,
STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET,
NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, NODE_ENV,
+ variables Railway auto-injectées

## Anti-crash (inspiré WinWin V2)
- `railway.toml` : healthcheck /api/health, timeout 120s, restart ON_FAILURE x10
- `instrumentation.js` : uncaughtException/unhandledRejection → serveur survit
- `middleware.js` : redirect apex→www, security headers, auth gate
- `global-error.jsx` + `not-found.jsx` : error boundaries frontend
- `start.sh` : migrations Prisma auto au démarrage

## Routes (42 total, build clean 0 erreurs)

### Pages publiques (11)
- `/` — Landing page (~1750 lignes)
- `/outils` — Index 6 outils gratuits
- `/outils/contestation` — Contestation loyer IA + PDF
- `/outils/bail-gratuit` — Générateur bail 6 étapes
- `/outils/resiliation` — Résiliation assistée + délais
- `/outils/calculateur-loyer` — Estimateur IA
- `/outils/etat-des-lieux` — EDL digital
- `/outils/assistant-ia` — Chatbot droit du bail
- `/demande` — Reverse marketplace locataires
- `/appartements/[city]` — SEO 13 villes FR
- `/wohnungen/[city]` — SEO 12 villes DE

### API Routes (20)
- `/api/health` — Health check complet (DB + env + services)
- `/api/ai/chat` — Chatbot IA droit du bail
- `/api/ai/estimate` — Estimation loyer IA
- `/api/tools/contest` — Contestation + calcul hypo + PDF
- `/api/tools/generate-bail` — Génération bail PDF
- `/api/tools/generate-resiliation` — Résiliation PDF
- `/api/tools/generate-edl` — État des lieux PDF
- `/api/reverse` — GET/POST demandes locataires (BDD)
- `/api/auth/login` — Connexion JWT
- `/api/auth/register` — Inscription
- `/api/properties` — CRUD biens (protégé)
- `/api/matching` — Scoring locataire/bien
- `/api/leases` — Gestion baux (protégé)
- `/api/documents` — Documents (protégé)
- `/api/cantonal` — Règles cantonales
- `/api/legal-references` — Taux hypo + IPC
- `/api/stripe/checkout` — Paiement commission
- `/api/stripe/connect` — Onboarding Stripe Connect
- `/api/stripe/artisan` — Paiement artisan
- `/api/stripe/webhook` — Webhook Stripe

### Middleware
- Redirect immocool.ch → www.immocool.ch (301)
- Security headers (X-Frame-Options, CSP, etc.)
- Auth gate sur routes protégées (JWT cookie)

## Base de données (Prisma)
Tables : User, TenantProfile, ArtisanProfile, Property, Application, Lease,
Intervention, Message, AuditLog, SearchRequest, LegalReference

## Modèle de revenus (7 flux)
1. Commission propriétaire : 50% du 1er loyer
2. Commission artisan : 10% intervention
3. Documents premium : CHF 29
4. SaaS B2B régies : abonnement mensuel
5. Contestation IA premium : CHF 49
6. Affiliations assurances/déménagement
7. Data licensing cantonal

## 8 machines de scale
1. Outils gratuits → capture emails
2. Aspirateur annonces → data
3. Reverse marketplace → chicken-and-egg
4. Widget embed → distribution
5. WhatsApp bot → engagement
6. Contestation IA → viralité
7. SaaS B2B → revenus récurrents
8. Monopole data → moat

## Sécurité
- JWT 7 jours, httpOnly cookie
- Routes protégées via middleware
- Stripe webhook signature vérifiée
- Pas de X-Powered-By header
- CORS restrictif en production
