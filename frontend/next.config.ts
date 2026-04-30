import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    // Permite que o bundler resolva e transpile arquivos fora do diretório frontend/
    config.resolve.alias = {
      ...config.resolve.alias,
      "@backend": path.resolve(__dirname, "../backend/ts"),
    };
    return config;
  },
};

export default nextConfig;
