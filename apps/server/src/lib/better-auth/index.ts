import { prisma } from "@repo/db";
import { serverEnv } from "@repo/env/server-env";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { allowedOrigins } from "../cors";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: serverEnv.GOOGLE_CLIENT_ID,
      clientSecret: serverEnv.GOOGLE_API_KEY,
      scope: ["openid", "email", "profile"],
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  trustedOrigins: allowedOrigins,
  advanced: {
    defaultCookieAttributes: {
      sameSite: serverEnv.BETTER_AUTH_URL.startsWith("https://")
        ? "none"
        : "lax",
    },
  },
});
