import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function serveArtworksPlugin() {
  const artworksDir = path.resolve(__dirname, 'artworks');

  return {
    name: 'serve-artworks-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/artworks/')) {
          const relativePath = decodeURIComponent(req.url.replace(/^\/artworks\//, ''));
          const filePath = path.join(artworksDir, relativePath);

          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.webp': 'image/webp',
              '.gif': 'image/gif',
              '.svg': 'image/svg+xml'
            };
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }
        next();
      });
    },
    closeBundle() {
      // In build, copy artworks to dist/artworks
      const distDir = path.resolve(__dirname, 'dist', 'artworks');
      if (fs.existsSync(artworksDir)) {
        console.log('Copying artworks directory to dist/artworks...');
        fs.cpSync(artworksDir, distDir, { recursive: true });
        console.log('Artworks copied successfully!');
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), serveArtworksPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-icons': ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
});
