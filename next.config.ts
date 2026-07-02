import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // basePath is set to /pmis in production via NEXT_PUBLIC_BASE_PATH env var on Vercel
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
};

export default nextConfig;
