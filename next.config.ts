import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // HSTS só em produção para não bloquear ambientes locais/staging sem HTTPS.
          // includeSubDomains e preload omitidos intencionalmente: adicionar apenas
          // quando todos os subdomínios estiverem prontos para HTTPS permanente e
          // houver intenção explícita de entrar na HSTS preload list.
          ...(isProduction
            ? [{ key: "Strict-Transport-Security", value: "max-age=63072000" }]
            : []),
          { key: "Content-Security-Policy", value: "upgrade-insecure-requests" },
        ],
      },
    ];
  },
};

export default nextConfig;
