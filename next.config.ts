import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {},
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
