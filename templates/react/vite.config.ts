import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['util', 'stream', 'buffer', 'process', 'events', 'crypto'],
      globals: { Buffer: true, global: true, process: true },
    }),
    isProduction &&
      compression({
        algorithms: ['gzip'],
        threshold: 10240,
        deleteOriginalAssets: false,
      }),
    isProduction &&
      compression({
        algorithms: ['brotliCompress'],
        threshold: 10240,
        deleteOriginalAssets: false,
      }),
  ].filter(Boolean),

  base: './',

  build: {
    outDir: path.resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
    minify: isProduction ? 'esbuild' : false,
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, 'index.html'),
      },
      output: {
        manualChunks: { 'react-vendor': ['react', 'react-dom'] },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
      },
    },
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    // 代理配置（仅独立开发时需要，通过 dashboard 访问时由 dashboard 处理）
    // proxy: {
    //   '/engine': {
    //     target: 'http://localhost:5678',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api\/v1\/tego-engine/, ''),
    //   },
    // },
  },
  preview: { port: 4174, strictPort: true },

  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@frontend': path.resolve(import.meta.dirname, 'src'),
      '@common': path.resolve(import.meta.dirname, 'src/common'),
    },
  },
});
