import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Disabled due to persistent worker crash on darwin/arm64 with SWC WASM
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
