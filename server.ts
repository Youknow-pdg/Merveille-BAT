import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add OAuth callback route for Supabase/Google Auth
  // This route returns a simple HTML page that closes the popup and notifies the opener
  app.get('/auth/callback', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentification réussie</title>
          <style>
            body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f9fafb; color: #111827; }
            .content { text-align: center; padding: 2rem; border-radius: 1rem; background: white; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
          </style>
        </head>
        <body>
          <div class="content">
            <h1>Authentification réussie !</h1>
            <p>Cette fenêtre va se fermer automatiquement...</p>
            <script>
              // Wait a tiny bit to ensure the Supabase client in the opener can pick up the session change if needed
              // or just notify the opener to refresh
              setTimeout(() => {
                if (window.opener) {
                  window.opener.postMessage({ type: 'SUPABASE_AUTH_SUCCESS' }, '*');
                  window.close();
                } else {
                  window.location.href = '/';
                }
              }, 1000);
            </script>
          </div>
        </body>
      </html>
    `);
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
