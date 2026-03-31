require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const gameRoutes = require("./routes/game");

const app = express();

/* =========================
   CORS
========================= */
app.use(
  cors({
    origin: ["http://localhost:5173", "https://www.cyberosint-academy.com", "https://cyberosint-academy.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================
   MIDDLEWARES - LIMITE 10MB
========================= */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/* =========================
   ROUTES
========================= */
app.get("/", (req, res) => {
  res.json({ message: "OSINT-LMS backend opérationnel" });
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/game", gameRoutes);

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✔ Serveur lancé sur http://localhost:${PORT}`);
});
