const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Total utilisateurs
    const totalUsers = await sql`SELECT COUNT(*) as count FROM users`;
    
    // Utilisateurs inscrits cette semaine
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const newUsers = await sql`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE created_at >= ${weekAgo.toISOString()}
    `;

    // Utilisateurs connectés MAINTENANT (< 2 minutes)
    const twoMinutesAgo = new Date();
    twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 2);
    
    const activeNow = await sql`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE last_login >= ${twoMinutesAgo.toISOString()}
    `;

    return res.status(200).json({
      total: parseInt(totalUsers[0].count),
      newThisWeek: parseInt(newUsers[0].count),
      activeNow: parseInt(activeNow[0].count),
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch stats',
      details: error.message
    });
  }
}
