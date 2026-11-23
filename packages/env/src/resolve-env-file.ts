import { findUp } from "find-up";

const ENV_FILE_NAMES = {
  development: [".env.local", ".env"],
  test: [".env.test.local", ".env.test"],
  production: [".env.production", ".env"],
} as const;

export async function resolveEnvFile(): Promise<string | undefined> {
  const names =
    process.env.NODE_ENV === "production"
      ? ENV_FILE_NAMES.production
      : process.env.NODE_ENV === "test"
        ? ENV_FILE_NAMES.test
        : ENV_FILE_NAMES.development;

  return findUp([...names], { type: "file" });
}
