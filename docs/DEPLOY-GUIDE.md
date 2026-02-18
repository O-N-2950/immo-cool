# 🚀 Guide de déploiement immo.cool

## ✅ Ce qui est fait

- **GitHub** : https://github.com/O-N-2950/immo-cool
- **Build Next.js** : testé et validé ✓
- **railway.toml** : configuré pour déploiement auto ✓
- **Structure** :
  ```
  immo-cool/
  ├── app/
  │   ├── components/
  │   │   └── ImmoCool.jsx    ← Prototype complet
  │   ├── globals.css
  │   ├── layout.jsx          ← SEO + Google Fonts
  │   └── page.jsx
  ├── docs/
  │   ├── immo-cool-business-analysis.jsx
  │   └── Réglementation_Bail_Suisse_par_Canton.md
  ├── next.config.js           ← Output standalone (Railway-ready)
  ├── package.json
  ├── railway.toml             ← Config Railway
  └── README.md
  ```

---

## 🚂 Déployer sur Railway (3 minutes)

### Étape 1 — Créer un compte Railway
1. Va sur **https://railway.app**
2. Connecte-toi avec ton compte GitHub (O-N-2950)

### Étape 2 — Nouveau projet
1. Clique **"New Project"**
2. Sélectionne **"Deploy from GitHub Repo"**
3. Cherche et sélectionne **`O-N-2950/immo-cool`**

### Étape 3 — Déploiement automatique
- Railway détecte automatiquement Next.js
- Le `railway.toml` configure la commande de start
- Le build se lance immédiatement
- En ~2 minutes, ton site est live !

### Étape 4 — Domaine personnalisé
1. Dans les settings du service, onglet **"Networking"**
2. Clique **"Generate Domain"** pour un `.up.railway.app`
3. Puis **"Custom Domain"** → ajoute **immo.cool**
4. Configure le DNS chez ton registrar :
   - **CNAME** : `www` → `<ton-app>.up.railway.app`
   - **A record** ou **ALIAS** : `@` → IP fournie par Railway

---

## 🔄 Déploiement continu

Chaque `git push` sur `main` déclenche automatiquement un redéploiement.

```bash
# Workflow quotidien
git add -A
git commit -m "description du changement"
git push
# → Railway redéploie automatiquement en ~2 min
```

---

## ⚡ Alternative : Vercel (backup)

Si Railway pose problème, Vercel fonctionne aussi :
1. Va sur **https://vercel.com**
2. **"Import Project"** → sélectionne `O-N-2950/immo-cool`
3. Déploiement immédiat avec preview URL
4. Configure le domaine immo.cool dans les settings

---

## 🔮 Prochaines étapes techniques

1. **Base de données** : Ajouter PostgreSQL dans Railway (1 clic)
2. **Stripe Connect** : Intégrer le paiement 50% propriétaire
3. **Auth** : Ajouter l'authentification (NextAuth.js)
4. **API Routes** : Backend dans `/app/api/`
5. **GoCaution** : Intégrer la garantie de loyer
6. **Moteur cantonal** : Base de règles par canton (Jura d'abord)
