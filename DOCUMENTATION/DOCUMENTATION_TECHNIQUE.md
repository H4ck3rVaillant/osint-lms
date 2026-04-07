# 📚 DOCUMENTATION TECHNIQUE - CYBEROSINT ACADEMY

**Version:** 2.0  
**Dernière mise à jour:** 08/04/2026  
**Auteur:** H4ck3r  

---

## 🏗️ ARCHITECTURE GLOBALE

```
┌─────────────────────────────────────────────────────────────────┐
│                         UTILISATEUR                              │
│                    www.cyberosint-academy.com                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DNS (GoDaddy)                              │
│  A Record: 76.76.21.21 (Vercel)                                 │
│  CNAME: cname.vercel-dns.com                                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│   FRONTEND (Vercel)     │   │   CDN (Vercel Edge)     │
│  React + TypeScript     │   │   Assets statiques      │
│  Vite Build             │   │   Cache global          │
└────────────┬────────────┘   └─────────────────────────┘
             │
             │ API Calls
             │
        ┌────┴─────────────────────┐
        │                          │
        ▼                          ▼
┌────────────────────┐  ┌────────────────────┐
│  BACKEND (Render)  │  │ ARGUS API (Render) │
│  Node.js Express   │  │ Python FastAPI     │
│  Port 10000        │  │ Port 10000         │
└─────────┬──────────┘  └────────────────────┘
          │
          ▼
┌────────────────────┐
│   DATABASE (Neon)  │
│  PostgreSQL 16     │
│  us-east-2 (AWS)   │
└────────────────────┘
```

---

## 📦 STACK TECHNIQUE

### **Frontend**
- **Framework:** React 18.3 + TypeScript 5
- **Build Tool:** Vite 5
- **Routing:** React Router v6
- **Styling:** Inline CSS-in-JS (styled components pattern)
- **State:** Context API (GameContext, ThemeContext, AuthContext)
- **Déploiement:** Vercel (Edge Network)

### **Backend**
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4
- **Auth:** JWT (jsonwebtoken)
- **Database ORM:** pg (node-postgres)
- **CORS:** cors middleware
- **Déploiement:** Render (Free Tier)

### **Argus API**
- **Language:** Python 3.11
- **Framework:** FastAPI
- **OSINT Tools:** python-whois, dnspython, requests
- **Déploiement:** Render (Free Tier)

### **Base de données**
- **Type:** PostgreSQL 16
- **Provider:** Neon Serverless Postgres
- **Région:** us-east-2 (AWS Ohio)
- **Connection:** SSL required

### **Services tiers**
- **DNS:** GoDaddy
- **CDN/Hosting Frontend:** Vercel
- **Hosting Backend:** Render
- **Contact Form:** Web3Forms
- **Analytics:** Vercel Analytics
- **SEO:** Google Search Console

---

## 📁 STRUCTURE DES REPOS

### **Monorepo GitHub**

```
osint-lms/                          # Repo principal (monorepo)
├── .git/
├── .gitignore
├── render.yaml                     # Config Render (multi-services)
├── vercel.json                     # Config Vercel
│
├── osint-lms-frontend/             # Application React
│   ├── public/
│   │   ├── sitemap.xml            # SEO
│   │   ├── robots.txt             # SEO
│   │   └── assets/                # Images, icons
│   ├── src/
│   │   ├── auth/                  # Authentification
│   │   ├── components/            # Composants réutilisables
│   │   ├── context/               # Context API (Game, Theme, Auth)
│   │   ├── hooks/                 # Custom hooks
│   │   ├── pages/                 # Pages de l'application
│   │   ├── utils/                 # Utilitaires
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── osint-lms-backend/              # API Node.js
│   ├── routes/
│   │   ├── auth.js                # Routes authentification
│   │   ├── admin.js               # Routes admin
│   │   ├── game.js                # Routes progression/leaderboard
│   │   └── messages.js            # Routes messages
│   ├── middlewares/
│   │   └── auth.js                # JWT verification
│   ├── services/
│   ├── db/                        # Database utilities
│   ├── .env                       # Variables d'environnement
│   ├── server.js                  # Point d'entrée
│   └── package.json
│
└── argus-service/                  # API OSINT Python
    ├── main.py                    # FastAPI app
    ├── requirements.txt           # Dépendances Python
    └── README.md

```

### **Branches Git**
- **main** : Production (auto-deploy activé)
- Pas de branches de développement (deploy direct sur main)

---

## 🔧 VARIABLES D'ENVIRONNEMENT

### **Backend (.env)**
```bash
# Server
PORT=10000                          # Port Render (auto-assigné)
NODE_ENV=production

# JWT
JWT_SECRET=bc394b82843f0438ae035ebd8647b72b...  # 64 bytes hex

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://osint_lms_db_user:***@osint-lms-db.c72ein28e.us-east-2.aws.neon.tech/osint-lms-db?sslmode=require

# CORS
FRONTEND_URL=https://www.cyberosint-academy.com
```

### **Frontend (Vite env)**
```bash
# Pas de .env nécessaire
# Les URLs backend sont hardcodées :
# - https://osint-lms-backend.onrender.com
# - https://argus-api-aqr6.onrender.com
```

### **Argus API (Python env)**
```bash
# Pas de .env
# Configuré directement dans main.py
```

---

## 🌐 CONFIGURATION DNS (GoDaddy)

### **Records DNS actuels**

