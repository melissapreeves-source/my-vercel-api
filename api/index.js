// This single file handles ALL routes
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const url = req.url;
  
  // GET /api or /api/ - Root endpoint
  if ((url === '/' || url === '/api' || url === '/api/') && req.method === 'GET') {
    return res.status(200).json({ 
      message: 'DearSS API is running!',
      endpoints: {
        send: 'POST /api/send - Send code and username',
        getCode: 'GET /api/getCode - Get latest code'
      }
    });
  }
  
  // POST /api/send - Receive data
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
    
    console.log(`Received from ${username}`);
    return res.status(200).json({ status: 'success', message: 'Data stored' });
  }
  
  // GET /api/getCode - Retrieve data
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
  
  // If no route matches
  return res.status(404).json({ error: `Route ${req.method} ${url} not found` });
}
