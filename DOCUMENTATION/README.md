# 📚 CYBEROSINT ACADEMY - DOCUMENTATION COMPLÈTE

**Plateforme d'apprentissage OSINT**  
**Version:** 2.0  
**Date:** 08/04/2026  
**Auteur:** H4ck3r

---

## 🎯 À PROPOS

CyberOSINT Academy est une plateforme gratuite d'apprentissage OSINT (Open Source Intelligence) comprenant :

- **Parcours progressifs** : Débutant, Intermédiaire, Avancé
- **CTF Challenges** : 11 défis OSINT pratiques
- **Labs interactifs** : VM Kali, VM Parrot, Argus Console
- **Gamification** : XP, badges, leaderboard, streak
- **Certificat** : Validation des compétences acquises

**Site web:** https://www.cyberosint-academy.com

---

## 📖 DOCUMENTATION DISPONIBLE

Cette documentation complète contient **5 fichiers** couvrant tous les aspects techniques :

### **1. 📘 DOCUMENTATION_TECHNIQUE.md**
**Description:** Architecture globale, stack technique, configuration services

**Contenu:**
- Architecture infrastructure complète
- Stack technique détaillée
- Structure des repos GitHub
- Configuration DNS (GoDaddy)
- Variables d'environnement
- Sécurité et monitoring
- Contacts et ressources

**📌 Lire en premier** pour comprendre l'architecture globale.

---

### **2. 🐛 TROUBLESHOOTING.md**
**Description:** Guide de dépannage avec bugs courants et solutions

**Contenu:**
- Problèmes frontend (Build, CORS, localStorage, routes)
- Problèmes backend (Veille Render, JWT, database)
- Problèmes Argus API (Timeout, WHOIS, CORS)
- Problèmes base de données (Tables, connexions)
- Problèmes DNS/domaine (Propagation, SSL)
- Problèmes déploiement (Vercel, Render)
- Problèmes persistance (Progression, certificat)
- Outils de diagnostic (F12, logs, tests)

**📌 Consulter** en cas de bug ou comportement inattendu.

---

### **3. 🚀 GUIDE_DEPLOIEMENT.md**
**Description:** Workflows de déploiement complets étape par étape

**Contenu:**
- Déploiement Frontend (Vercel)
- Déploiement Backend (Render)
- Déploiement Argus API (Render)
- Configuration DNS (GoDaddy)
- Setup Base de données (Neon)
- Workflows complets (features, fixes, hotfix)
- Rollback et recovery
- Checklist déploiement

**📌 Suivre** pour déployer du code en production.

---

### **4. 🏗️ SCHEMAS_ARCHITECTURE.md**
**Description:** Schémas détaillés et diagrammes d'architecture

**Contenu:**
- Architecture technique détaillée (diagrammes ASCII)
- Flux de données (auth, save, OSINT queries)
- Structure base de données (schémas SQL)
- Layers de sécurité
- Plan de scalabilité
- Métriques et monitoring
- Optimisations performance
- Récapitulatif complet (URLs, stack, dashboards)

**📌 Référence** pour comprendre les flux et l'infrastructure.

---

### **5. ✅ SEO_GUIDE_COMPLET.md**
**Description:** Guide SEO et indexation Google

**Contenu:**
- Sitemap.xml corrigé
- Robots.txt configuré
- Soumission Google Search Console
- Meta tags recommandés
- Google Analytics setup
- Checklist SEO complète

**📌 Utiliser** pour améliorer le référencement.

---

## 🗂️ ORGANISATION DES FICHIERS

```
~/osint-lms/                           # Monorepo principal
├── DOCUMENTATION/                     # 📁 Dossier documentation
│   ├── README.md                      # Ce fichier (index)
│   ├── DOCUMENTATION_TECHNIQUE.md     # Architecture
│   ├── TROUBLESHOOTING.md             # Dépannage
│   ├── GUIDE_DEPLOIEMENT.md           # Déploiement
│   ├── SCHEMAS_ARCHITECTURE.md        # Schémas
│   └── SEO_GUIDE_COMPLET.md           # SEO
│
├── osint-lms-frontend/                # Application React
├── osint-lms-backend/                 # API Node.js
└── argus-service/                     # API Python OSINT
```

