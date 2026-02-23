# CONTEXT.md — www.immocool.ch
> Dernière mise à jour : 23 février 2026 (session 3)
> Coller en début de chaque nouvelle conversation Claude

---

## 🎯 PROJET
**immocool.ch** = Première régie immobilière 100% IA de Suisse. Du début à la fin sans intervention humaine (sauf état des lieux physique).

- **Repo :** https://github.com/O-N-2950/immo-cool
- **Prod :** https://www.immocool.ch
- **Railway :** europe-west4, auto-deploy GitHub

## 💰 BUSINESS MODEL
| Rôle | Prix |
|------|------|
| Locataire | **GRATUIT** |
| Propriétaire | **50% du 1er loyer** (unique) |
| Artisan | **10%** par intervention |

Paiements : **Stripe Connect**

## 🏗️ STACK
Next.js 15 (App Router) + React 19 + PostgreSQL/Prisma 5 + Stripe Connect + Railway
UI: Recharts + Lucide React + "Swiss Noir Luxury" design system

## 📄 STRUCTURE (v3.1)

```
app/
├── page.jsx                       # Landing → ImmoCool component
├── layout.jsx                     # SEO meta, PWA manifest, fonts, viewport
├── globals.css                    # Base styles responsive
├── sitemap.js                     # Dynamic sitemap FR+DE (25 villes)
├── robots.js                      # SEO robots
├── appartements/[city]/page.jsx   # SEO FR — 13 villes (generateStaticParams)
├── wohnungen/[city]/page.jsx      # SEO DE — 12 villes (generateStaticParams)
├── components/ImmoCool.jsx        # UI principale (1706 lignes, "use client")
└── api/
    ├── auth/register + login
    ├── cantonal (26 cantons)
    ├── properties (CRUD)
    ├── matching (score 0-100)
    ├── leases (CRUD)
    ├── legal-references (taux hypo + IPC)
    ├── documents (PDF)
    ├── stripe/checkout + connect + webhook + artisan
    └── health
public/
├── manifest.json                  # PWA installable
└── icon.svg                       # Logo (PNGs à générer)
lib/
├── cantonal-rules.js (26 cantons)
├── legal-references.js (3 niveaux: hardcoded → BDD → fetch)
├── matching.js (6 critères)
├── documents/ (bail, EDL, quittance, résiliation, PDF)
├── auth.js, prisma.js, stripe.js
prisma/schema.prisma (11 modèles)
```

## 🖥️ UI — ImmoCool.jsx (1706 lignes)

### Systèmes globaux
- **i18n FR/DE** — TRANSLATIONS object, useLang() hook, LangSwitch component
- **Responsive** — useIsMobile() hook, CSS media queries @768px, classes .mobile-*
- **Chatbot IA** — AIChatbot component, appelle Claude Sonnet API, expert droit du bail suisse, visible sur toutes les pages
- **Estimateur loyer IA** — RentEstimator component, appelle Claude API, retourne min/median/max/charges/explication
- **PWA** — manifest.json, installable sur iOS/Android

### Pages (17 écrans)
1. Landing (hero animé + pricing + features + estimateur IA)
2. Auth login/register (routage par rôle)
3. Dashboard proprio: overview, biens (wizard 4 étapes), matching IA (RadarChart), baux (signature bail canvas), EDL (comparaison entrée/sortie), messages, artisans marketplace, paramètres
4. Dashboard locataire: recherche + carte SVG + candidature + agenda visites + mon bail (aide résiliation) + EDL + messages
5. Pages SEO /appartements/[city] (13 villes FR) + /wohnungen/[city] (12 villes DE)

### Composants avancés
SignaturePad (canvas tactile), PropertyMap (SVG interactif), VisitScheduler (calendrier + créneaux), NotifPanel (5 types), Ring (score animé), AIChatbot (Claude API), RentEstimator (Claude API), LangSwitch, Fade

## 📡 API ROUTES
auth (register/login JWT), cantonal (26 cantons), properties (CRUD), matching (score), leases (CRUD), legal-references (taux hypo + IPC), documents (PDF), stripe (checkout/connect/webhook/artisan), health

## 🗄️ BDD PRISMA (11 modèles)
User, TenantProfile, ArtisanProfile, Property, Application, Lease, Intervention, Message, AuditLog, LegalReference

## 🇨🇭 AVANTAGES CONCURRENTIELS vs Homegate/ImmoScout24/Flatfox
1. ✅ GRATUIT pour locataires (vs frais partout)
2. ✅ Chatbot IA expert droit du bail (PERSONNE ne l'a)
3. ✅ Estimation loyer IA (vs données statiques concurrents)
4. ✅ Conformité légale automatique 26 cantons (vs manuel)
5. ✅ SEO par ville FR+DE (25 landing pages indexées)
6. ✅ PWA installable (app gratuite sans App Store)
7. ✅ 50% 1er loyer vs 5-8% annuel des régies traditionnelles
8. ✅ Matching IA 6 critères (vs tri manuel)

## 📋 TODO

### 🔴 CRITIQUE — pour que le site marche vraiment
- [ ] Connecter ImmoCool.jsx aux API routes (fetch au lieu de mock data)
- [ ] Génération PDF réelle (bail, EDL, quittance) — ajouter pdfkit ou puppeteer
- [ ] Upload photos réel (Railway volume ou S3 gratuit Cloudflare R2)
- [ ] Stripe Connect onboarding prod
- [ ] Générer icon-192.png et icon-512.png pour PWA
- [ ] Auth réelle câblée (JWT → cookies → middleware Next.js)

### 🟡 IMPORTANT — pour scale
- [ ] Notifications email (Resend free tier = 100/jour)
- [ ] Publication vers Homegate/ImmoScout24 API (syndication)
- [ ] GoCaution intégration
- [ ] Tests e2e (Playwright)
- [ ] Monitoring/analytics (Plausible gratuit)

### 🟢 V2 — pour dominer
- [ ] Italien (IT) dans i18n
- [ ] Résiliation automatisée (envoi recommandé)
- [ ] Comparaison photos EDL via IA
- [ ] Analytics avancées propriétaire
- [ ] App mobile native (React Native)
- [ ] Agenda visites persistant (Google Calendar sync)
- [ ] Scoring locataire amélioré (historique, revenus vérifiés)

## ⚠️ POINTS D'ATTENTION
1. Stripe partagé PEP's Swiss SA — webhooks filtrent metadata
2. État des lieux = seul processus non automatisé (présence physique)
3. next-auth v5 bêta — attention breaking changes
4. Taux hypothécaire: toujours depuis LegalReference BDD
5. 26 cantons avec règles différentes — vérifier canton
6. Domaine: www.immocool.ch (immo.cool en attente TMCH Namebay)

## 🔑 ENV VARS (Railway)
DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, JWT_SECRET
