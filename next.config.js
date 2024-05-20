// /** @type {import('next').NextConfig} */

const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  // register: true,
  // skipWaiting: true,
  disable: false,
  runtimeCaching,
  // buildExcludes: [/middleware-manifest.json$/],
});

const nextConfig = withPWA({
  reactStrictMode: true,
  poweredByHeader: false,
});

module.exports = nextConfig;
