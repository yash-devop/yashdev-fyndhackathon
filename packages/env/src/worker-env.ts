import { config } from "dotenv";
import { z } from "zod";
import { resolveEnvFile } from "./resolve-env-file";

config({ path: await resolveEnvFile() });

const workerEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().min(1).default("redis://localhost:6379"),
  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(2),
});

export const workerEnv = workerEnvSchema.parse(process.env);