---

## 🚀 QUICK START

### **Pour débuter :**

1. **Lire DOCUMENTATION_TECHNIQUE.md** → Comprendre l'architecture
2. **Lire GUIDE_DEPLOIEMENT.md** → Apprendre à déployer
3. **Bookmark TROUBLESHOOTING.md** → Référence en cas de bug

### **Pour déployer une modification :**

```bash
# 1. Modifier le code
cd ~/osint-lms/osint-lms-frontend
# Éditer src/...

# 2. Tester
npm run dev

# 3. Build
npm run build

# 4. Push
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# 5. Vercel auto-deploy (2 min)
# https://www.cyberosint-academy.com
```

**📖 Voir GUIDE_DEPLOIEMENT.md pour workflows complets**

---

## 📊 INFRASTRUCTURE RÉSUMÉE

```
┌───────────────────────────────────────────────┐
│  www.cyberosint-academy.com (Production)      │
└───────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│  Vercel CDN  │          │  Vercel Edge │
│  (Frontend)  │          │  (Assets)    │
└──────┬───────┘          └──────────────┘
       │
       │ API Calls
       │
   ┌───┴────────────────┐
   │                    │
   ▼                    ▼
┌────────┐        ┌────────┐
│ Render │        │ Render │
│Backend │        │ Argus  │
└───┬────┘        └────────┘
    │
    ▼
┌────────┐
│  Neon  │
│  PG16  │
└────────┘
```

**📖 Voir SCHEMAS_ARCHITECTURE.md pour schémas détaillés**

---

## 🔧 STACK TECHNIQUE

| Layer      | Technology               | Hébergement |
|------------|--------------------------|-------------|
| Frontend   | React 18 + TypeScript    | Vercel      |
| Backend    | Node.js + Express        | Render      |
| Argus API  | Python 3.11 + FastAPI    | Render      |
| Database   | PostgreSQL 16            | Neon        |
| DNS        | GoDaddy                  | -           |
| Contact    | Web3Forms                | -           |

**📖 Voir DOCUMENTATION_TECHNIQUE.md pour détails complets**

---

## 🐛 PROBLÈMES COURANTS

### **Site inaccessible après déploiement**
→ Voir TROUBLESHOOTING.md → "Page blanche après déploiement"

### **Progression perdue après cache clear**
→ Voir TROUBLESHOOTING.md → "localStorage vide après refresh"

### **Argus API timeout 30s**
→ Voir TROUBLESHOOTING.md → "Whois timeout 30s"

### **DNS ne propage pas**
→ Voir TROUBLESHOOTING.md → "DNS propagation lente"

**📖 Voir TROUBLESHOOTING.md pour tous les bugs et solutions**

---

## 📈 MONITORING

### **Dashboards**
- **Vercel Analytics:** https://vercel.com/analytics
- **Render Metrics:** https://dashboard.render.com
- **Neon Console:** https://console.neon.tech
- **Google Search:** https://search.google.com/search-console

### **Logs**
```bash
# Frontend (Vercel)
# Vercel Dashboard → Deployments → Latest

# Backend (Render)
# Render Dashboard → osint-lms-backend → Logs

# Argus API (Render)
# Render Dashboard → argus-api → Logs
```

**📖 Voir DOCUMENTATION_TECHNIQUE.md section Monitoring**

---

## 🔐 SÉCURITÉ

**Layers de protection :**
1. **CDN/DNS** : DDoS protection, SSL/TLS
2. **Frontend** : XSS prevention, input sanitization
3. **Backend** : JWT auth, CORS, SQL injection prevention
4. **Database** : SSL required, row-level security

**📖 Voir SCHEMAS_ARCHITECTURE.md section Sécurité**

---

## 🚀 SCALABILITÉ

