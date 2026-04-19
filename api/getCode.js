export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = global.latestPayload;

  if (!payload || !payload.username) {
    return res.status(200).json({ status: 'waiting', message: 'No code available' });
  }

  return res.status(200).json({
    status: 'success',
    username: payload.username,
    code: payload.code,
    timestamp: payload.timestamp
  });
}