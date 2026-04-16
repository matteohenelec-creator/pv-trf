exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch(e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { path, method, body, token } = payload;
  const BASE = 'https://api.roundtable.world/v1/app';

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Token ' + token;

  const options = { method: method || 'GET', headers };
  if (body && method === 'POST') options.body = JSON.stringify(body);

  try {
    const response = await fetch(BASE + path, options);
    const data = await response.text();
    return {
      statusCode: response.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: data
    };
  } catch(e) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: e.message })
    };
  }
};
