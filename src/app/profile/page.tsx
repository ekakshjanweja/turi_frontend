"use client";

import { Loading } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Unauthorized } from "@/components/unauthorized";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session, isPending } = auth.useSession();

  if (isPending) return <Loading />;

  if (!session?.user) return <Unauthorized />;

  const router = useRouter();

  const signOut = async () => {
    await auth.signOut();
    router.push("/");
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Your account information</p>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              {session.user.name || "No name provided"}
            </h2>
            <p className="text-muted-foreground">
              {session.user.email || "No email provided"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <h3 className="font-medium">User ID</h3>
              <p className="text-sm text-muted-foreground font-mono">
                {session.user.id}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Account Created</h3>
              <p className="text-sm text-muted-foreground">
                {session.user.createdAt
                  ? new Date(session.user.createdAt).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Email Verified</h3>
              <p className="text-sm text-muted-foreground">
                {session.user.emailVerified ? "Yes" : "No"}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Session ID</h3>
              <p className="text-sm text-muted-foreground font-mono">
                {session.session?.id || "Not available"}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={signOut} variant="destructive">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
