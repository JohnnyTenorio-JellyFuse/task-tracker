const crypto = require('crypto');
const { createClient } = require('redis');

let client;
async function getClient() {
  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    client.on('error', () => {}); // surfaced to the caller via the failed await instead
  }
  if (!client.isOpen) await client.connect();
  return client;
}

function keyFor(code) {
  const hash = crypto.createHash('sha256').update(String(code)).digest('hex');
  return 'ttsync:' + hash;
}

module.exports = async (req, res) => {
  if (!process.env.REDIS_URL) {
    res.status(500).json({ error: 'No Redis database connected to this project yet (missing REDIS_URL).' });
    return;
  }

  let c;
  try {
    c = await getClient();
  } catch (e) {
    res.status(502).json({ error: 'Could not reach the Redis database.' });
    return;
  }

  try {
    if (req.method === 'GET') {
      const code = req.query.code;
      if (!code) { res.status(400).json({ error: 'Missing code' }); return; }
      const value = await c.get(keyFor(code));
      res.status(200).json({ state: value ? JSON.parse(value) : null });
      return;
    }

    if (req.method === 'PUT') {
      const { code, state } = req.body || {};
      if (!code || !state) { res.status(400).json({ error: 'Missing code or state' }); return; }
      await c.set(keyFor(code), JSON.stringify(state));
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    res.status(502).json({ error: 'Redis operation failed: ' + e.message });
  }
};
