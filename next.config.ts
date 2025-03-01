import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.DefinePlugin({
        'globalThis.__DEV__': false,
      }),
    );

    return config;
  },
};

export default nextConfig;
