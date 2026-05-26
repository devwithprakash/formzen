/** @type {import('next').NextConfig} */
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com", // ✅ Clerk hosted images
      },
    ],
  },
};

export default nextConfig;
