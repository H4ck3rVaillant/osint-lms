const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const { createUser, getUserByUsername } = require("../_lib/database");

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

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
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: "Cet utilisateur existe déjà" });
    }

    // Hash du mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Générer un secret TOTP
    const totpSecret = speakeasy.generateSecret({
      name: `CyberOSINT Academy (${username})`,
      issuer: "CyberOSINT Academy"
    });

    // Créer l'utilisateur
    const userId = await createUser({
      username,
      password: passwordHash,
      role,
      totp_secret: totpSecret.base32,
      must_change_password: 0
    });

    // Générer le QR Code
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
};
