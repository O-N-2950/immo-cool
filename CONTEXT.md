# 🗂️ CONTEXT.md — www.immocool.ch
> Dernière mise à jour : 23 février 2026
> Ce fichier est à coller en début de chaque nouvelle conversation dans le projet "www.immocool.ch"

---

## 🎯 VUE D'ENSEMBLE DU PROJET

**immocool.ch** = Plateforme immobilière suisse 100% automatisée, du début à la fin sans intervention humaine — sauf pour les états des lieux d'entrée et sortie (propriétaire présent obligatoire).

**Slogan :** "50% moins cher qu'une régie — et gratuit pour les locataires."

- **Repo GitHub :** https://github.com/O-N-2950/immo-cool
- **URL Production :** https://www.immocool.ch
- **URL Railway :** https://immo-cool-production.up.railway.app
- **Hébergement :** Railway (europe-west4) + auto-deploy GitHub

---

## 💰 MODÈLE ÉCONOMIQUE (Plan B)

| Rôle | Prix |
|------|------|
| Locataire | **GRATUIT** (recherche, matching, bail, 26 cantons) |
| Propriétaire | **50% du 1er loyer** (commission unique) |
| Artisan | **10%** sur chaque intervention |

Paiements via **Stripe Connect** — propriétaires et artisans s'onboardent sur Stripe directement.

---

## 🏗️ STACK TECHNIQUE

| Couche | Tech | Détail |
|--------|------|--------|
| Framework | Next.js 15 (App Router) | React 19 |
| UI | "Swiss Noir Luxury" design system | Cormorant Garamond + DM Sans + JetBrains Mono |
| Base de données | PostgreSQL + Prisma 5 | Railway managed |
| Auth | JWT + bcrypt | next-auth v5 beta |
| Paiements | Stripe Connect | Webhooks avec filtre metadata |
| Charts | Recharts | Dashboard analytics |
| Icons | Lucide React | Iconographie complète |
| Deploy | Railway | CI/CD automatique via GitHub |

---

## 🖥️ INTERFACE UTILISATEUR (v2 — Swiss Noir Luxury)

