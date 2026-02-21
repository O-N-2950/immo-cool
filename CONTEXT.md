# 🗂️ CONTEXT.md — www.immocool.ch
> Dernière mise à jour : 21 février 2026
> Coller en début de chaque nouvelle conversation dans le projet "www.immo.cool"

---

## 🎯 VUE D'ENSEMBLE

**immocool.ch** = Plateforme immobilière suisse 100% automatisée.
- Gratuit pour les locataires
- Propriétaires : 50% du 1er loyer
- Artisans : commission 10%
- Hébergement suisse, conforme RGPD

- **Repo GitHub :** https://github.com/O-N-2950/immo-cool
- **URL Production :** https://www.immocool.ch
- **Railway URL :** https://immo-cool-production.up.railway.app
- **Hébergement :** Railway (europe-west4)
- **CI/CD :** GitHub → Railway auto-deploy

---

## 🏗️ STACK TECHNIQUE

| Couche | Tech | Détail |
|--------|------|--------|
| Framework | Next.js 15 (App Router) | React 19 |
| UI | React 19 + design custom | Playfair Display + DM Sans + JetBrains Mono |
| Base de données | PostgreSQL + Prisma 5 | Railway managed |
| Auth | JWT + bcrypt | next-auth v5 beta |
| Paiements | Stripe Connect | Commission auto |
| Deploy | Railway | europe-west4 |

---

## 🗄️ MODÈLES DE DONNÉES (Prisma)

**Utilisateurs & Rôles :** `LANDLORD` / `TENANT` / `ARTISAN` / `ADMIN`

- **User** : email, role, profil, adresse, `stripeCustomerId`, `stripeConnectId`
- **TenantProfile** : revenus, critères de recherche, score matching (0-100), cantons préférés
- **ArtisanProfile** : spécialités (10 types), cantons couverts, tarif horaire, rating
- **Property** : type (APARTMENT/HOUSE/STUDIO/COMMERCIAL/PARKING/STORAGE), localisation, specs, `monthlyRent`, images[], `availableFrom`, `previousRent`
- **Application** : candidature avec `matchScore` (0-100), statut (PENDING→ACCEPTED/REJECTED)
- **Lease** : bail complet, compliance cantonale, signatures, `etatLieuxEntree/Sortie` (Json), `commissionAmount`
- **Intervention** : artisan → bien, devis, paiement, rating
- **Message** : messaging entre utilisateurs
- **LegalReference** : taux hypothécaire de référence + IPC (auto-fetch)
- **AuditLog** : traçabilité complète

---

## 🇨🇭 FONCTIONNALITÉS CLÉS

### Moteur de règles cantonales (26 cantons)
- Dates de résiliation officielles par canton
- Formulaire de loyer initial obligatoire (OBLF art. 19)
- Validation de conformité automatique
- Taux hypothécaire de référence : 1.25% (auto-mis à jour)
- IPC intégré

### Matching intelligent
- Score de compatibilité 0-100
- Budget + localisation + timing + profil locataire
- Classement automatique des candidatures

### Stripe Connect
- Onboarding propriétaires et artisans
- Commission propriétaire : 50% du 1er loyer
- Commission artisan : 10%
- Webhook : `jvais.cool/api/webhooks/stripe`
- ⚠️ Partage Stripe avec PEP's V2 → filtre par metadata

---

## 📡 API ROUTES PRINCIPALES

| Endpoint | Description |
|----------|-------------|
| `GET /api/cantonal?canton=JU` | Règles cantonales |
| `GET /api/properties?canton=VD` | Liste des biens |
| `GET /api/matching?propertyId=x` | Matching locataires |
| `POST /api/auth/register` | Inscription |
| `POST /api/auth/login` | Connexion |
| `POST /api/leases` | Création bail |
| `POST /api/stripe/checkout` | Paiement commission |
| `POST /api/stripe/connect` | Onboarding Stripe |

---

## 📁 STRUCTURE DU PROJET

```
immo-cool/
├── app/
│   ├── layout.jsx           # Layout principal
│   ├── page.jsx             # Page d'accueil
│   └── globals.css
├── lib/
│   ├── auth.js              # JWT + bcrypt
│   ├── cantonal-rules.js    # Règles 26 cantons
│   ├── legal-references.js  # Taux hypothécaire + IPC
│   ├── matching.js          # Algorithme de matching
│   ├── prisma.js            # Client Prisma
│   └── stripe.js            # Stripe Connect
├── prisma/
│   └── schema.prisma        # Schéma complet BDD
├── docs/
│   ├── DEPLOY-GUIDE.md
│   └── Réglementation_Bail_Suisse_par_Canton.md
└── railway.toml
```

---

## 🔑 VARIABLES D'ENVIRONNEMENT (Railway)

- `DATABASE_URL` : PostgreSQL Railway (auto-injecté)
- `STRIPE_SECRET_KEY` : Stripe Connect (PEP's Swiss SA)
- `STRIPE_WEBHOOK_SECRET` : webhook immocool.ch
- `JWT_SECRET` : auth
- `NEXTAUTH_SECRET` : next-auth

---

## ⚠️ POINTS D'ATTENTION

1. **Stripe partagé avec PEP's V2** → toujours filtrer par metadata pour distinguer les paiements
2. **Hébergement suisse obligatoire** → Railway europe-west4 ✅
3. **Conformité légale suisse** : `lib/cantonal-rules.js` + `lib/legal-references.js` sont critiques — ne pas modifier sans validation légale
4. **next-auth v5 beta** : API peut changer — vérifier la compatibilité lors des mises à jour
5. **État des lieux** stocké en JSON dans le modèle Lease → prévoir une UI dédiée

---

## 🔗 LIENS UTILES

- Repo GitHub : https://github.com/O-N-2950/immo-cool
- Railway Dashboard : https://railway.app
- Stripe Dashboard : https://dashboard.stripe.com
- Docs réglementation : `docs/Réglementation_Bail_Suisse_par_Canton.md`
