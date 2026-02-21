import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
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

    // Récupérer tous les users (SANS les mots de passe)
    const users = await sql`
      SELECT 
        id,
        username,
        role,
        created_at,
        last_login
      FROM users
      ORDER BY created_at DESC
    `;

    return res.status(200).json({
      users,
      count: users.length
    });

  } catch (error) {
    console.error('Admin users list error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch users',
      details: error.message
    });
  }
}
