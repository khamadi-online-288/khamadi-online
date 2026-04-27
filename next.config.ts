import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/english/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
};

// Allow build-time TS/ESLint bypass without polluting the typed config
const config = Object.assign(nextConfig, {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
})

export default config;
