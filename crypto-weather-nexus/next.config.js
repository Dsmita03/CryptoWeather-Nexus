/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,  // Enables faster builds
  trailingSlash: false, // Keeps standard URL structure
};

module.exports = nextConfig;
