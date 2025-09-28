import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'icon.svg',
          dest: '.'
        },
        {
          src: 'service-worker.js',
          dest: '.'
        },
        {
          src: 'metadata.json',
          dest: '.'
        }
      ]
    })
  ],
  define: {
    // This replaces process.env.API_KEY with the value from the build environment.
    // Ensure the API_KEY environment variable is set in your deployment environment.
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
