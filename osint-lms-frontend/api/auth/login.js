const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserByUsername, updateLastLogin } = require("../_lib/database");

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
  
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Champs manquants" });
  }
  
  try {
    const user = await getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // ✅ VÉRIFIER SI BLOQUÉ PAR L'ADMIN
    if (user.blocked) {
      return res.status(403).json({ message: "Compte bloqué. Contactez l'administrateur." });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // ✅ Mettre à jour last_login
    try {
      await updateLastLogin(user.id);
    } catch (updateError) {
      console.warn('Failed to update last_login:', updateError);
    }
    
    // Token temporaire pour 2FA
    const tempToken = jwt.sign(
      { id: user.id, username: user.username, step: "awaiting_2fa" },
      process.env.JWT_SECRET,
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
};