| Type  | Name | Value                          | TTL  |
|-------|------|--------------------------------|------|
| A     | @    | 76.76.21.21                    | 600  |
| CNAME | www  | cname.vercel-dns.com           | 3600 |
| TXT   | @    | google-site-verification=...   | 3600 |

### **Explication**
- **A Record (@)** : Pointe vers Vercel
- **CNAME (www)** : Alias vers Vercel CDN
- **TXT** : Vérification Google Search Console

---

## 🚀 DÉPLOIEMENT

### **Frontend (Vercel)**

**Configuration Vercel:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

**Workflow:**
```bash
# 1. Développement local
cd osint-lms-frontend
npm run dev              # http://localhost:5173

# 2. Build de test
npm run build
npm run preview

# 3. Push sur GitHub
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# 4. Auto-deploy Vercel (< 2 minutes)
# https://www.cyberosint-academy.com mise à jour automatiquement
```

**Domaine custom:**
- Production: https://www.cyberosint-academy.com
- Preview: https://cyberosint-academy.vercel.app

---

### **Backend (Render)**

**Service:** `osint-lms-backend`  
**URL:** https://osint-lms-backend.onrender.com  
**Type:** Web Service (Free Tier)

**Configuration Render:**
```yaml
services:
  - type: web
    name: osint-lms-backend
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: PORT
        value: 10000
```

**Workflow:**
```bash
# 1. Modification du code
cd osint-lms-backend
# Éditer les fichiers...

# 2. Test local
npm start                # Port 3000 local

# 3. Push sur GitHub
git add .
git commit -m "fix: correction bug"
git push origin main

# 4. Deploy manuel sur Render
# Dashboard → Manual Deploy → Deploy latest commit
# Attendre 2-3 minutes
```

**⚠️ IMPORTANT - Free Tier:**
- Se met en veille après 15 min d'inactivité
- Premier appel = réveil (~30s)
- Utilisé pour l'API de progression/leaderboard

---

### **Argus API (Render)**

**Service:** `argus-api`  
**URL:** https://argus-api-aqr6.onrender.com  
**Type:** Web Service (Free Tier)

**Configuration:**
```yaml
services:
  - type: web
    name: argus-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Workflow:**
```bash
cd argus-service
# Éditer main.py...
git add .
git commit -m "feat: new OSINT module"
git push origin main

# Deploy manuel Render
# https://dashboard.render.com/web/srv-d6a9nfili9vc73akjdu0
```

**⚠️ IMPORTANT:**
- Keepalive implémenté côté frontend (ping toutes les 10 min)
- Évite la mise en veille si un utilisateur a Argus Console ouvert

---

### **Base de données (Neon)**

**Cluster:** osint-lms-db  
**Région:** us-east-2 (AWS Ohio)  
**Version:** PostgreSQL 16

**Connection String:**
```
postgresql://osint_lms_db_user:***@osint-lms-db.c72ein28e.us-east-2.aws.neon.tech/osint-lms-db?sslmode=require
```

**Tables principales:**
```sql
-- users : Utilisateurs de la plateforme
-- game_states : Progression de chaque utilisateur
-- messages : Contact/feedback
```

**Accès:**
- Dashboard Neon: https://console.neon.tech
- Connection direct: pgAdmin ou psql avec la connection string

**Backups:**
- Automatiques par Neon (7 jours de rétention)
- Possibilité d'export manuel

---

## 🔐 SÉCURITÉ

### **Authentification**
- JWT tokens (expire 24h)
- Password hashing: bcrypt
- Protected routes avec middleware auth

### **CORS**
```javascript
// Backend
cors({
  origin: [
    "https://www.cyberosint-academy.com",
    "https://cyberosint-academy.vercel.app",
    "http://localhost:5173"
  ]
})

// Argus
CORSMiddleware(
  allow_origins=[
    "https://www.cyberosint-academy.com",
    "https://cyberosint-academy.vercel.app",
    "http://localhost:5173"
  ]
)
```

### **SQL Injection**
- Utilisation de requêtes paramétrées (pg)
- Pas de concaténation de strings SQL

### **XSS**
- React échappe automatiquement le contenu
- Pas de `dangerouslySetInnerHTML`

---

## 📊 MONITORING

### **Vercel Analytics**
- Activé sur www.cyberosint-academy.com
- Métriques de performance (Web Vitals)
- Trafic et pages vues

### **Render Logs**
```bash
# Accès aux logs en temps réel
# Dashboard Render → Service → Logs
```

### **Neon Metrics**
- Connexions actives
- Queries/sec
- Storage utilisé

---

## 🐛 TROUBLESHOOTING

Voir fichier séparé: `TROUBLESHOOTING.md`

---

## 📞 CONTACTS & RESSOURCES

**Services:**
- Vercel Dashboard: https://vercel.com/dashboard
- Render Dashboard: https://dashboard.render.com
- Neon Console: https://console.neon.tech
- GoDaddy DNS: https://dcc.godaddy.com/manage/dns
- Google Search Console: https://search.google.com/search-console

**Documentation:**
- React: https://react.dev
- Vite: https://vitejs.dev
- Express: https://expressjs.com
- FastAPI: https://fastapi.tiangolo.com
- Neon: https://neon.tech/docs

**Support:**
- Vercel: https://vercel.com/support
- Render: https://render.com/docs
- Neon: https://neon.tech/docs/introduction

---

**FIN DE LA DOCUMENTATION PRINCIPALE**
