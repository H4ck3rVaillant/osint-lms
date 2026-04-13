const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const db = require("../services/neonDatabase");
const { checkAccountLocked, recordFailedAttempt, resetAttempts } = require("../middlewares/rateLimiter");

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
      password: passwordHash,
      role,  // FORCÉ à "user"
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
   POST /auth/login - Étape 1
   PROTECTION: Rate limiting sur mot de passe
==================================== */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Champs manquants" });
  }
  
  try {
    // 🛡️ PROTECTION 1: Vérifier si le compte est bloqué (mot de passe)
    const lockStatus = await checkAccountLocked(username, "password");
    
    if (lockStatus.isLocked) {
      return res.status(429).json({
        message: lockStatus.message,
        unlockTime: lockStatus.unlockTime,
        hoursRemaining: lockStatus.hoursRemaining
      });
    }
    
    // Récupérer l'utilisateur depuis la DB
    const user = await db.getUserByUsername(username);
    
    if (!user) {
      // 🛡️ PROTECTION 2: Enregistrer tentative échouée
      const result = await recordFailedAttempt(username, "password");
      
      return res.status(401).json({ 
        message: "Identifiants invalides",
        remainingAttempts: result.remainingAttempts
      });
    }
    
    // Vérifier le mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // 🛡️ PROTECTION 3: Enregistrer tentative échouée
      const result = await recordFailedAttempt(username, "password");
      
      if (result.isLocked) {
        return res.status(429).json({ message: result.message });
      }
      
      return res.status(401).json({ 
        message: "Identifiants invalides",
        remainingAttempts: result.remainingAttempts
      });
    }
    
    // ✅ Mot de passe correct: Réinitialiser les tentatives
    await resetAttempts(username, "password");
    
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
    console.error("Erreur lors du login:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

/* ====================================
   POST /auth/verify-2fa - SÉCURISÉ
   PROTECTION: Rate limiting sur code 2FA
==================================== */
router.post("/verify-2fa", async (req, res) => {
  const { tempToken, totpCode } = req.body;
  
  if (!tempToken || !totpCode) {
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
    
    // 🛡️ PROTECTION 3: Vérifier si le compte est bloqué (2FA)
    const lockStatus = await checkAccountLocked(decoded.username, "2fa");
    
    if (lockStatus.isLocked) {
      return res.status(429).json({
        message: lockStatus.message,
        unlockTime: lockStatus.unlockTime,
        hoursRemaining: lockStatus.hoursRemaining
      });
    }
    
    // Récupérer l'utilisateur
    const user = await db.getUserById(decoded.id);
    
    if (!user || !user.totp_secret) {
      return res.status(401).json({ message: "Utilisateur invalide ou 2FA non configuré" });
    }
    
    // Vérifier le code 2FA
    const isValid = speakeasy.totp.verify({
      secret: user.totp_secret,
      encoding: "base32",
      token: totpCode,
      window: 2
    });
    
    if (!isValid) {
      // 🛡️ PROTECTION 4: Enregistrer tentative 2FA échouée
      const result = await recordFailedAttempt(decoded.username, "2fa");
      
      if (result.isLocked) {
        return res.status(429).json({ message: result.message });
      }
      
      return res.status(401).json({ 
        message: "Code 2FA invalide",
        remainingAttempts: result.remainingAttempts
      });
    }
    
    // ✅ Code 2FA correct: Réinitialiser les tentatives
    await resetAttempts(decoded.username, "2fa");
    
    // Mettre à jour last_login
    await db.updateLastLogin(user.id);
    console.log("✅ Last login mis à jour pour user", user.id);
    
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
