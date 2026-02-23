# CONTEXT.md — www.immocool.ch
> Dernière mise à jour : 23 février 2026 (session 5 — stratégie révolutionnaire)
> Coller en début de chaque nouvelle conversation Claude

---

## 🎯 VISION
**immocool.ch** = Première régie immobilière 100% IA de Suisse. Zéro intervention humaine. On ne cherche pas les utilisateurs — on s'incruste partout où ils sont déjà (embed, WhatsApp, SEO). On aspire propriétaires et locataires via des outils gratuits irrésistibles, du scraping automatisé, et une reverse marketplace. On domine par la data, l'IA, et l'infrastructure invisible.

**Ambition :** Devenir le Stripe de l'immobilier suisse — personne ne visite notre site, mais notre tech est partout.

- **Repo :** https://github.com/O-N-2950/immo-cool
- **Prod :** https://www.immocool.ch
- **Railway :** europe-west4, auto-deploy GitHub

---

## 💰 MODÈLE ÉCONOMIQUE (7 flux de revenus)

### Flux principaux
| # | Source | Montant | Type | Trigger |
|---|--------|---------|------|---------|
| 1 | Commission propriétaire | **50% du 1er loyer** | One-shot | Signature du bail |
| 2 | Commission artisan | **10%** par intervention | Récurrent | Chaque intervention |
| 3 | Documents premium | **CHF 29** (bail + e-signature + EDL + notifs) | One-shot | Choix du proprio |
| 4 | SaaS régies B2B | **CHF 99-299/mois** white-label | Récurrent | Abonnement |
| 5 | Contestation loyer IA | **CHF 49** ou 10% de l'économie annuelle | One-shot | Locataire conteste |

### Flux d'affiliation (passifs, automatiques)
| # | Partenaire | Commission | Trigger |
|---|------------|-----------|---------|
| 6 | GoCaution / SwissCaution | ~CHF 50-80/contrat | Signature bail → garantie |
| 7 | Assurance RC ménage (Helvetia, Mobilière) | ~CHF 30-50/an | Signature bail → proposition |
| 8 | Déménageurs / Poste réexpédition | ~CHF 50-100/lead | Changement locataire |

### Flux gratuit locataires = TOUJOURS GRATUIT

---

## 🚀 STRATÉGIE SCALE — 8 MACHINES

### Machine 1 : OUTILS GRATUITS → FUNNEL SEO
- **/outils/bail-gratuit** → Générateur bail PDF 26 cantons → email capturé → "publiez ce bien"
- **/outils/resiliation** → Générateur résiliation → locataire capturé → "trouvez mieux"
- **/outils/calculateur-loyer** → "Votre loyer est X% trop élevé" → push recherche
- **/outils/etat-des-lieux** → PDF pro gratuit → logo immo.cool sur chaque document
- **/outils/assistant-ia** → Chatbot expert droit du bail 24/7
- **/outils/contestation** → ⭐ Analyse bail + génère lettre de contestation auto
- Chaque PDF généré = pub gratuite (logo imprimé, circule entre parties)

### Machine 2 : ASPIRATEUR (scraping + outreach IA)
- Scraper chaque nuit : Homegate, ImmoScout24, tous-les-logements.ch, Flatfox
- Identifier propriétaires → email auto personnalisé par Claude
- "Votre bien en ligne depuis X jours. Nous avons Y locataires qualifiés. Import 1-clic. Payez seulement si ça marche."
- **Stack :** n8n + Prisma + Resend + Claude

### Machine 3 : REVERSE MARKETPLACE ⭐
- Locataires publient GRATUITEMENT leurs critères de recherche
- "3.5p, Delémont, max CHF 1300, couple, CDI, 8500/mois"
- Propriétaires voient la DEMANDE RÉELLE → viennent lister leur bien
- Résout le chicken-and-egg : on commence par le côté gratuit (locataires)
- Propriétaires paient (50% 1er loyer) PARCE QUE les candidats sont déjà là

### Machine 4 : WIDGET EMBED ⭐ (le Stripe de l'immo)
- `<script src="immocool.ch/embed.js"></script>` → intégrable sur n'importe quel site
- Communes, notaires, fiduciaires, blogs immo, comparateurs → intègrent nos outils
- Chaque embed = notre marque sur leur site
- Chaque document généré via embed = logo immo.cool
- On devient l'infrastructure invisible de l'immobilier suisse

