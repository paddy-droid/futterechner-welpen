import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Ersetze VITE_GEMINI_API_KEY durch einen Platzhalter zur Build-Zeit
        // und lade den echten Wert zur Laufzeit
        'import.meta.env.VITE_GEMINI_API_KEY': 'process.env.VITE_GEMINI_API_KEY || ""'
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
