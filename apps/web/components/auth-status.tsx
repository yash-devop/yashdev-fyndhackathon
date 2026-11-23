"use client";

import { Button } from "@repo/ui/button";
import { signOut, useSession } from "@/lib/auth-client";
import { GoogleSignIn } from "./google-sign-in";

export const AuthStatus = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <span className="text-muted-foreground text-sm">Loading…</span>;
  }

  if (!session) {
    return <GoogleSignIn />;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm">
        Signed in as{" "}
        <span className="font-medium">
          {session.user.name || session.user.email}
        </span>
      </p>
      {session.user.name && (
        <p className="text-muted-foreground text-sm">{session.user.email}</p>
      )}
      <Button variant="outline" size="sm" onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
};
