# 🏗️ SCHÉMAS D'ARCHITECTURE - CYBEROSINT ACADEMY

**Version:** 2.0  
**Dernière mise à jour:** 08/04/2026

---

## 📊 ARCHITECTURE TECHNIQUE DÉTAILLÉE

### **Vue d'ensemble Infrastructure**

```
                    INTERNET
                       │
                       ▼
         ┌─────────────────────────────┐
         │    DNS (GoDaddy)            │
         │  cyberosint-academy.com     │
         │                             │
         │  A:    76.76.21.21         │
         │  CNAME: vercel-dns.com     │
         └──────────────┬──────────────┘
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
    ┌──────────────────┐  ┌──────────────────┐
    │  Vercel CDN      │  │  Vercel Edge     │
    │  (Frontend)      │  │  Network         │
    │                  │  │  (150+ PoP)      │
    │  React App       │  │  Static Assets   │
    │  Vite Build      │  │  Global Cache    │
    └────────┬─────────┘  └──────────────────┘
             │
             │ HTTPS API Calls
             │
    ┌────────┴────────────────────────────┐
    │                                     │
    ▼                                     ▼
┌─────────────────────┐        ┌─────────────────────┐
│  Render (Backend)   │        │  Render (Argus)     │
│  srv-xxxxx          │        │  srv-d6a9nfili9vc   │
│                     │        │                     │
│  Node.js 18         │        │  Python 3.11        │
│  Express.js         │        │  FastAPI            │
│  Port 10000         │        │  Port 10000         │
│                     │        │                     │
│  - Auth (JWT)       │        │  - WHOIS            │
│  - Game State       │        │  - DNS Lookup       │
│  - Leaderboard      │        │  - Port Scan        │
│  - User Management  │        │  - SSL Check        │
└──────────┬──────────┘        │  - Tech Detection   │
           │                    └─────────────────────┘
           │ PostgreSQL
           │
           ▼
┌─────────────────────┐
│  Neon PostgreSQL    │
│  Serverless DB      │
│                     │
│  Region: us-east-2  │
│  Version: PG 16     │
│  SSL Required       │
│                     │
│  Tables:            │
│  - users            │
│  - game_states      │
│  - messages         │
└─────────────────────┘
```

---

## 🔄 FLUX DE DONNÉES

### **1. Authentification utilisateur**

```
User                Frontend             Backend            Database
 │                     │                    │                  │
 │  Login Form        │                    │                  │
 ├───────────────────>│                    │                  │
 │                    │  POST /auth/login  │                  │
 │                    ├───────────────────>│                  │
 │                    │                    │  SELECT user     │
 │                    │                    ├─────────────────>│
 │                    │                    │  <user_data>     │
 │                    │                    │<─────────────────┤
 │                    │                    │                  │
 │                    │                    │  bcrypt.compare  │
 │                    │                    │  (password)      │
 │                    │                    │                  │
 │                    │  { token, user }   │                  │
 │                    │<───────────────────┤                  │
 │  <JWT Token>       │                    │                  │
 │<───────────────────┤                    │                  │
 │                    │                    │                  │
 │  localStorage.     │                    │                  │
 │  setItem("token")  │                    │                  │
 │                    │                    │                  │
```

### **2. Sauvegarde progression (Auto-save)**

```
User Action          GameContext         useLocalStorageSync    Backend        Database
    │                    │                       │                 │              │
    │  Complete CTF      │                       │                 │              │
    ├───────────────────>│                       │                 │              │
    │                    │  updateGameState()    │                 │              │
    │                    │  setSolvedChallenges  │                 │              │
    │                    │                       │                 │              │
    │                    │  localStorage.        │                 │              │
    │                    │  setItem("game")      │                 │              │
    │                    │                       │                 │              │
    │                    │                       │  [After 30s]    │              │
    │                    │                       │  POST /save     │              │
    │                    │                       ├────────────────>│              │
    │                    │                       │                 │  UPDATE      │
    │                    │                       │                 │  game_state  │
    │                    │                       │                 ├─────────────>│
    │                    │                       │                 │  <OK>        │
    │                    │                       │                 │<─────────────┤
    │                    │                       │  <success>      │              │
    │                    │                       │<────────────────┤              │
    │                    │                       │                 │              │
```

### **3. Argus OSINT Query avec Keepalive**

