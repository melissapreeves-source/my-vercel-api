export default async function handler(req, res) {
  res.status(200).json({ 
    message: 'DearSS API is running!',
    endpoints: {
      send: 'POST /api/send - Send code and username',
      getCode: 'GET /api/getCode - Get latest code'
    }
  });
}