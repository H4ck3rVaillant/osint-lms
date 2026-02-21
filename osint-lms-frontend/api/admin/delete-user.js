const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId required' });
    }

    const sql = neon(process.env.DATABASE_URL);
    
    // Vérifier que ce n'est pas l'admin
    const user = await sql`SELECT username FROM users WHERE id = ${userId}`;
    
    if (user[0]?.username === 'Cyber_Admin') {
      return res.status(403).json({ error: 'Cannot delete admin account' });
    }

    // Supprimer l'utilisateur
    await sql`DELETE FROM users WHERE id = ${userId}`;

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ 
      error: 'Failed to delete user',
      details: error.message
    });
  }
}