```
User                ArgusConsole        Argus API          External Services
 │                      │                   │                     │
 │  whois google.com    │                   │                     │
 ├─────────────────────>│                   │                     │
 │                      │  [Keepalive]      │                     │
 │                      │  GET /            │                     │
 │                      ├──────────────────>│                     │
 │                      │  <200 OK>         │                     │
 │                      │<──────────────────┤                     │
 │                      │                   │                     │
 │                      │  GET /api/whois/  │                     │
 │                      │  google.com       │                     │
 │                      ├──────────────────>│                     │
 │                      │                   │  python-whois      │
 │                      │                   │  query             │
 │                      │                   ├────────────────────>│
 │                      │                   │  <whois_data>      │
 │                      │                   │<────────────────────┤
 │                      │                   │                     │
 │                      │                   │  format_date()     │
 │                      │                   │  format_status()   │
 │                      │                   │                     │
 │                      │  {domain, date,   │                     │
 │                      │   registrar...}   │                     │
 │                      │<──────────────────┤                     │
 │  [Display WHOIS]     │                   │                     │
 │<─────────────────────┤                   │                     │
```

---

## 🗂️ STRUCTURE BASE DE DONNÉES

### **Table: users**

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Index
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

### **Table: game_states**

```sql
CREATE TABLE game_states (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    game_state JSONB NOT NULL,
    challenges JSONB,
    xp INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Index
CREATE INDEX idx_game_states_user ON game_states(user_id);
CREATE INDEX idx_game_states_xp ON game_states(xp DESC);
```

### **Table: messages**

```sql
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(100),
    email VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_user ON messages(user_id);
```

---

## 🔐 SÉCURITÉ - LAYERS

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: DNS & CDN (Vercel Edge)                       │
│  - DDoS Protection                                      │
│  - Rate Limiting (automatique)                          │
│  - SSL/TLS Encryption                                   │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│  LAYER 2: Frontend (React)                              │
│  - Input Sanitization                                   │
│  - XSS Prevention (React auto-escape)                   │
│  - CSRF Tokens (JWT)                                    │
│  - Secure localStorage                                  │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│  LAYER 3: Backend (Express)                             │
│  - JWT Verification                                     │
│  - CORS Strict Origin                                   │
│  - Password Hashing (bcrypt)                            │
│  - SQL Injection Prevention (parameterized queries)     │
│  - Rate Limiting (express-rate-limit)                   │
└───────────────────────┬─────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────┐
│  LAYER 4: Database (Neon PostgreSQL)                    │
│  - SSL Required                                         │
│  - Row-Level Security                                   │
│  - Connection Pooling                                   │
│  - Automated Backups                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📈 SCALABILITÉ

### **Limites actuelles (Free Tier)**

| Service      | Limite Free            | Limite actuelle | Recommandation      |
|--------------|------------------------|-----------------|---------------------|
| Vercel       | 100GB bandwidth/mois   | ~5GB/mois       | OK pour 1000 users  |
| Render       | 750h compute/mois      | ~750h (1 inst.) | Passer à Starter    |
| Neon         | 3GB storage            | ~50MB           | OK pour 10K users   |
| Web3Forms    | 250 soumissions/mois   | ~10/mois        | OK                  |

### **Plan de montée en charge**

```
PHASE 1: 0-500 users (ACTUEL)
├── Vercel Free
├── Render Free (2 instances: backend + argus)
└── Neon Free

PHASE 2: 500-2000 users
├── Vercel Pro ($20/mois)
├── Render Starter ($7/mois x2 = $14/mois)
│   ├── Instance Type: Standard
│   └── Autoscaling: 1-2 instances
└── Neon Launch ($19/mois)

PHASE 3: 2000-10000 users
├── Vercel Pro
├── Render Pro ($25/mois x2 = $50/mois)
│   ├── Instance Type: Standard Plus
│   ├── Autoscaling: 2-5 instances
│   └── Load Balancer
├── Neon Scale ($69/mois)
└── Redis Cache (Upstash)

PHASE 4: 10000+ users
├── Migration vers infrastructure dédiée
├── Kubernetes (GKE/EKS)
├── PostgreSQL géré (AWS RDS)
├── CDN Premium (Cloudflare Enterprise)
└── Monitoring (Datadog/New Relic)
```

---

## 🔍 MONITORING & OBSERVABILITÉ

### **Métriques clés à surveiller**

