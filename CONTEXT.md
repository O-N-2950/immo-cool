# 🗂️ CONTEXT.md — www.immocool.ch
> Dernière mise à jour : 23 février 2026 (session 2)
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
| UI | "Swiss Noir Luxury" design system v3 | Cormorant Garamond + DM Sans + JetBrains Mono |
| Base de données | PostgreSQL + Prisma 5 | Railway managed |
| Auth | JWT + bcrypt | next-auth v5 beta |
| Paiements | Stripe Connect | Webhooks avec filtre metadata |
| Charts | Recharts | Dashboard analytics + RadarChart matching |
| Icons | Lucide React | Iconographie complète |
| Deploy | Railway | CI/CD automatique via GitHub |

---

## 🖥️ INTERFACE UTILISATEUR (v3 — Swiss Noir Luxury)

### Design System
- **Esthétique :** Dark luxury fintech — fond noir (#07060A), accents or (#D4A853), touches purple (#A78BFA)
- **Typo :** Cormorant Garamond (display), DM Sans (body), JetBrains Mono (code/data)
- **Composants réutilisables :** Badge, Ring (score), Btn (GlowButton), Stat, Inp, Sel, Fade, SignaturePad, PropertyMap, NotifPanel, VisitScheduler

### Pages complètes (ImmoCool.jsx — 1426 lignes)

#### Public
1. **Landing page** — Hero animé (3 étapes), pricing 3 colonnes, grille 6 features, trust badges, footer
2. **Auth (Login/Register)** — Split screen, sélection rôle (Propriétaire/Locataire/Artisan), routage selon rôle

#### Dashboard Propriétaire (8 sous-pages)
3. **Overview** — 4 stat cards animés, AreaChart performance 6 mois, widget conformité légale (taux hypo + IPC + OBLF), fil d'activité temps réel
4. **Mes biens** — Liste biens avec stats (vues/candidatures), **formulaire création 4 étapes** (infos → caractéristiques + upload photos → finances + preview commission → vérification légale + récapitulatif)
5. **Candidatures (Matching IA)** — Split view avec Ring score animé, RadarChart 6 axes, barres de progression, message du candidat, boutons Accepter/Contacter/Refuser
6. **Baux** — Liste baux actifs/en attente, **signature de bail avec SignaturePad tactile**, références légales, calcul auto commission Stripe
7. **État des lieux** — 3 modes (Entrée/Sortie/**Comparaison**), navigation par pièce (8 pièces), notation 4 niveaux, remarques + photos, barre progression, **comparaison entrée/sortie avec détection dégradations** (fond rouge + icône alerte), **signature tactile canvas**
8. **Messages** — Liste conversations avec indicateur non-lu, threads avec bulles chat, champ saisie + envoi
9. **Artisans Marketplace** — Filtres par spécialité (7 types), cards avec rating/avis/tarif, **flow complet demande d'intervention** (sélection bien → description → envoi → confirmation avec mention commission 10%)
10. **Paramètres** — Profil, Stripe Connect status

#### Dashboard Locataire (5 sous-pages)
11. **Recherche** — Filtres (canton/pièces/budget), liste biens avec favoris ❤️, **carte SVG interactive** avec pins prix, fiche détaillée (photos, features, badges, description)
12. **Candidature** — Bouton "Postuler gratuitement" → message optionnel → confirmation
13. **Visite** — **VisitScheduler** : calendrier 7 jours + créneaux horaires → confirmation avec notification
14. **Mes candidatures** — Liste avec Ring score, statut (Acceptée/En attente/Refusée)
15. **Mon bail** — Détails complets (loyer, taux hypo, IPC, prochain terme), boutons PDF/télécharger, **aide à la résiliation** (calcul date limite automatique selon canton)
16. **Mon état des lieux** — Entrée (complété) + Sortie (à planifier)
17. **Messages** — Même composant que propriétaire

### Composants avancés
- **SignaturePad** — Canvas HTML5, dessin souris + tactile (mobile), bouton effacer/valider
- **PropertyMap** — Carte SVG du Jura avec pins interactifs (prix), sélection/highlight
- **VisitScheduler** — Calendrier dates (7 jours) + créneaux horaires, confirmation
- **NotifPanel** — Dropdown 5 types (match/candidature/légal/bail/paiement), badges non-lu
- **Ring** — Score circulaire animé avec couleur adaptative
- **Fade** — Transition d'apparition avec délai configurable
- **Transitions de page** — Fade out/in (200ms) entre chaque navigation

---

## 🗄️ SCHÉMA BASE DE DONNÉES (Prisma)

### Utilisateurs & Auth
- **User** : email, passwordHash, role (LANDLORD/TENANT/ARTISAN/ADMIN), status, profil complet, nationalité, permis suisse, stripeCustomerId, stripeConnectId
- **TenantProfile** : revenus, emploi, critères recherche, score 0-100, vérifications
- **ArtisanProfile** : companyName, spécialités (7 types), cantons couverts, tarif horaire, note

### Biens & Processus
- **Property** : type, statut, localisation + canton, caractéristiques, loyer + charges + dépôt, images[], loyer précédent
- **Application** : candidature avec score matching 0-100, statut (PENDING/SHORTLISTED/ACCEPTED/REJECTED)
- **Lease** : bail complet, signatures, taux hypothécaire + IPC au moment du bail, état des lieux JSON, commission Stripe
- **Intervention** : demande artisan, devis, montant final, commission 10%, rating

### Système
- **Message** : messagerie propriétaire ↔ locataire
- **AuditLog** : traçabilité
- **LegalReference** : taux hypothécaire + IPC auto-fetch

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

### Matching IA (6 critères, pondération 100 pts)
- Budget (30 pts), Localisation (25 pts), Pièces (15 pts), Timing (10 pts), Fiabilité (15 pts), Vérification (5 pts)

### Documents générés automatiquement
- Bail à loyer conforme au canton
- Formulaire de loyer initial (si requis par canton)
- État des lieux entrée + sortie (JSON, présence physique requise)
- Quittance de clés
- Aide à la résiliation

### Marketplace Artisans (7 spécialités)
- Plomberie, Électricité, Peinture, Serrurerie, Chauffage, Menuiserie, Nettoyage
- Flow: demande → devis → intervention → paiement Stripe → commission 10% auto

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
│   ├── components/ImmoCool.jsx # Composant principal v3 (1426 lignes)
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
├── lib/
│   ├── auth.js
│   ├── cantonal-rules.js       # 26 cantons avec règles
│   ├── documents/              # bail, état des lieux, quittance, résiliation, PDF
│   ├── legal-references.js     # 3 niveaux: hardcoded → BDD → auto-fetch web
│   ├── matching.js             # Scoring 6 critères
│   ├── prisma.js
│   └── stripe.js
├── prisma/schema.prisma        # 11 modèles
├── docs/
│   ├── DEPLOY-GUIDE.md
│   └── Réglementation_Bail_Suisse_par_Canton.md
├── CONTEXT.md
└── railway.toml
```

---

## ⚠️ POINTS D'ATTENTION

1. **Stripe partagé** avec PEP's Swiss SA — webhooks filtrent par metadata
2. **État des lieux** = seul processus NON automatisé (présence physique)
3. **next-auth v5 bêta** — attention breaking changes
4. **Taux hypothécaire** : toujours lire depuis LegalReference BDD
5. **26 cantons** avec règles différentes — toujours vérifier le canton
6. **Multi-rôles** : User peut être propriétaire ET artisan
7. **Domaine** : www.immocool.ch (immo.cool en attente TMCH chez Namebay)
8. **Design System** : "Swiss Noir Luxury" v3 — dark #07060A, gold #D4A853

---

## 🔑 VARIABLES D'ENVIRONNEMENT (Railway)

- `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `JWT_SECRET`

---

## 📋 RESTE À FAIRE (priorité)

### 🔴 Critique
- [ ] Connecter frontend (ImmoCool.jsx) aux API routes réelles (fetch au lieu de mock data)
- [ ] Génération PDF réelle (ajouter pdfkit ou puppeteer)
- [ ] Upload photos réel (S3 ou Railway volume)
- [ ] Notifications emails (nodemailer / Resend)
- [ ] Stripe Connect onboarding réel en production

### 🟡 Important
- [ ] Agenda visites persistant (BDD)
- [ ] GoCaution intégration
- [ ] Tests end-to-end
- [ ] PWA / responsive mobile

### 🟢 V2
- [ ] Résiliation automatisée avec envoi recommandé
- [ ] Comparaison photos état des lieux (IA)
- [ ] Analytics avancées propriétaire
- [ ] Extension marketplace artisans (devis en ligne, paiement progressif)
- [ ] App mobile native

---

## 🔗 LIENS UTILES

- Repo: https://github.com/O-N-2950/immo-cool
- Prod: https://www.immocool.ch
- Railway: https://immo-cool-production.up.railway.app
- Doc: `docs/Réglementation_Bail_Suisse_par_Canton.md`
