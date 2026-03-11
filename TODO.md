# immo.cool — TODO
> Mis à jour: 12 mars 2026

## ✅ TERMINÉ

### Infrastructure
- [x] Next.js 15 sur Railway (standalone, PostgreSQL)
- [x] DNS immocool.ch + www.immocool.ch → Railway
- [x] Auto-deploy GitHub → Railway
- [x] Prisma 11 modèles, 3 migrations
- [x] Health check complet (/api/health)
- [x] start.sh avec migrations auto au démarrage

### Sécurité (audit 15/15)
- [x] JWT complet (jose, edge-compatible)
- [x] Rate limiting (5/min auth, 10/min AI, 60/min général)
- [x] CORS restrictif (whitelist 5 domaines)
- [x] XSS sanitization sur tous les POST
- [x] Validation Swiss-specific (NPA, cantons, prix, surface)
- [x] Headers HSTS, CSP, X-Frame DENY
- [x] Safe error responses (pas de stack traces)
- [x] DB indexes sur colonnes de recherche

### Auth
- [x] Login/Register pages dédiées
- [x] Dashboard authentifié (fetch /api/auth/me)
- [x] Cookies HTTP-only (immo_session, 7j)
- [x] Landing page redirige vers vraies pages auth

### IA
- [x] Chatbot juridique (droit du bail 26 cantons)
- [x] Estimateur de loyer IA (données marché + Claude)
- [x] Contestation de loyer (calcul hypo + IPC + analyse IA)
- [x] ANTHROPIC_API_KEY configurée en prod

### Outils gratuits (6 machines d'acquisition)
- [x] Générateur de bail PDF
- [x] Résiliation assistée + calcul délais
- [x] Contestation loyer IA + PDF
- [x] Calculateur loyer IA
- [x] État des lieux digital
- [x] Assistant IA chatbot

### Frontend
- [x] Landing page showcase (1740 lignes)
- [x] 6 pages outils connectées aux API
- [x] Reverse marketplace /demande (fetch /api/reverse)
- [x] SEO: sitemap 35 URLs, robots.txt, meta tags, layouts
- [x] i18n FR/DE (25 villes)
- [x] Stripe Connect architecture prête

## 🔴 PHASE 1 — Priorité haute

### Stripe Connect end-to-end
- [ ] Tester le flux complet: inscription → KYC → publication → paiement
- [ ] Vérifier les webhooks en prod (checkout.session.completed)
- [ ] Ajouter page de succès/échec paiement

### Google Search Console
- [ ] Vérifier ownership www.immocool.ch
- [ ] Soumettre sitemap.xml
- [ ] Vérifier indexation des 35 URLs
- [ ] Configurer analytics (Vercel Analytics ou Plausible)

### Polish
- [ ] Icônes PWA (icon-192.png, icon-512.png)
- [ ] Manifest.json PWA
- [ ] Favicon personnalisé
- [ ] OpenGraph images pour partage réseaux sociaux

## 🟡 PHASE 2 — Scale

### Aspirateur d'annonces
- [ ] Scraper Homegate/Comparis/ImmoScout
- [ ] Pipeline n8n pour ingestion automatique
- [ ] Déduplication et enrichissement IA

### WhatsApp Bot
- [ ] Intégration WhatsApp Business API
- [ ] Workflow n8n: demande locataire → matching → notification
- [ ] Alertes propriétaires par WhatsApp

### Widget Embed
- [ ] Composant JS embeddable pour sites tiers
- [ ] Affiche les demandes locataires
- [ ] Lead generation pour propriétaires

### Email Nurturing
- [ ] Capture email sur chaque outil
- [ ] Séquences automatiques (welcome, relance, upsell)
- [ ] Templates email transactionnels

## 🟠 PHASE 3 — Monétisation avancée

### SaaS B2B Régies
- [ ] Dashboard multi-propriétaires
- [ ] Gestion de parc immobilier
- [ ] Reporting et analytics
- [ ] API pour intégration ERP régies

### Data Monopole
- [ ] Stats loyers par commune/canton
- [ ] Rapports de marché automatisés
- [ ] API data pour partenaires

### Affiliations
- [ ] GoCaution (garantie de loyer)
- [ ] Assurance ménage
- [ ] Services de déménagement
- [ ] Rénovation / aménagement

## 🔵 PHASE 4 — Expansion

- [ ] Multi-cantons (GE, VD, NE, FR en priorité)
- [ ] Multilingue complet (IT, EN)
- [ ] App mobile native (React Native)
- [ ] Marketplace artisans avec ratings
- [ ] Gestion comptable automatisée
