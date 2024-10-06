/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.pixel.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
    domains: ['image.tmdb.org'],
    unoptimized: true,
  },
};

export default nextConfig;
