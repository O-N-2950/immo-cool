# TODO.md — immocool.ch Road to Domination
> Mise à jour : 23 février 2026

## Légende
- 🔴 = Critique (bloquant)
- 🟡 = Important (scale)
- 🟢 = Monétisation
- 🔵 = Domination
- ✅ = Fait
- 🚧 = En cours
- ⭐ = Avantage compétitif unique

---

## 🔴 PHASE 1 — MVP LIVE (semaines 1-4)
**Objectif : premier euro encaissé**

### Outils publics gratuits (funnel)
- [🚧] /outils/bail-gratuit — Générateur bail PDF 26 cantons, 6 étapes
- [ ] /outils/resiliation — Générateur résiliation PDF
- [ ] /outils/calculateur-loyer — Estimation IA via /api/ai/estimate
- [ ] /outils/assistant-ia — Chatbot IA public via /api/ai/chat
- [ ] /outils/contestation ⭐ — Analyse bail + lettre contestation auto (BUZZ MÉDIAS)
- [ ] /outils/etat-des-lieux — Générateur EDL PDF

### Technique
- [✅] Structure Next.js 15 + App Router
- [✅] UI ImmoCool.jsx v3.1 (1706 lignes, i18n, responsive, PWA)
- [✅] API routes backend (auth, cantonal, properties, matching, leases, etc.)
- [✅] API IA server-side (/api/ai/chat + /api/ai/estimate avec fallback)
- [✅] Prisma schema 11 modèles
- [✅] SEO pages villes FR (13) + DE (12)
- [✅] Sitemap dynamique + robots.txt
- [✅] PWA manifest
- [ ] Connecter auth réelle (JWT → cookies → middleware Next.js)
- [ ] Connecter frontend aux API (remplacer TOUTES les données mock)
- [ ] Génération PDF réelle (bail, EDL, résiliation) — pdfkit ou puppeteer
- [ ] Stripe Connect onboarding production
- [ ] Deploy fonctionnel Railway → www.immocool.ch
- [ ] Google Search Console + soumettre sitemap
- [ ] Générer icônes PWA (icon-192.png, icon-512.png)
- [ ] Tests basiques (routes API + génération PDF)

---

## 🟡 PHASE 2 — ASPIRATION (semaines 4-8)
**Objectif : 100 biens listés, 500 locataires inscrits**

### Acquisition automatisée
- [ ] Scraper nocturne Homegate + ImmoScout24 + Flatfox (n8n)
- [ ] Templates email outreach IA (Resend + Claude personnalisation)
- [ ] Import 1-clic d'annonce existante vers immo.cool
- [ ] /demande/ ⭐ — Reverse marketplace (locataires publient critères)

### Canaux
- [ ] Bot WhatsApp ⭐ (Twilio + Claude + PDF gen)
- [ ] Blog SEO : 10-20 articles ("délai résiliation genève", "formulaire loyer initial vaud", etc.)
- [ ] Google Ads budget mini CHF 200-500/mois ciblant outils gratuits

### Monétisation early
- [ ] Intégrer GoCaution/SwissCaution dans flow signature bail (affiliation)
- [ ] Intégrer proposition assurance RC ménage (affiliation)

---

## 🟢 PHASE 3 — MONÉTISATION (mois 2-4)
**Objectif : CHF 10'000 MRR**

### Revenus directs
- [ ] Bail premium CHF 29 (e-signature intégrée + EDL pré-rempli + notifications)
- [ ] Contestation loyer : CHF 49 flat ou 10% de l'économie annuelle
- [ ] Marketplace artisans live (Stripe Connect onboarding artisans)

### Distribution
- [ ] Widget embed ⭐ (`<script>` pour communes, notaires, fiduciaires)
- [ ] Dashboard data public : stats loyers par ville/canton → SEO viral
- [ ] Programme parrainage propriétaire → propriétaire (CHF 50 crédit)

### PR / Médias
- [ ] Communiqué de presse avec angle "contestation loyer IA"
- [ ] Contact : Le Quotidien Jurassien, RTS Info, 20 Minutes, ICTjournal
- [ ] Publication données exclusives ("loyers moyens Jura Q1 2026")

---

## 🔵 PHASE 4 — DOMINATION (mois 4-12)
**Objectif : leader Romandie, expansion Suisse alémanique**

### Produits
- [ ] SaaS B2B white-label pour régies — CHF 99-299/mois
- [ ] API publique données loyers (freemium : 100 req/jour gratuit, pro CHF 49/mois)
- [ ] Paiement instantané propriétaire (partenariat fintech type Advanon)

### Tech avancée
- [ ] Résiliation auto avec envoi recommandé (API Poste Suisse)
- [ ] Comparaison photos EDL via IA vision (Claude)
- [ ] Scoring locataire amélioré (historique, revenus vérifiés)
- [ ] Italien dans i18n
- [ ] App mobile native (React Native) ou PWA avancée

### Expansion
- [ ] SEO agressif Suisse alémanique (DE)
- [ ] Partenariats communes Jura puis Romandie
- [ ] Levée de fonds si traction confirmée (objectif : CHF 500k seed)
- [ ] Embauche #1 : growth marketer

---

## MÉTRIQUES CLÉS À SUIVRE
| Métrique | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|----------|---------|---------|---------|---------|
| Biens listés | 5 | 100 | 500 | 2'000 |
| Locataires inscrits | 20 | 500 | 3'000 | 15'000 |
| PDFs générés/mois | 50 | 500 | 2'000 | 10'000 |
| Baux signés/mois | 1 | 10 | 50 | 200 |
| MRR (CHF) | 0 | 1'000 | 10'000 | 50'000 |
| Visites site/mois | 200 | 5'000 | 30'000 | 150'000 |
