// Vercel Serverless Function
// Fichier: api/admin/reset-password.js

import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // CORS headers
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
    return res.status(400).json({ error: 'userId manquant' });
  }

  try {
    // Connexion Neon
    const sql = neon(process.env.DATABASE_URL);

    // Générer mot de passe temporaire (8 caractères aléatoires)
    const tempPassword = Math.random().toString(36).slice(-8).toUpperCase();

    // Hash du mot de passe (tu utilises bcrypt normalement)
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Mettre à jour le mot de passe dans Neon
    await sql`
      UPDATE users 
      SET password_hash = ${hashedPassword}
      WHERE id = ${userId}
    `;

    return res.status(200).json({
      success: true,
      tempPassword: tempPassword,
      message: 'Mot de passe réinitialisé'
    });

  } catch (error) {
    console.error('Erreur reset password:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de la réinitialisation',
      details: error.message 
    });
  }
}
