# TODO — immo.cool
## Dernière mise à jour : 6 mars 2026

---

## ✅ FAIT (v3.2)
- [x] 6 outils gratuits frontend + backend
- [x] Moteur PDF unifié (bail, résiliation, contestation, EDL)
- [x] 3 endpoints IA (chat, estimation, contestation)
- [x] Reverse marketplace /demande avec BDD
- [x] Anti-crash WinWin V2 (instrumentation, restart x10, healthcheck)
- [x] Middleware sécurité (redirect, headers, auth gate)
- [x] Error boundaries (global-error, not-found)
- [x] 26 env vars configurées Railway
- [x] Prisma migrations auto au démarrage
- [x] SEO: sitemap 33 URLs, layouts, metadata
- [x] i18n FR/DE (80+ clés, 25 villes)
- [x] Landing page complète (~1750 lignes)
- [x] Build clean 42 routes, 0 erreurs

---

## 🔴 PHASE 1 — PRIORITAIRE (clients existants)

### Auth & Inscription
- [ ] Page /login avec formulaire email/mot de passe
- [ ] Page /register avec choix rôle (propriétaire/locataire/artisan)
- [ ] API /api/auth/me — retour profil utilisateur connecté
- [ ] API /api/auth/logout — suppression cookie
- [ ] Middleware auth complet (vérif JWT dans routes protégées)
- [ ] Page /dashboard — redirection selon rôle

### Dashboard Propriétaire
- [ ] Connecter ImmoCool.jsx wizard création bien → POST /api/properties
- [ ] Liste de mes biens (GET /api/properties?owner=me)
- [ ] Voir les candidatures reçues
- [ ] Stripe Connect onboarding (flux réel, pas mock)
- [ ] Paiement commission 50% après signature bail

### Dashboard Locataire
- [ ] Page profil locataire (scoring, vérification)
- [ ] Candidater à un bien
- [ ] Suivi de mes candidatures
- [ ] Reverse marketplace : mes demandes actives

### Connecter Frontend → API
- [ ] Landing page : remplacer données mock par vrais appels API
- [ ] /demande : charger les demandes depuis /api/reverse (plus de seed data)
- [ ] Outils : connecter génération PDF réelle (download du fichier)

### Stripe Production
- [ ] Créer les produits Stripe (commission, documents premium)
- [ ] Flux paiement commission propriétaire
- [ ] Webhook Stripe fonctionnel (signature + traitement)
- [ ] Page succès/annulation paiement

---

## 🟡 PHASE 2 — GROWTH

### SEO & Acquisition
- [ ] Google Search Console → soumettre sitemap
- [ ] Google Analytics / Plausible
- [ ] Générer icônes PWA (icon-192.png, icon-512.png)
- [ ] Méta tags Open Graph avec images
- [ ] Blog /articles pour SEO longue traîne

### Aspirateur d'annonces
- [ ] Scraper Immoscout24, Homegate, Anibis
- [ ] Stockage annonces en BDD (dédup par adresse)
- [ ] Matching automatique annonces ↔ demandes locataires
- [ ] Alertes email pour locataires

### Notifications
- [ ] Email transactionnel (Resend/Sendgrid)
- [ ] Notification nouvelle candidature → propriétaire
- [ ] Notification réponse → locataire
- [ ] Rappel expiration demande (J-7)

### WhatsApp Bot
- [ ] Intégration WhatsApp Business API
- [ ] Chatbot droit du bail via WhatsApp
- [ ] Alertes nouvelles annonces par WhatsApp

---

## 🔵 PHASE 3 — SCALE

### Widget Embed
- [ ] Script embed pour sites de régies
- [ ] Calculateur de loyer en widget
- [ ] Formulaire de candidature embed

### SaaS B2B
- [ ] Dashboard régie (multi-propriétaires)
- [ ] API management pour régies
- [ ] Abonnement mensuel Stripe

### Data & Analytics
- [ ] Dashboard analytics (visites, conversions)
- [ ] Export data par canton
- [ ] Indices de marché automatisés

---

## 🟣 PHASE 4 — EXPANSION

- [ ] Expansion multi-cantons (VD, GE, BE, ZH)
- [ ] Contestation premium avec avocat partenaire
- [ ] Assurance loyer intégrée (affiliation)
- [ ] App mobile PWA complète
- [ ] Signature électronique légale (Skribble)

---

## Points d'attention
- ⚠️ Stripe: clés TEST, passer en LIVE avant premiers paiements réels
- ⚠️ Disclaimers juridiques sur tous les outils (pas un substitut d'avocat)
- ⚠️ RGPD/LPD : politique de confidentialité à compléter
- ⚠️ 26 cantons = 26 règles → cantonal-rules.js à enrichir progressivement
- ⚠️ Taux hypothécaire et IPC : vérifier régulièrement les valeurs OFL/OFS
