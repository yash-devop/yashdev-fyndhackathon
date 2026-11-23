import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    globalSetup: ["./src/test/global-setup.ts"],
    env: {
      NODE_ENV: "test",
      DATABASE_URL:
        "postgresql://postgres:root@localhost:5433/yash-fynd-test?schema=public",
      POSTGRES_USER: "postgres",
      POSTGRES_PASSWORD: "root",
      POSTGRES_DB: "yash-fynd-test",
      NEXT_PUBLIC_FRONTEND_URL: "http://localhost:3000",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts"],
    },
  },
});
