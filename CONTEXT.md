# CONTEXT.md — www.immocool.ch
> Dernière mise à jour : 23 février 2026 (session 5 — code robuste v4)
> Coller en début de chaque nouvelle conversation Claude
> **9'123 lignes de code — 40 routes — BUILD CLEAN 0 ERREURS**

---

## 🎯 VISION
**immocool.ch** = Première régie immobilière 100% IA de Suisse. Zéro intervention humaine.
On s'incruste partout (outils gratuits, embed, WhatsApp, SEO). On aspire le marché.

**Repo :** https://github.com/O-N-2950/immo-cool | **Prod :** https://www.immocool.ch | **Railway :** europe-west4

---

## 💰 7 FLUX DE REVENUS
| # | Source | Montant | Type |
|---|--------|---------|------|
| 1 | Commission propriétaire | **50% du 1er loyer** | One-shot |
| 2 | Commission artisan | **10%** /intervention | Récurrent |
| 3 | Documents premium | **CHF 29** (e-signature+EDL+notifs) | One-shot |
| 4 | SaaS régies B2B | **CHF 99-299/mois** white-label | Récurrent |
| 5 | Contestation loyer | **CHF 49** ou 10% économie/an | One-shot |
| 6 | Affiliation GoCaution | ~CHF 50-80/contrat | Passif |
| 7 | Affiliation assurance RC | ~CHF 30-50/an | Passif |

---

## 🚀 8 MACHINES DE SCALE
1. **Outils gratuits** → 6 outils, chaque PDF = pub gratuite (logo immo.cool)
2. **Aspirateur** → Scraper nocturne portails + outreach email IA
3. **Reverse marketplace** → Locataires publient critères, propriétaires voient la demande
4. **Widget embed** → `<script>` intégrable sur sites tiers (communes, notaires, fiduciaires)
5. **Bot WhatsApp** → Twilio + Claude, l'immo dans ta poche
6. **Contestation IA** → Arme nucléaire médiatique, CHF dès jour 1
7. **B2B SaaS** → White-label conformité pour ~1500 régies suisses
8. **Monopole data** → Chaque outil = données loyers réels → devenir LA référence

---

## 🏗️ STACK
Next.js 15 + React 19 | PostgreSQL + Prisma 5 | Stripe Connect | Claude API (server-side) | pdf-lib | Recharts | Lucide | Railway auto-deploy

---

## 📄 CE QUI EST CONSTRUIT (✅ fonctionnel)

### Pages publiques (11 pages)
| Route | Description | Lignes |
|-------|-------------|--------|
| `/` | Landing (ImmoCool.jsx) — hero, pricing, features, section outils | ~1750 |
| `/outils` | Index des 6 outils gratuits | ~100 |
| `/outils/contestation` | ⭐ Contestation loyer IA — 3 étapes, résultat, PDF auto | 300 |
| `/outils/bail-gratuit` | ⭐ Générateur bail 6 étapes, 26 cantons, PDF conforme | 320 |
| `/outils/resiliation` | Résiliation bail — calcul délais, PDF recommandé | 185 |
| `/outils/calculateur-loyer` | Estimation IA + comparaison loyer actuel | 145 |
| `/outils/etat-des-lieux` | EDL PDF dynamique (sections par pièces) | 142 |
| `/outils/assistant-ia` | Chatbot IA droit du bail, suggestions, conversation | 115 |
| `/demande` | ⭐ Reverse marketplace (locataires publient, proprios voient) | 200 |
| `/appartements/[city]` | SEO FR — 13 villes | SSG |
| `/wohnungen/[city]` | SEO DE — 12 villes | SSG |

### API Routes (19 endpoints)
| Route | Description |
|-------|-------------|
| `/api/ai/chat` | ⭐ Chatbot IA server-side (Claude + fallback prédéfini) |
| `/api/ai/estimate` | ⭐ Estimation loyer IA + fallback algo 26 cantons (données Wüest Partner) |
| `/api/tools/contest` | ⭐ Analyse loyer — calcul hypo/IPC + IA + génération PDF contestation |
| `/api/tools/generate-bail` | Génération PDF bail via pdf-lib |
| `/api/tools/generate-resiliation` | Génération PDF résiliation via pdf-lib |
| `/api/tools/generate-edl` | Génération PDF état des lieux via pdf-lib |
| `/api/auth/*` | Login/register (JWT + bcrypt) |
| `/api/properties` | CRUD biens |
| `/api/matching` | Scoring IA 6 critères |
| `/api/leases`, `/api/documents` | Gestion baux et documents |
| `/api/cantonal` | Règles 26 cantons |
| `/api/legal-references` | Taux hypo + IPC auto |
| `/api/stripe/*` | Checkout, Connect, webhook, artisan |
| `/api/health` | Health check |

