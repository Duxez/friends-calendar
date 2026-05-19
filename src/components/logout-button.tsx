"use client";

import { Button } from "@fluentui/react-components";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <Button
      type="button"
      appearance="primary"
      onClick={() => signOut({ callbackUrl: "/auth/login" })}
    >
      Log out
    </Button>
  );
}
