/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export for Hostinger shared hosting
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  reactStrictMode: true,
  trailingSlash: true,
  // Optimize build for modern browsers
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Reduce JavaScript bundle size
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'lodash'],
  },
  // Configure Turbopack (Next.js 16 uses Turbopack by default)
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;

