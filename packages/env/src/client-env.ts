import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z.string().url(),
});

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
});
