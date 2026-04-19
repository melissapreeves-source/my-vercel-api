// Single file API - handles all routes
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Get the path (remove query string)
  const url = req.url.split('?')[0];
  
  // ============================================
  // ROUTE: GET /api or /api/ (root)
  // ============================================
  if ((url === '/' || url === '/api' || url === '/api/') && req.method === 'GET') {
    return res.status(200).json({ 
      message: 'DearSS API is running!',
      endpoints: {
        send: 'POST /api/send - Send code and username',
        getCode: 'GET /api/getCode - Get latest code'
      }
    });
  }
  
  // ============================================
  // ROUTE: POST /api/send
  // ============================================
  if (url === '/send' && req.method === 'POST') {
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
    
    console.log(`[STORED] ${username} - ${code.length} chars`);
    return res.status(200).json({ status: 'success', message: 'Data stored' });
  }
  
  // ============================================
  // ROUTE: GET /api/getCode
  // ============================================
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
  
  // ============================================
  // No route matched
  // ============================================
  return res.status(404).json({ 
    error: `Route ${req.method} ${url} not found`,
    available: ['GET /api', 'POST /api/send', 'GET /api/getCode']
  });
}
