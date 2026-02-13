const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const { getUserById } = require("../_lib/database");

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

  const { tempToken, totpCode } = req.body;

  if (!tempToken || !totpCode) {
    return res.status(400).json({ message: "Token et code 2FA requis" });
  }

  try {
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);

    if (decoded.step !== "awaiting_2fa") {
      return res.status(401).json({ message: "Token invalide" });
    }

    const user = await getUserById(decoded.id);

    if (!user || !user.totp_secret) {
      return res.status(401).json({ message: "Utilisateur invalide ou 2FA non configuré" });
    }

    const isValid = speakeasy.totp.verify({
      secret: user.totp_secret,
      encoding: "base32",
      token: totpCode,
      window: 2
    });

    if (!isValid) {
      return res.status(401).json({ message: "Code 2FA invalide" });
    }

    // Token JWT final
    const finalToken = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET,
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
};
