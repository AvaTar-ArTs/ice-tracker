/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
  // Transformers.js uses WASM and worker; ensure they are served
  webpack: (config, { isServer }) => {
    if (isServer) return config;
    config.resolve.fallback = { fs: false, path: false, ...config.resolve?.fallback };
    return config;
  },
};

module.exports = nextConfig;
