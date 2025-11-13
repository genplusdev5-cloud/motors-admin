
export async function POST(req) {
  try {
    const body = await req.json()

    // 🔗 Backend API endpoint
    const response = await fetch('https://motor-match.genplusinnovations.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    // Pass through response to frontend
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Proxy error:', error)

    return new Response(JSON.stringify({ error: 'Proxy login failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
