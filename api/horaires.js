const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER   = 'maisonno';
const REPO_NAME    = 'lapommedadam';
const FILE_PATH    = 'horaires.json';
const BRANCH       = 'main';

const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

const headers = {
  'Authorization': `Bearer ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET ──
  if (req.method === 'GET') {
    const r = await fetch(API_BASE, { headers });
    if (!r.ok) {
      // Fichier inexistant → renvoyer structure par défaut
      if (r.status === 404) return res.status(200).json({ content: JSON.stringify([]), sha: null });
      return res.status(r.status).json({ error: 'GitHub read error' });
    }
    const data = await r.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return res.status(200).json({ content, sha: data.sha });
  }

  // ── PUT ──
  if (req.method === 'PUT') {
    const { content, sha } = req.body;
    if (!content) return res.status(400).json({ error: 'content requis' });

    let currentSha = sha;
    if (!currentSha) {
      const r = await fetch(API_BASE, { headers });
      if (r.ok) { const d = await r.json(); currentSha = d.sha; }
    }

    const body = {
      message: '🕐 Mise à jour horaires',
      content: Buffer.from(content, 'utf-8').toString('base64'),
      branch: BRANCH,
      ...(currentSha ? { sha: currentSha } : {}),
    };

    const r = await fetch(API_BASE, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const err = await r.json();
      return res.status(r.status).json({ error: err.message });
    }
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Méthode non supportée' });
}
