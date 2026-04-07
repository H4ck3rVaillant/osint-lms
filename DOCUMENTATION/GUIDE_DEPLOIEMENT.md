# 🚀 GUIDE DE DÉPLOIEMENT COMPLET

**Version:** 2.0  
**Dernière mise à jour:** 08/04/2026

---

## 📋 TABLE DES MATIÈRES

1. [Déploiement Frontend (Vercel)](#déploiement-frontend-vercel)
2. [Déploiement Backend (Render)](#déploiement-backend-render)
3. [Déploiement Argus API (Render)](#déploiement-argus-api-render)
4. [Configuration DNS (GoDaddy)](#configuration-dns-godaddy)
5. [Base de données (Neon)](#base-de-données-neon)
6. [Workflows complets](#workflows-complets)

---

## 🎨 DÉPLOIEMENT FRONTEND (VERCEL)

### **Setup initial (fait une seule fois)**

#### **Étape 1 - Connecter GitHub à Vercel**

```bash
# 1. Créer compte Vercel
https://vercel.com/signup

# 2. Importer le projet
Vercel Dashboard → New Project → Import Git Repository
→ Sélectionner: H4ck3r/osint-lms
→ Root Directory: osint-lms-frontend

# 3. Configuration build
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install

# 4. Deploy
Cliquer "Deploy"
Attendre 2-3 minutes
```

#### **Étape 2 - Configurer domaine custom**

```bash
# 1. Ajouter le domaine
Vercel Dashboard → Project Settings → Domains
→ Add Domain: www.cyberosint-academy.com

# 2. Vercel donne les DNS records
A Record: 76.76.21.21
CNAME: cname.vercel-dns.com

# 3. Ajouter dans GoDaddy (voir section DNS)

# 4. Attendre validation (24-48h)
# Vercel provisionne automatiquement le SSL
```

---

### **Workflow de déploiement quotidien**

```bash
┌─────────────────────────────────────────────────┐
│  1. DÉVELOPPEMENT LOCAL                         │
└─────────────────────────────────────────────────┘
cd ~/osint-lms/osint-lms-frontend
npm run dev
# Tester sur http://localhost:5173

┌─────────────────────────────────────────────────┐
│  2. MODIFICATIONS                               │
└─────────────────────────────────────────────────┘
# Éditer les fichiers dans src/
# Ex: src/pages/Dashboard.tsx

┌─────────────────────────────────────────────────┐
│  3. TEST BUILD                                  │
└─────────────────────────────────────────────────┘
npm run build
npm run preview
# Tester sur http://localhost:4173

┌─────────────────────────────────────────────────┐
│  4. COMMIT & PUSH                               │
└─────────────────────────────────────────────────┘
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

┌─────────────────────────────────────────────────┐
│  5. AUTO-DEPLOY VERCEL                          │
└─────────────────────────────────────────────────┘
# Automatique dès le push !
# Vercel Dashboard → Deployments
# Attendre 1-2 minutes
# ✅ https://www.cyberosint-academy.com mis à jour

┌─────────────────────────────────────────────────┐
│  6. VÉRIFICATION                                │
└─────────────────────────────────────────────────┘
# Ouvrir le site
# Vider cache (Ctrl+Shift+R)
# Tester la fonctionnalité
```

---

### **Rollback en cas de problème**

```bash
# 1. Vercel Dashboard → Deployments
# 2. Trouver le dernier déploiement fonctionnel
# 3. Cliquer "..." → "Promote to Production"
# 4. Confirmer
# ✅ Retour à la version précédente instantané

# OU via Git
git log --oneline  # Trouver le bon commit
git revert <commit_hash>
git push origin main
# Vercel redéploie automatiquement
```

---

## 🔧 DÉPLOIEMENT BACKEND (RENDER)

### **Setup initial (fait une seule fois)**

#### **Étape 1 - Créer le service Render**

```bash
# 1. Créer compte Render
https://render.com/register

# 2. New Web Service
Dashboard → New → Web Service

# 3. Connecter GitHub
→ Connect Repository: H4ck3r/osint-lms
→ Select: osint-lms-backend

# 4. Configuration
Name: osint-lms-backend
Environment: Node
Region: Oregon (US West)
Branch: main
Root Directory: osint-lms-backend
Build Command: npm install
Start Command: node server.js
Instance Type: Free

# 5. Variables d'environnement
DATABASE_URL = postgresql://osint_lms_db_user:***@...
JWT_SECRET = bc394b82843f0438ae035ebd...
NODE_ENV = production
PORT = 10000

# 6. Deploy
Cliquer "Create Web Service"
Attendre 3-5 minutes
```

#### **Étape 2 - Configurer auto-deploy (optionnel)**

```bash
# Render Dashboard → Service Settings
→ Build & Deploy
→ Auto-Deploy: Yes
→ Branch: main

# Maintenant push sur main = auto-deploy
```

---

### **Workflow de déploiement quotidien**

```bash
┌─────────────────────────────────────────────────┐
│  1. DÉVELOPPEMENT LOCAL                         │
└─────────────────────────────────────────────────┘
cd ~/osint-lms/osint-lms-backend
npm start
# Tester sur http://localhost:3000

┌─────────────────────────────────────────────────┐
│  2. MODIFICATIONS                               │
└─────────────────────────────────────────────────┘
# Éditer routes/game.js par exemple

┌─────────────────────────────────────────────────┐
│  3. TEST API                                    │
└─────────────────────────────────────────────────┘
# Postman ou curl
curl http://localhost:3000/

┌─────────────────────────────────────────────────┐
│  4. COMMIT & PUSH                               │
└─────────────────────────────────────────────────┘
git add .
git commit -m "fix: correction endpoint leaderboard"
git push origin main

┌─────────────────────────────────────────────────┐
│  5. DEPLOY MANUEL RENDER                        │
└─────────────────────────────────────────────────┘
# Render Dashboard → osint-lms-backend
→ Manual Deploy
→ Deploy latest commit
→ Attendre 2-3 minutes

┌─────────────────────────────────────────────────┐
│  6. VÉRIFICATION                                │
└─────────────────────────────────────────────────┘
curl https://osint-lms-backend.onrender.com/
# Doit renvoyer: {"message":"OSINT-LMS backend opérationnel"}

# Tester dans l'app
# Ouvrir www.cyberosint-academy.com
# Se connecter
# Vérifier leaderboard/progression
```

---

### **Monitoring & Logs**

```bash
# Logs temps réel
Render Dashboard → Service → Logs

# Métriques
Render Dashboard → Metrics
→ CPU Usage
→ Memory Usage
→ Request Count

# Restart manuel si besoin
Render Dashboard → Manual Deploy → Restart Service
```

---

## 🔬 DÉPLOIEMENT ARGUS API (RENDER)

### **Setup initial**

```bash
# 1. Render Dashboard → New Web Service
Repository: osint-lms
Root Directory: argus-service
Environment: Python
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT

# 2. Deploy
# Pas de variables d'env nécessaires
# CORS configuré directement dans main.py
```

---

### **Workflow déploiement**

```bash
┌─────────────────────────────────────────────────┐
│  1. DÉVELOPPEMENT LOCAL                         │
└─────────────────────────────────────────────────┘
cd ~/osint-lms/argus-service

# Créer venv (première fois)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer dépendances
pip install -r requirements.txt

# Lancer
uvicorn main:app --reload
# Test: http://localhost:8000

┌─────────────────────────────────────────────────┐
│  2. MODIFICATIONS                               │
└─────────────────────────────────────────────────┘
# Éditer main.py
# Ex: Ajouter nouveau module OSINT

┌─────────────────────────────────────────────────┐
│  3. TEST API                                    │
└─────────────────────────────────────────────────┘
curl http://localhost:8000/api/whois/google.com

┌─────────────────────────────────────────────────┐
│  4. COMMIT & PUSH                               │
└─────────────────────────────────────────────────┘
git add .
git commit -m "feat: add new OSINT module"
git push origin main

┌─────────────────────────────────────────────────┐
│  5. DEPLOY MANUEL RENDER                        │
└─────────────────────────────────────────────────┘
# https://dashboard.render.com/web/srv-d6a9nfili9vc73akjdu0
→ Manual Deploy → Deploy latest commit

┌─────────────────────────────────────────────────┐
│  6. VÉRIFICATION                                │
└─────────────────────────────────────────────────┘
curl https://argus-api-aqr6.onrender.com/
# Tester dans Argus Console
```

---

## 🌐 CONFIGURATION DNS (GODADDY)

### **Setup complet**

```bash
┌─────────────────────────────────────────────────┐
│  1. ACCÉDER AU DNS MANAGER                      │
└─────────────────────────────────────────────────┘
https://dcc.godaddy.com/manage/dns
→ Sélectionner: cyberosint-academy.com

┌─────────────────────────────────────────────────┐
│  2. AJOUTER A RECORD                            │
└─────────────────────────────────────────────────┘
Type: A
Name: @ (root domain)
Value: 76.76.21.21
TTL: 600 (10 minutes)

┌─────────────────────────────────────────────────┐
│  3. AJOUTER CNAME POUR WWW                      │
└─────────────────────────────────────────────────┘
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (1 hour)

┌─────────────────────────────────────────────────┐
│  4. AJOUTER TXT POUR GOOGLE                     │
└─────────────────────────────────────────────────┘
Type: TXT
Name: @
Value: google-site-verification=xxxxx
TTL: 3600

(Récupérer la valeur dans Google Search Console)

┌─────────────────────────────────────────────────┐
│  5. SAUVEGARDER                                 │
└─────────────────────────────────────────────────┘
→ Save Changes
→ Attendre propagation (24-48h)

┌─────────────────────────────────────────────────┐
│  6. VÉRIFICATION                                │
└─────────────────────────────────────────────────┘
# Test DNS
dig www.cyberosint-academy.com

# Test propagation mondiale
https://dnschecker.org
```

---

### **Vérification DNS rapide**

```bash
# Windows
nslookup www.cyberosint-academy.com

# Mac/Linux
dig www.cyberosint-academy.com

# Devrait afficher:
# www.cyberosint-academy.com. 3600 IN CNAME cname.vercel-dns.com.
```

---

## 💾 BASE DE DONNÉES (NEON)

### **Setup initial**

```bash
┌─────────────────────────────────────────────────┐
│  1. CRÉER COMPTE NEON                           │
└─────────────────────────────────────────────────┘
https://console.neon.tech/sign_up

┌─────────────────────────────────────────────────┐
│  2. CRÉER PROJET                                │
└─────────────────────────────────────────────────┘
→ New Project
Name: osint-lms-db
Region: AWS us-east-2 (Ohio)
PostgreSQL Version: 16

┌─────────────────────────────────────────────────┐
│  3. RÉCUPÉRER CONNECTION STRING                 │
└─────────────────────────────────────────────────┘
Dashboard → Connection Details
→ Copier: postgresql://osint_lms_db_user:***@...

┌─────────────────────────────────────────────────┐
│  4. AJOUTER DANS RENDER                         │
└─────────────────────────────────────────────────┘
Render → osint-lms-backend → Environment
→ Add Environment Variable
Key: DATABASE_URL
Value: [coller la connection string]
→ Save Changes
→ Redéployer le service

┌─────────────────────────────────────────────────┐
│  5. CRÉER LES TABLES                            │
└─────────────────────────────────────────────────┘
# Se connecter avec psql
psql "postgresql://osint_lms_db_user:***@..."

# Exécuter les migrations
\i ~/osint-lms/osint-lms-backend/db/migrations/001_create_users.sql
\i ~/osint-lms/osint-lms-backend/db/migrations/002_create_game_states.sql
```

---

### **Backup manuel**

```bash
# 1. Export
pg_dump "postgresql://..." > backup_$(date +%Y%m%d).sql

# 2. Restore (si nécessaire)
psql "postgresql://..." < backup_20260408.sql
```

---

### **Monitoring**

```bash
# Neon Console
https://console.neon.tech

→ Metrics:
  - Active Connections
  - Data Size
  - Compute Time
  
→ SQL Editor:
  - Exécuter requêtes directement
  
→ Branches:
  - Créer branche de dev si besoin
```

---

## 🔄 WORKFLOWS COMPLETS

### **Workflow 1: Nouvelle fonctionnalité Frontend**

```bash
# 1. Créer branche feature (optionnel)
git checkout -b feature/new-dashboard

# 2. Développer
cd osint-lms-frontend
npm run dev
# Éditer src/pages/NewDashboard.tsx

# 3. Tester
npm run build
npm run preview

# 4. Commit
git add .
git commit -m "feat: nouveau dashboard amélioré"

# 5. Push
git push origin feature/new-dashboard

# 6. Merge dans main
git checkout main
git merge feature/new-dashboard
git push origin main

# 7. Vérifier déploiement Vercel
# https://www.cyberosint-academy.com
```

---

### **Workflow 2: Fix bug Backend**

```bash
# 1. Identifier le bug
# Logs Render → osint-lms-backend

# 2. Reproduire en local
cd osint-lms-backend
npm start
# Tester l'endpoint problématique

# 3. Corriger
# Éditer routes/game.js

# 4. Tester
curl http://localhost:3000/game/leaderboard

# 5. Commit & Push
git add .
git commit -m "fix: correction calcul leaderboard"
git push origin main

# 6. Deploy Render
# Render Dashboard → Manual Deploy

# 7. Vérifier en prod
curl https://osint-lms-backend.onrender.com/game/leaderboard
```

---

### **Workflow 3: Mise à jour Argus API**

```bash
# 1. Développer module OSINT
cd argus-service
# Éditer main.py

# 2. Tester
uvicorn main:app --reload
curl http://localhost:8000/api/new-module/test

# 3. Mettre à jour requirements.txt si besoin
pip freeze > requirements.txt

# 4. Commit & Push
git add .
git commit -m "feat: nouveau module OSINT xyz"
git push origin main

# 5. Deploy Render
# https://dashboard.render.com/web/srv-d6a9nfili9vc73akjdu0
→ Manual Deploy

# 6. Tester en prod
# Argus Console → new-module test
```

---

### **Workflow 4: Hotfix urgent production**

```bash
# 1. Identifier le problème critique
# Ex: Site down, erreur 500

# 2. Fix rapide
# Éditer le fichier concerné

# 3. Commit direct sur main (urgent!)
git add .
git commit -m "hotfix: correction erreur critique"
git push origin main

# 4. Deploy immédiat
# Vercel = automatique
# Render = Manual Deploy

# 5. Vérifier
# Tester la prod immédiatement

# 6. Créer issue GitHub pour tracer
# Note: À éviter, préférer feature branches
```

---

## ✅ CHECKLIST DÉPLOIEMENT

### **Avant chaque déploiement:**

- [ ] Code testé en local
- [ ] Build réussi (`npm run build`)
- [ ] Pas d'erreurs TypeScript
- [ ] Variables d'env vérifiées
- [ ] Commit message descriptif

### **Après déploiement:**

- [ ] Site accessible
- [ ] Fonctionnalités testées
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] Performance OK (PageSpeed)
- [ ] Mobile responsive OK

---

## 📞 SUPPORT

**En cas de problème:**

1. Consulter TROUBLESHOOTING.md
2. Vérifier logs (Vercel, Render)
3. Tester en local
4. Rollback si nécessaire

**Contacts:**
- Vercel Support: https://vercel.com/support
- Render Support: https://render.com/docs
- Neon Support: https://neon.tech/docs

---

**FIN DU GUIDE DE DÉPLOIEMENT**
