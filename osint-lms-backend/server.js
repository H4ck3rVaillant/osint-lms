require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const gameRoutes = require("./routes/game");
const honeypotRoutes = require("./routes/honeypot");

const app = express();

/* =========================
   CORS (OBLIGATOIRE)
========================= */
app.use(
  cors({
    origin: ["http://localhost:5173", "https://www.cyberosint-academy.com"],
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
app.use("/messages", messageRoutes);
app.use("/game", gameRoutes);
app.use("/", honeypotRoutes);

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✔ Serveur lancé sur http://localhost:${PORT}`);
});