**Limites actuelles (Free Tier) :**
- Vercel: 100GB bandwidth/mois
- Render: 750h compute/mois
- Neon: 3GB storage
- **Capacité:** ~500-1000 utilisateurs actifs

**📖 Voir SCHEMAS_ARCHITECTURE.md pour plan de montée en charge**

---

## 📞 SUPPORT & CONTACTS

**Services :**
- Vercel: https://vercel.com/support
- Render: https://render.com/docs/troubleshooting
- Neon: https://neon.tech/docs
- GoDaddy: https://www.godaddy.com/help

**GitHub :**
- Repos: https://github.com/H4ck3r/osint-lms
- Issues: Créer une issue sur GitHub pour bug tracking

**Email :**
- Contact: Via formulaire sur www.cyberosint-academy.com

---

## 🎓 CONTRIBUTION

### **Ajouter une fonctionnalité**

1. Créer branche feature
2. Développer et tester
3. Commit avec message clair
4. Push et déployer
5. **Mettre à jour cette documentation si nécessaire**

**📖 Voir GUIDE_DEPLOIEMENT.md → Workflow 1**

---

## 📝 HISTORIQUE DES VERSIONS

### **Version 2.0 (08/04/2026)**
- ✅ Persistance données corrigée (54 clés)
- ✅ Certificat CTF fonctionnel
- ✅ Leaderboard nettoyé
- ✅ VM Parrot whois ajouté
- ✅ Argus API formatage dates
- ✅ SEO sitemap + robots.txt
- ✅ Documentation complète créée

### **Version 1.0 (Février 2026)**
- Lancement initial
- Parcours OSINT complets
- CTF Challenges
- VM Labs
- Système de gamification

---

## ✅ CHECKLIST MAINTENANCE

**Hebdomadaire :**
- [ ] Vérifier logs Render (erreurs)
- [ ] Vérifier métriques Vercel (performance)
- [ ] Vérifier Neon (connexions, storage)
- [ ] Tester fonctionnalités critiques (login, CTF, save)

**Mensuel :**
- [ ] Backup base de données (export manuel)
- [ ] Vérifier SEO ranking (Search Console)
- [ ] Review analytics (users, pages vues)
- [ ] Mettre à jour dépendances npm/pip

**Trimestriel :**
- [ ] Audit sécurité
- [ ] Performance optimization
- [ ] Documentation update
- [ ] User feedback review

---

## 🎯 ROADMAP

**Court terme (Q2 2026) :**
- [ ] Migration vers Render Starter (sortir de Free Tier)
- [ ] Ajouter Redis cache (leaderboard)
- [ ] Implémenter rate limiting
- [ ] PWA (Service Worker)

**Moyen terme (Q3-Q4 2026) :**
- [ ] API versioning
- [ ] i18n (internationalisation)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics

**Long terme (2027+) :**
- [ ] Migration Kubernetes
- [ ] Multi-region deployment
- [ ] Premium features
- [ ] Community contributions

---

## 📚 INDEX RAPIDE

**Besoin de :**
- Comprendre l'architecture → DOCUMENTATION_TECHNIQUE.md
- Résoudre un bug → TROUBLESHOOTING.md
- Déployer du code → GUIDE_DEPLOIEMENT.md
- Voir les schémas → SCHEMAS_ARCHITECTURE.md
- Améliorer le SEO → SEO_GUIDE_COMPLET.md

---

## 🙏 REMERCIEMENTS

**Technologies utilisées :**
- React, Vite, TypeScript
- Node.js, Express, FastAPI
- PostgreSQL, Neon
- Vercel, Render, GoDaddy

**Communauté OSINT**
- Pour l'inspiration et les ressources
- Pour les techniques et méthodologies

---

**📧 Contact:** Via formulaire www.cyberosint-academy.com  
**🌐 Website:** https://www.cyberosint-academy.com  
**💻 GitHub:** https://github.com/H4ck3r/osint-lms

---

**FIN DU README PRINCIPAL**

**🚀 Bonne chance avec CyberOSINT Academy ! 🎓**
