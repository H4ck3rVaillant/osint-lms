require("dotenv").config();

const express = require("express");
const cors = require("cors");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/game"); // ✅ NOUVEAU

const app = express();

/* =========================
   CORS
========================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://www.cyberosint-academy.com",
      "https://cyberosint-academy.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
  res.json({ message: "OSINT-LMS backend opérationnel" });
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/game", gameRoutes); // ✅ NOUVEAU - Routes de progression du jeu

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✔ Serveur lancé sur http://localhost:${PORT}`);
});
