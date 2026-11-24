import { config } from "dotenv";
import { z } from "zod";
import { resolveEnvFile } from "./resolve-env-file";

config({ path: await resolveEnvFile() });
const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(8000),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_FRONTEND_URL: z.string().url(),
  NEXT_PUBLIC_BACKEND_URL: z.string().url(),
});

export const serverEnv = serverEnvSchema.parse(process.env);
