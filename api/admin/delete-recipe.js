const sdk = require('node-appwrite');

/**
 * Vercel Serverless Function
 * DELETE /api/admin/delete-recipe?recipeId=...
 *
 * Auth:
 * - Client sends an Appwrite JWT in `Authorization: Bearer <jwt>`
 * - This function verifies the JWT (who is the caller)
 * - Then verifies the caller is a member of the configured admin team
 * - Then deletes the recipe using a server API key
 */
module.exports = async (req, res) => {
  // CORS for same-origin + local dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const recipeId = req.query.recipeId;
  if (!recipeId || typeof recipeId !== 'string') {
    return res.status(400).json({ error: 'Missing recipeId' });
  }

  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  const jwt = match ? match[1] : null;
  if (!jwt) {
    return res.status(401).json({ error: 'Missing Authorization Bearer token' });
  }

  const endpoint = process.env.APPWRITE_ENDPOINT;
  const projectId = process.env.APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  const recipeCollectionId = process.env.APPWRITE_RECIPE_COLLECTION_ID;
  const adminTeamId = process.env.APPWRITE_ADMIN_TEAM_ID;

  const missing = [];
  if (!endpoint) missing.push('APPWRITE_ENDPOINT');
  if (!projectId) missing.push('APPWRITE_PROJECT_ID');
  if (!apiKey) missing.push('APPWRITE_API_KEY');
  if (!databaseId) missing.push('APPWRITE_DATABASE_ID');
  if (!recipeCollectionId) missing.push('APPWRITE_RECIPE_COLLECTION_ID');
  if (!adminTeamId) missing.push('APPWRITE_ADMIN_TEAM_ID');
  if (missing.length) {
    return res.status(500).json({ error: `Missing server env vars: ${missing.join(', ')}` });
  }

  // Identify caller via JWT (no API key)
  const authClient = new sdk.Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setJWT(jwt);
  const account = new sdk.Account(authClient);

  let user;
  try {
    user = await account.get();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid session (JWT)' });
  }

  // Admin client using API key
  const adminClient = new sdk.Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);
  const teams = new sdk.Teams(adminClient);
  const databases = new sdk.Databases(adminClient);

  // Verify membership in admin team
  try {
    const memberships = await teams.listMemberships(adminTeamId);
    const isAdmin = (memberships.memberships || []).some((m) => {
      const isUser = m.userId === user.$id;
      const isConfirmed = m.confirm === true || m.confirmed === true;
      return isUser && isConfirmed;
    });
    if (!isAdmin) {
      return res.status(403).json({ error: 'Not an admin' });
    }
  } catch (e) {
    return res.status(403).json({ error: 'Could not verify admin membership' });
  }

  try {
    await databases.deleteDocument(databaseId, recipeCollectionId, recipeId);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res
      .status(500)
      .json({ error: 'Failed to delete recipe', details: e?.message || String(e) });
  }
};


