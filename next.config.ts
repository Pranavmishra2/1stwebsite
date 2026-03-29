import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // XSS Protection (legacy browsers)
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Referrer Policy
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Permissions Policy — disable unused browser features
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self)" },
          // Strict Transport Security (HTTPS only)
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com https://checkout.razorpay.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.googleapis.com wss://*.googleapis.com https://*.firebaseio.com https://*.firebase.googleapis.com https://*.firebaseapp.com wss://*.firebaseio.com https://api.razorpay.com",
              "frame-src 'self' https://accounts.google.com https://*.firebaseapp.com https://api.razorpay.com",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Disable x-powered-by header
  poweredByHeader: false,

  turbopack: {},
};

export default withPWA(nextConfig);
