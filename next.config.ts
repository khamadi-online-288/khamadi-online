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

// typescript.ignoreBuildErrors stays in next.config; eslint moved to eslint.config
const config: NextConfig = {
  ...nextConfig,
  typescript: { ignoreBuildErrors: true },
  serverExternalPackages: ['pdfkit', 'fontkit', '@pdf-lib/fontkit'],
}

export default config;
