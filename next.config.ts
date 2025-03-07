import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  webpack: (config, { webpack, dev }) => {
    if (!dev) {
      config.devtool = false;
    }

    config.plugins.push(
      new webpack.DefinePlugin({
        'globalThis.__DEV__': JSON.stringify(dev),
      }),
    );

    return config;
  },
};

export default nextConfig;
