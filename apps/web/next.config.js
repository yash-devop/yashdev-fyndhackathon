import nextEnv from "@next/env";
import { fileURLToPath } from "node:url";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(
  fileURLToPath(new URL("../..", import.meta.url)),
  false,
  console,
  true,
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/env", "@repo/schemas", "@repo/ui"],
};

export default nextConfig;
