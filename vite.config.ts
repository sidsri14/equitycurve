import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['@solana/web3.js', '@meteora-ag/dynamic-bonding-curve-sdk'],
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  define: {
    global: 'globalThis',
  },
})