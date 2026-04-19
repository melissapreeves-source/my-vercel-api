export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, code } = req.body;

  if (!username || !code) {
    return res.status(400).json({ error: 'Missing username or code' });
  }

  // Store in memory (will reset on cold start)
  global.latestPayload = {
    username: username,
    code: code,
    timestamp: Date.now()
  };

  console.log(`Received from ${username}`);
  return res.status(200).json({ status: 'success', message: 'Data stored' });
}