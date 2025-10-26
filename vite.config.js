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
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
          'query-vendor': ['@tanstack/react-query'],
          'form-vendor': ['react-hook-form'],
          
          // **OPTIMIZATION**: Separate heavy libraries for lazy loading
          // TinyMCE is split into its own chunk to load only when editor is used
          'editor': ['@tinymce/tinymce-react'],
          'tinymce-core': ['tinymce'],
          
          // Motion libraries separated for better code splitting
          'animation': ['framer-motion', 'motion'],
          
          // App chunks
          'auth': ['./src/appwrite/auth.js', './src/appwrite/config.js'],
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
    // Chunk size warnings - increased to account for vendor chunks
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true, // Split CSS into separate files
    // **OPTIMIZATION**: Enable module preload for faster chunk loading
    modulePreload: {
      polyfill: false, // Disable polyfill for modern browsers
    },
  },
  // Prefetch chunks for better performance
  server: {
    preTransformRequests: false,
  },
  // **OPTIMIZATION**: Add optimizeDeps for better dev experience
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'prop-types'],
    exclude: ['@tinymce/tinymce-react', 'tinymce'], // Don't pre-bundle heavy editor
  },
})
