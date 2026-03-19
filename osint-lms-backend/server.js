require("dotenv").config({ debug: process.env.DEBUG === 'true' });

const express = require("express");
const cors = require("cors");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/game");
const messagesRoutes = require("./routes/messages");

const app = express();

/* =========================
   CORS (OBLIGATOIRE)
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "https://osint-lms-frontend.onrender.com",
  "https://www.cyberosint-academy.com",
  "https://cyberosint-academy.vercel.app",
  "https://cyberosint-academy-git-main-h4ck3rvaillants-projects.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`❌ CORS bloqué pour : ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());

/* =========================
   ROUTES
========================= */
app.get("/", (req, res) => {
  res.json({ 
    message: "OSINT-LMS backend opérationnel",
    version: "2.0.0",
    features: ["auth", "admin", "game-persistence", "messaging"]
  });
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/game", gameRoutes);
app.use("/messages", messagesRoutes);

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 10000;
const ENV = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur le port ${PORT}`);
  console.log(`   Environnement : ${ENV}`);
  console.log(`   CORS autorisés : ${allowedOrigins.join(', ')}`);
});
