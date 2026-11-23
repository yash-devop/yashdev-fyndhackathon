"use client";

import { Button } from "@repo/ui/button";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { signIn } from "@/lib/auth-client";

const getCallbackURL = () =>
  process.env.NEXT_PUBLIC_FRONTEND_URL ?? window.location.origin;

export const GoogleSignIn = () => (
  <Button
    size="lg"
    onClick={() =>
      signIn.social({ provider: "google", callbackURL: getCallbackURL() })
    }
  >
    <IconBrandGoogleFilled />
    Sign in with Google
  </Button>
);
