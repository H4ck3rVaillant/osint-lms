# 🐛 TROUBLESHOOTING - GUIDE DE DÉPANNAGE

**Version:** 2.0  
**Dernière mise à jour:** 08/04/2026

---

## 📋 TABLE DES MATIÈRES

1. [Problèmes Frontend](#problèmes-frontend)
2. [Problèmes Backend](#problèmes-backend)
3. [Problèmes Argus API](#problèmes-argus-api)
4. [Problèmes Base de données](#problèmes-base-de-données)
5. [Problèmes DNS/Domaine](#problèmes-dnsdomaine)
6. [Problèmes de déploiement](#problèmes-de-déploiement)
7. [Problèmes de persistance](#problèmes-de-persistance)

---

## 🎨 PROBLÈMES FRONTEND

### ❌ **Build Vite échoue**

**Symptômes:**
```bash
npm run build
✘ [ERROR] Transform failed with 1 error
```

**Causes possibles:**
1. Erreur TypeScript
2. Import manquant
3. Syntaxe invalide

**Solutions:**
```bash
# 1. Vérifier les erreurs TypeScript
npm run type-check

# 2. Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# 3. Vérifier la config Vite
cat vite.config.ts
```

---

### ❌ **Page blanche après déploiement**

**Symptômes:**
- Site accessible mais page blanche
- Console F12: Erreur 404 sur les assets

**Cause:** Base path incorrect dans Vite

**Solution:**
```typescript
// vite.config.ts
export default defineConfig({
  base: '/',  // Doit être '/' pour domaine custom
  // ...
})
```

---

### ❌ **CORS Error - API calls bloquées**

**Symptômes:**
```
Access to fetch at 'https://osint-lms-backend.onrender.com/...' 
has been blocked by CORS policy
```

**Cause:** Domaine manquant dans allow_origins backend

**Solution:**
```bash
# Vérifier CORS backend
cd ~/osint-lms/osint-lms-backend
grep -A 5 "cors({" server.js

# Doit contenir:
# "https://www.cyberosint-academy.com"
```

---

### ❌ **localStorage vide après refresh**

**Symptômes:**
- Progression perdue après F5
- Utilisateur déconnecté

**Cause:** Hook `useLocalStorageSync` pas déclenché

**Solution:**
```typescript
// Vérifier dans F12 Console
localStorage.getItem("cyberosint_game_state")
// Si null → problème de sync

// Vérifier useLocalStorageSync.ts
// Doit avoir dépendance [token] et non []
```

**Fix appliqué:** Voir commit `fix: localStorage sync with token dependency`

---

### ❌ **Routes 404 après refresh**

**Symptômes:**
- Route `/dashboard` fonctionne en navigation
- 404 après refresh direct

**Cause:** SPA routing non configuré sur Vercel

**Solution:**
```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 🔧 PROBLÈMES BACKEND

### ❌ **Backend en veille (15 min)**

**Symptômes:**
```
[!] Timeout: le serveur n'a pas répondu en 30s
```

**Cause:** Render Free Tier se met en veille après 15 min

**Solutions:**

**1. Augmenter le timeout côté frontend:**
```typescript
fetch(url, {
  signal: AbortSignal.timeout(60000)  // 60s au lieu de 30s
})
```

**2. Implémenter keepalive (FAIT pour Argus):**
```typescript
useEffect(() => {
  const keepAlive = () => fetch("https://osint-lms-backend.onrender.com/");
  const interval = setInterval(keepAlive, 10 * 60 * 1000); // 10 min
  return () => clearInterval(interval);
}, []);
```

---

### ❌ **JWT Token invalide**

**Symptômes:**
```json
{"error": "Token invalide"}
```

**Causes:**
1. JWT_SECRET changé
2. Token expiré (>24h)
3. Token malformé

**Solution:**
```bash
# 1. Vérifier JWT_SECRET
cd ~/osint-lms/osint-lms-backend
cat .env | grep JWT_SECRET

# 2. Forcer reconnexion utilisateur
localStorage.removeItem("token")
# Se reconnecter
```

---

### ❌ **Database connection failed**

**Symptômes:**
```
Error: connection to server failed
```

**Solutions:**
```bash
# 1. Vérifier DATABASE_URL
echo $DATABASE_URL

# 2. Tester connection directe
psql "postgresql://osint_lms_db_user:***@osint-lms-db.c72ein28e.us-east-2.aws.neon.tech/osint-lms-db?sslmode=require"

# 3. Vérifier IP allowlist Neon
# Neon Console → Settings → IP Allow List
# Doit permettre 0.0.0.0/0 pour Render
```

---

## 🔬 PROBLÈMES ARGUS API

### ❌ **Whois timeout 30s**

**Symptômes:**
```
[!] Timeout: le serveur n'a pas répondu en 30s
```

**Causes:**
1. API en veille (réveil = 15-30s)
2. Requête WHOIS lente (~10-20s)
3. Total > 30s

**Solutions:**

**1. Timeout 60s (FAIT):**
```typescript
// ArgusConsole.tsx ligne 306
signal: AbortSignal.timeout(60000)
```

**2. Keepalive (FAIT):**
```typescript
// Ping API toutes les 10 min
```

---

### ❌ **Whois données brutes**

**Symptômes:**
```
[+] Created: [datetime.datetime(1997, 9, 15, 4, 0)]
```

**Cause:** Python datetime pas converti en string

**Solution:**
```python
# main.py - whois_lookup
def format_date(date_val):
    if isinstance(date_val, list):
        date_val = date_val[0]
    if date_val:
        return str(date_val).split()[0]  # YYYY-MM-DD
    return "N/A"
```

**Fix appliqué:** Commit `fix: whois date formatting`

---

### ❌ **CORS missing pour www**

**Symptômes:**
```
CORS header 'Access-Control-Allow-Origin' missing
```

**Solution:**
```python
# main.py ligne 11
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://cyberosint-academy.vercel.app",
        "https://www.cyberosint-academy.com",  # AJOUTER
        "http://localhost:5173"
    ]
)
```

---

## 💾 PROBLÈMES BASE DE DONNÉES

### ❌ **Table not found**

**Symptômes:**
```
relation "users" does not exist
```

**Cause:** Migrations pas exécutées

**Solution:**
```bash
# 1. Se connecter à Neon
psql "postgresql://..."

# 2. Lister les tables
\dt

# 3. Créer les tables manquantes
# Utiliser les migrations dans db/migrations/
```

---

### ❌ **Connection pool exhausted**

**Symptômes:**
```
Error: Too many clients
```

**Cause:** Connexions non fermées

**Solution:**
```javascript
// Toujours fermer les connexions
const client = await pool.connect();
try {
  // ... requêtes
} finally {
  client.release();  // IMPORTANT
}
```

---

## 🌐 PROBLÈMES DNS/DOMAINE

### ❌ **Site inaccessible sur www**

**Symptômes:**
- `https://www.cyberosint-academy.com` → ERR_NAME_NOT_RESOLVED
- `https://cyberosint-academy.com` → Fonctionne

**Cause:** CNAME www manquant

**Solution:**
```bash
# GoDaddy DNS Manager
# Ajouter:
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**Vérification:**
```bash
dig www.cyberosint-academy.com
# Doit renvoyer CNAME vers Vercel
```

---

### ❌ **SSL Certificate error**

**Symptômes:**
```
NET::ERR_CERT_COMMON_NAME_INVALID
```

**Cause:** Certificat SSL pas encore provisionné

**Solution:**
```bash
# 1. Attendre 24-48h après config DNS
# 2. Vérifier dans Vercel Dashboard
# Domains → www.cyberosint-academy.com → Status: Active

# 3. Si toujours erreur après 48h:
# Vercel Dashboard → Domains → Refresh SSL
```

---

### ❌ **DNS propagation lente**

**Symptômes:**
- Fonctionne chez certains, pas chez d'autres
- Résultats DNS différents

**Cause:** Propagation DNS en cours (24-48h)

**Vérification:**
```bash
# Tester la propagation mondiale
https://dnschecker.org
# Entrer: www.cyberosint-academy.com

# Flush DNS local
# Windows:
ipconfig /flushdns

# Mac/Linux:
sudo dscacheutil -flushcache
```

---

## 🚀 PROBLÈMES DE DÉPLOIEMENT

### ❌ **Vercel build failed**

**Symptômes:**
```
Error: Build exceeded maximum duration of 45 minutes
```

**Causes:**
1. node_modules trop volumineux
2. Build infini (loop)

**Solutions:**
```bash
# 1. Nettoyer node_modules
rm -rf node_modules
npm install --production

# 2. Vérifier .vercelignore
echo "node_modules" > .vercelignore
echo ".git" >> .vercelignore

# 3. Utiliser cache Vercel
# Vercel auto-cache node_modules
```

---

### ❌ **Render deploy stuck**

**Symptômes:**
- Deploy en cours depuis >10 min
- Pas de logs

**Solutions:**
```bash
# 1. Annuler le deploy
# Render Dashboard → Cancel Deploy

# 2. Vérifier les logs build
# Render Dashboard → Logs → Build Logs

# 3. Redémarrer le service
# Render Dashboard → Manual Deploy → Clear build cache
```

---

### ❌ **Environment variables manquantes**

**Symptômes:**
```
Error: DATABASE_URL is not defined
```

**Solution:**
```bash
# Render Dashboard → Environment
# Ajouter:
# DATABASE_URL = postgresql://...
# JWT_SECRET = bc394b...

# Puis redéployer
```

---

## 💿 PROBLÈMES DE PERSISTANCE

### ❌ **Progression perdue après cache clear**

**Symptômes:**
- Vider le cache → progression disparaît
- Historique CTF/quiz perdu

**Cause:** localStorage sync pas activé

**Solution appliquée:**
```typescript
// useLocalStorageSync.ts
// 1. Dépendance [token] au lieu de []
// 2. Auto-save toutes les 30s
// 3. Listener 'localStorageUpdated'
```

**Commit:** `fix: localStorage persistence with API sync`

---

### ❌ **Certificat ne se met pas à jour**

**Symptômes:**
- CTF résolu mais certificat pas coché
- Parcours validé mais certificat incomplet

**Cause:** Mauvaise clé localStorage lue

**Solutions:**

**1. Vérifier certificateTracker.ts:**
```typescript
// Doit lire cyberosint_challenges
const challengesStr = localStorage.getItem("cyberosint_challenges");
// PAS ctf_progress
```

**2. Forcer refresh:**
```javascript
// F12 Console
localStorage.removeItem("certificat_progression");
window.location.reload();
```

---

### ❌ **Leaderboard pas à jour**

**Symptômes:**
- XP augmente mais pas dans leaderboard
- Rang incorrect

**Cause:** Backend pas mis à jour

**Solution:**
```javascript
// Vérifier auto-save
const interval = setInterval(() => {
  saveToAPI();
}, 30000);  // Toutes les 30s

// Forcer save manuel
await fetch("https://osint-lms-backend.onrender.com/game/save-full", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    gameState: localStorage.getItem("cyberosint_game_state"),
    challenges: localStorage.getItem("cyberosint_challenges")
  })
});
```

---

## 🔍 OUTILS DE DIAGNOSTIC

### **F12 Developer Tools**

**Console:**
```javascript
// Vérifier localStorage
Object.keys(localStorage).forEach(key => {
  console.log(key, localStorage.getItem(key)?.length);
});

// Vérifier token
localStorage.getItem("token")

// Vérifier progression
JSON.parse(localStorage.getItem("cyberosint_game_state"))
```

**Network:**
- Filtrer par "Fetch/XHR"
- Vérifier status codes (200, 401, 500)
- Inspecter payloads Request/Response

**Application:**
- Storage → Local Storage → www.cyberosint-academy.com
- Vérifier toutes les clés

---

### **Logs Backend (Render)**

```bash
# Accès temps réel
# Render Dashboard → Service → Logs

# Filtrer par type
# [INFO] - requêtes normales
# [ERROR] - erreurs
# [WARN] - avertissements

# Chercher une erreur spécifique
# Ctrl+F dans les logs
```

---

### **Logs Frontend (Vercel)**

```bash
# Vercel Dashboard → Deployments → Latest → Function Logs
# (Pas de logs runtime pour static sites)

# Utiliser console.log en dev
npm run dev
# Ouvrir F12 Console
```

---

### **Test DNS**

```bash
# Dig
dig www.cyberosint-academy.com

# NSLookup
nslookup www.cyberosint-academy.com

# Online checker
https://dnschecker.org
https://mxtoolbox.com/SuperTool.aspx
```

---

### **Test API**

```bash
# cURL
curl https://osint-lms-backend.onrender.com/
# Doit renvoyer: {"message":"OSINT-LMS backend opérationnel"}

curl https://argus-api-aqr6.onrender.com/
# Doit renvoyer: {"status":"Argus V2.0 API en ligne","modules":50}

# Avec auth
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://osint-lms-backend.onrender.com/game/leaderboard
```

---

## 📞 SUPPORT & RESSOURCES

**En cas de problème persistant:**

1. **Vérifier logs** (Vercel, Render, F12)
2. **Tester en local** (`npm run dev`)
3. **Vider cache** (Ctrl+Shift+R)
4. **Vérifier variables d'env** (Render Dashboard)
5. **Consulter cette doc** 📚

**Contacts support:**
- Vercel: https://vercel.com/support
- Render: https://render.com/docs/troubleshooting
- Neon: https://neon.tech/docs/introduction

---

**FIN DU TROUBLESHOOTING GUIDE**