```
FRONTEND (Vercel Analytics)
├── Page Views
├── Unique Visitors
├── Bounce Rate
├── Core Web Vitals
│   ├── LCP (Largest Contentful Paint) < 2.5s
│   ├── FID (First Input Delay) < 100ms
│   └── CLS (Cumulative Layout Shift) < 0.1
└── Deployment Frequency

BACKEND (Render Metrics)
├── Request Rate (req/s)
├── Response Time (p50, p95, p99)
├── Error Rate (%)
├── CPU Usage (%)
├── Memory Usage (MB)
└── Active Connections

DATABASE (Neon Metrics)
├── Active Connections
├── Query Duration (avg, max)
├── Database Size (GB)
├── Cache Hit Rate (%)
└── Replication Lag (ms)

ARGUS API (Render Metrics)
├── OSINT Query Rate
├── External API Response Time
├── Error Rate par module
└── Uptime (keepalive effectiveness)
```

---

## 🚀 PERFORMANCE OPTIMISATIONS

### **Frontend**

```
OPTIMISATIONS APPLIQUÉES:
✅ Vite Build Optimization
   - Tree shaking
   - Code splitting
   - Minification
   
✅ React Optimizations
   - Lazy loading (React.lazy)
   - Memo components (React.memo)
   - useMemo/useCallback hooks
   
✅ Asset Optimization
   - Image lazy loading
   - SVG optimization
   - Font subsetting
   
✅ Vercel Edge Network
   - Global CDN (150+ PoP)
   - Brotli compression
   - HTTP/2 Push

POTENTIELLES AMÉLIORATIONS:
⚠ Service Worker (PWA)
⚠ Image CDN (Cloudinary/Imgix)
⚠ Bundle analyzer
⚠ Route-based code splitting
```

### **Backend**

```
OPTIMISATIONS APPLIQUÉES:
✅ Connection Pooling (pg)
✅ JWT stateless auth
✅ CORS configuration stricte

POTENTIELLES AMÉLIORATIONS:
⚠ Redis Cache (leaderboard)
⚠ Rate Limiting
⚠ API Response Caching
⚠ Database query optimization (EXPLAIN ANALYZE)
⚠ Horizontal scaling (multiple instances)
```

---

## 📦 RÉCAPITULATIF COMPLET

### **Repositories GitHub**

```
https://github.com/H4ck3r/osint-lms
├── osint-lms-frontend (Vercel)
├── osint-lms-backend (Render)
└── argus-service (Render)
```

### **URLs Production**

```
Frontend:     https://www.cyberosint-academy.com
Backend API:  https://osint-lms-backend.onrender.com
Argus API:    https://argus-api-aqr6.onrender.com
Database:     osint-lms-db.c72ein28e.us-east-2.aws.neon.tech
```

### **Dashboards**

```
Vercel:       https://vercel.com/dashboard
Render:       https://dashboard.render.com
Neon:         https://console.neon.tech
GoDaddy DNS:  https://dcc.godaddy.com/manage/dns
Analytics:    https://vercel.com/analytics
Search:       https://search.google.com/search-console
```

### **Stack complète**

```
FRONTEND
├── React 18.3
├── TypeScript 5
├── Vite 5
├── React Router v6
└── Context API

BACKEND
├── Node.js 18+
├── Express.js 4
├── PostgreSQL (pg)
├── JWT Auth
└── CORS

ARGUS API
├── Python 3.11
├── FastAPI
├── python-whois
├── dnspython
└── requests

INFRASTRUCTURE
├── Vercel (Frontend CDN)
├── Render (Backend + Argus)
├── Neon (PostgreSQL)
├── GoDaddy (DNS)
└── Web3Forms (Contact)

TOOLS
├── Git/GitHub
├── npm/pip
├── VS Code
├── Postman
└── pgAdmin
```

---

## 📞 RESSOURCES & DOCUMENTATION

### **Documentation officielle**
- Frontend: Voir DOCUMENTATION_TECHNIQUE.md
- Dépannage: Voir TROUBLESHOOTING.md
- Déploiement: Voir GUIDE_DEPLOIEMENT.md
- SEO: Voir SEO_GUIDE_COMPLET.md

### **Quick Links**
- Architecture: Ce fichier (SCHEMAS_ARCHITECTURE.md)
- Monorepo: ~/osint-lms/
- Support: Consulter TROUBLESHOOTING.md

---

**FIN DES SCHÉMAS D'ARCHITECTURE**

**📚 DOCUMENTATION COMPLÈTE DISPONIBLE**
