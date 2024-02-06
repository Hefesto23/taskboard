/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['jsx', 'js', 'tsx', 'ts'],
  experimental: {
    // esmExternals: "loose",
    serverComponentsExternalPackages: ['mongoose'],
  },
  env: {
    NEXT_AUTH_URL: process.env.NEXT_AUTH_URL,
  }
};

export default nextConfig;