### Design System
- **Esthétique :** Dark luxury fintech — fond noir (#07060A), accents or (#D4A853), touches purple (#A78BFA)
- **Typo :** Cormorant Garamond (display), DM Sans (body), JetBrains Mono (code/data)
- **Composants réutilisables :** Badge, ScoreRing, GlowButton, StatCard, Input, Dropdown

### Pages implémentées (ImmoCool.jsx — composant principal)
1. **Landing page** — Hero animé, pricing 3 colonnes (Locataire GRATUIT / Proprio 50% / Artisan 10%), grille fonctionnalités, trust badges
2. **Auth (Login/Register)** — Split screen, sélection de rôle (Propriétaire/Locataire/Artisan), formulaire complet
3. **Dashboard propriétaire** — Sidebar collapsible, stats cards animés, graphique performance (AreaChart recharts), widget conformité légale, fil d'activité
4. **Gestion des biens** — Liste avec vues/candidatures, formulaire création en 4 étapes (infos → caractéristiques → finances → vérification légale)
5. **Matching IA (Candidatures)** — Split view candidats/détail, ScoreRing animé, RadarChart 6 axes (budget/localisation/pièces/timing/fiabilité/vérifié), barres de progression par critère
6. **Baux** — Liste des baux actifs/en attente, références légales (taux hypo + IPC + OBLF), boutons signature
7. **État des lieux interactif** — Navigation par pièce, 8 pièces prédéfinies, notation (Neuf/Bon/Usé/Endommagé), champ remarques + photo par élément, barre de progression, bouton signature
8. **Artisans / Messages / Paramètres** — Pages placeholder (Prochainement)

---

## 🗄️ SCHÉMA BASE DE DONNÉES (Prisma)

### Utilisateurs & Auth
- **User** : email, passwordHash, role (LANDLORD/TENANT/ARTISAN/ADMIN), status (PENDING/ACTIVE/SUSPENDED), profil complet, nationalité, type de permis suisse (B/C/L/G), stripeCustomerId, stripeConnectId
- **TenantProfile** : revenus, type emploi, critères recherche (budget, cantons préférés, pièces, date déménagement), score 0-100, vérifications (revenus, identité, références)
- **ArtisanProfile** : companyName, spécialités (PLOMBERIE/ELECTRICITE/PEINTURE/SERRURERIE/MENUISERIE/CHAUFFAGE/NETTOYAGE/DEMENAGEMENT/JARDINAGE/GENERAL), cantons couverts, tarif horaire, note moyenne

### Biens & Processus
- **Property** : type (APARTMENT/HOUSE/STUDIO/COMMERCIAL/PARKING/STORAGE), statut (DRAFT/ACTIVE/RENTED/ARCHIVED), localisation complète + canton, caractéristiques (pièces, m², balcon, parking...), loyer + charges + dépôt, images[], loyer précédent (formulaire officiel)
- **Application** : candidature locataire ↔ bien, score matching 0-100, statut (PENDING/SHORTLISTED/ACCEPTED/REJECTED/WITHDRAWN)
- **Lease** : bail complet avec conformité cantonale, signatures électroniques, taux hypothécaire + IPC au moment du bail, état des lieux entrée/sortie (JSON), commission Stripe
- **Intervention** : demande artisan, statut (REQUESTED→COMPLETED→PAID), devis, montant final, commission 10%, rating 1-5

### Système
- **Message** : messagerie propriétaire ↔ locataire (contexte bien/bail)
- **AuditLog** : traçabilité complète de toutes les actions
- **LegalReference** : taux hypothécaire de référence (1.25%) + IPC — auto-fetch système

---

## 📡 API ROUTES (Next.js App Router)

| Endpoint | Description |
|----------|-------------|
| `GET /api/cantonal?canton=JU` | Règles cantonales (26 cantons) |
| `GET /api/properties?canton=VD` | Liste des biens |
| `GET /api/matching?propertyId=x` | Score matching locataires (0-100) |
| `POST /api/auth/register` | Inscription |
| `POST /api/auth/login` | Connexion JWT |
| `POST /api/leases` | Création de bail conforme |
| `GET /api/legal-references` | Taux hypothécaire + IPC |
| `GET /api/documents` | Génération de documents PDF |
| `POST /api/stripe/checkout` | Paiement commission propriétaire |
| `POST /api/stripe/connect` | Onboarding Stripe Connect |
| `POST /api/stripe/webhook` | Webhooks Stripe (filtre metadata) |
| `GET /api/health` | Health check Railway |

---

## 🇨🇭 FONCTIONNALITÉS CLÉS

### Moteur de règles cantonales (26 cantons)
- Dates de résiliation officielles par canton
- Formulaire de loyer initial obligatoire (OBLF art. 19 al. 1)
- Taux hypothécaire de référence : 1.25% (auto-fetch + stocké en BDD)
- IPC auto-fetch + stocké en BDD
- Validation conformité automatique

### Documents générés automatiquement
- Bail à loyer conforme au canton
- État des lieux entrée + sortie (JSON stocké, présence humaine requise)
- Quittance de clés
- Aide à la résiliation

### Matching IA (6 critères, pondération 100 pts)
- Budget (30 pts) — ratio loyer/revenu, norme suisse 33%
- Localisation (25 pts) — canton + ville préférés
- Pièces (15 pts) — correspondance nombre de pièces
- Timing (10 pts) — compatibilité date d'emménagement
- Fiabilité (15 pts) — score profil locataire
- Vérification (5 pts) — identité, revenus, références

---

## 📁 STRUCTURE DU REPO

```
immo-cool/
├── app/
│   ├── api/                    # API Routes Next.js
│   │   ├── auth/               # login, register
│   │   ├── cantonal/           # 26 cantons
│   │   ├── documents/          # Génération PDF
│   │   ├── leases/             # CRUD baux
│   │   ├── legal-references/   # Taux & IPC
│   │   ├── matching/           # Score matching
│   │   ├── properties/         # CRUD biens
│   │   └── stripe/             # checkout, connect, webhook
│   ├── components/ImmoCool.jsx # Composant principal (Swiss Noir Luxury)
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
├── lib/
│   ├── auth.js
│   ├── cantonal-rules.js
│   ├── documents/              # bail, état des lieux, quittance, résiliation, PDF
│   ├── legal-references.js
│   ├── matching.js
│   ├── prisma.js
│   └── stripe.js
├── prisma/schema.prisma
├── docs/
│   ├── DEPLOY-GUIDE.md
│   └── Réglementation_Bail_Suisse_par_Canton.md
└── railway.toml
```

---

## ⚠️ POINTS D'ATTENTION / DÉCISIONS TECHNIQUES

1. **Stripe partagé** : Même compte Stripe (PEP's Swiss SA) que PEP's V2 — les webhooks utilisent des filtres metadata pour distinguer les paiements immocool vs PEP's
2. **État des lieux** : Seul processus NON automatisé — présence physique du propriétaire requise, stocké en JSON dans `Lease.etatLieuxEntree` / `etatLieuxSortie`
3. **next-auth v5 bêta** — attention aux breaking changes si mise à jour
4. **Taux hypothécaire** : Toujours lire depuis `LegalReference` en BDD, ne jamais hardcoder
5. **Cantons** : 26 cantons avec règles différentes — toujours vérifier le bon canton avant de générer un document
6. **Multi-rôles** : Un user peut être propriétaire ET artisan (stripeConnectId commun)
7. **Domaine** : www.immocool.ch (pas www.immo.cool) — immo.cool en attente TMCH chez Namebay
8. **Design System** : "Swiss Noir Luxury" — dark bg (#07060A), gold accents (#D4A853), fonts: Cormorant Garamond / DM Sans / JetBrains Mono

---

## 🔑 VARIABLES D'ENVIRONNEMENT (Railway)

- `DATABASE_URL` : PostgreSQL Railway (auto-injecté)
- `NEXTAUTH_SECRET` : Secret next-auth
- `NEXTAUTH_URL` : https://www.immocool.ch
- `STRIPE_SECRET_KEY` : Clé Stripe PEP's Swiss SA
- `STRIPE_WEBHOOK_SECRET` : Secret webhook immocool
- `JWT_SECRET` : Pour tokens JWT custom

---

## 📋 RESTE À FAIRE (priorité)

### 🔴 Critique
- [ ] Connecter le frontend (ImmoCool.jsx) aux API routes réelles (fetch au lieu de mock data)
- [ ] Génération PDF réelle (ajouter pdfkit ou puppeteer)
- [ ] Upload photos (S3 ou Railway volume)
- [ ] Notifications / emails (confirmation inscription, nouveau match, rappels)
- [ ] Signature électronique (Skribble ou signature tactile maison)

### 🟡 Important
- [ ] Messagerie propriétaire ↔ locataire (API + UI)
- [ ] Agenda / coordination de visites
- [ ] GoCaution intégration
- [ ] Tests end-to-end avec vraies données

### 🟢 V2
- [ ] Marketplace artisans (flow complet)
- [ ] Résiliation automatisée
- [ ] Comparaison état des lieux entrée/sortie
- [ ] PWA / app mobile
- [ ] Extension multi-cantons (UI locataire)

---

## 🔗 LIENS UTILES

- Repo GitHub : https://github.com/O-N-2950/immo-cool
- Production : https://www.immocool.ch
- Railway : https://immo-cool-production.up.railway.app
- Doc réglementation : `docs/Réglementation_Bail_Suisse_par_Canton.md`
