"use client";

import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { auth } from "@/lib/auth";
import { Button } from "./ui/button";

export function Navbar() {
  const { data: session, isPending } = auth.useSession();

  const isLoggedIn = !!session?.user;

  return (
    <nav className="flex items-center justify-between py-4 px-12">
      <Link href="/" className="text-xl font-semibold hover:opacity-80">
        Turi
      </Link>

      <div className="flex gap-x-4 items-center">
        {!isPending && isLoggedIn && (
          <>
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link
              href="/profile"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Button variant="ghost" size="sm">
                Profile
              </Button>
            </Link>
          </>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
}
