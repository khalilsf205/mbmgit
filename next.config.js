/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['next-themes'],
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
      useDeploymentId: true,
      // Optionally, use with Server Actions
      useDeploymentIdServerActions: true,
    },
  }
  
module.exports = nextConfig;