/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // webpack: (config, { dev, isServer }) => {
  //   if (dev && !isServer) {
  //     config.watchOptions = {
  //       ...config.watchOptions,
  //       poll: 1000, // Check for changes every second
  //       aggregateTimeout: 300, // Delay before rebuilding
  //     };
  //   }
  //   return config;
  // },
};

export default nextConfig;