### Machine 5 : BOT WHATSAPP ⭐
- 90% des Suisses sur WhatsApp → on est dans leur poche
- "résiliation bail genève" → PDF généré
- "cherche 3.5p delémont max 1400" → biens dispo
- Photo de lettre de hausse → IA analyse + dit si légal + génère contestation
- Zéro app, zéro site → conversation naturelle
- **Stack :** Twilio/WhatsApp Business API + Claude + PDF gen

### Machine 6 : CONTESTATION LOYER IA ⭐ (arme nucléaire)
- Locataire saisit son bail → IA compare : taux hypo, IPC, loyers du quartier
- "Votre loyer est 22% trop élevé. Baisse possible : CHF 280/mois."
- Génère lettre de contestation conforme automatiquement
- **EXPLOSIF côté médias** → PR gratuite massive
- Propriétaires viennent fixer des loyers justes dès le départ → moins de litiges
- Monétisation : CHF 49 ou 10% de l'économie annuelle

### Machine 7 : B2B SaaS RÉGIES
- ~1500 petites régies en Suisse galèrent avec conformité 26 cantons
- White-label : bail auto + taux hypo + IPC + formulaire loyer initial
- CHF 99-299/mois
- Chaque régie cliente = distributeur involontaire d'immo.cool

### Machine 8 : MONOPOLE DATA
- Chaque outil utilisé = données loyers réels
- Devenir LA référence suisse
- Médias citent → SEO gratuit
- Communes consultent → crédibilité institutionnelle
- Dashboard public de statistiques par ville/canton → viral
- API data en freemium pour développeurs/chercheurs

---

## 🏗️ STACK TECHNIQUE

