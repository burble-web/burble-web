import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/categories',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/en/categories',
        destination: '/en/products',
        permanent: true,
      },
      {
        source: '/ar/categories',
        destination: '/ar/products',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
