import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Project root directory (path is relative to the location of vite.config.js)
  root: path.resolve(__dirname, './'),

  // Base public path when served in development or production
  base: '/',

  // Configuration options for the dev server
  server: {
    // Specify the port the dev server runs on
    port: 3000,
    // Open the browser automatically
    open: true,
    // Enable CORS
    cors: true
  },

  // Build-specific options
  build: {
    // Output directory for build files (path is relative to the project root)
    outDir: 'dist',
    // Generate sourcemaps for debugging
    sourcemap: true,
    // Optimize and hash static asset filenames
    assetsDir: 'assets',
    // Path transformations for assets
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        game: path.resolve(__dirname, 'game.html'),
        about: path.resolve(__dirname, 'about.html'),
        local: path.resolve(__dirname, 'local.html'),
        popup: path.resolve(__dirname, 'popup.html')
      }
    }
  },

  // Resolve alias for easier imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@models': path.resolve(__dirname, 'models'),
      '@css': path.resolve(__dirname, 'CSS')
      // Add other aliases if necessary
    }
  },

  // Plugin options and custom plugin usage can be added here
  plugins: [
    // Add any Vite plugins you might need. For handling GLB files or other specific static assets,
    // Vite should handle them out of the box or you might need to add custom plugins or adjust the config.
  ]
});
