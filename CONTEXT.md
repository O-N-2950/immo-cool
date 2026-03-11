# immo.cool — CONTEXT.md v5
> Dernière mise à jour: 12 mars 2026
> La première régie 100% IA de Suisse

## Vision
Plateforme immobilière suisse automatisée — 8 machines d'acquisition, 7 flux de revenus.
**Marché initial:** Canton du Jura → expansion multi-cantons.

## Business Model (Plan B v5)
- **Propriétaires:** 50% du premier loyer (payable après signature du bail)
- **Locataires:** 100% GRATUIT
- **Artisans:** 10% commission sur interventions via Stripe Connect
- **Documents premium:** Bail personnalisé CHF 29
- **SaaS B2B:** Abonnement régies (à venir)
- **Contestation IA:** CHF 49 (à venir)
- **Affiliations:** déménagement, GoCaution, assurance (à venir)

## Stack technique
- **Frontend:** Next.js 15.5.12 (App Router, standalone output)
- **Hosting:** Railway (PostgreSQL + service web)
- **ORM:** Prisma 5.22 (11 modèles, 3 migrations)
- **Payments:** Stripe Connect (partagé avec PEP's V2, filtré par metadata.app)
- **IA:** Anthropic Claude API (chat, estimation, contestation)
- **PDF:** pdf-lib (4 types: bail, résiliation, EDL, contestation)
- **Auth:** JWT via jose (edge-compatible) + cookies HTTP-only
- **Security:** Rate limiting, CORS whitelist, XSS sanitization, HSTS/CSP
- **DNS:** immocool.ch + www.immocool.ch → Railway (CNAME)

## Infrastructure Railway
- **Project:** tender-hope (e259bb36-94f5-4f7e-9306-31a0f1b85e71)
- **Service:** immo-cool (b96273ab-7194-4f8d-a4a7-ade615f1f2bc)
- **Environment:** production (49461362-f1ec-4d1b-a94c-39e4ff3b2a9e)
- **Workspace:** 3bcd3c2b-04d6-4979-95ff-c5862f606fd2
- **PostgreSQL:** fc99c4fc-7755-4966-85e6-04e071601c77
- **Domain Railway:** immo-cool-production.up.railway.app
- **Custom domains:** www.immocool.ch ✅ / immocool.ch ✅
- **Auto-deploy:** GitHub main → Railway (trigger d43858f0)

## Variables d'environnement (26)
DATABASE_URL, DATABASE_PUBLIC_URL, JWT_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL,
ANTHROPIC_API_KEY, STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET,
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, NEXT_PUBLIC_APP_URL, NODE_ENV, APP_NAME,
APP_DISPLAY_NAME, STRIPE_PRODUCT_PREFIX, RAILWAY_* (auto-injectées)

## Inventaire des routes (47 routes, 0 erreur)

### Pages publiques (14)
- `/` — Landing page showcase (ImmoCool.jsx ~1740 lignes)
- `/login` — Page connexion (API /api/auth/login)
- `/register` — Page inscription (API /api/auth/register)
- `/dashboard` — Tableau de bord authentifié (fetch /api/auth/me)
- `/outils` — Index des 6 outils gratuits
- `/outils/contestation` — Contestation loyer IA + PDF
- `/outils/bail-gratuit` — Générateur de bail PDF (wizard 6 étapes)
- `/outils/resiliation` — Résiliation assistée + calcul délais
- `/outils/calculateur-loyer` — Estimateur loyer IA
- `/outils/etat-des-lieux` — État des lieux digital
- `/outils/assistant-ia` — Chatbot droit du bail
- `/demande` — Reverse marketplace (locataires publient, propriétaires proposent)
- `/appartements/[city]` — SEO 13 villes FR
- `/wohnungen/[city]` — SEO 12 villes DE

### API Routes (22)
- `/api/health` — Health check complet (DB, AI, Stripe, JWT, env)
- `/api/ai/chat` — Chatbot juridique Claude
- `/api/ai/estimate` — Estimation loyer IA + données marché
- `/api/auth/login` — Connexion JWT + cookie
- `/api/auth/register` — Inscription + profil + score
- `/api/auth/logout` — Déconnexion (clear cookies)
- `/api/auth/me` — Profil utilisateur (protégé)
- `/api/properties` — CRUD biens immobiliers (protégé)
- `/api/leases` — Gestion baux (protégé)
- `/api/documents` — Génération documents HTML (protégé)
- `/api/matching` — Moteur matching IA (protégé)
- `/api/reverse` — Reverse marketplace CRUD
- `/api/cantonal` — Règles 26 cantons
- `/api/legal-references` — Taux hypothécaire + IPC (scraping OFL/OFS)
- `/api/tools/contest` — Contestation loyer + analyse IA
- `/api/tools/generate-bail` — Génération bail PDF
- `/api/tools/generate-resiliation` — Génération résiliation PDF
- `/api/tools/generate-edl` — Génération état des lieux PDF
- `/api/stripe/checkout` — Paiement commission (protégé)
- `/api/stripe/connect` — Onboarding Stripe Connect (protégé)
- `/api/stripe/artisan` — Paiement artisan (protégé)
- `/api/stripe/webhook` — Webhooks Stripe (signature vérifiée)

### Fichiers utilitaires
- `/sitemap.xml` — 35 URLs (auto-généré)
- `/robots.txt` — Allow / sauf /api/ et /dashboard/

## Sécurité (audit 15/15 corrigé — 12 mars 2026)
1. ✅ Secrets en variables d'environnement
2. ✅ JWT complet (jose, edge-compatible, vérification dans middleware)
3. ✅ Rate limiting (5/min auth, 10/min AI, 15/min tools, 60/min général)
4. ✅ CORS restrictif (whitelist 5 domaines production)
5. ✅ Validation serveur inputs (types, longueurs, formats Swiss)
6. ✅ XSS sanitization (sanitizeObject sur tous les POST)
7. ✅ SQL paramétré (Prisma ORM, 0 concaténation)
8. ✅ Prix validés (positif, numérique, max CHF 100k)
9. ✅ Surfaces validées (positif, max 10'000 m²)
10. ✅ Adresses sanitizées (XSS + max 200 chars)
11. ✅ Pagination (page/limit bornés, max 50)
12. ✅ Headers sécurité HTTP (HSTS, X-Frame DENY, CSP, nosniff, XSS-Protection)
13. ✅ Gestion erreurs propre (safeErrorResponse, pas de stack traces en prod)
14. ✅ Health check endpoint (DB, AI, Stripe, JWT, env)
15. ✅ Index DB sur colonnes de recherche (ownerId, surface, postalCode, etc.)

## Base de données (Prisma, 11 modèles)
User, TenantProfile, ArtisanProfile, Property, Application,
Lease, Intervention, Message, AuditLog, SearchRequest, LegalReference

### Migrations
1. `20260221_init` — Schema initial complet
2. `20260224_search_requests` — Table SearchRequest (reverse marketplace)
3. `20260312_security_indexes` — Index additionnels sécurité (5 index)

## Points d'attention
- **Stripe partagé:** Même compte que PEP's V2 → filtrage par `metadata.app = "immo_cool"`
- **Railway workspace:** Utiliser `workspaceId` dans les queries GraphQL
- **Standalone mode:** `node .next/standalone/server.js` (pas `next start`)
- **Migrations:** Exécutées au démarrage via `start.sh`
- **SSL sandbox:** Les erreurs TLS depuis Claude sont des artefacts proxy Anthropic

## Repo GitHub
`O-N-2950/immo-cool` — branche `main` — auto-deploy Railway
