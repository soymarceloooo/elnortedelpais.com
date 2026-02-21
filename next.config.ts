import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['react-map-gl', 'mapbox-gl'],
  experimental: {
    turbo: {
      resolveAlias: {
        'react-map-gl': './node_modules/react-map-gl/dist/esm/index.js',
      },
    },
  },
};

export default nextConfig;
