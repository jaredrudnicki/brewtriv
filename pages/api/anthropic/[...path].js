// pages/api/[...path].js
const apiKey = process.env.CLAUDE_API_KEY

export default async function handler(req, res) {
  const { path } = req.query;
  const ANTHROPIC_URL = process.env.ANTHROPIC_URL;
  const url = `${ANTHROPIC_URL}/${path.join('/')}`;


  const headers = {
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    // 'Authorization': `Bearer ${apiKey}`,
  };
  
  console.log(url);

  const response = await fetch(url, {
      method: req.method,
      headers: {
      ...headers
      //host: 'externalapi.com', // Make sure to set the host header if needed
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      redirect: "follow"
  })

  console.log(response)
  // Get the response from the external API
  const data = await response.json();
  console.log(data);
  //const buffer = Buffer.from(data);
  // Set the status and headers from the external API response
  
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  res.removeHeader('content-encoding');
  res.removeHeader('content-length');
  res.removeHeader('connection');
  res.removeHeader('Transfer-Encoding');
  res.status(response.status).json(data);


}
