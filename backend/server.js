require("dotenv").config();

const express    = require("express");
const cors       = require("cors");
const helmet     = require("helmet");
const rateLimit  = require("express-rate-limit");
const { initDatabase } = require("./services/database");

const authRoutes  = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();

/* =====================================================
   SÉCURITÉ
===================================================== */
app.use(helmet());
app.set("trust proxy", 1); // Nécessaire derrière le reverse proxy de Render

/* =====================================================
   CORS — accepte le frontend Render + localhost dev
===================================================== */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.FRONTEND_URL, // URL Render du frontend (définie dans les env vars)
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origin (ex: Postman, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS bloqué pour l'origine : ${origin}`));
    },
    methods:      ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

/* =====================================================
   RATE LIMITING — protection brute force
===================================================== */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // 20 tentatives max par IP
  message: { message: "Trop de tentatives. Réessayez dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

/* =====================================================
   MIDDLEWARES
===================================================== */
app.use(express.json({ limit: "10kb" }));

/* =====================================================
   ROUTES
===================================================== */
app.get("/", (_req, res) => {
  res.json({
    message: "CyberOSINT Academy API",
    status:  "operational",
    version: "1.0.0",
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/auth",  authLimiter, authRoutes);
app.use("/admin", adminRoutes);

/* =====================================================
   GESTION DES ERREURS
===================================================== */
app.use((err, _req, res, _next) => {
  if (err.message && err.message.startsWith("CORS")) {
    return res.status(403).json({ message: err.message });
  }
  console.error("Erreur serveur:", err);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

/* =====================================================
   DÉMARRAGE — initialise la DB avant d'écouter
===================================================== */
const PORT = process.env.PORT || 3000;

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Serveur lancé sur le port ${PORT}`);
      console.log(`   Environnement : ${process.env.NODE_ENV || "development"}`);
      console.log(`   CORS autorisés : ${allowedOrigins.join(", ")}`);
    });
  })
  .catch((err) => {
    console.error("❌ Impossible de démarrer — erreur DB:", err.message);
    process.exit(1);
  });
