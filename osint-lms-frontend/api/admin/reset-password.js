const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Vérifier que l'utilisateur existe
    const user = await sql`SELECT id, username FROM users WHERE id = ${userId}`;
    
    if (!user || user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Générer mot de passe temporaire (8 caractères)
    const tempPassword = Math.random().toString(36).slice(-8).toUpperCase();

    // Hash avec bcrypt
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Mettre à jour dans la base (colonne "password" pas "password_hash")
    await sql`
      UPDATE users 
      SET password = ${hashedPassword}, must_change_password = 1
      WHERE id = ${userId}
    `;

    return res.status(200).json({
      success: true,
      tempPassword: tempPassword,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ 
      error: 'Failed to reset password',
      details: error.message
    });
  }
}
