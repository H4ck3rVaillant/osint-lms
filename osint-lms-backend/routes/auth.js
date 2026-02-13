const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const db = require("../services/database");

const router = express.Router();

/* ====================================
   POST /auth/register
   Inscription d'un nouvel utilisateur
==================================== */
router.post("/register", async (req, res) => {
  const { username, password, role = "user" } = req.body;

  // Validation
  if (!username || !password) {
    return res.status(400).json({ message: "Username et password requis" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Le mot de passe doit faire au moins 8 caractères" });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: "Cet utilisateur existe déjà" });
    }

    // Hash du mot de passe avec bcrypt (salt rounds = 10)
    const passwordHash = await bcrypt.hash(password, 10);

    // Générer un secret TOTP pour l'authentification 2FA
    const totpSecret = speakeasy.generateSecret({
      name: `CyberOSINT Academy (${username})`,
      issuer: "CyberOSINT Academy"
    });

    // Créer l'utilisateur dans la DB
    const userId = await db.createUser({
      username,
      password: passwordHash,
      role,
      totp_secret: totpSecret.base32,
      must_change_password: 0
    });

    // Générer le QR Code pour FreeOTP/Google Authenticator
    const qrCodeDataURL = await QRCode.toDataURL(totpSecret.otpauth_url);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      userId,
      totpSecret: totpSecret.base32,
      qrCode: qrCodeDataURL,
      instructions: "Scannez ce QR code avec FreeOTP ou Google Authenticator"
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
  }
});

/* ====================================
   POST /auth/login
   Étape 1 : Vérification username/password
==================================== */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    // Récupérer l'utilisateur depuis la DB
    const user = await db.getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Vérifier le mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Générer un token temporaire (5 minutes) pour la vérification 2FA
    const tempToken = jwt.sign(
      { id: user.id, username: user.username, step: "awaiting_2fa" },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "5m" }
    );

    res.json({
      message: "Mot de passe correct. Veuillez entrer votre code 2FA.",
      tempToken,
      requires2FA: true
    });
  } catch (error) {
    console.error("Erreur lors du login:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/* ====================================
   POST /auth/verify-2fa
   Étape 2 : Vérification du code TOTP (6 chiffres)
==================================== */
router.post("/verify-2fa", async (req, res) => {
  const { tempToken, totpCode } = req.body;

  if (!tempToken || !totpCode) {
    return res.status(400).json({ message: "Token et code 2FA requis" });
  }

  try {
    // Vérifier le token temporaire
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET || "dev_secret");

    if (decoded.step !== "awaiting_2fa") {
      return res.status(401).json({ message: "Token invalide" });
    }

    // Récupérer l'utilisateur
    const user = await db.getUserById(decoded.id);

    if (!user || !user.totp_secret) {
      return res.status(401).json({ message: "Utilisateur invalide ou 2FA non configuré" });
    }

    // Vérifier le code TOTP (6 chiffres) avec speakeasy
    const isValid = speakeasy.totp.verify({
      secret: user.totp_secret,
      encoding: "base32",
      token: totpCode,
      window: 2 // Accepte ±1 intervalle de 30s pour compenser le décalage d'horloge
    });

    if (!isValid) {
      return res.status(401).json({ message: "Code 2FA invalide" });
    }

    // Générer le token JWT final (valide 24h)
    const finalToken = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "24h" }
    );

    res.json({
      message: "Authentification réussie",
      token: finalToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }
    console.error("Erreur lors de la vérification 2FA:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/* ====================================
   POST /auth/regenerate-qr
   Régénérer le QR code TOTP (si perdu)
==================================== */
router.post("/regenerate-qr", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const user = await db.getUserByUsername(username);

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe invalide" });
    }

    if (!user.totp_secret) {
      return res.status(400).json({ message: "Pas de secret TOTP configuré" });
    }

    // Recréer le QR code à partir du secret existant
    const otpauthUrl = speakeasy.otpauthURL({
      secret: user.totp_secret,
      label: `CyberOSINT Academy (${username})`,
      issuer: "CyberOSINT Academy",
      encoding: "base32"
    });

    const qrCodeDataURL = await QRCode.toDataURL(otpauthUrl);

    res.json({
      qrCode: qrCodeDataURL,
      totpSecret: user.totp_secret,
      instructions: "Scannez ce QR code avec FreeOTP ou Google Authenticator"
    });
  } catch (error) {
    console.error("Erreur lors de la régénération du QR:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
