import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TEST_DATABASE_URL =
  "postgresql://postgres:root@localhost:5433/yash-fynd-test?schema=public";

export function setup(): void {
  const dbPackageDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../../packages/db",
  );

  const result = spawnSync(
    "pnpm",
    ["exec", "prisma", "db", "push", "--config=prisma7.config.ts"],
    {
      cwd: dbPackageDir,
      env: {
        ...process.env,
        NODE_ENV: "test",
        DATABASE_URL: process.env.DATABASE_URL ?? TEST_DATABASE_URL,
        POSTGRES_USER: "postgres",
        POSTGRES_PASSWORD: "root",
        POSTGRES_DB: "yash-fynd-test",
        NEXT_PUBLIC_FRONTEND_URL: "http://localhost:3000",
      },
      stdio: "inherit",
      shell: true,
    },
  );

  if (result.status !== 0) {
    throw new Error("Failed to prepare the test database");
  }
}
