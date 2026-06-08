import type { NextConfig } from "next";

const isCloudflarePages = process.env.CF_PAGES === "1";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()"
  }
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isCloudflarePages
    ? {
        output: "export",
        images: {
          unoptimized: true
        },
        trailingSlash: true
      }
    : {
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        }
      })
};

export default nextConfig;
