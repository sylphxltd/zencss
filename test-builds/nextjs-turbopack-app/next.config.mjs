/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack mode (no plugin support yet)
  experimental: {
    turbo: {
      rules: {},
    }
  }
};

export default nextConfig;
