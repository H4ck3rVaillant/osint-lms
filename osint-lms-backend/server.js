require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

const app = express();

/* =========================
   CORS (OBLIGATOIRE)
========================= */
app.use(
  cors({
    origin: "http://localhost:5173",
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

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✔ Serveur lancé sur http://localhost:${PORT}`);
});
