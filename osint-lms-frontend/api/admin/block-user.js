const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, blocked } = req.body;

    if (!userId || typeof blocked !== 'boolean') {
      return res.status(400).json({ error: 'userId and blocked (boolean) required' });
    }

    const sql = neon(process.env.DATABASE_URL);

    // Mettre à jour le statut blocked
    await sql`
      UPDATE users 
      SET blocked = ${blocked}
      WHERE id = ${userId}
    `;

    return res.status(200).json({
      success: true,
      message: blocked ? 'User blocked successfully' : 'User unblocked successfully'
    });

  } catch (error) {
    console.error('Block user error:', error);
    return res.status(500).json({ 
      error: 'Failed to update user status',
      details: error.message
    });
  }
}
