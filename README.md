# 🏠 immo.cool

**La plateforme immobilière 100% gratuite pour les locataires.**

> 50% moins cher qu'une régie — et gratuit pour les locataires.

## 🚀 Live

- **Production**: https://immo-cool-production.up.railway.app
- **Custom domain**: https://www.immocool.ch

## 🏗️ Architecture

- **Frontend**: Next.js 15 + React 19 (App Router)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL via Prisma ORM
- **Payments**: Stripe Connect
- **Hosting**: Railway (europe-west4)
- **CI/CD**: GitHub → Railway auto-deploy

## 📦 Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, custom design system |
| Database | PostgreSQL + Prisma 5 |
| Auth | JWT + bcrypt |
| Payments | Stripe Connect |
| Fonts | Playfair Display + DM Sans + JetBrains Mono |

## 🇨🇭 Fonctionnalités

### Moteur de règles cantonales (26 cantons)
- Dates de résiliation officielles
- Formulaire de loyer initial obligatoire
- Validation de conformité automatique
- Taux hypothécaire de référence (1.25%)

### Matching intelligent
- Score de compatibilité 0-100
- Budget, localisation, timing, profil locataire
- Classement automatique des candidatures

### Stripe Connect
- Commission propriétaire: 50% du premier loyer
- Commission artisan: 10%
- Webhook avec filtre metadata (cohabitation PEP's V2)

### API Routes
| Endpoint | Description |
|----------|------------|
| `GET /api/cantonal?canton=JU` | Règles cantonales |
| `GET /api/properties?canton=VD` | Liste des biens |
| `GET /api/matching?propertyId=x` | Matching locataires |
| `POST /api/auth/register` | Inscription |
| `POST /api/auth/login` | Connexion |
| `POST /api/leases` | Création de bail |
| `POST /api/stripe/checkout` | Paiement commission |
| `POST /api/stripe/connect` | Onboarding Stripe |

## 🛠️ Développement

```bash
npm install
npm run dev
```

## 📋 Tarifs (Plan B)

| | Locataire | Propriétaire |
|--|----------|-------------|
| **Prix** | **GRATUIT** | 50% du 1er loyer |
| Recherche | ✅ Illimité | ✅ |
| Matching | ✅ | ✅ |
| Bail conforme | ✅ | ✅ |
| 26 cantons | ✅ | ✅ |

## 📄 License

Propriétaire — immo.cool © 2026
