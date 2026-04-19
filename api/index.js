export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Get the path from the URL
  const url = req.url;
  
  // POST to /api/send
  if (url === '/send' && req.method === 'POST') {
    const { username, code } = req.body;
    
    if (!username || !code) {
      return res.status(400).json({ error: 'Missing username or code' });
    }
    
    // Store in memory
    global.latestPayload = {
      username: username,
      code: code,
      timestamp: Date.now()
    };
    
    return res.status(200).json({ status: 'success', message: 'Data stored' });
  }
  
  // GET from /api/getCode
  if (url === '/getCode' && req.method === 'GET') {
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
  
  // GET to /api (root)
  if (url === '/' || url === '/api' || url === '/api/') {
    return res.status(200).json({ 
      message: 'DearSS API is running!',
      endpoints: {
        send: 'POST /api/send - Send code and username',
        getCode: 'GET /api/getCode - Get latest code'
      }
    });
  }
  
  // If no route matches
  return res.status(404).json({ error: `Route ${req.method} ${url} not found` });
}