### Lib (moteur)
| Fichier | Description |
|---------|-------------|
| `lib/pdf-engine.js` | ⭐ Moteur PDF unifié (bail, résiliation, contestation, EDL) — 596 lignes |
| `lib/cantonal-rules.js` | 26 cantons, formulaire loyer initial, délais, termes |
| `lib/legal-references.js` | Taux hypo 1.25% + IPC 107.1, 3 niveaux (fallback → DB → fetch) |
| `lib/matching.js` | Scoring 6 critères (budget, localisation, taille, profil...) |
| `lib/documents/*` | Templates bail, EDL, quittance, résiliation |
| `lib/auth.js`, `lib/prisma.js`, `lib/stripe.js` | Auth, DB, paiements |

### SEO & PWA
- Sitemap dynamique: 33 URLs (landing + 6 outils + demande + 25 villes FR/DE)
- robots.txt, manifest.json, meta OpenGraph, hreflang FR↔DE
- SEO metadata par page (layouts dédiés)
- i18n FR/DE (80+ clés), responsive mobile-first

### Prisma schema
11 modèles: User, Property, PropertyMatch, Lease, Document, Payment, LegalReference, Artisan, ArtisanIntervention, Visit, Notification

---

## 📋 TODO

### 🔴 PHASE 1 — MVP LIVE (semaines 1-4)
- [ ] Connecter auth réelle (JWT cookies middleware)
- [ ] Connecter ImmoCool.jsx aux API (remplacer TOUTES les données mock)
- [ ] Stripe Connect onboarding production
- [ ] Deploy Railway → www.immocool.ch LIVE (build ✅, déploiement à vérifier)
- [ ] Google Search Console + soumettre sitemap
- [ ] Générer icônes PWA (icon-192.png, icon-512.png)
- [ ] Stocker demandes reverse marketplace en BDD (actuellement données seed)

### 🟡 PHASE 2 — ASPIRATION (semaines 4-8)
- [ ] Scraper Homegate + ImmoScout24 + Flatfox (n8n nocturne)
- [ ] Outreach email auto IA (Resend + Claude)
- [ ] Import 1-clic d'annonce existante
- [ ] Intégrer GoCaution dans flow signature (affiliation)
- [ ] Blog SEO: 10-20 articles cibles
- [ ] Bot WhatsApp (Twilio + Claude + PDF gen)
- [ ] Google Ads mini budget CHF 200-500/mois

### 🟢 PHASE 3 — MONÉTISATION (mois 2-4)
- [ ] Bail premium CHF 29 (e-signature + EDL + notifs)
- [ ] Contestation loyer CHF 49 ou 10% économie
- [ ] Marketplace artisans live (Stripe Connect artisans)
- [ ] Widget embed pour sites tiers
- [ ] Dashboard data public (stats loyers par ville)
- [ ] Contact presse (QJ, RTS, 20 Minutes)

### 🔵 PHASE 4 — DOMINATION (mois 4-12)
- [ ] SaaS B2B white-label régies CHF 99-299/mois
- [ ] API publique données loyers (freemium)
- [ ] Italien dans i18n
- [ ] App mobile native ou PWA avancée
- [ ] Expansion Suisse alémanique

---

## ⚠️ POINTS D'ATTENTION
1. Stripe partagé PEP's Swiss SA — webhooks filtrent metadata
2. ANTHROPIC_API_KEY en env Railway — JAMAIS côté client
3. Taux hypo 1.25% + IPC 107.1 : depuis LegalReference BDD
4. 26 cantons règles différentes — toujours vérifier le canton
5. Domaine: www.immocool.ch (immo.cool en attente TMCH Namebay)
6. Contestation loyer: disclaimer "pas avocats" obligatoire
7. Scraping: légal si données publiques, pas de surcharge

## 🔑 ENV VARS (Railway)
DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, JWT_SECRET, ANTHROPIC_API_KEY
