import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - separate large libraries
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'lucide-vendor': ['lucide-react'],
          'form-vendor': ['react-hook-form'],
          
          // App chunks
          'auth': ['./src/appwrite/auth.js', './src/appwrite/config.js'],
          'editor': ['@tinymce/tinymce-react', 'tinymce'],
          'ai': ['groq-sdk'],
          'store': ['./src/store/authSlice.js', './src/store/darkmodeSlice.js', './src/store/postSlice.js', './src/store/profileSlice.js'],
        },
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.facadeModuleId?.includes('/Pages/')) {
            return 'pages/[name]-[hash].js';
          }
          if (chunkInfo.facadeModuleId?.includes('/Components/ui/')) {
            return 'ui/[name]-[hash].js';
          }
          return 'chunks/[name]-[hash].js';
        },
        // Optimize asset names
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'styles/[name]-[hash].css';
          }
          return 'assets/[name]-[hash][extname]';
        }
      },
      // Tree shaking optimization
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    },
    // Enable code splitting and optimization
    sourcemap: false,
    minify: 'esbuild', // Use esbuild for faster builds
    target: 'esnext', // Modern browsers for better optimization
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true, // Split CSS into separate files
  },
  // Prefetch chunks for better performance
  server: {
    preTransformRequests: false,
  },
})