| Couche | Tech |
|--------|------|
| Framework | Next.js 15 (App Router) + React 19 |
| UI | "Swiss Noir Luxury" v3 — Cormorant Garamond + DM Sans + JetBrains Mono |
| BDD | PostgreSQL + Prisma 5 (Railway) |
| Auth | JWT + bcrypt (next-auth v5 beta) |
| Paiements | Stripe Connect |
| IA | Claude API server-side (/api/ai/*) — chat + estimation + contestation |
| Charts | Recharts |
| Icons | Lucide React |
| Automation | n8n (scraping, emails, relances) |
| Email | Resend (free tier 100/jour) |
| WhatsApp | Twilio / WhatsApp Business API |
| Embed | Script JS autonome (iframes + postMessage) |
| Deploy | Railway auto-deploy GitHub |

---

## 📄 STRUCTURE REPO

```
app/
├── page.jsx                        # Landing
├── layout.jsx                      # SEO, PWA, fonts
├── globals.css, sitemap.js, robots.js
├── appartements/[city]/page.jsx    # SEO FR (13 villes)
├── wohnungen/[city]/page.jsx       # SEO DE (12 villes)
├── outils/
│   ├── bail-gratuit/page.jsx       # ⭐ Générateur bail 6 étapes
│   ├── resiliation/page.jsx        # Générateur résiliation
│   ├── calculateur-loyer/page.jsx  # Calculateur IA
│   ├── etat-des-lieux/page.jsx     # Générateur EDL
│   ├── assistant-ia/page.jsx       # Chatbot IA public
│   └── contestation/page.jsx       # ⭐ Analyse + contestation loyer IA
├── demande/page.jsx                # ⭐ Reverse marketplace (locataires publient critères)
├── blog/[slug]/page.jsx            # Articles SEO
├── components/ImmoCool.jsx         # UI principale (1706 lignes)
├── embed/                          # ⭐ Widget embedable pour sites tiers
└── api/
    ├── ai/ (chat, estimate, contest) # IA server-side
    ├── tools/ (generate-bail, generate-resiliation, generate-edl)
    ├── scraper/                    # Scraping portails
    ├── whatsapp/webhook/           # Bot WhatsApp
    ├── embed/                      # API pour widgets embed
    ├── reverse/                    # API reverse marketplace
    ├── auth/, cantonal/, properties/, matching/, leases/
    ├── legal-references/, documents/
    ├── stripe/ (checkout, connect, webhook, artisan)
    └── health/
public/ manifest.json, icon.svg
lib/ cantonal-rules, legal-references, matching, documents/, auth, prisma, stripe
prisma/schema.prisma (11+ modèles)
```

---

## 🖥️ UI — ImmoCool.jsx (1706 lignes)
- i18n FR/DE, responsive, PWA
- Chatbot IA + Estimateur IA (Claude API server-side)
- 17 écrans (landing, auth, dashboards proprio/locataire, SEO villes)
- Composants : SignaturePad, PropertyMap, VisitScheduler, NotifPanel, Ring, AIChatbot, RentEstimator, LangSwitch

---

## 📋 TODO — ROAD TO DOMINATION

### 🔴 PHASE 1 — MVP LIVE (semaines 1-4) — objectif : premier euro
- [ ] Finir /outils/bail-gratuit (6 étapes → PDF) — PRIORITÉ #1
- [ ] /outils/resiliation (formulaire → PDF)
- [ ] /outils/calculateur-loyer (→ /api/ai/estimate)
- [ ] /outils/assistant-ia (chatbot → /api/ai/chat)
- [ ] /outils/contestation ⭐ (analyse bail → lettre auto) — BUZZ MÉDIATIQUE
- [ ] Connecter auth réelle (JWT cookies middleware)
- [ ] Connecter ImmoCool.jsx aux API (remplacer mocks)
- [ ] Génération PDF réelle (pdfkit ou html-pdf)
- [ ] Stripe Connect prod
- [ ] Deploy Railway → www.immocool.ch LIVE
- [ ] Google Search Console + sitemap
- [ ] Icônes PWA

### 🟡 PHASE 2 — ASPIRATION (semaines 4-8) — objectif : 100 biens
- [ ] /demande/ → Reverse marketplace (locataires publient critères)
- [ ] Scraper Homegate + ImmoScout24 + Flatfox (n8n nocturne)
- [ ] Outreach email auto IA (Resend + Claude)
- [ ] Import 1-clic d'annonce existante
- [ ] Intégrer GoCaution dans flow signature
- [ ] Intégrer assurance RC ménage (affiliation)
- [ ] Blog SEO : 10-20 articles cibles
- [ ] Bot WhatsApp ⭐ (Twilio + Claude)
- [ ] Google Ads mini budget CHF 200-500/mois sur outils gratuits

### 🟢 PHASE 3 — MONÉTISATION (mois 2-4) — objectif : CHF 10k MRR
- [ ] Bail premium CHF 29 (e-signature + EDL + notifs)
- [ ] Contestation loyer CHF 49 ou 10% économie
- [ ] Marketplace artisans live (Stripe Connect)
- [ ] Widget embed ⭐ (script JS pour sites tiers)
- [ ] Dashboard data public (stats loyers par ville) → SEO viral
- [ ] Contact presse (QJ, RTS, 20 Minutes) avec outil contestation = angle médiatique fort
- [ ] Programme parrainage propriétaire → propriétaire

### 🔵 PHASE 4 — DOMINATION (mois 4-12) — objectif : leader Romandie
- [ ] SaaS B2B white-label régies CHF 99-299/mois
- [ ] API publique données loyers (freemium)
- [ ] Paiement instantané propriétaire (partenariat fintech)
- [ ] Italien dans i18n
- [ ] Résiliation auto (envoi recommandé API Poste)
- [ ] Comparaison photos EDL via IA vision
- [ ] App mobile native ou PWA avancée
- [ ] Expansion Suisse alémanique agressive
- [ ] Levée de fonds si traction confirmée

---

## ⚠️ POINTS D'ATTENTION
1. Stripe partagé PEP's Swiss SA — webhooks filtrent metadata
2. État des lieux = seul processus non 100% auto (présence physique obligatoire)
3. Scraping portails : légal si données publiques, pas de surcharge
4. ANTHROPIC_API_KEY en env Railway — JAMAIS côté client
5. Taux hypo : toujours depuis LegalReference BDD
6. 26 cantons règles différentes
7. Domaine : www.immocool.ch (immo.cool en attente TMCH Namebay)
8. Contestation loyer : préciser qu'on n'est pas avocats (disclaimer légal)
9. WhatsApp Business API : nécessite validation Meta (~2 semaines)

## 🔑 ENV VARS (Railway)
DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, JWT_SECRET, ANTHROPIC_API_KEY, TWILIO_SID, TWILIO_AUTH_TOKEN, WHATSAPP_NUMBER, RESEND_API_KEY
