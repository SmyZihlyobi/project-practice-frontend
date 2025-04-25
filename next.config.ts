import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },

  webpack: (config, { webpack, dev }) => {
    if (!dev) {
      config.devtool = false;

      // Отключаем дев тулзы apollo graphql
      config.plugins.push(
        new webpack.DefinePlugin({
          'globalThis.__DEV__': JSON.stringify(dev),
        }),
      );
    }

    return config;
  },
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Конфигурация кэширования для SW
  runtimeCaching: [
    {
      urlPattern: new RegExp(`^${process.env.NEXT_PUBLIC_BACKEND_URL}/.*$`),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 минут
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\.(woff|woff2|ttf|eot)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'fonts-cache',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\.(js|css|txt)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
      },
    },
  ],
})(nextConfig);
