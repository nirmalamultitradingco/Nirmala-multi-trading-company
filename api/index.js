import app from '../server/server.js';

export default function handler(req, res) {
  // If rewritten by Vercel and stripped of /api, normalize req.url for Express route matching
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/uploads')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
}

