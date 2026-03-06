/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    instrumentationHook: true,
  },
  // Compression gzip pour performance
  compress: true,
  // Désactiver le header X-Powered-By (sécurité)
  poweredByHeader: false,
};

module.exports = nextConfig;
