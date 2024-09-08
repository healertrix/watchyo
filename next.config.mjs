/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com', // Fix wildcard usage
      },
      {
        protocol: 'https',
        hostname: '**.pixel.com', // Fix wildcard usage
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com', // Add Pexels hostname
      },
    ],
  },
};

export default nextConfig;
