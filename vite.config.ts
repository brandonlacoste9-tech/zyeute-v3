import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { metaImagesPlugin } from "./vite-plugin-meta-images";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    metaImagesPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  // Fix for react-window CommonJS/ESM compatibility
  optimizeDeps: {
    include: [
      'react-window',
      'react-virtualized-auto-sizer'
    ]
  },
  css: {
    postcss: {
      plugins: [],
    },
  },

  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    // Chunk size warning limit (KB)
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging (disable for smaller builds)
    sourcemap: process.env.NODE_ENV === "production" ? false : true,
    // Minification options (esbuild is faster and default in Vite)
    minify: "esbuild",
    // Rollup options for advanced bundling
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // React core vendor chunks (changes infrequently)
          "react-vendor": ["react", "react-dom", "react-router-dom"],

          // UI library chunks
          "ui-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-progress",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-avatar",
            "@radix-ui/react-label",
          ],

          // Icon library
          "ui-icons": ["lucide-react", "react-icons"],

          // Supabase chunk
          "supabase": ["@supabase/supabase-js"],

          // Form handling
          "forms": ["react-hook-form", "@hookform/resolvers", "zod"],

          // Utilities
          "utils": [
            "clsx",
            "class-variance-authority",
            "tailwind-merge",
            "date-fns",
          ],

          // Virtualization (for infinite scroll)
          "virtualization": ["react-window", "react-virtualized-auto-sizer"],
        },
        // Naming pattern for chunks
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    // Target modern browsers for smaller bundles
    target: "es2020",
    // CSS code splitting
    cssCodeSplit: true,
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
