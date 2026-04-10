const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const db = require("../db");

const router = express.Router();

/* ====================================
   POST /auth/register - SÉCURISÉ
   FAILLE CORRIGÉE: role forcé à "user"
==================================== */
router.post("/register", async (req, res) => {
  const { username, password } = req.body; // PAS de role dans req.body
  
  // SÉCURITÉ: Forcer role = "user" (JAMAIS admin via register)
  const role = "user";
  
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
    
    // Hash du mot de passe
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Générer secret TOTP pour 2FA
    const totpSecret = speakeasy.generateSecret({
      name: `CyberOSINT Academy (${username})`,
      issuer: "CyberOSINT Academy"
    });
    
    // Créer l'utilisateur (role forcé à "user")
    const userId = await db.createUser({
      username,
      passwordHash,
      role,  // FORCÉ à "user"
      totpSecret: totpSecret.base32
    });
    
    // Générer QR Code pour 2FA
    const qrCodeUrl = await QRCode.toDataURL(totpSecret.otpauth_url);
    
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      userId,
      username,
      qrCode: qrCodeUrl,
      totpSecret: totpSecret.base32
    });
    
  } catch (error) {
    console.error("Erreur register:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/* ====================================
   POST /auth/login - Étape 1
==================================== */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username et password requis" });
  }
  
  try {
    const user = await db.getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }
    
    // Vérifier password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }
    
    // SÉCURITÉ: Ajouter timestamp dans tempToken
    const tempToken = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        step: "awaiting_2fa",
        iat: Math.floor(Date.now() / 1000)  // Timestamp
      },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "5m" }
    );
    
    res.json({
      message: "Mot de passe correct. Veuillez entrer votre code 2FA.",
      tempToken,
      requires2FA: true
    });
    
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/* ====================================
   POST /auth/verify-2fa - SÉCURISÉ
   FAILLE CORRIGÉE: Vérification stricte du tempToken
==================================== */
router.post("/verify-2fa", async (req, res) => {
  const { tempToken, code } = req.body;
  
  if (!tempToken || !code) {
    return res.status(400).json({ message: "Token et code requis" });
  }
  
  try {
    // Vérifier et décoder le tempToken
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET || "dev_secret");
    
    // SÉCURITÉ 1: Vérifier que step === "awaiting_2fa"
    if (decoded.step !== "awaiting_2fa") {
      return res.status(401).json({ message: "Token invalide - étape incorrecte" });
    }
    
    // SÉCURITÉ 2: Vérifier que le token a moins de 5 minutes
    const tokenAge = Math.floor(Date.now() / 1000) - decoded.iat;
    if (tokenAge > 300) { // 5 minutes = 300 secondes
      return res.status(401).json({ message: "Token expiré" });
    }
    
    // Récupérer l'utilisateur
    const user = await db.getUserById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }
    
    // Vérifier le code 2FA
    const verified = speakeasy.totp.verify({
      secret: user.totp_secret,
      encoding: "base32",
      token: code,
      window: 2
    });
    
    if (!verified) {
      return res.status(401).json({ message: "Code 2FA invalide" });
    }
    
    // Mettre à jour last_login
    await db.updateLastLogin(user.id);
    
    // Générer le token final (24h)
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
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expiré" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token invalide" });
    }
    console.error("Erreur verify-2fa:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/* ====================================
   GET /auth/me - Vérifier token
==================================== */
router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Token manquant" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    const user = await db.getUserById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
    
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
});

module.exports = router;
